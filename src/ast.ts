import {
  AssignmentContext,
  AssignmentOperatorContext,
  BlockContext,
  BreakStatementContext,
  ContinueStatementContext,
  DoWhileStatementContext,
  ElseIfPartContext,
  ExpressionContext,
  ForInitContext,
  ForStatementContext,
  ForUpdateContext,
  ForeachStatementContext,
  FunctionCallContext,
  FunctionDeclarationContext,
  IfStatementContext,
  ParameterContext,
  PrintStatementContext,
  ProgramContext,
  ReturnStatementContext,
  StatementContext,
  VariableDeclarationContext,
  WhileStatementContext,
} from '../generated/grammar/AstigLangParser';
import {
  ExpressionNode,
  ExpressionNodeType,
  FunctionCallNode,
} from './models/ExpressionNode';
import { ParameterNode } from './models/ParameterNode';
import { ProgramNode } from './models/ProgramNode';
import {
  AssignmentNode,
  BlockStatementNode,
  BreakStatementNode,
  ContinueStatementNode,
  DoWhileStatementNode,
  ForStatementNode,
  ForeachStatementNode,
  FunctionDeclarationNode,
  IfStatementNode,
  PrintStatementNode,
  ReturnStatementNode,
  StatementNode,
  StatementNodeType,
  VariableDeclarationNode,
  WhileStatementNode,
} from './models/StatementNode';

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

  const assignment = ctx.assignment();
  if (assignment) {
    return buildAssignment(assignment);
  }

  const printStatement = ctx.printStatement();
  if (printStatement) {
    return buildPrintStatement(printStatement);
  }

  const ifStatement = ctx.ifStatement();
  if (ifStatement) {
    return buildIfStatement(ifStatement);
  }

  const whileStatement = ctx.whileStatement();
  if (whileStatement) {
    return buildWhileStatement(whileStatement);
  }

  const doWhileStatement = ctx.doWhileStatement();
  if (doWhileStatement) {
    return buildDoWhileStatement(doWhileStatement);
  }

  const forStatement = ctx.forStatement();
  if (forStatement) {
    return buildForStatement(forStatement);
  }

  const foreachStatement = ctx.foreachStatement();
  if (foreachStatement) {
    return buildForeachStatement(foreachStatement);
  }

  const breakStatement = ctx.breakStatement();
  if (breakStatement) {
    return buildBreakStatement(breakStatement);
  }

  const continueStatement = ctx.continueStatement();
  if (continueStatement) {
    return buildContinueStatement(continueStatement);
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
    declarationKind: buildDeclarationKind(ctx),
    name: ctx.IDENTIFIER().text,
    declaredType: ctx.typeAnnotation()?.dataType().text,
    value: buildExpression(ctx.expression()),
  };
}

function buildDeclarationKind(
  ctx: VariableDeclarationContext,
): VariableDeclarationNode['declarationKind'] {
  const declarationKeyword = ctx.declarationKeyword();
  if (declarationKeyword.CONST_KW()) {
    return 'const';
  }
  if (declarationKeyword.LET_KW()) {
    return 'let';
  }
  return 'var';
}

function buildPrintStatement(ctx: PrintStatementContext): PrintStatementNode {
  return {
    type: StatementNodeType.PrintStatement,
    value: buildExpression(ctx.expression()),
  };
}

function buildIfStatement(ctx: IfStatementContext): IfStatementNode {
  const condition = buildExpression(ctx.expression());
  const thenBranch = ctx.block().statement().map(buildStatement);

  // Build else if chains
  const elseIfChains = (ctx.elseIfPart() || []).map(
    (elseIfCtx: ElseIfPartContext) => ({
      condition: buildExpression(elseIfCtx.expression()),
      body: elseIfCtx.block().statement().map(buildStatement),
    }),
  );

  // Build else branch if present
  const elsePartCtx = ctx.elsePart();
  const elseBranch = elsePartCtx
    ? elsePartCtx.block().statement().map(buildStatement)
    : undefined;

  return {
    type: StatementNodeType.IfStatement,
    condition,
    thenBranch,
    elseIfChains,
    elseBranch,
  };
}

function buildWhileStatement(ctx: WhileStatementContext): WhileStatementNode {
  return {
    type: StatementNodeType.WhileStatement,
    condition: buildExpression(ctx.expression()),
    body: ctx.block().statement().map(buildStatement),
  };
}

function buildDoWhileStatement(
  ctx: DoWhileStatementContext,
): DoWhileStatementNode {
  return {
    type: StatementNodeType.DoWhileStatement,
    body: ctx.block().statement().map(buildStatement),
    condition: buildExpression(ctx.expression()),
  };
}

function buildForStatement(ctx: ForStatementContext): ForStatementNode {
  const forInit = ctx.forInit();
  const forUpdate = ctx.forUpdate();

  const expression = ctx.expression();
  return {
    type: StatementNodeType.ForStatement,
    init: forInit ? buildForInit(forInit) : undefined,
    condition: expression ? buildExpression(expression) : undefined,
    update: forUpdate ? buildForUpdate(forUpdate) : undefined,
    body: ctx.block().statement().map(buildStatement),
  };
}

function buildForInit(
  ctx: ForInitContext,
): VariableDeclarationNode | AssignmentNode {
  const variableDeclaration = ctx.variableDeclaration();
  if (variableDeclaration) {
    return buildVariableDeclaration(variableDeclaration);
  }

  const assignment = ctx.assignment();
  if (assignment) {
    return buildAssignment(assignment);
  }

  throw new Error(`Unsupported for init: ${ctx.text}`);
}

function buildForUpdate(ctx: ForUpdateContext): AssignmentNode {
  const assignment = ctx.assignment();
  if (assignment) {
    return buildAssignment(assignment);
  }

  throw new Error(`Unsupported for update: ${ctx.text}`);
}

function buildAssignment(ctx: AssignmentContext): AssignmentNode {
  return {
    type: StatementNodeType.Assignment,
    name: ctx.IDENTIFIER().text,
    operator: buildAssignmentOperator(ctx.assignmentOperator()),
    value: buildExpression(ctx.expression()),
  };
}

function buildAssignmentOperator(
  ctx: AssignmentOperatorContext,
): AssignmentNode['operator'] {
  if (ctx.ADD_ASSIGN()) {
    return '+=';
  }
  if (ctx.SUB_ASSIGN()) {
    return '-=';
  }
  return '=';
}

function buildForeachStatement(
  ctx: ForeachStatementContext,
): ForeachStatementNode {
  return {
    type: StatementNodeType.ForeachStatement,
    variable: ctx.IDENTIFIER().text,
    iterable: buildExpression(ctx.expression()),
    body: ctx.block().statement().map(buildStatement),
  };
}

function buildBreakStatement(_ctx: BreakStatementContext): BreakStatementNode {
  return {
    type: StatementNodeType.BreakStatement,
  };
}

function buildContinueStatement(
  _ctx: ContinueStatementContext,
): ContinueStatementNode {
  return {
    type: StatementNodeType.ContinueStatement,
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
    (ctx as any)._op ??
    ctx.ADD() ??
    ctx.SUB() ??
    ctx.MUL() ??
    ctx.DIV() ??
    ctx.EQ() ??
    ctx.NEQ() ??
    ctx.LT() ??
    ctx.GT() ??
    ctx.LTE() ??
    ctx.GTE();

  if (expressions.length === 2 && operatorToken) {
    return {
      type: ExpressionNodeType.BinaryExpression,
      operator: operatorToken.text as
        | '+'
        | '-'
        | '*'
        | '/'
        | '=='
        | '!='
        | '<'
        | '>'
        | '<='
        | '>=',
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
