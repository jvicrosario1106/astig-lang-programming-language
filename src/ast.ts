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
import { ProgramNode } from './models/ProgramNode';
import {
  StatementNode,
  VariableDeclarationNode,
  StatementNodeType,
  PrintStatementNode,
  FunctionDeclarationNode,
  ReturnStatementNode,
  BlockStatementNode,
} from './models/StatementNode';
import { ParameterNode } from './models/ParameterNode';
import {
  FunctionCallNode,
  ExpressionNodeType,
  ExpressionNode,
} from './models/ExpressionNode';

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
    type: StatementNodeType.VariableDeclaration,
    name: ctx.IDENTIFIER().text,
    declaredType: ctx.typeAnnotation()?.dataType().text,
    value: buildExpression(ctx.expression()),
  };
}

function buildPrintStatement(ctx: PrintStatementContext): PrintStatementNode {
  return {
    type: StatementNodeType.PrintStatement,
    value: buildExpression(ctx.expression()),
  };
}

function buildFunctionDeclaration(
  ctx: FunctionDeclarationContext,
): FunctionDeclarationNode {
  return {
    type: StatementNodeType.FunctionDeclaration,
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
    type: StatementNodeType.ReturnStatement,
    value: expression ? buildExpression(expression) : undefined,
  };
}

function buildBlockStatement(ctx: BlockContext): BlockStatementNode {
  return {
    type: StatementNodeType.BlockStatement,
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
      type: ExpressionNodeType.NumberLiteral,
      value: Number(numberToken.text),
    };
  }

  const stringToken = ctx.STRING();
  if (stringToken) {
    return {
      type: ExpressionNodeType.StringLiteral,
      value: JSON.parse(stringToken.text) as string,
    };
  }

  const identifierToken = ctx.IDENTIFIER();
  if (identifierToken) {
    return {
      type: ExpressionNodeType.Identifier,
      name: identifierToken.text,
    };
  }

  const expressions = ctx.getRuleContexts(ExpressionContext);
  const operatorToken =
    (ctx as any)._op ?? ctx.ADD() ?? ctx.SUB() ?? ctx.MUL() ?? ctx.DIV();

  if (expressions.length === 2 && operatorToken) {
    return {
      type: ExpressionNodeType.BinaryExpression,
      operator: operatorToken.text as '+' | '-' | '*' | '/',
      left: buildExpression(expressions[0]),
      right: buildExpression(expressions[1]),
    };
  }

  if (expressions.length === 1 && ctx.SUB()) {
    return {
      type: ExpressionNodeType.UnaryExpression,
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
    type: ExpressionNodeType.FunctionCall,
    name: ctx.IDENTIFIER().text,
    arguments: ctx.argumentList()?.expression().map(buildExpression) ?? [],
  };
}
