/**
 * Tree-walking interpreter for AstigLang.
 *
 * Executes a type-checked entry program: registers record types and functions,
 * then runs only the entry file's `main`. Include modules never execute directly.
 *
 * Export visibility matches the type checker: global env holds exported functions;
 * same-file private helpers are added via `withModuleFunctions` when a function runs.
 */
import { BreakException } from './classes/BreakException';
import { ContinueException } from './classes/ContinueException';
import { buildRecordRegistry, RecordRegistry } from './classes/RecordRegistry';
import { ReturnException } from './classes/ReturnException';
import { RuntimeEnvironment } from './classes/RuntimeEnvironment';
import { RuntimeError } from './classes/RuntimeError';
import { AstigType } from './models/AstigType';
import { ExpressionNode, ExpressionNodeType } from './models/ExpressionNode';
import { ProgramNode } from './models/ProgramNode';
import {
  isRecordRuntimeValue,
  RecordRuntimeValue,
  RuntimeValue,
} from './models/RuntimeValue';
import {
  AssignmentNode,
  AssignmentTarget,
  FunctionDeclarationNode,
  SourceLocation,
  StatementNode,
  StatementNodeType,
} from './models/StatementNode';
import { resolveParameterType, resolveVariableDeclarationType } from './utils/astigTypeUtils';
import { isTruthy } from './utils/isTruthy';
import { withModuleFunctions } from './utils/moduleScope';
import {
  getRecordFieldValue,
  setRecordFieldValue,
} from './utils/recordRuntimeUtils';
import { coerceScanInput, readScanLine } from './utils/scanUtils';
import { HeapEmulator, VirtualHeap } from './classes/HeapEmulator';
import { MarkSweepGC } from './models/GarbageCollector';

export type ExecutionContext = {
  environment: RuntimeEnvironment;
  recordRegistry: RecordRegistry;
  output: string[];
  moduleFunctions: Record<string, FunctionDeclarationNode[]>;
  heap: HeapEmulator;
};

function raiseRuntimeError(message: string, location?: SourceLocation): never {
  throw new RuntimeError(message, location);
}

/** Runs the full program and returns all printed lines in order. */
export function runProgram(program: ProgramNode): string[] {
  const recordRegistry = buildRecordRegistry(program.recordDeclarations);
  const environment = new RuntimeEnvironment(undefined, true);
  const output: string[] = [];
  const heapInstance = new VirtualHeap();
  const context: ExecutionContext = {
    environment,
    recordRegistry,
    output,
    moduleFunctions: program.moduleFunctions,
    heap: heapInstance
  };

  heapInstance.registerGCCallback(() => {
    MarkSweepGC.run(context);
  });

  for (const functionNode of program.functions) {
    environment.declareFunction(functionNode);
  }

  if (!program.mainFunction) {
    throw new Error('Entry program file must define function main()');
  }

  // Entry file scope: exported functions + local entry-file helpers.
  const mainEnvironment = withModuleFunctions(
    environment,
    program.entryModule,
    program.moduleFunctions,
  );

  executeBlock(program.mainFunction.body, {
    ...context,
    environment: mainEnvironment,
  });

  return output;
}

/** Dispatches a single statement to the appropriate runtime handler. */
function executeStatement(statement: StatementNode, context: ExecutionContext): void {
  const { environment, output } = context;
  const location = statement.location;

  // Helper function to safely execute an action and throw appropriate errors.
  const runSafely = (action: () => void): void => {
    try {
      action();
    } catch (error) {
      if (error instanceof RuntimeError || error instanceof BreakException || error instanceof ContinueException || error instanceof ReturnException) {
        throw error;
      }
      if (error instanceof Error) {
        throw new RuntimeError(error.message, location);
      }
      throw error;
    }
  };

  switch (statement.type) {
    case StatementNodeType.VariableDeclaration:
      const initialValue = evaluateExpression(statement.value, context);
      // 1. Allocate a single slot on the heap for this variable
      const addr = context.heap.malloc(1);
      // 2. Write the initial value into that heap slot
      context.heap.set(addr, initialValue);

      runSafely(() =>
        environment.declare(
          statement.declarationKind,
          statement.name,
          { isHeapReference: true, address: addr },
          resolveVariableDeclarationType(statement, context.recordRegistry),
        ),
      );
      return;

    case StatementNodeType.Assignment:
      executeAssignment(statement, context, location);
      return;
    
    case StatementNodeType.ArrayIndexAssignment: {
      let targetArray = environment.lookup(statement.arrayName);

      // Unwrap if it was passed as a function argument or variable pointer reference
      if (targetArray && typeof targetArray === 'object' && 'isHeapReference' in targetArray) {
        targetArray = context.heap.get(targetArray.address);
      }

      if (!Array.isArray(targetArray)) {
        raiseRuntimeError(
          `Runtime Error: Variable "${statement.arrayName}" is not an array.`,
          location,
        );
      }
      const incomingValue = evaluateExpression(statement.value, context);
      const evaluatedIndex: RuntimeValue = evaluateExpression(statement.index, context);
      
      if (typeof evaluatedIndex !== 'number') {
        raiseRuntimeError(
          `Runtime Error: Array index must evaluate to a number. Got value "${evaluatedIndex}" of type: ${typeof evaluatedIndex}`,
          location,
        );
      }

      const index = Math.floor(evaluatedIndex);

      if (index < 0 || index >= targetArray.length) {
        raiseRuntimeError(
          `Runtime Error: Index ${index} is out of bounds for array "${statement.arrayName}" of length ${targetArray.length}.`,
          location,
        );
      }

      targetArray[index] = incomingValue;
      return;
    }

    case StatementNodeType.PrintStatement:
      output.push(String(evaluateExpression(statement.value, context)));
      return;
    
    case StatementNodeType.ScanStatement: {
      if (statement.promptMessage) {
        process.stdout.write(statement.promptMessage);
      }

      const userInput = readScanLine();
      runSafely(() => {
        const targetType = environment.getResolvedType(statement.variableName);
        const finalValue = coerceScanInput(userInput, targetType);

        const binding = environment.get(statement.variableName);
        if (binding && typeof binding === 'object' && 'isHeapReference' in binding) {
          context.heap.set(binding.address, finalValue);
        } else {
          environment.assign(statement.variableName, finalValue);
        }
      });
      return;
    }

    case StatementNodeType.IfStatement: {
      const condition = evaluateExpression(statement.condition, context);

      if (isTruthy(condition)) {
        executeBlock(statement.thenBranch, context);
      } else {
        let executed = false;
        for (const elseIfChain of statement.elseIfChains) {
          const elseIfCondition = evaluateExpression(elseIfChain.condition, context);
          if (isTruthy(elseIfCondition)) {
            executeBlock(elseIfChain.body, context);
            executed = true;
            break;
          }
        }
        if (!executed && statement.elseBranch) {
          executeBlock(statement.elseBranch, context);
        }
      }
      return;
    }

    case StatementNodeType.WhileStatement: {
      while (isTruthy(evaluateExpression(statement.condition, context))) {
        try {
          executeBlock(statement.body, context);
        } catch (error) {
          if (error instanceof BreakException) {
            break;
          }
          if (error instanceof ContinueException) {
            continue;
          }
          throw error;
        }
      }
      return;
    }

    case StatementNodeType.DoWhileStatement: {
      do {
        try {
          executeBlock(statement.body, context);
        } catch (error) {
          if (error instanceof BreakException) {
            break;
          }
          if (error instanceof ContinueException) {
            // Continue to condition check
          } else {
            throw error;
          }
        }
      } while (isTruthy(evaluateExpression(statement.condition, context)));
      return;
    }

    case StatementNodeType.ForStatement: {
      const loopEnvironment =
        statement.init?.type === StatementNodeType.VariableDeclaration
          ? environment.createBlockScope()
          : environment;
      const loopContext: ExecutionContext = { ...context, environment: loopEnvironment };

      if (statement.init) {
        executeStatement(statement.init, loopContext);
      }

      while (
        !statement.condition ||
        isTruthy(evaluateExpression(statement.condition, loopContext))
      ) {
        try {
          executeBlock(statement.body, loopContext);
        } catch (error) {
          if (error instanceof BreakException) {
            break;
          }
          if (error instanceof ContinueException) {
            // Continue to update
          } else {
            throw error;
          }
        }

        if (statement.update) {
          executeAssignment(statement.update, loopContext, statement.update.location);
        }
      }
      return;
    }

    case StatementNodeType.ForeachStatement: {
      const iterable = evaluateExpression(statement.iterable, context);

      if (typeof iterable === 'string') {
        const foreachEnvironment = environment.createBlockScope();
        const foreachContext: ExecutionContext = {
          ...context,
          environment: foreachEnvironment,
        };
        foreachEnvironment.declare(
          'let',
          statement.variable,
          '',
          { kind: 'primitive', type: AstigType.Char },
        );

        for (const char of iterable) {
          foreachEnvironment.assign(statement.variable, char);
          try {
            executeBlock(statement.body, foreachContext);
          } catch (error) {
            if (error instanceof BreakException) {
              break;
            }
            if (error instanceof ContinueException) {
              continue;
            }
            throw error;
          }
        }
      } else {
        raiseRuntimeError(
          `Foreach only supports string iteration, got ${typeof iterable}`,
          location,
        );
      }
      return;
    }

    case StatementNodeType.BreakStatement:
      throw new BreakException();

    case StatementNodeType.ContinueStatement:
      throw new ContinueException();

    case StatementNodeType.FunctionDeclaration:
      environment.declareFunction(statement);
      return;

    case StatementNodeType.ReturnStatement:
      throw new ReturnException(
        statement.value ? evaluateExpression(statement.value, context) : null,
      );
    
      case StatementNodeType.FreeStatement: {
      const ptrAddress = evaluateExpression(statement.ptrExpr, context);
      if (typeof ptrAddress !== 'number') {
        throw new Error('Runtime Error: Address targeted for fHR33z must resolve to a valid numeric pointer.');
      }
      context.heap.free(ptrAddress);
      return;
    }

    case StatementNodeType.MemsetStatement: {
      const ptrAddress = evaluateExpression(statement.ptrExpr, context);
      const fillValue = evaluateExpression(statement.valueExpr, context);
      const allocationSize = evaluateExpression(statement.sizeExpr, context);

      if (typeof ptrAddress !== 'number' || typeof fillValue !== 'number' || typeof allocationSize !== 'number') {
        throw new Error('Runtime Error: Invalid numerical arguments supplied to mH3mS3t operation.');
      }

      const byteValue = Math.floor(fillValue) & 0xFF;

      // Fill heap memory range sequentially
      for (let offset = 0; offset < Math.floor(allocationSize); offset++) {
        context.heap.set(ptrAddress + offset, byteValue);
      }
      return;
    }

    case StatementNodeType.BlockStatement:
      executeBlock(statement.body, context);
      return;
  }
}

/** Evaluates the right-hand side and writes to a variable or record field target. */
function executeAssignment(
  assignment: AssignmentNode,
  context: ExecutionContext,
  location?: SourceLocation,
): void {
  const rightValue = evaluateExpression(assignment.value, context);
  const resultValue = evaluateAssignmentValue(assignment, rightValue, context);

  if (assignment.target.kind === 'variable') {
    try {
      const binding = context.environment.get(assignment.target.name);
      
      // Mutate the value inside the heap slot instead of replacing the environment binding object
      if (binding && typeof binding === 'object' && 'isHeapReference' in binding) {
        context.heap.set(binding.address, resultValue);
      } else {
        context.environment.assign(assignment.target.name, resultValue);
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new RuntimeError(error.message, location);
      }
      throw error;
    }
    return;
  }
  else if (assignment.target.kind === 'dereference'){
    const heapAddress = evaluateExpression(assignment.target.pointerExpression, context);

    if (typeof heapAddress === 'number' && context.heap.isFreed(heapAddress)) {
      throw new Error(`Runtime Error: Segmentation Fault. Attempted to write to dangling pointer at address ${heapAddress}`);
    }

    context.heap.set(heapAddress, resultValue);
    return;
  }

  assignRecordField(assignment.target, resultValue, context, location);
}

/** Writes through a dotted record field path on a variable in the environment. */
function assignRecordField(
  target: Extract<AssignmentTarget, { kind: 'recordField' }>,
  value: RuntimeValue,
  context: ExecutionContext,
  location?: SourceLocation,
): void {
  let recordValue = context.environment.get(target.rootVariable);

  if (recordValue && typeof recordValue === 'object' && 'isHeapReference' in recordValue) {
    recordValue = context.heap.get(recordValue.address);
  }

  if (!isRecordRuntimeValue(recordValue)) {
    throw new RuntimeError(`Variable "${target.rootVariable}" is not a record`, location);
  }

  setRecordFieldValue(recordValue, target.fieldPath, value);
}

/** Computes the stored value for `=`, `+=`, or `-=` assignments. */
function evaluateAssignmentValue(
  assignment: AssignmentNode,
  rightValue: RuntimeValue,
  context: ExecutionContext,
): RuntimeValue {
  if (assignment.operator === '=') {
    return rightValue;
  }

  const leftValue = readAssignmentTargetValue(assignment.target, context);

  if (assignment.operator === '+=') {
    if (typeof leftValue === 'string' || typeof rightValue === 'string') {
      return String(leftValue) + String(rightValue);
    }
    return (leftValue as number) + (rightValue as number);
  }

  if (assignment.operator === '-=') {
    return (leftValue as number) - (rightValue as number);
  }

  throw new Error(`Unsupported assignment operator ${assignment.operator}`);
}

/** Reads the current value of an assignment target (variable or record field). */
function readAssignmentTargetValue(
  target: AssignmentTarget,
  context: ExecutionContext,
): RuntimeValue {
  if (target.kind === 'variable') {
    const binding = context.environment.get(target.name);
    
    if (binding && typeof binding === 'object' && 'isHeapReference' in binding) {
      return context.heap.get(binding.address);
    }
    
    return binding;
  }

  if (target.kind === 'dereference'){
    // Evaluate the inner pointer expression to find the target address
    const heapAddress = evaluateExpression(target.pointerExpression, context);

    // Safety Guard: Check if the VirtualHeap address space is still valid/allocated
    if (typeof heapAddress === 'number' && context.heap.isFreed(heapAddress)) {
      throw new Error(`Runtime Error: Segmentation Fault. Attempted to read dangling pointer at address ${heapAddress}`);
    }

    // Return value from heap emulator
    return context.heap.get(heapAddress);
  }

  let recordValue = context.environment.get(target.rootVariable);
  if (recordValue && typeof recordValue === 'object' && 'isHeapReference' in recordValue) {
    recordValue = context.heap.get(recordValue.address);
  }
  if (!isRecordRuntimeValue(recordValue)) {
    throw new Error(`Variable "${target.rootVariable}" is not a record`);
  }

  return getRecordFieldValue(recordValue, target.fieldPath);
}

/** Runs statements in a new block scope. */
function executeBlock(statements: StatementNode[], context: ExecutionContext): void {
  const blockEnvironment = context.environment.createBlockScope();
  const blockContext: ExecutionContext = {
    ...context,
    environment: blockEnvironment,
  };

  for (const statement of statements) {
    executeStatement(statement, blockContext);
  }
}

/** Recursively evaluates an expression and returns its runtime value. */
function evaluateExpression(
  expression: ExpressionNode,
  context: ExecutionContext,
): RuntimeValue {
  switch (expression.type) {
    case ExpressionNodeType.NumberLiteral:
    case ExpressionNodeType.FloatLiteral:
    case ExpressionNodeType.StringLiteral:
      return expression.value;

    case ExpressionNodeType.BooleanLiteral:
      return expression.value;

    case ExpressionNodeType.Identifier:{
      const binding = context.environment.get(expression.name);
      // If it's a number pointing to heap memory, read the actual value out of it
      if (binding && typeof binding === 'object' && 'isHeapReference' in binding) {
        return context.heap.get(binding.address);
      }
      return binding;
    }

    case ExpressionNodeType.MemberAccess: {
      const objectValue = evaluateExpression(expression.object, context);

      if (!isRecordRuntimeValue(objectValue)) {
        throw new Error(`Cannot access member "${expression.field}" on non-record value`);
      }

      return getRecordFieldValue(objectValue, [expression.field]);
    }

    case ExpressionNodeType.Malloc: {
      const sizeBytes = evaluateExpression(expression.sizeExpr, context);
      if (typeof sizeBytes !== 'number') {
        throw new Error('Runtime Error: Size argument for mH4lL0cH must be a number.');
      }
      // Allocate chunk via the HeapEmulator interface and return the base address pointer
      return context.heap.malloc(Math.floor(sizeBytes));
    }

    case ExpressionNodeType.Realloc: {
      const ptrAddress = evaluateExpression(expression.ptrExpr, context);
      const sizeBytes = evaluateExpression(expression.sizeExpr, context);
      if (typeof ptrAddress !== 'number' || typeof sizeBytes !== 'number') {
        throw new Error('Runtime Error: Invalid pointer or size arguments passed to rH34lL0cH.');
      }
      // Reallocate block memory layout safely
      return context.heap.realloc(ptrAddress, Math.floor(sizeBytes));
    }

    case ExpressionNodeType.ArrayLiteral:
      return expression.elements.map(elementNode => (evaluateExpression(elementNode, context)));

    case ExpressionNodeType.ArrayIndexAccess:
      let targetArray = context.environment.lookup(expression.arrayName);

      // Unwrap if it was passed as a function argument or variable pointer reference
      if (targetArray && typeof targetArray === 'object' && 'isHeapReference' in targetArray) {
        targetArray = context.heap.get(targetArray.address);
      }

      if (!Array.isArray(targetArray)){
        throw new Error(`Runtime Error: "${expression.arrayName}" is not an array.`);
      }

      let evaluatedIndex: RuntimeValue = evaluateExpression(expression.index, context);

      if (typeof evaluatedIndex === 'string' && !isNaN(Number(evaluatedIndex))) {
        evaluatedIndex = parseInt(evaluatedIndex, 10);
      }
      
      if (typeof evaluatedIndex !== "number"){
        throw new Error(`Runtime Error: Array index must evaluate to a number. Got value "${evaluatedIndex}" of type: ${typeof evaluatedIndex}`);
      }

      const index = Math.floor(evaluatedIndex);

      if (index < 0 || index >= targetArray.length){
        throw new Error(
          `Runtime Error: Index ${index} is out of bounds for array "${expression.arrayName}" of length ${targetArray.length}.`
        );
      }
      return targetArray[index];

    case ExpressionNodeType.RecordLiteral:
      return evaluateRecordLiteral(expression, context);

    case ExpressionNodeType.BinaryExpression: {
      const left = evaluateExpression(expression.left, context);
      const right = evaluateExpression(expression.right, context);

      switch (expression.operator) {
        case '+':
          if (typeof left === 'string' || typeof right === 'string') {
            return String(left) + String(right);
          }
          return (left as number) + (right as number);
        case '-':
          return (left as number) - (right as number);
        case '*':
          return (left as number) * (right as number);
        case '/':
          return (left as number) / (right as number);
        case '%':
          return (left as number) % (right as number);
        case '==':
          return left === right;
        case '!=':
          return left !== right;
        case '<':
          return (left as number) < (right as number);
        case '>':
          return (left as number) > (right as number);
        case '<=':
          return (left as number) <= (right as number);
        case '>=':
          return (left as number) >= (right as number);
        case '<<':
          return (left as number) << (right as number);
        case '>>':
          return (left as number) >> (right as number);
        case '&':
          return (left as number) & (right as number);
        case '|':
          return (left as number) | (right as number);
        case 'AND': 
          return (left as boolean) && (right as boolean);
        case 'OR':
          return (left as boolean) || (right as boolean);
        default:
          throw new Error('Unsupported binary operator');
      }
    }

    case ExpressionNodeType.UnaryExpression: {
      // Handle address-of operator (&) before evaluating the argument
      if (expression.operator === '&') {
        if (expression.argument.type === ExpressionNodeType.Identifier) {
          const binding = context.environment.get(expression.argument.name);
          
          // Extract the underlying numeric address pointer from the tag object
          if (binding && typeof binding === 'object' && 'isHeapReference' in binding) {
            return binding.address;
          }
          throw new Error('Runtime Error: Identifier is not allocated in heap memory.');
        }
      }
      
      const value = evaluateExpression(expression.argument, context);

      if (expression.operator === '*') {
        if (typeof value !== 'number') {
          throw new Error(`Runtime Error: Cannot dereference non-numeric address: ${value}`);
        }
        // Memory safety guard: block read if the address is flagged as deallocated[cite: 3]
        if (context.heap.isFreed(value)) {
          throw new Error(`Runtime Error: Segmentation Fault. Attempted to read from dangling pointer at address ${value}`);
        }
        return context.heap.get(value);
      }

      if (typeof value === 'number') {
        return -value;
        
      }
      else if (typeof value === 'boolean'){
        return !value;
      }
      
      throw new Error('Invalid unary expression.');
    }

    case ExpressionNodeType.FunctionCall:
      return executeFunctionCall(
        expression.name,
        expression.arguments,
        context,
      );
  }
}

/** Builds a record instance from `new TypeName { ... }`, validating required fields. */
function evaluateRecordLiteral(
  expression: Extract<ExpressionNode, { type: ExpressionNodeType.RecordLiteral }>,
  context: ExecutionContext,
): RecordRuntimeValue {
  const recordFields = context.recordRegistry.getFields(expression.recordTypeName);
  const fieldValues = new Map<string, RuntimeValue>();

  for (const fieldDefinition of recordFields) {
    const literalField = expression.fields.find(
      (field) => field.name === fieldDefinition.name,
    );

    if (!literalField) {
      throw new Error(
        `Missing field "${fieldDefinition.name}" in record literal for "${expression.recordTypeName}"`,
      );
    }

    fieldValues.set(
      fieldDefinition.name,
      evaluateExpression(literalField.value, context),
    );
  }

  return {
    recordTypeName: expression.recordTypeName,
    fields: fieldValues,
  };
}

/** Looks up and invokes a user-defined function by name. */
function executeFunctionCall(
  name: string,
  args: ExpressionNode[],
  context: ExecutionContext,
): RuntimeValue {
  const functionNode = context.environment.getFunction(name);
  const argValues = args.map((arg) => evaluateExpression(arg, context));

  return executeUserFunction(functionNode, argValues, context);
}

/** Runs a function body in a fresh function scope; catches `return` via ReturnException. */
function executeUserFunction(
  functionNode: FunctionDeclarationNode,
  argValues: RuntimeValue[],
  context: ExecutionContext,
): RuntimeValue {
  if (argValues.length !== functionNode.parameters.length) {
    throw new Error(
      `Function "${functionNode.name}" expected ${functionNode.parameters.length} arguments but got ${argValues.length}`,
    );
  }

  // Same-file private helpers are visible here via the caller's module scope.
  const callableEnvironment = withModuleFunctions(
    context.environment,
    functionNode.sourceModule,
    context.moduleFunctions,
  );
  const functionEnvironment = callableEnvironment.createFunctionScope();
  const functionContext: ExecutionContext = {
    ...context,
    environment: functionEnvironment,
  };

  functionNode.parameters.forEach((parameter, index) => {
    const paramAddr = context.heap.malloc(1);
    context.heap.set(paramAddr, argValues[index]);

    functionEnvironment.declare(
      'let',
      parameter.name,
      { isHeapReference: true, address: paramAddr },
      resolveParameterType(parameter, context.recordRegistry),
    );
  });

  try {
    executeBlock(functionNode.body, functionContext);
  } catch (error) {
    if (error instanceof ReturnException) {
      return error.value;
    }
    throw error;
  }

  return null;
}
