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
import { resolveParameterType, resolveVariableDeclarationType } from './utils/astigTypeUtils';
import { isTruthy } from './utils/isTruthy';
import { withModuleFunctions, findFunctionInModules } from './utils/moduleScope';
import {
  getRecordFieldValue,
  setRecordFieldValue,
} from './utils/recordRuntimeUtils';
import { coerceScanInput, readScanLine } from './utils/scanUtils';
import {
  runWithRuntimeRecovery,
  RuntimeRecoverySession,
} from './utils/runtimeRecovery';

type ExecutionContext = {
  environment: RuntimeEnvironment;
  recordRegistry: RecordRegistry;
  output: string[];
  moduleFunctions: Record<string, FunctionDeclarationNode[]>;
  insideFunction: boolean;
  recovery?: RuntimeRecoverySession;
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

    if (statement.promptMessage) {
      process.stdout.write(statement.promptMessage);
    }

    const userInput = readScanLine();
    const targetType = environment.getResolvedType(statement.variableName);
    const finalValue = coerceScanInput(userInput, targetType);
    environment.assign(statement.variableName, finalValue);
  } catch (error) {
    if (error instanceof RuntimeError) {
      throw error;
    }

    const message =
      error instanceof Error ? error.message : 'Scan statement failed';
    throw new ScanError(message, location);
  }
}

/** Runs the full program and returns all printed lines in order. */
export function runProgram(
  program: ProgramNode,
  filename = '<input>',
  recover = true,
): string[] {
  const recovery: RuntimeRecoverySession | undefined = recover
    ? { filename, diagnostics: [] }
    : undefined;
  const recordRegistry = buildRecordRegistry(program.recordDeclarations);
  const environment = new RuntimeEnvironment(undefined, true);
  const output: string[] = [];
  const context: ExecutionContext = {
    environment,
    recordRegistry,
    output,
    moduleFunctions: program.moduleFunctions,
    insideFunction: false,
    recovery,
  };

  for (const functionNode of program.functions) {
    runWithRuntimeRecovery(
      recovery,
      () => environment.declareFunction(functionNode),
      functionNode.location,
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

  executeBlock(program.mainFunction.body, {
    ...context,
    environment: mainEnvironment,
  });

  if (recovery && recovery.diagnostics.length > 0) {
    throw new RuntimeErrors(recovery.diagnostics);
  }

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
          environment.declare(
            statement.declarationKind,
            statement.name,
            evaluateExpression(statement.value, context),
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

      const targetArray = environment.lookup(statement.arrayName);

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
      context.environment.assign(assignment.target.name, resultValue);
    } catch (error) {
      throw toRuntimeError(error, location);
    }
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
  const recordValue = context.environment.get(target.rootVariable);

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
    return context.environment.get(target.name);
  }

  const recordValue = context.environment.get(target.rootVariable);
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

    case ExpressionNodeType.Identifier:
      return context.environment.get(expression.name);

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

    case ExpressionNodeType.ArrayLiteral:
      return expression.elements.map(elementNode => (evaluateExpression(elementNode, context)));

    case ExpressionNodeType.ArrayIndexAccess:
      const targetArray = context.environment.lookup(expression.arrayName);
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
        case 'AND':
          return (left as boolean) && (right as boolean);
        case 'OR':
          return (left as boolean) || (right as boolean);
        default:
          raiseInvalidOperation(`Unsupported binary operator "${operator}"`);
      }
    }

    case ExpressionNodeType.UnaryExpression: {
      const value = evaluateExpression(expression.argument, context);
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
  const functionEnvironment = callableEnvironment.createFunctionScope();
  const functionContext: ExecutionContext = {
    ...context,
    environment: functionEnvironment,
    insideFunction: true,
  };

  functionNode.parameters.forEach((parameter, index) => {
    functionEnvironment.declare(
      'let',
      parameter.name,
      argValues[index],
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
