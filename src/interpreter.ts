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
      environment.set(statement.name, evaluateExpression(statement.value, environment));
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

    case 'FunctionCall':
      throw new Error(`Function calls are not implemented yet: ${expression.name}`);
  }
}
