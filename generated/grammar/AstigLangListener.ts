// Generated from grammar/AstigLang.g4 by ANTLR 4.9.0-SNAPSHOT


import { ParseTreeListener } from "antlr4ts/tree/ParseTreeListener";

import { ProgramContext } from "./AstigLangParser";
import { StatementContext } from "./AstigLangParser";
import { VariableDeclarationContext } from "./AstigLangParser";
import { DeclarationKeywordContext } from "./AstigLangParser";
import { PrintStatementContext } from "./AstigLangParser";
import { IfStatementContext } from "./AstigLangParser";
import { WhileStatementContext } from "./AstigLangParser";
import { FunctionDeclarationContext } from "./AstigLangParser";
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

