// Generated from grammar/AstigLang.g4 by ANTLR 4.9.0-SNAPSHOT


import { ParseTreeVisitor } from "antlr4ts/tree/ParseTreeVisitor";

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
	 * Visit a parse tree produced by `AstigLangParser.declarationKeyword`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDeclarationKeyword?: (ctx: DeclarationKeywordContext) => Result;

	/**
	 * Visit a parse tree produced by `AstigLangParser.printStatement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPrintStatement?: (ctx: PrintStatementContext) => Result;

	/**
	 * Visit a parse tree produced by `AstigLangParser.ifStatement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitIfStatement?: (ctx: IfStatementContext) => Result;

	/**
	 * Visit a parse tree produced by `AstigLangParser.whileStatement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitWhileStatement?: (ctx: WhileStatementContext) => Result;

	/**
	 * Visit a parse tree produced by `AstigLangParser.functionDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFunctionDeclaration?: (ctx: FunctionDeclarationContext) => Result;

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

