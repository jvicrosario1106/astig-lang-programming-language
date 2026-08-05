// Generated from grammar/AstigLang.g4 by ANTLR 4.9.0-SNAPSHOT


import { ParseTreeVisitor } from "antlr4ts/tree/ParseTreeVisitor";

import { ProgramContext } from "./AstigLangParser";
import { IncludeListContext } from "./AstigLangParser";
import { IncludeStatementContext } from "./AstigLangParser";
import { StatementContext } from "./AstigLangParser";
import { VariableDeclarationContext } from "./AstigLangParser";
import { RecordDeclarationContext } from "./AstigLangParser";
import { RecordFieldListContext } from "./AstigLangParser";
import { RecordFieldContext } from "./AstigLangParser";
import { RecordLiteralContext } from "./AstigLangParser";
import { RecordLiteralFieldListContext } from "./AstigLangParser";
import { RecordLiteralFieldContext } from "./AstigLangParser";
import { ArrayLiteralContext } from "./AstigLangParser";
import { ArrayElementListContext } from "./AstigLangParser";
import { DeclarationKeywordContext } from "./AstigLangParser";
import { FreeStatementContext } from "./AstigLangParser";
import { MemsetStatementContext } from "./AstigLangParser";
import { PrintStatementContext } from "./AstigLangParser";
import { ScanStatementContext } from "./AstigLangParser";
import { IfStatementContext } from "./AstigLangParser";
import { ElseIfPartContext } from "./AstigLangParser";
import { ElsePartContext } from "./AstigLangParser";
import { WhileStatementContext } from "./AstigLangParser";
import { DoWhileStatementContext } from "./AstigLangParser";
import { ForStatementContext } from "./AstigLangParser";
import { ForInitContext } from "./AstigLangParser";
import { ForUpdateContext } from "./AstigLangParser";
import { AssignmentContext } from "./AstigLangParser";
import { ArrayIndexAccessContext } from "./AstigLangParser";
import { ArrayIndexAssignmentContext } from "./AstigLangParser";
import { RecordFieldAccessContext } from "./AstigLangParser";
import { AssignmentOperatorContext } from "./AstigLangParser";
import { ForeachStatementContext } from "./AstigLangParser";
import { BreakStatementContext } from "./AstigLangParser";
import { ContinueStatementContext } from "./AstigLangParser";
import { FunctionDeclarationContext } from "./AstigLangParser";
import { FunctionMainDeclarationContext } from "./AstigLangParser";
import { ParameterListContext } from "./AstigLangParser";
import { ParameterContext } from "./AstigLangParser";
import { ReturnStatementContext } from "./AstigLangParser";
import { BlockContext } from "./AstigLangParser";
import { ArgumentListContext } from "./AstigLangParser";
import { FunctionCallContext } from "./AstigLangParser";
import { TypeAnnotationContext } from "./AstigLangParser";
import { ReturnTypeAnnotationContext } from "./AstigLangParser";
import { DataTypeContext } from "./AstigLangParser";
import { ReturnDataTypeContext } from "./AstigLangParser";
import { ExpressionContext } from "./AstigLangParser";


/**
 * This interface defines a complete generic visitor for a parse tree produced
 * by `AstigLangParser`.
 *
 * @param <Result> The return type of the visit operation. Use `void` for
 * operations with no return type.
 */
export interface AstigLangVisitor<Result> extends ParseTreeVisitor<Result> {
	/**
	 * Visit a parse tree produced by `AstigLangParser.program`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitProgram?: (ctx: ProgramContext) => Result;

	/**
	 * Visit a parse tree produced by `AstigLangParser.includeList`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitIncludeList?: (ctx: IncludeListContext) => Result;

	/**
	 * Visit a parse tree produced by `AstigLangParser.includeStatement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitIncludeStatement?: (ctx: IncludeStatementContext) => Result;

	/**
	 * Visit a parse tree produced by `AstigLangParser.statement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitStatement?: (ctx: StatementContext) => Result;

	/**
	 * Visit a parse tree produced by `AstigLangParser.variableDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitVariableDeclaration?: (ctx: VariableDeclarationContext) => Result;

	/**
	 * Visit a parse tree produced by `AstigLangParser.recordDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitRecordDeclaration?: (ctx: RecordDeclarationContext) => Result;

	/**
	 * Visit a parse tree produced by `AstigLangParser.recordFieldList`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitRecordFieldList?: (ctx: RecordFieldListContext) => Result;

	/**
	 * Visit a parse tree produced by `AstigLangParser.recordField`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitRecordField?: (ctx: RecordFieldContext) => Result;

	/**
	 * Visit a parse tree produced by `AstigLangParser.recordLiteral`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitRecordLiteral?: (ctx: RecordLiteralContext) => Result;

	/**
	 * Visit a parse tree produced by `AstigLangParser.recordLiteralFieldList`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitRecordLiteralFieldList?: (ctx: RecordLiteralFieldListContext) => Result;

	/**
	 * Visit a parse tree produced by `AstigLangParser.recordLiteralField`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitRecordLiteralField?: (ctx: RecordLiteralFieldContext) => Result;

	/**
	 * Visit a parse tree produced by `AstigLangParser.arrayLiteral`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitArrayLiteral?: (ctx: ArrayLiteralContext) => Result;

	/**
	 * Visit a parse tree produced by `AstigLangParser.arrayElementList`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitArrayElementList?: (ctx: ArrayElementListContext) => Result;

	/**
	 * Visit a parse tree produced by `AstigLangParser.declarationKeyword`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDeclarationKeyword?: (ctx: DeclarationKeywordContext) => Result;

	/**
	 * Visit a parse tree produced by `AstigLangParser.freeStatement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFreeStatement?: (ctx: FreeStatementContext) => Result;

	/**
	 * Visit a parse tree produced by `AstigLangParser.memsetStatement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitMemsetStatement?: (ctx: MemsetStatementContext) => Result;

	/**
	 * Visit a parse tree produced by `AstigLangParser.printStatement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPrintStatement?: (ctx: PrintStatementContext) => Result;

	/**
	 * Visit a parse tree produced by `AstigLangParser.scanStatement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitScanStatement?: (ctx: ScanStatementContext) => Result;

	/**
	 * Visit a parse tree produced by `AstigLangParser.ifStatement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitIfStatement?: (ctx: IfStatementContext) => Result;

	/**
	 * Visit a parse tree produced by `AstigLangParser.elseIfPart`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitElseIfPart?: (ctx: ElseIfPartContext) => Result;

	/**
	 * Visit a parse tree produced by `AstigLangParser.elsePart`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitElsePart?: (ctx: ElsePartContext) => Result;

	/**
	 * Visit a parse tree produced by `AstigLangParser.whileStatement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitWhileStatement?: (ctx: WhileStatementContext) => Result;

	/**
	 * Visit a parse tree produced by `AstigLangParser.doWhileStatement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDoWhileStatement?: (ctx: DoWhileStatementContext) => Result;

	/**
	 * Visit a parse tree produced by `AstigLangParser.forStatement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitForStatement?: (ctx: ForStatementContext) => Result;

	/**
	 * Visit a parse tree produced by `AstigLangParser.forInit`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitForInit?: (ctx: ForInitContext) => Result;

	/**
	 * Visit a parse tree produced by `AstigLangParser.forUpdate`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitForUpdate?: (ctx: ForUpdateContext) => Result;

	/**
	 * Visit a parse tree produced by `AstigLangParser.assignment`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAssignment?: (ctx: AssignmentContext) => Result;

	/**
	 * Visit a parse tree produced by `AstigLangParser.arrayIndexAccess`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitArrayIndexAccess?: (ctx: ArrayIndexAccessContext) => Result;

	/**
	 * Visit a parse tree produced by `AstigLangParser.arrayIndexAssignment`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitArrayIndexAssignment?: (ctx: ArrayIndexAssignmentContext) => Result;

	/**
	 * Visit a parse tree produced by `AstigLangParser.recordFieldAccess`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitRecordFieldAccess?: (ctx: RecordFieldAccessContext) => Result;

	/**
	 * Visit a parse tree produced by `AstigLangParser.assignmentOperator`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAssignmentOperator?: (ctx: AssignmentOperatorContext) => Result;

	/**
	 * Visit a parse tree produced by `AstigLangParser.foreachStatement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitForeachStatement?: (ctx: ForeachStatementContext) => Result;

	/**
	 * Visit a parse tree produced by `AstigLangParser.breakStatement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitBreakStatement?: (ctx: BreakStatementContext) => Result;

	/**
	 * Visit a parse tree produced by `AstigLangParser.continueStatement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitContinueStatement?: (ctx: ContinueStatementContext) => Result;

	/**
	 * Visit a parse tree produced by `AstigLangParser.functionDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFunctionDeclaration?: (ctx: FunctionDeclarationContext) => Result;

	/**
	 * Visit a parse tree produced by `AstigLangParser.functionMainDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFunctionMainDeclaration?: (ctx: FunctionMainDeclarationContext) => Result;

	/**
	 * Visit a parse tree produced by `AstigLangParser.parameterList`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitParameterList?: (ctx: ParameterListContext) => Result;

	/**
	 * Visit a parse tree produced by `AstigLangParser.parameter`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitParameter?: (ctx: ParameterContext) => Result;

	/**
	 * Visit a parse tree produced by `AstigLangParser.returnStatement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitReturnStatement?: (ctx: ReturnStatementContext) => Result;

	/**
	 * Visit a parse tree produced by `AstigLangParser.block`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitBlock?: (ctx: BlockContext) => Result;

	/**
	 * Visit a parse tree produced by `AstigLangParser.argumentList`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitArgumentList?: (ctx: ArgumentListContext) => Result;

	/**
	 * Visit a parse tree produced by `AstigLangParser.functionCall`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFunctionCall?: (ctx: FunctionCallContext) => Result;

	/**
	 * Visit a parse tree produced by `AstigLangParser.typeAnnotation`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTypeAnnotation?: (ctx: TypeAnnotationContext) => Result;

	/**
	 * Visit a parse tree produced by `AstigLangParser.returnTypeAnnotation`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitReturnTypeAnnotation?: (ctx: ReturnTypeAnnotationContext) => Result;

	/**
	 * Visit a parse tree produced by `AstigLangParser.dataType`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDataType?: (ctx: DataTypeContext) => Result;

	/**
	 * Visit a parse tree produced by `AstigLangParser.returnDataType`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitReturnDataType?: (ctx: ReturnDataTypeContext) => Result;

	/**
	 * Visit a parse tree produced by `AstigLangParser.expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitExpression?: (ctx: ExpressionContext) => Result;
}

