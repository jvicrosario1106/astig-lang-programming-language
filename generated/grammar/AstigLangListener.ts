// Generated from grammar/AstigLang.g4 by ANTLR 4.9.0-SNAPSHOT


import { ParseTreeListener } from "antlr4ts/tree/ParseTreeListener";

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
 * This interface defines a complete listener for a parse tree produced by
 * `AstigLangParser`.
 */
export interface AstigLangListener extends ParseTreeListener {
	/**
	 * Enter a parse tree produced by `AstigLangParser.program`.
	 * @param ctx the parse tree
	 */
	enterProgram?: (ctx: ProgramContext) => void;
	/**
	 * Exit a parse tree produced by `AstigLangParser.program`.
	 * @param ctx the parse tree
	 */
	exitProgram?: (ctx: ProgramContext) => void;

	/**
	 * Enter a parse tree produced by `AstigLangParser.includeList`.
	 * @param ctx the parse tree
	 */
	enterIncludeList?: (ctx: IncludeListContext) => void;
	/**
	 * Exit a parse tree produced by `AstigLangParser.includeList`.
	 * @param ctx the parse tree
	 */
	exitIncludeList?: (ctx: IncludeListContext) => void;

	/**
	 * Enter a parse tree produced by `AstigLangParser.includeStatement`.
	 * @param ctx the parse tree
	 */
	enterIncludeStatement?: (ctx: IncludeStatementContext) => void;
	/**
	 * Exit a parse tree produced by `AstigLangParser.includeStatement`.
	 * @param ctx the parse tree
	 */
	exitIncludeStatement?: (ctx: IncludeStatementContext) => void;

	/**
	 * Enter a parse tree produced by `AstigLangParser.statement`.
	 * @param ctx the parse tree
	 */
	enterStatement?: (ctx: StatementContext) => void;
	/**
	 * Exit a parse tree produced by `AstigLangParser.statement`.
	 * @param ctx the parse tree
	 */
	exitStatement?: (ctx: StatementContext) => void;

	/**
	 * Enter a parse tree produced by `AstigLangParser.variableDeclaration`.
	 * @param ctx the parse tree
	 */
	enterVariableDeclaration?: (ctx: VariableDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `AstigLangParser.variableDeclaration`.
	 * @param ctx the parse tree
	 */
	exitVariableDeclaration?: (ctx: VariableDeclarationContext) => void;

	/**
	 * Enter a parse tree produced by `AstigLangParser.recordDeclaration`.
	 * @param ctx the parse tree
	 */
	enterRecordDeclaration?: (ctx: RecordDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `AstigLangParser.recordDeclaration`.
	 * @param ctx the parse tree
	 */
	exitRecordDeclaration?: (ctx: RecordDeclarationContext) => void;

	/**
	 * Enter a parse tree produced by `AstigLangParser.recordFieldList`.
	 * @param ctx the parse tree
	 */
	enterRecordFieldList?: (ctx: RecordFieldListContext) => void;
	/**
	 * Exit a parse tree produced by `AstigLangParser.recordFieldList`.
	 * @param ctx the parse tree
	 */
	exitRecordFieldList?: (ctx: RecordFieldListContext) => void;

	/**
	 * Enter a parse tree produced by `AstigLangParser.recordField`.
	 * @param ctx the parse tree
	 */
	enterRecordField?: (ctx: RecordFieldContext) => void;
	/**
	 * Exit a parse tree produced by `AstigLangParser.recordField`.
	 * @param ctx the parse tree
	 */
	exitRecordField?: (ctx: RecordFieldContext) => void;

	/**
	 * Enter a parse tree produced by `AstigLangParser.recordLiteral`.
	 * @param ctx the parse tree
	 */
	enterRecordLiteral?: (ctx: RecordLiteralContext) => void;
	/**
	 * Exit a parse tree produced by `AstigLangParser.recordLiteral`.
	 * @param ctx the parse tree
	 */
	exitRecordLiteral?: (ctx: RecordLiteralContext) => void;

	/**
	 * Enter a parse tree produced by `AstigLangParser.recordLiteralFieldList`.
	 * @param ctx the parse tree
	 */
	enterRecordLiteralFieldList?: (ctx: RecordLiteralFieldListContext) => void;
	/**
	 * Exit a parse tree produced by `AstigLangParser.recordLiteralFieldList`.
	 * @param ctx the parse tree
	 */
	exitRecordLiteralFieldList?: (ctx: RecordLiteralFieldListContext) => void;

	/**
	 * Enter a parse tree produced by `AstigLangParser.recordLiteralField`.
	 * @param ctx the parse tree
	 */
	enterRecordLiteralField?: (ctx: RecordLiteralFieldContext) => void;
	/**
	 * Exit a parse tree produced by `AstigLangParser.recordLiteralField`.
	 * @param ctx the parse tree
	 */
	exitRecordLiteralField?: (ctx: RecordLiteralFieldContext) => void;

	/**
	 * Enter a parse tree produced by `AstigLangParser.arrayLiteral`.
	 * @param ctx the parse tree
	 */
	enterArrayLiteral?: (ctx: ArrayLiteralContext) => void;
	/**
	 * Exit a parse tree produced by `AstigLangParser.arrayLiteral`.
	 * @param ctx the parse tree
	 */
	exitArrayLiteral?: (ctx: ArrayLiteralContext) => void;

	/**
	 * Enter a parse tree produced by `AstigLangParser.arrayElementList`.
	 * @param ctx the parse tree
	 */
	enterArrayElementList?: (ctx: ArrayElementListContext) => void;
	/**
	 * Exit a parse tree produced by `AstigLangParser.arrayElementList`.
	 * @param ctx the parse tree
	 */
	exitArrayElementList?: (ctx: ArrayElementListContext) => void;

	/**
	 * Enter a parse tree produced by `AstigLangParser.declarationKeyword`.
	 * @param ctx the parse tree
	 */
	enterDeclarationKeyword?: (ctx: DeclarationKeywordContext) => void;
	/**
	 * Exit a parse tree produced by `AstigLangParser.declarationKeyword`.
	 * @param ctx the parse tree
	 */
	exitDeclarationKeyword?: (ctx: DeclarationKeywordContext) => void;

	/**
	 * Enter a parse tree produced by `AstigLangParser.freeStatement`.
	 * @param ctx the parse tree
	 */
	enterFreeStatement?: (ctx: FreeStatementContext) => void;
	/**
	 * Exit a parse tree produced by `AstigLangParser.freeStatement`.
	 * @param ctx the parse tree
	 */
	exitFreeStatement?: (ctx: FreeStatementContext) => void;

	/**
	 * Enter a parse tree produced by `AstigLangParser.memsetStatement`.
	 * @param ctx the parse tree
	 */
	enterMemsetStatement?: (ctx: MemsetStatementContext) => void;
	/**
	 * Exit a parse tree produced by `AstigLangParser.memsetStatement`.
	 * @param ctx the parse tree
	 */
	exitMemsetStatement?: (ctx: MemsetStatementContext) => void;

	/**
	 * Enter a parse tree produced by `AstigLangParser.printStatement`.
	 * @param ctx the parse tree
	 */
	enterPrintStatement?: (ctx: PrintStatementContext) => void;
	/**
	 * Exit a parse tree produced by `AstigLangParser.printStatement`.
	 * @param ctx the parse tree
	 */
	exitPrintStatement?: (ctx: PrintStatementContext) => void;

	/**
	 * Enter a parse tree produced by `AstigLangParser.scanStatement`.
	 * @param ctx the parse tree
	 */
	enterScanStatement?: (ctx: ScanStatementContext) => void;
	/**
	 * Exit a parse tree produced by `AstigLangParser.scanStatement`.
	 * @param ctx the parse tree
	 */
	exitScanStatement?: (ctx: ScanStatementContext) => void;

	/**
	 * Enter a parse tree produced by `AstigLangParser.ifStatement`.
	 * @param ctx the parse tree
	 */
	enterIfStatement?: (ctx: IfStatementContext) => void;
	/**
	 * Exit a parse tree produced by `AstigLangParser.ifStatement`.
	 * @param ctx the parse tree
	 */
	exitIfStatement?: (ctx: IfStatementContext) => void;

	/**
	 * Enter a parse tree produced by `AstigLangParser.elseIfPart`.
	 * @param ctx the parse tree
	 */
	enterElseIfPart?: (ctx: ElseIfPartContext) => void;
	/**
	 * Exit a parse tree produced by `AstigLangParser.elseIfPart`.
	 * @param ctx the parse tree
	 */
	exitElseIfPart?: (ctx: ElseIfPartContext) => void;

	/**
	 * Enter a parse tree produced by `AstigLangParser.elsePart`.
	 * @param ctx the parse tree
	 */
	enterElsePart?: (ctx: ElsePartContext) => void;
	/**
	 * Exit a parse tree produced by `AstigLangParser.elsePart`.
	 * @param ctx the parse tree
	 */
	exitElsePart?: (ctx: ElsePartContext) => void;

	/**
	 * Enter a parse tree produced by `AstigLangParser.whileStatement`.
	 * @param ctx the parse tree
	 */
	enterWhileStatement?: (ctx: WhileStatementContext) => void;
	/**
	 * Exit a parse tree produced by `AstigLangParser.whileStatement`.
	 * @param ctx the parse tree
	 */
	exitWhileStatement?: (ctx: WhileStatementContext) => void;

	/**
	 * Enter a parse tree produced by `AstigLangParser.doWhileStatement`.
	 * @param ctx the parse tree
	 */
	enterDoWhileStatement?: (ctx: DoWhileStatementContext) => void;
	/**
	 * Exit a parse tree produced by `AstigLangParser.doWhileStatement`.
	 * @param ctx the parse tree
	 */
	exitDoWhileStatement?: (ctx: DoWhileStatementContext) => void;

	/**
	 * Enter a parse tree produced by `AstigLangParser.forStatement`.
	 * @param ctx the parse tree
	 */
	enterForStatement?: (ctx: ForStatementContext) => void;
	/**
	 * Exit a parse tree produced by `AstigLangParser.forStatement`.
	 * @param ctx the parse tree
	 */
	exitForStatement?: (ctx: ForStatementContext) => void;

	/**
	 * Enter a parse tree produced by `AstigLangParser.forInit`.
	 * @param ctx the parse tree
	 */
	enterForInit?: (ctx: ForInitContext) => void;
	/**
	 * Exit a parse tree produced by `AstigLangParser.forInit`.
	 * @param ctx the parse tree
	 */
	exitForInit?: (ctx: ForInitContext) => void;

	/**
	 * Enter a parse tree produced by `AstigLangParser.forUpdate`.
	 * @param ctx the parse tree
	 */
	enterForUpdate?: (ctx: ForUpdateContext) => void;
	/**
	 * Exit a parse tree produced by `AstigLangParser.forUpdate`.
	 * @param ctx the parse tree
	 */
	exitForUpdate?: (ctx: ForUpdateContext) => void;

	/**
	 * Enter a parse tree produced by `AstigLangParser.assignment`.
	 * @param ctx the parse tree
	 */
	enterAssignment?: (ctx: AssignmentContext) => void;
	/**
	 * Exit a parse tree produced by `AstigLangParser.assignment`.
	 * @param ctx the parse tree
	 */
	exitAssignment?: (ctx: AssignmentContext) => void;

	/**
	 * Enter a parse tree produced by `AstigLangParser.arrayIndexAccess`.
	 * @param ctx the parse tree
	 */
	enterArrayIndexAccess?: (ctx: ArrayIndexAccessContext) => void;
	/**
	 * Exit a parse tree produced by `AstigLangParser.arrayIndexAccess`.
	 * @param ctx the parse tree
	 */
	exitArrayIndexAccess?: (ctx: ArrayIndexAccessContext) => void;

	/**
	 * Enter a parse tree produced by `AstigLangParser.arrayIndexAssignment`.
	 * @param ctx the parse tree
	 */
	enterArrayIndexAssignment?: (ctx: ArrayIndexAssignmentContext) => void;
	/**
	 * Exit a parse tree produced by `AstigLangParser.arrayIndexAssignment`.
	 * @param ctx the parse tree
	 */
	exitArrayIndexAssignment?: (ctx: ArrayIndexAssignmentContext) => void;

	/**
	 * Enter a parse tree produced by `AstigLangParser.recordFieldAccess`.
	 * @param ctx the parse tree
	 */
	enterRecordFieldAccess?: (ctx: RecordFieldAccessContext) => void;
	/**
	 * Exit a parse tree produced by `AstigLangParser.recordFieldAccess`.
	 * @param ctx the parse tree
	 */
	exitRecordFieldAccess?: (ctx: RecordFieldAccessContext) => void;

	/**
	 * Enter a parse tree produced by `AstigLangParser.assignmentOperator`.
	 * @param ctx the parse tree
	 */
	enterAssignmentOperator?: (ctx: AssignmentOperatorContext) => void;
	/**
	 * Exit a parse tree produced by `AstigLangParser.assignmentOperator`.
	 * @param ctx the parse tree
	 */
	exitAssignmentOperator?: (ctx: AssignmentOperatorContext) => void;

	/**
	 * Enter a parse tree produced by `AstigLangParser.foreachStatement`.
	 * @param ctx the parse tree
	 */
	enterForeachStatement?: (ctx: ForeachStatementContext) => void;
	/**
	 * Exit a parse tree produced by `AstigLangParser.foreachStatement`.
	 * @param ctx the parse tree
	 */
	exitForeachStatement?: (ctx: ForeachStatementContext) => void;

	/**
	 * Enter a parse tree produced by `AstigLangParser.breakStatement`.
	 * @param ctx the parse tree
	 */
	enterBreakStatement?: (ctx: BreakStatementContext) => void;
	/**
	 * Exit a parse tree produced by `AstigLangParser.breakStatement`.
	 * @param ctx the parse tree
	 */
	exitBreakStatement?: (ctx: BreakStatementContext) => void;

	/**
	 * Enter a parse tree produced by `AstigLangParser.continueStatement`.
	 * @param ctx the parse tree
	 */
	enterContinueStatement?: (ctx: ContinueStatementContext) => void;
	/**
	 * Exit a parse tree produced by `AstigLangParser.continueStatement`.
	 * @param ctx the parse tree
	 */
	exitContinueStatement?: (ctx: ContinueStatementContext) => void;

	/**
	 * Enter a parse tree produced by `AstigLangParser.functionDeclaration`.
	 * @param ctx the parse tree
	 */
	enterFunctionDeclaration?: (ctx: FunctionDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `AstigLangParser.functionDeclaration`.
	 * @param ctx the parse tree
	 */
	exitFunctionDeclaration?: (ctx: FunctionDeclarationContext) => void;

	/**
	 * Enter a parse tree produced by `AstigLangParser.functionMainDeclaration`.
	 * @param ctx the parse tree
	 */
	enterFunctionMainDeclaration?: (ctx: FunctionMainDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `AstigLangParser.functionMainDeclaration`.
	 * @param ctx the parse tree
	 */
	exitFunctionMainDeclaration?: (ctx: FunctionMainDeclarationContext) => void;

	/**
	 * Enter a parse tree produced by `AstigLangParser.parameterList`.
	 * @param ctx the parse tree
	 */
	enterParameterList?: (ctx: ParameterListContext) => void;
	/**
	 * Exit a parse tree produced by `AstigLangParser.parameterList`.
	 * @param ctx the parse tree
	 */
	exitParameterList?: (ctx: ParameterListContext) => void;

	/**
	 * Enter a parse tree produced by `AstigLangParser.parameter`.
	 * @param ctx the parse tree
	 */
	enterParameter?: (ctx: ParameterContext) => void;
	/**
	 * Exit a parse tree produced by `AstigLangParser.parameter`.
	 * @param ctx the parse tree
	 */
	exitParameter?: (ctx: ParameterContext) => void;

	/**
	 * Enter a parse tree produced by `AstigLangParser.returnStatement`.
	 * @param ctx the parse tree
	 */
	enterReturnStatement?: (ctx: ReturnStatementContext) => void;
	/**
	 * Exit a parse tree produced by `AstigLangParser.returnStatement`.
	 * @param ctx the parse tree
	 */
	exitReturnStatement?: (ctx: ReturnStatementContext) => void;

	/**
	 * Enter a parse tree produced by `AstigLangParser.block`.
	 * @param ctx the parse tree
	 */
	enterBlock?: (ctx: BlockContext) => void;
	/**
	 * Exit a parse tree produced by `AstigLangParser.block`.
	 * @param ctx the parse tree
	 */
	exitBlock?: (ctx: BlockContext) => void;

	/**
	 * Enter a parse tree produced by `AstigLangParser.argumentList`.
	 * @param ctx the parse tree
	 */
	enterArgumentList?: (ctx: ArgumentListContext) => void;
	/**
	 * Exit a parse tree produced by `AstigLangParser.argumentList`.
	 * @param ctx the parse tree
	 */
	exitArgumentList?: (ctx: ArgumentListContext) => void;

	/**
	 * Enter a parse tree produced by `AstigLangParser.functionCall`.
	 * @param ctx the parse tree
	 */
	enterFunctionCall?: (ctx: FunctionCallContext) => void;
	/**
	 * Exit a parse tree produced by `AstigLangParser.functionCall`.
	 * @param ctx the parse tree
	 */
	exitFunctionCall?: (ctx: FunctionCallContext) => void;

	/**
	 * Enter a parse tree produced by `AstigLangParser.typeAnnotation`.
	 * @param ctx the parse tree
	 */
	enterTypeAnnotation?: (ctx: TypeAnnotationContext) => void;
	/**
	 * Exit a parse tree produced by `AstigLangParser.typeAnnotation`.
	 * @param ctx the parse tree
	 */
	exitTypeAnnotation?: (ctx: TypeAnnotationContext) => void;

	/**
	 * Enter a parse tree produced by `AstigLangParser.returnTypeAnnotation`.
	 * @param ctx the parse tree
	 */
	enterReturnTypeAnnotation?: (ctx: ReturnTypeAnnotationContext) => void;
	/**
	 * Exit a parse tree produced by `AstigLangParser.returnTypeAnnotation`.
	 * @param ctx the parse tree
	 */
	exitReturnTypeAnnotation?: (ctx: ReturnTypeAnnotationContext) => void;

	/**
	 * Enter a parse tree produced by `AstigLangParser.dataType`.
	 * @param ctx the parse tree
	 */
	enterDataType?: (ctx: DataTypeContext) => void;
	/**
	 * Exit a parse tree produced by `AstigLangParser.dataType`.
	 * @param ctx the parse tree
	 */
	exitDataType?: (ctx: DataTypeContext) => void;

	/**
	 * Enter a parse tree produced by `AstigLangParser.returnDataType`.
	 * @param ctx the parse tree
	 */
	enterReturnDataType?: (ctx: ReturnDataTypeContext) => void;
	/**
	 * Exit a parse tree produced by `AstigLangParser.returnDataType`.
	 * @param ctx the parse tree
	 */
	exitReturnDataType?: (ctx: ReturnDataTypeContext) => void;

	/**
	 * Enter a parse tree produced by `AstigLangParser.expression`.
	 * @param ctx the parse tree
	 */
	enterExpression?: (ctx: ExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `AstigLangParser.expression`.
	 * @param ctx the parse tree
	 */
	exitExpression?: (ctx: ExpressionContext) => void;
}

