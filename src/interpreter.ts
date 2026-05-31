import { ExpressionNode, ProgramNode, StatementNode } from './ast';

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
    case 'VariableDeclaration':
      environment.set(
        statement.name,
        evaluateExpression(statement.value, environment),
      );
      return;

    case 'PrintStatement':
      output.push(String(evaluateExpression(statement.value, environment)));
      return;

    case 'FunctionDeclaration':
      return;

    case 'ReturnStatement':
      throw new Error('Return statements are only valid inside function calls');

    case 'BlockStatement':
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
    case 'NumberLiteral':
    case 'StringLiteral':
      return expression.value;

    case 'Identifier': {
      const value = environment.get(expression.name);
      if (value === undefined) {
        throw new Error(`Undefined variable "${expression.name}"`);
      }

      return value;
    }

    case 'BinaryExpression': {
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

    case 'UnaryExpression': {
      const value = evaluateExpression(expression.argument, environment);
      if (typeof value !== 'number') {
        throw new Error('Unary minus can only be applied to numbers');
      }
      return -value;
    }

    case 'FunctionCall':
      throw new Error(
        `Function calls are not implemented yet: ${expression.name}`,
      );
  }
}
