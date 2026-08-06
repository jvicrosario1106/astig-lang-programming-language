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
import { RuntimeErrors } from './classes/RuntimeErrors';
import {
  ArrayBoundsError,
  ArrayTypeError,
  ConstAssignmentError,
  InvalidOperationError,
  PrintError,
  ScanError,
  toRuntimeError,
  UndefinedFunctionError,
} from './classes/RuntimeExceptions';
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
import { resolveParameterType, resolveVariableDeclarationType, formatResolvedType } from './utils/astigTypeUtils';
import { isTruthy } from './utils/isTruthy';
import { withModuleFunctions, findFunctionInModules } from './utils/moduleScope';
import {
  getRecordFieldValue,
  setRecordFieldValue,
} from './utils/recordRuntimeUtils';
import { coerceScanInput, isScannableType, readScanLine } from './utils/scanUtils';
import {
  runWithRuntimeRecovery,
  RuntimeRecoverySession,
} from './utils/runtimeRecovery';
import { HeapEmulator, VirtualHeap } from './classes/HeapEmulator';
import { MarkSweepGC } from './models/GarbageCollector';
import { HeapVisualizer } from './classes/HeapVisualizer';
import {
  describeStatement,
  MAIN_FUNCTION_NAME,
  RuntimeDebugSession,
} from './classes/RuntimeDebugger';

export type ExecutionContext = {
  environment: RuntimeEnvironment;
  recordRegistry: RecordRegistry;
  output: string[];
  moduleFunctions: Record<string, FunctionDeclarationNode[]>;
  insideFunction: boolean;
  recovery?: RuntimeRecoverySession;
  heap: HeapEmulator;
  debug?: RuntimeDebugSession;
};

function raiseArrayBoundsError(message: string, location?: SourceLocation): never {
  throw new ArrayBoundsError(message, location);
}

function raiseArrayTypeError(message: string, location?: SourceLocation): never {
  throw new ArrayTypeError(message, location);
}

function raiseInvalidOperation(message: string, location?: SourceLocation): never {
  throw new InvalidOperationError(message, location);
}

function runRecordOperation(
  operation: () => RuntimeValue | void,
  location?: SourceLocation,
): RuntimeValue | void {
  try {
    return operation();
  } catch (error) {
    if (error instanceof Error) {
      raiseInvalidOperation(error.message, location);
    }
    throw error;
  }
}

/** Formats a runtime value for output; plain Errors become PrintError upstream. */
function formatValueForPrint(value: RuntimeValue): string {
  if (isRecordRuntimeValue(value)) {
    throw new Error(
      `Cannot print record value of type "${value.recordTypeName}" directly`,
    );
  }

  if (Array.isArray(value)) {
    return `[${value.map((element) => formatValueForPrint(element)).join(', ')}]`;
  }

  return String(value);
}

/** Runs print with try-catch so I/O failures become PrintError. */
function executePrintStatement(
  statement: Extract<StatementNode, { type: StatementNodeType.PrintStatement }>,
  context: ExecutionContext,
): void {
  const location = statement.location;

  try {
    const value = evaluateExpression(statement.value, context);
    context.output.push(formatValueForPrint(value));
  } catch (error) {
    if (error instanceof RuntimeError) {
      throw error;
    }

    const message =
      error instanceof Error ? error.message : 'Print statement failed';
    throw new PrintError(message, location);
  }
}

/** Runs scan with try-catch so I/O failures become ScanError. */
function executeScanStatement(
  statement: Extract<StatementNode, { type: StatementNodeType.ScanStatement }>,
  context: ExecutionContext,
): void {
  const location = statement.location;
  const { environment } = context;

  try {
    const variableKind = environment.getVariableKind(statement.variableName);
    if (variableKind === 'const') {
      throw new ConstAssignmentError(statement.variableName, location);
    }

    const targetType = environment.getResolvedType(statement.variableName);
    if (!isScannableType(targetType)) {
      throw new ScanError(
        `Cannot scan into ${formatResolvedType(targetType)}`,
        location,
      );
    }

    if (statement.promptMessage) {
      process.stdout.write(statement.promptMessage);
    }

    const userInput = readScanLine();
    const finalValue = coerceScanInput(userInput, targetType);
    const binding = environment.get(statement.variableName);

    if (binding && typeof binding === 'object' && 'isHeapReference' in binding) {
      context.heap.set(binding.address, finalValue);
    } else {
      environment.assign(statement.variableName, finalValue);
    }
  } catch (error) {
    if (error instanceof RuntimeError) {
      throw error;
    }

    const message =
      error instanceof Error ? error.message : 'Scan statement failed';
    throw new ScanError(message, location);
  }
}

let currentContext: ExecutionContext | null = null;

/** Runs the full program and returns all printed lines in order. */
export function runProgram(
  program: ProgramNode,
  filename = '<input>',
  recover = true,
  debug?: RuntimeDebugSession,
): string[] {
  const recovery: RuntimeRecoverySession | undefined = recover
    ? { filename, diagnostics: [] }
    : undefined;
  const recordRegistry = buildRecordRegistry(program.recordDeclarations);
  const environment = new RuntimeEnvironment(undefined, true, 'global');
  const output: string[] = [];
  const heapInstance = new VirtualHeap();
  const context: ExecutionContext = {
    environment,
    recordRegistry,
    output,
    moduleFunctions: program.moduleFunctions,
    insideFunction: false,
    recovery,
    heap: heapInstance,
    debug,
  };

  currentContext = context;

  heapInstance.registerGCCallback(() => {
    let header: string = "\n CRITICAL THRESHOLD HIT (>=75%)! Initiating Mark-and-Sweep...";
    let gcReport = HeapVisualizer.renderSnapshot(heapInstance, header);
    //console.log(gcReport); // Before GC Snapshot
    HeapVisualizer.appendFullReport(gcReport);

    if (currentContext){
      MarkSweepGC.run(currentContext);
    }

    header = " GC SWEEP COMPLETE!";
    gcReport = HeapVisualizer.renderSnapshot(heapInstance, header);
    //console.log(gcReport); // After GC Snapshot
    HeapVisualizer.appendFullReport(gcReport);
  });

  for (const functionNode of program.functions) {
    runWithRuntimeRecovery(
      recovery,
      () => environment.declareFunction(functionNode),
      functionNode.location,
    );
  }

  if (debug) {
    debug.recordStep(
      environment,
      heapInstance,
      'Functions registered in global scope',
      { line: 1, column: 1 },
    );
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

  const mainEntryLine = program.mainFunction.body[0]?.location?.line ?? 1;
  const mainEntryColumn = program.mainFunction.body[0]?.location?.column ?? 1;

  if (debug) {
    debug.pushFrame(MAIN_FUNCTION_NAME, mainEntryLine, mainEntryColumn);
    debug.recordStep(
      mainEnvironment,
      heapInstance,
      `Enter ${MAIN_FUNCTION_NAME}`,
      { line: mainEntryLine, column: mainEntryColumn },
    );
  }

  executeBlock(program.mainFunction.body, {
    ...context,
    environment: mainEnvironment,
  });

  if (debug) {
    debug.recordStep(
      mainEnvironment,
      heapInstance,
      `${MAIN_FUNCTION_NAME} finished`,
      { line: mainEntryLine, column: mainEntryColumn },
    );
    debug.popFrame();
  }

  if (recovery && recovery.diagnostics.length > 0) {
    throw new RuntimeErrors(recovery.diagnostics);
  }

  let header: string = "\n CLOSING PROGRAM! Initiating Mark-and-Sweep...";
  let gcReport = HeapVisualizer.renderSnapshot(heapInstance, header);
  //console.log(gcReport); // Before GC Snapshot
  HeapVisualizer.appendFullReport(gcReport);

  MarkSweepGC.run(context);

  header = " GC SWEEP COMPLETE!";
  gcReport = HeapVisualizer.renderSnapshot(heapInstance, header);
  //console.log(gcReport); // After GC Snapshot
  HeapVisualizer.appendFullReport(gcReport);

  return output;
}

/** Dispatches a single statement to the appropriate runtime handler. */
function executeStatement(statement: StatementNode, context: ExecutionContext): void {
  currentContext = context;
  const { environment, output } = context;
  const location = statement.location;

  // Helper function to safely execute an action and throw appropriate errors.
  const runSafely = (action: () => void): void => {
    try {
      action();
    } catch (error) {
      if (
        error instanceof RuntimeError ||
        error instanceof BreakException ||
        error instanceof ContinueException ||
        error instanceof ReturnException
      ) {
        throw error;
      }

      throw toRuntimeError(error, location);
    }
  };

  switch (statement.type) {
    case StatementNodeType.VariableDeclaration:
      runSafely(() => {
        const resolvedType = resolveVariableDeclarationType(
          statement,
          context.recordRegistry,
        );

        if (statement.value) {
          const initialValue = evaluateExpression(statement.value, context);
          const addr = context.heap.malloc(1);
          context.heap.set(addr, initialValue);

          environment.declare(
            statement.declarationKind,
            statement.name,
            { isHeapReference: true, address: addr },
            resolvedType,
          );
          return;
        }

        environment.declareUninitialized(
          statement.declarationKind,
          statement.name,
          resolvedType,
        );
      });
      return;

    case StatementNodeType.Assignment:
      executeAssignment(statement, context, location);
      return;
    
    case StatementNodeType.ArrayIndexAssignment: {
      if (statement.operator !== '=') {
        raiseInvalidOperation(
          `Unsupported array index assignment operator "${statement.operator}"`,
          location,
        );
      }

      let targetArray = environment.lookup(statement.arrayName);

      if (targetArray && typeof targetArray === 'object' && 'isHeapReference' in targetArray) {
        targetArray = context.heap.get(targetArray.address);
      }

      if (!Array.isArray(targetArray)) {
        raiseArrayTypeError(
          `Variable "${statement.arrayName}" is not an array.`,
          location,
        );
      }
      const incomingValue = evaluateExpression(statement.value, context);
      const evaluatedIndex: RuntimeValue = evaluateExpression(statement.index, context);
      
      if (typeof evaluatedIndex !== 'number') {
        raiseInvalidOperation(
          `Array index must evaluate to a number. Got value "${evaluatedIndex}" of type: ${typeof evaluatedIndex}`,
          location,
        );
      }

      const index = Math.floor(evaluatedIndex);

      if (index < 0 || index >= targetArray.length) {
        raiseArrayBoundsError(
          `Index ${index} is out of bounds for array "${statement.arrayName}" of length ${targetArray.length}.`,
          location,
        );
      }

      targetArray[index] = incomingValue;
      return;
    }

    case StatementNodeType.PrintStatement:
      executePrintStatement(statement, context);
      return;

    case StatementNodeType.ScanStatement:
      executeScanStatement(statement, context);
      return;

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
        raiseInvalidOperation(
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
      if (!context.insideFunction) {
        throw new InvalidOperationError(
          'Return statement outside of a function',
          location,
        );
      }

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
  const resultValue = evaluateAssignmentValue(assignment, rightValue, context, location);

  if (assignment.target.kind === 'variable') {
    try {
      const variableName = assignment.target.name;
      if (context.environment.getVariableKind(variableName) === 'const') {
        throw new ConstAssignmentError(variableName, location);
      }

      const binding = context.environment.get(variableName);

      // Mutate the value inside the heap slot instead of replacing the environment binding object
      if (binding && typeof binding === 'object' && 'isHeapReference' in binding) {
        context.heap.set(binding.address, resultValue);
      } else {
        context.environment.assign(variableName, resultValue);
      }
    } catch (error) {
      throw toRuntimeError(error, location);
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
    throw new InvalidOperationError(
      `Variable "${target.rootVariable}" is not a record`,
      location,
    );
  }

  runRecordOperation(
    () => setRecordFieldValue(recordValue, target.fieldPath, value),
    location,
  );
}

/** Computes the stored value for `=`, `+=`, or `-=` assignments. */
function evaluateAssignmentValue(
  assignment: AssignmentNode,
  rightValue: RuntimeValue,
  context: ExecutionContext,
  location?: SourceLocation,
): RuntimeValue {
  if (assignment.operator === '=') {
    return rightValue;
  }

  const leftValue = readAssignmentTargetValue(assignment.target, context, location);

  if (assignment.operator === '+=') {
    if (typeof leftValue === 'string' || typeof rightValue === 'string') {
      return String(leftValue) + String(rightValue);
    }
    return (leftValue as number) + (rightValue as number);
  }

  if (assignment.operator === '-=') {
    return (leftValue as number) - (rightValue as number);
  }

  raiseInvalidOperation(
    `Unsupported assignment operator "${assignment.operator}"`,
    location,
  );
}

/** Reads the current value of an assignment target (variable or record field). */
function readAssignmentTargetValue(
  target: AssignmentTarget,
  context: ExecutionContext,
  location?: SourceLocation,
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
    raiseInvalidOperation(
      `Variable "${target.rootVariable}" is not a record`,
      location,
    );
  }

  return runRecordOperation(
    () => getRecordFieldValue(recordValue, target.fieldPath),
    location,
  ) as RuntimeValue;
}

/** Runs statements in a new block scope. */
function executeBlock(statements: StatementNode[], context: ExecutionContext): void {
  const blockEnvironment = context.environment.createBlockScope();
  const blockContext: ExecutionContext = {
    ...context,
    environment: blockEnvironment,
  };

  for (const statement of statements) {
    runWithRuntimeRecovery(
      context.recovery,
      () => executeStatement(statement, blockContext),
      statement.location,
    );

    context.debug?.recordStep(
      blockContext.environment,
      context.heap,
      describeStatement(statement),
      statement.location,
    );
  }
}

/** Recursively evaluates an expression and returns its runtime value. */
function evaluateExpression(
  expression: ExpressionNode,
  context: ExecutionContext,
): RuntimeValue {
  currentContext = context;

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
        throw new InvalidOperationError(
          `Cannot access member "${expression.field}" on non-record value`,
        );
      }

      return runRecordOperation(
        () => getRecordFieldValue(objectValue, [expression.field]),
      ) as RuntimeValue;
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
        throw new ArrayTypeError(`"${expression.arrayName}" is not an array.`);
      }

      let evaluatedIndex: RuntimeValue = evaluateExpression(expression.index, context);

      if (typeof evaluatedIndex === 'string' && !isNaN(Number(evaluatedIndex))) {
        evaluatedIndex = parseInt(evaluatedIndex, 10);
      }
      
      if (typeof evaluatedIndex !== "number"){
        throw new InvalidOperationError(
          `Array index must evaluate to a number. Got value "${evaluatedIndex}" of type: ${typeof evaluatedIndex}`,
        );
      }

      const index = Math.floor(evaluatedIndex);

      if (index < 0 || index >= targetArray.length){
        throw new ArrayBoundsError(
          `Index ${index} is out of bounds for array "${expression.arrayName}" of length ${targetArray.length}.`,
        );
      }
      return targetArray[index];

    case ExpressionNodeType.RecordLiteral:
      return evaluateRecordLiteral(expression, context);

    case ExpressionNodeType.BinaryExpression: {
      const left = evaluateExpression(expression.left, context);
      const right = evaluateExpression(expression.right, context);
      const operator = expression.operator;

      switch (operator) {
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
          raiseInvalidOperation(`Unsupported binary operator "${operator}"`);
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
      
      raiseInvalidOperation('Invalid unary expression.');
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
  if (!context.recordRegistry.has(expression.recordTypeName)) {
    raiseInvalidOperation(`Unknown record type "${expression.recordTypeName}"`);
  }

  const recordFields = context.recordRegistry.getFields(expression.recordTypeName);
  const fieldValues = new Map<string, RuntimeValue>();

  for (const literalField of expression.fields) {
    const fieldDefinition = recordFields.find(
      (field) => field.name === literalField.name,
    );

    if (!fieldDefinition) {
      raiseInvalidOperation(
        `Field "${literalField.name}" is not declared on record "${expression.recordTypeName}"`,
      );
    }
  }

  for (const fieldDefinition of recordFields) {
    const literalField = expression.fields.find(
      (field) => field.name === fieldDefinition.name,
    );

    if (!literalField) {
      raiseInvalidOperation(
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
  location?: SourceLocation,
): RuntimeValue {
  let functionNode: FunctionDeclarationNode;

  try {
    functionNode = context.environment.getFunction(name);
  } catch (error) {
    if (error instanceof UndefinedFunctionError) {
      const privateFunction = findFunctionInModules(name, context.moduleFunctions);
      if (privateFunction && !privateFunction.isExported) {
        raiseInvalidOperation(
          `Function "${name}" is not exported from "${privateFunction.sourceModule}"`,
          location,
        );
      }
    }

    throw error;
  }

  const argValues = args.map((arg) => evaluateExpression(arg, context));

  return executeUserFunction(functionNode, argValues, context, location);
}

/** Runs a function body in a fresh function scope; catches `return` via ReturnException. */
function executeUserFunction(
  functionNode: FunctionDeclarationNode,
  argValues: RuntimeValue[],
  context: ExecutionContext,
  location?: SourceLocation,
): RuntimeValue {
  if (argValues.length !== functionNode.parameters.length) {
    raiseInvalidOperation(
      `Function "${functionNode.name}" expected ${functionNode.parameters.length} arguments but got ${argValues.length}`,
      location,
    );
  }

  // Same-file private helpers are visible here via the caller's module scope.
  const callableEnvironment = withModuleFunctions(
    context.environment,
    functionNode.sourceModule,
    context.moduleFunctions,
  );
  const functionEnvironment = callableEnvironment.createFunctionScope(functionNode.name);
  const functionContext: ExecutionContext = {
    ...context,
    environment: functionEnvironment,
    insideFunction: true,
  };

  const callLine = location?.line ?? functionNode.location?.line ?? 1;
  const callColumn = location?.column ?? functionNode.location?.column ?? 1;

  context.debug?.pushFrame(functionNode.name, callLine, callColumn);

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

  context.debug?.recordStep(
    functionEnvironment,
    context.heap,
    `Enter function ${functionNode.name}`,
    location ?? functionNode.location,
  );

  try {
    executeBlock(functionNode.body, functionContext);
  } catch (error) {
    if (error instanceof ReturnException) {
      context.debug?.recordStep(
        functionEnvironment,
        context.heap,
        `Return from ${functionNode.name}`,
        location ?? functionNode.location,
      );
      context.debug?.popFrame();
      return error.value;
    }
    context.debug?.popFrame();
    throw error;
  }

  context.debug?.recordStep(
    functionEnvironment,
    context.heap,
    `Return from ${functionNode.name} (implicit null)`,
    location ?? functionNode.location,
  );
  context.debug?.popFrame();

  return null;
}
