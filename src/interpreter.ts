import { ExpressionNode, ExpressionNodeType } from './models/ExpressionNode';
import { ProgramNode } from './models/ProgramNode';
import { StatementNode, StatementNodeType } from './models/StatementNode';

type RuntimeValue = number | string;

export function runProgram(program: ProgramNode): string[] {
  const environment = new Map<string, RuntimeValue>();
  const output: string[] = [];

  for (const statement of program.body) {
    executeStatement(statement, environment, output);
  }

  return output;
}

function executeStatement(
  statement: StatementNode,
  environment: Map<string, RuntimeValue>,
  output: string[],
): void {
  switch (statement.type) {
    case StatementNodeType.VariableDeclaration:
      environment.set(
        statement.name,
        evaluateExpression(statement.value, environment),
      );
      return;

    case StatementNodeType.PrintStatement:
      output.push(String(evaluateExpression(statement.value, environment)));
      return;

    case StatementNodeType.FunctionDeclaration:
      return;

    case StatementNodeType.ReturnStatement:
      throw new Error('Return statements are only valid inside function calls');

    case StatementNodeType.BlockStatement:
      for (const nestedStatement of statement.body) {
        executeStatement(nestedStatement, environment, output);
      }
      return;
  }
}

function evaluateExpression(
  expression: ExpressionNode,
  environment: Map<string, RuntimeValue>,
): RuntimeValue {
  switch (expression.type) {
    case ExpressionNodeType.NumberLiteral:
    case ExpressionNodeType.StringLiteral:
      return expression.value;

    case ExpressionNodeType.Identifier: {
      const value = environment.get(expression.name);
      if (value === undefined) {
        throw new Error(`Undefined variable "${expression.name}"`);
      }

      return value;
    }

    case ExpressionNodeType.BinaryExpression: {
      const left = evaluateExpression(expression.left, environment);
      const right = evaluateExpression(expression.right, environment);

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
        default:
          throw new Error('Unsupported binary operator');
      }
    }

    case ExpressionNodeType.UnaryExpression: {
      const value = evaluateExpression(expression.argument, environment);
      if (typeof value !== 'number') {
        throw new Error('Unary minus can only be applied to numbers');
      }
      return -value;
    }

    case ExpressionNodeType.FunctionCall:
      throw new Error(
        `Function calls are not implemented yet: ${expression.name}`,
      );
  }
}
