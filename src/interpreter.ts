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
import { ReturnException } from './classes/ReturnException';
import { buildRecordRegistry, RecordRegistry } from './classes/RecordRegistry';
import { RuntimeEnvironment } from './classes/RuntimeEnvironment';
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
  StatementNode,
  StatementNodeType,
} from './models/StatementNode';
import { isTruthy } from './utils/isTruthy';
import { withModuleFunctions } from './utils/moduleScope';
import {
  getRecordFieldValue,
  setRecordFieldValue,
} from './utils/recordRuntimeUtils';
import { expressionTypeToResolved } from './utils/astigTypeUtils';
import fs from 'fs';

type ExecutionContext = {
  environment: RuntimeEnvironment;
  recordRegistry: RecordRegistry;
  output: string[];
  moduleFunctions: Record<string, FunctionDeclarationNode[]>;
};

/** Runs the full program and returns all printed lines in order. */
export function runProgram(program: ProgramNode): string[] {
  const recordRegistry = buildRecordRegistry(program.recordDeclarations);
  const environment = new RuntimeEnvironment(undefined, true);
  const output: string[] = [];
  const context: ExecutionContext = {
    environment,
    recordRegistry,
    output,
    moduleFunctions: program.moduleFunctions,
  };

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

  switch (statement.type) {
    case StatementNodeType.VariableDeclaration:
      environment.declare(
        statement.declarationKind,
        statement.name,
        evaluateExpression(statement.value, context),
      );
      return;

    case StatementNodeType.Assignment:
      executeAssignment(statement, context);
      return;
    
    case StatementNodeType.ArrayIndexAssignment:
      const targetArray = environment.lookup(statement.arrayName);

      if (!Array.isArray(targetArray)){
        throw new Error(`Runtime Error: Variable "${statement.arrayName}" is not an array.`);
      }
      const incomingValue = evaluateExpression(statement.value, context);
      const evaluatedIndex: RuntimeValue = evaluateExpression(statement.index, context);
      
      if (typeof evaluatedIndex !== "number"){
        throw new Error(`Runtime Error: Array index must evaluate to a number. Got value "${evaluatedIndex}" of type: ${typeof evaluatedIndex}`);
      }

      const index = Math.floor(evaluatedIndex);

      if (index < 0 || index >= targetArray.length){
        throw new Error(
          `Runtime Error: Index ${index} is out of bounds for array "${statement.arrayName}" of length ${targetArray.length}.`
        );
      }

      targetArray[index] = incomingValue;
      return;

    case StatementNodeType.PrintStatement:
      output.push(String(evaluateExpression(statement.value, context)));
      return;
    
    case StatementNodeType.ScanStatement:{
      if (statement.promptMessage){
        process.stdout.write(statement.promptMessage);
      }

      const buffer = Buffer.alloc(1024);
      const bytesRead = fs.readSync(0, buffer, 0, buffer.length, null);
      const userInput = buffer.toString('utf8', 0, bytesRead).trim();

      const currentVarValue = environment.get(statement.variableName);

      let finalValue: any = userInput;
      if (typeof currentVarValue === 'number') {
        const parsed = parseInt(userInput, 10);
        finalValue = isNaN(parsed) ? 0 : parsed; // Coerce text to a clean mathematical integer
      } else if (typeof currentVarValue === 'boolean') {
        finalValue = userInput.toLowerCase() === 'true';
      }

      environment.assign(statement.variableName, finalValue);
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
          executeAssignment(statement.update, loopContext);
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
        foreachEnvironment.declare('let', statement.variable, '');

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
        throw new Error(
          `Foreach only supports string iteration, got ${typeof iterable}`,
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

    case StatementNodeType.BlockStatement:
      executeBlock(statement.body, context);
      return;
  }
}

/** Evaluates the right-hand side and writes to a variable or record field target. */
function executeAssignment(assignment: AssignmentNode, context: ExecutionContext): void {
  const rightValue = evaluateExpression(assignment.value, context);
  const resultValue = evaluateAssignmentValue(assignment, rightValue, context);

  if (assignment.target.kind === 'variable') {
    context.environment.assign(assignment.target.name, resultValue);
    return;
  }

  assignRecordField(assignment.target, resultValue, context);
}

/** Writes through a dotted record field path on a variable in the environment. */
function assignRecordField(
  target: Extract<AssignmentTarget, { kind: 'recordField' }>,
  value: RuntimeValue,
  context: ExecutionContext,
): void {
  const recordValue = context.environment.get(target.rootVariable);

  if (!isRecordRuntimeValue(recordValue)) {
    throw new Error(`Variable "${target.rootVariable}" is not a record`);
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
    return context.environment.get(target.name);
  }

  const recordValue = context.environment.get(target.rootVariable);
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

    case ExpressionNodeType.Identifier:
      return context.environment.get(expression.name);

    case ExpressionNodeType.MemberAccess: {
      const objectValue = evaluateExpression(expression.object, context);

      if (!isRecordRuntimeValue(objectValue)) {
        throw new Error(`Cannot access member "${expression.field}" on non-record value`);
      }

      return getRecordFieldValue(objectValue, [expression.field]);
    }

    case ExpressionNodeType.ArrayLiteral:
      return expression.elements.map(elementNode => (evaluateExpression(elementNode, context)));

    case ExpressionNodeType.ArrayIndexAccess:
      const targetArray = context.environment.lookup(expression.arrayName);
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
        case 'AND':
          return (left as boolean) && (right as boolean);
        case 'OR':
          return (left as boolean) || (right as boolean);
        default:
          throw new Error('Unsupported binary operator');
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
    functionEnvironment.declare('let', parameter.name, argValues[index]);
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
