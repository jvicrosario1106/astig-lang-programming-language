/**
 * Converts an ANTLR parse tree into AstigLang AST nodes.
 *
 * Entry point: `buildAst(programContext)` returns a `ProgramNode` with includes,
 * records, statements, functions, and optional `main` (required on entry file only).
 * map each grammar rule (statements, expressions, assignments, etc.) to typed nodes.
 */
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
  FunctionMainDeclarationContext,
  IfStatementContext,
  IncludeListContext,
  IncludeStatementContext,
  ParameterContext,
  PrintStatementContext,
  ProgramContext,
  RecordDeclarationContext,
  RecordFieldAccessContext,
  RecordFieldContext,
  RecordLiteralContext,
  RecordLiteralFieldContext,
  ReturnStatementContext,
  StatementContext,
  VariableDeclarationContext,
  WhileStatementContext,
} from '../generated/grammar/AstigLangParser';
import { IncludeNode } from './models/IncludeNode';
import { MainFunctionNode } from './models/MainFunctionNode';
import {
  ExpressionNode,
  ExpressionNodeType,
  FunctionCallNode,
} from './models/ExpressionNode';
import { ParameterNode } from './models/ParameterNode';
import { ProgramNode } from './models/ProgramNode';
import { RecordDeclarationNode } from './models/RecordNode';
import {
  AssignmentNode,
  AssignmentTarget,
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

/** Builds the root program AST from the parser's `program` rule. */
export function buildAst(ctx: ProgramContext): ProgramNode {
  const mainDeclaration = ctx.functionMainDeclaration();

  return {
    type: 'Program',
    includes: collectIncludes(ctx.includeList()),
    recordDeclarations: ctx.recordDeclaration().map(buildRecordDeclaration),
    functions: ctx.functionDeclaration().map(buildFunctionDeclaration),
    moduleFunctions: {},
    mainFunction: mainDeclaration ? buildMainFunction(mainDeclaration) : undefined,
  };
}

function collectIncludes(includeLists: IncludeListContext[]): IncludeNode[] {
  const includes: IncludeNode[] = [];

  for (const includeList of includeLists) {
    collectIncludesFromList(includeList, includes);
  }

  return includes;
}

function collectIncludesFromList(
  includeList: IncludeListContext,
  includes: IncludeNode[],
): void {
  includes.push(buildInclude(includeList.includeStatement()));

  for (const nestedIncludeList of includeList.includeList()) {
    collectIncludesFromList(nestedIncludeList, includes);
  }
}

/** Builds an include node from `include filename.stg`. */
function buildInclude(ctx: IncludeStatementContext): IncludeNode {
  return {
    type: 'Include',
    filename: ctx.FILENAME().text,
  };
}

/** Builds a record type declaration node from the `record` grammar rule. */
function buildRecordDeclaration(ctx: RecordDeclarationContext): RecordDeclarationNode {
  return {
    type: 'RecordDeclaration',
    name: ctx.IDENTIFIER().text,
    fields:
      ctx
        .recordFieldList()
        ?.recordField()
        .map(buildRecordField) ?? [],
  };
}

function buildRecordField(ctx: RecordFieldContext) {
  return {
    name: ctx.IDENTIFIER().text,
    declaredType: ctx.typeAnnotation().dataType().text,
  };
}

/** Builds the optional `function main() { ... }` entry point node. */
function buildMainFunction(ctx: FunctionMainDeclarationContext): MainFunctionNode {
  return {
    type: 'MainFunction',
    body: ctx.block().statement().map(buildStatement),
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

  const elseIfChains = (ctx.elseIfPart() || []).map(
    (elseIfCtx: ElseIfPartContext) => ({
      condition: buildExpression(elseIfCtx.expression()),
      body: elseIfCtx.block().statement().map(buildStatement),
    }),
  );

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

/** Resolves the left-hand side of an assignment to a variable or record field path. */
function buildAssignmentTarget(ctx: AssignmentContext): AssignmentTarget {
  const recordFieldAccess = ctx.recordFieldAccess();
  if (recordFieldAccess) {
    return buildRecordFieldTarget(recordFieldAccess);
  }

  const identifier = ctx.IDENTIFIER();
  if (!identifier) {
    throw new Error(`Unsupported assignment target: ${ctx.text}`);
  }

  return {
    kind: 'variable',
    name: identifier.text,
  };
}

/** Converts `root.field.subfield` syntax into a record field assignment target. */
function buildRecordFieldTarget(ctx: RecordFieldAccessContext): AssignmentTarget {
  const identifiers = ctx.IDENTIFIER().map((token) => token.text);

  return {
    kind: 'recordField',
    rootVariable: identifiers[0],
    fieldPath: identifiers.slice(1),
  };
}

function buildAssignment(ctx: AssignmentContext): AssignmentNode {
  return {
    type: StatementNodeType.Assignment,
    target: buildAssignmentTarget(ctx),
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
    // Set by parser when `eHXpH0RTz` is present; used by programLoader for cross-file visibility.
    isExported: Boolean(ctx.EXPORT_KW()),
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

/** Dispatches expression parse nodes to the correct AST shape (literals, calls, operators, etc.). */
function buildExpression(ctx: ExpressionContext): ExpressionNode {
  const functionCall = ctx.functionCall();
  if (functionCall) {
    return buildFunctionCall(functionCall);
  }

  const recordLiteral = ctx.recordLiteral();
  if (recordLiteral) {
    return buildRecordLiteral(recordLiteral);
  }

  const floatToken = ctx.FLOAT();
  if (floatToken) {
    return {
      type: ExpressionNodeType.FloatLiteral,
      value: Number(floatToken.text),
    };
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

  if (ctx.TRUE_KW()) {
    return {
      type: ExpressionNodeType.BooleanLiteral,
      value: true,
    };
  }

  if (ctx.FALSE_KW()) {
    return {
      type: ExpressionNodeType.BooleanLiteral,
      value: false,
    };
  }

  const expressions = ctx.getRuleContexts(ExpressionContext);
  const memberField = ctx.IDENTIFIER();

  if (expressions.length === 1 && memberField && isMemberAccessExpression(ctx)) {
    return {
      type: ExpressionNodeType.MemberAccess,
      object: buildExpression(expressions[0]),
      field: memberField.text,
    };
  }

  if (expressions.length === 1 && ctx.SUB() && !memberField) {
    return {
      type: ExpressionNodeType.UnaryExpression,
      operator: '-',
      argument: buildExpression(expressions[0]),
    };
  }

  const operatorToken =
    (ctx as ExpressionContext & { _op?: { text: string } })._op ??
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
      operator: operatorToken.text as BinaryExpressionOperator,
      left: buildExpression(expressions[0]),
      right: buildExpression(expressions[1]),
    };
  }

  if (memberField && expressions.length === 0) {
    return {
      type: ExpressionNodeType.Identifier,
      name: memberField.text,
    };
  }

  if (expressions.length === 1) {
    return buildExpression(expressions[0]);
  }

  throw new Error(`Unsupported expression: ${ctx.text}`);
}

type BinaryExpressionOperator =
  | '+'
  | '-'
  | '*'
  | '/'
  | '=='
  | '!='
  | '<'
  | '>'
  | '<='
  | '>=';

function isMemberAccessExpression(ctx: ExpressionContext): boolean {
  return (
    !ctx.ADD() &&
    !ctx.SUB() &&
    !ctx.MUL() &&
    !ctx.DIV() &&
    !ctx.EQ() &&
    !ctx.NEQ() &&
    !ctx.LT() &&
    !ctx.GT() &&
    !ctx.LTE() &&
    !ctx.GTE() &&
    ctx.text.includes('.')
  );
}

/** Builds a `new TypeName { field = expr, ... }` record literal expression. */
function buildRecordLiteral(ctx: RecordLiteralContext): ExpressionNode {
  return {
    type: ExpressionNodeType.RecordLiteral,
    recordTypeName: ctx.IDENTIFIER().text,
    fields:
      ctx
        .recordLiteralFieldList()
        ?.recordLiteralField()
        .map(buildRecordLiteralField) ?? [],
  };
}

function buildRecordLiteralField(ctx: RecordLiteralFieldContext) {
  const assignment = ctx.assignment();
  const target = buildAssignmentTarget(assignment);

  if (target.kind !== 'variable') {
    throw new Error(`Record literal fields must use simple names: ${assignment.text}`);
  }

  return {
    name: target.name,
    value: buildExpression(assignment.expression()),
  };
}

function buildFunctionCall(ctx: FunctionCallContext): FunctionCallNode {
  return {
    type: ExpressionNodeType.FunctionCall,
    name: ctx.IDENTIFIER().text,
    arguments: ctx.argumentList()?.expression().map(buildExpression) ?? [],
  };
}
