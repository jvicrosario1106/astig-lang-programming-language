import {
  BlockContext,
  ExpressionContext,
  FunctionCallContext,
  FunctionDeclarationContext,
  ParameterContext,
  PrintStatementContext,
  ProgramContext,
  ReturnStatementContext,
  StatementContext,
  VariableDeclarationContext,
} from '../generated/grammar/AstigLangParser';

export type ProgramNode = {
  type: 'Program';
  body: StatementNode[];
};

export type StatementNode =
  | VariableDeclarationNode
  | PrintStatementNode
  | FunctionDeclarationNode
  | ReturnStatementNode
  | BlockStatementNode;

export type VariableDeclarationNode = {
  type: 'VariableDeclaration';
  name: string;
  declaredType?: string;
  value: ExpressionNode;
};

export type PrintStatementNode = {
  type: 'PrintStatement';
  value: ExpressionNode;
};

export type FunctionDeclarationNode = {
  type: 'FunctionDeclaration';
  name: string;
  parameters: ParameterNode[];
  returnType?: string;
  body: StatementNode[];
};

export type ParameterNode = {
  type: 'Parameter';
  name: string;
  declaredType?: string;
};

export type ReturnStatementNode = {
  type: 'ReturnStatement';
  value?: ExpressionNode;
};

export type BlockStatementNode = {
  type: 'BlockStatement';
  body: StatementNode[];
};

export type ExpressionNode =
  | NumberLiteralNode
  | StringLiteralNode
  | IdentifierNode
  | FunctionCallNode
  | BinaryExpressionNode
  | UnaryExpressionNode;

export type NumberLiteralNode = {
  type: 'NumberLiteral';
  value: number;
};

export type StringLiteralNode = {
  type: 'StringLiteral';
  value: string;
};

export type IdentifierNode = {
  type: 'Identifier';
  name: string;
};

export type FunctionCallNode = {
  type: 'FunctionCall';
  name: string;
  arguments: ExpressionNode[];
};

export type BinaryExpressionNode = {
  type: 'BinaryExpression';
  operator: '+' | '-' | '*' | '/';
  left: ExpressionNode;
  right: ExpressionNode;
};

export type UnaryExpressionNode = {
  type: 'UnaryExpression';
  operator: '-';
  argument: ExpressionNode;
};

export function buildAst(ctx: ProgramContext): ProgramNode {
  return {
    type: 'Program',
    body: ctx.statement().map(buildStatement),
  };
}

function buildStatement(ctx: StatementContext): StatementNode {
  const variableDeclaration = ctx.variableDeclaration();
  if (variableDeclaration) {
    return buildVariableDeclaration(variableDeclaration);
  }

  const printStatement = ctx.printStatement();
  if (printStatement) {
    return buildPrintStatement(printStatement);
  }

  const functionDeclaration = ctx.functionDeclaration();
  if (functionDeclaration) {
    return buildFunctionDeclaration(functionDeclaration);
  }

  const returnStatement = ctx.returnStatement();
  if (returnStatement) {
    return buildReturnStatement(returnStatement);
  }

  const block = ctx.block();
  if (block) {
    return buildBlockStatement(block);
  }

  throw new Error(`Unsupported statement: ${ctx.text}`);
}

function buildVariableDeclaration(
  ctx: VariableDeclarationContext,
): VariableDeclarationNode {
  return {
    type: 'VariableDeclaration',
    name: ctx.IDENTIFIER().text,
    declaredType: ctx.typeAnnotation()?.dataType().text,
    value: buildExpression(ctx.expression()),
  };
}

function buildPrintStatement(ctx: PrintStatementContext): PrintStatementNode {
  return {
    type: 'PrintStatement',
    value: buildExpression(ctx.expression()),
  };
}

function buildFunctionDeclaration(
  ctx: FunctionDeclarationContext,
): FunctionDeclarationNode {
  return {
    type: 'FunctionDeclaration',
    name: ctx.IDENTIFIER().text,
    parameters: ctx.parameterList()?.parameter().map(buildParameter) ?? [],
    returnType: ctx.returnTypeAnnotation()?.returnDataType().text,
    body: ctx.block().statement().map(buildStatement),
  };
}

function buildParameter(ctx: ParameterContext): ParameterNode {
  return {
    type: 'Parameter',
    name: ctx.IDENTIFIER().text,
    declaredType: ctx.typeAnnotation()?.dataType().text,
  };
}

function buildReturnStatement(
  ctx: ReturnStatementContext,
): ReturnStatementNode {
  const expression = ctx.expression();

  return {
    type: 'ReturnStatement',
    value: expression ? buildExpression(expression) : undefined,
  };
}

function buildBlockStatement(ctx: BlockContext): BlockStatementNode {
  return {
    type: 'BlockStatement',
    body: ctx.statement().map(buildStatement),
  };
}

function buildExpression(ctx: ExpressionContext): ExpressionNode {
  const functionCall = ctx.functionCall();
  if (functionCall) {
    return buildFunctionCall(functionCall);
  }

  const numberToken = ctx.NUMBER();
  if (numberToken) {
    return {
      type: 'NumberLiteral',
      value: Number(numberToken.text),
    };
  }

  const stringToken = ctx.STRING();
  if (stringToken) {
    return {
      type: 'StringLiteral',
      value: JSON.parse(stringToken.text) as string,
    };
  }

  const identifierToken = ctx.IDENTIFIER();
  if (identifierToken) {
    return {
      type: 'Identifier',
      name: identifierToken.text,
    };
  }

  const expressions = ctx.getRuleContexts(ExpressionContext);
  const operatorToken =
    (ctx as any)._op ?? ctx.ADD() ?? ctx.SUB() ?? ctx.MUL() ?? ctx.DIV();

  if (expressions.length === 2 && operatorToken) {
    return {
      type: 'BinaryExpression',
      operator: operatorToken.text as '+' | '-' | '*' | '/',
      left: buildExpression(expressions[0]),
      right: buildExpression(expressions[1]),
    };
  }

  if (expressions.length === 1 && ctx.SUB()) {
    return {
      type: 'UnaryExpression',
      operator: '-',
      argument: buildExpression(expressions[0]),
    };
  }

  if (expressions.length === 1) {
    return buildExpression(expressions[0]);
  }

  throw new Error(`Unsupported expression: ${ctx.text}`);
}

function buildFunctionCall(ctx: FunctionCallContext): FunctionCallNode {
  return {
    type: 'FunctionCall',
    name: ctx.IDENTIFIER().text,
    arguments: ctx.argumentList()?.expression().map(buildExpression) ?? [],
  };
}
