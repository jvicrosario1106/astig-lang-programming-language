import { BreakException } from './classes/BreakException';
import { ContinueException } from './classes/ContinueException';
import { ReturnException } from './classes/ReturnException';
import { RuntimeEnvironment } from './classes/RuntimeEnvironment';
import { ExpressionNode, ExpressionNodeType } from './models/ExpressionNode';
import { ProgramNode } from './models/ProgramNode';
import { RuntimeValue } from './models/RuntimeValue';
import {
  AssignmentNode,
  FunctionDeclarationNode,
  StatementNode,
  StatementNodeType,
} from './models/StatementNode';
import { isTruthy } from './utils/isTruthy';
// TODO: check if we can do these commands
// npm install readline-sync
// npm install --save-dev @types/readline-sync
// import readlineSync from 'readline-sync';
import fs from 'fs';

// Runs each top-level statement and collects printed output.
export function runProgram(program: ProgramNode): string[] {
  const environment = new RuntimeEnvironment(undefined, true);
  const output: string[] = [];
  for (const statement of program.body) {
    executeStatement(statement, environment, output);
  }

  return output;
}

// Executes one statement based on its AST node type.
function executeStatement(
  statement: StatementNode,
  environment: RuntimeEnvironment,
  output: string[],
): void {
  switch (statement.type) {
    case StatementNodeType.VariableDeclaration:
      // Store const/let/var with the correct runtime behavior.
      environment.declare(
        statement.declarationKind,
        statement.name,
        evaluateExpression(statement.value, environment, output),
      );
      return;

    case StatementNodeType.Assignment:
      // Update an existing variable.
      executeAssignment(statement, environment, output);
      return;
    
    case StatementNodeType.ArrayIndexAssignment:
      const targetArray = environment.lookup(statement.arrayName);

      // Check if it is an array first
      if (!Array.isArray(targetArray)){
        throw new Error(`Runtime Error: Variable "${statement.arrayName}" is not an array.`);
      }

      // Evaluate index first
      const index = evaluateExpression(statement.index, environment, output);

      // Check index is number.
      if (typeof index !== "number"){
        // If it is not a number then throw error
        throw new Error(`Runtime Error: Array index must evaluate to a number. Got type: ${typeof index}`);
      }
      
      // Check if index is within bounds (no negative or beyond bounds of array)
      if (index < 0 || index >= targetArray.length){
        throw new Error(`Runtime Error: Cannot assign to index ${index}. Index is out of bounds for array "${statement.arrayName}" of length ${targetArray.length}.`);
      }

      const incomingValue = evaluateExpression(statement.value, environment, output);
      targetArray[index] = incomingValue;
      return;

    case StatementNodeType.PrintStatement:
      // Evaluate then append to program output.
      output.push(
        String(evaluateExpression(statement.value, environment, output)),
      );
      return;
    
    case StatementNodeType.ScanStatement:{
      if (statement.promptMessage){
        process.stdout.write(statement.promptMessage);
      }

      const buffer = Buffer.alloc(1024);
      const bytesRead = fs.readSync(0, buffer, 0, buffer.length, null);
      const userInput = buffer.toString('utf8', 0, bytesRead).trim();

      environment.assign(statement.variableName, userInput);

      return;
    }

    case StatementNodeType.IfStatement: {
      // Run the first matching if/else-if/else block.
      const condition = evaluateExpression(
        statement.condition,
        environment,
        output,
      );

      if (isTruthy(condition)) {
        executeBlock(statement.thenBranch, environment, output);
      } else {
        // Check else if chains
        let executed = false;
        for (const elseIfChain of statement.elseIfChains) {
          const elseIfCondition = evaluateExpression(
            elseIfChain.condition,
            environment,
            output,
          );
          if (isTruthy(elseIfCondition)) {
            executeBlock(elseIfChain.body, environment, output);
            executed = true;
            break;
          }
        }
        // Execute else branch if no else if matched
        if (!executed && statement.elseBranch) {
          executeBlock(statement.elseBranch, environment, output);
        }
      }
      return;
    }

    case StatementNodeType.WhileStatement: {
      // Keep running while the condition is truthy.
      while (
        isTruthy(evaluateExpression(statement.condition, environment, output))
      ) {
        try {
          executeBlock(statement.body, environment, output);
        } catch (e) {
          if (e instanceof BreakException) {
            break;
          } else if (e instanceof ContinueException) {
            continue;
          }
          throw e;
        }
      }
      return;
    }

    case StatementNodeType.DoWhileStatement: {
      // Run once first, then check the condition.
      do {
        try {
          executeBlock(statement.body, environment, output);
        } catch (e) {
          if (e instanceof BreakException) {
            break;
          } else if (e instanceof ContinueException) {
            // Continue to condition check
          } else {
            throw e;
          }
        }
      } while (
        isTruthy(evaluateExpression(statement.condition, environment, output))
      );
      return;
    }

    case StatementNodeType.ForStatement: {
      // Let/const loop variables get their own loop scope.
      const loopEnvironment =
        statement.init?.type === StatementNodeType.VariableDeclaration &&
        statement.init.declarationKind !== 'var'
          ? environment.createBlockScope()
          : environment;

      // Execute initialization
      if (statement.init) {
        executeStatement(statement.init, loopEnvironment, output);
      }

      // Loop with condition and update
      while (
        !statement.condition ||
        isTruthy(
          evaluateExpression(statement.condition, loopEnvironment, output),
        )
      ) {
        try {
          executeBlock(statement.body, loopEnvironment, output);
        } catch (e) {
          if (e instanceof BreakException) {
            break;
          } else if (e instanceof ContinueException) {
            // Continue to update
          } else {
            throw e;
          }
        }

        // Execute update
        if (statement.update) {
          executeAssignment(statement.update, loopEnvironment, output);
        }
      }
      return;
    }

    case StatementNodeType.ForeachStatement: {
      // Iterate through each character in a string.
      const iterable = evaluateExpression(
        statement.iterable,
        environment,
        output,
      );

      // Handle string iteration
      if (typeof iterable === 'string') {
        const foreachEnvironment = environment.createBlockScope();
        foreachEnvironment.declare('let', statement.variable, '');
        for (const char of iterable) {
          foreachEnvironment.assign(statement.variable, char);
          try {
            executeBlock(statement.body, foreachEnvironment, output);
          } catch (e) {
            if (e instanceof BreakException) {
              break;
            } else if (e instanceof ContinueException) {
              continue;
            }
            throw e;
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
      // Save the function so calls can find it later.
      environment.declareFunction(statement);
      return;

    case StatementNodeType.ReturnStatement:
      // Exit the current function with an optional value.
      throw new ReturnException(
        statement.value
          ? evaluateExpression(statement.value, environment, output)
          : null,
      );

    case StatementNodeType.BlockStatement:
      executeBlock(statement.body, environment, output);
      return;
  }
}

// Evaluates the right side and assigns it to a variable.
function executeAssignment(
  assignment: AssignmentNode,
  environment: RuntimeEnvironment,
  output: string[],
): void {
  const rightValue = evaluateExpression(assignment.value, environment, output);
  const value = evaluateAssignmentValue(assignment, rightValue, environment);
  environment.assign(assignment.name, value);
}

// Applies =, +=, -=, and -+ assignment behavior.
function evaluateAssignmentValue(
  assignment: AssignmentNode,
  rightValue: RuntimeValue,
  environment: RuntimeEnvironment,
): RuntimeValue {
  if (assignment.operator === '=') {
    return rightValue;
  }

  const leftValue = environment.get(assignment.name);
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

// Runs statements inside a new block scope.
function executeBlock(
  statements: StatementNode[],
  environment: RuntimeEnvironment,
  output: string[],
): void {
  const blockEnvironment = environment.createBlockScope();
  for (const statement of statements) {
    executeStatement(statement, blockEnvironment, output);
  }
}

// Evaluates an expression into a runtime value.
function evaluateExpression(
  expression: ExpressionNode,
  environment: RuntimeEnvironment,
  output: string[],
): RuntimeValue {
  switch (expression.type) {
    case ExpressionNodeType.NumberLiteral:
    case ExpressionNodeType.StringLiteral:
      return expression.value;

    case ExpressionNodeType.RecordLiteral:
      const evaluatedFields = new Map<string, RuntimeValue>();
      for (const field of expression.fields){
        const runtimeVal = evaluateExpression(field.value, environment, output);
        evaluatedFields.set(field.name, runtimeVal);
      }
      return {
        recordTypeName: expression.recordTypeName,
        fields: evaluatedFields
      };
    
    case ExpressionNodeType.ArrayLiteral:
      return expression.elements.map(elementNode => (evaluateExpression(elementNode, environment, output)));

    case ExpressionNodeType.Identifier: 
      return environment.get(expression.name);

    case ExpressionNodeType.ArrayIndexAccess:
      const targetArray = environment.lookup(expression.arrayName);
      if (!Array.isArray(targetArray)){
        throw new Error(`Runtime Error: "${expression.arrayName}" is not an array.`);
      }

      const evaluatedIndex = evaluateExpression(expression.index, environment, output);
      // Check if expression is a number
      if (typeof evaluatedIndex !== "number") {
        throw new Error(`Runtime Error: Array index must evaluate to a number. Got: ${typeof evaluatedIndex}`);
      }

      // Check if the expression is within bounds
      if (evaluatedIndex < 0 || evaluatedIndex >= targetArray.length) {
        throw new Error(
            `Runtime Error: Index ${evaluatedIndex} is out of bounds for array "${expression.arrayName}" of length ${targetArray.length}.`
        );
      }

      return targetArray[evaluatedIndex];

    case ExpressionNodeType.BinaryExpression: {
      const left = evaluateExpression(expression.left, environment, output);
      const right = evaluateExpression(expression.right, environment, output);

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
        default:
          throw new Error('Unsupported binary operator');
      }
    }

    case ExpressionNodeType.UnaryExpression: {
      const value = evaluateExpression(
        expression.argument,
        environment,
        output,
      );
      if (typeof value !== 'number') {
        throw new Error('Unary minus can only be applied to numbers');
      }
      return -value;
    }

    case ExpressionNodeType.FunctionCall:
      return executeFunctionCall(
        expression.name,
        expression.arguments,
        environment,
        output,
      );
  }
}

// Calls a function with evaluated arguments.
function executeFunctionCall(
  name: string,
  args: ExpressionNode[],
  environment: RuntimeEnvironment,
  output: string[],
): RuntimeValue {
  const functionNode = environment.getFunction(name);
  const argValues = args.map((arg) =>
    evaluateExpression(arg, environment, output),
  );

  return executeUserFunction(functionNode, argValues, environment, output);
}

// Binds parameters, runs the body, and returns the result.
function executeUserFunction(
  functionNode: FunctionDeclarationNode,
  argValues: RuntimeValue[],
  callingEnvironment: RuntimeEnvironment,
  output: string[],
): RuntimeValue {
  if (argValues.length !== functionNode.parameters.length) {
    throw new Error(
      `Function "${functionNode.name}" expected ${functionNode.parameters.length} arguments but got ${argValues.length}`,
    );
  }

  const functionEnvironment = callingEnvironment.createFunctionScope();
  functionNode.parameters.forEach((parameter, index) => {
    functionEnvironment.declare('let', parameter.name, argValues[index]);
  });

  try {
    executeBlock(functionNode.body, functionEnvironment, output);
  } catch (e) {
    if (e instanceof ReturnException) {
      return e.value;
    }
    throw e;
  }

  return null;
}
