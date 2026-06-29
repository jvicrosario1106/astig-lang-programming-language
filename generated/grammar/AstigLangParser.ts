// Generated from grammar/AstigLang.g4 by ANTLR 4.9.0-SNAPSHOT


import { ATN } from "antlr4ts/atn/ATN";
import { ATNDeserializer } from "antlr4ts/atn/ATNDeserializer";
import { FailedPredicateException } from "antlr4ts/FailedPredicateException";
import { NotNull } from "antlr4ts/Decorators";
import { NoViableAltException } from "antlr4ts/NoViableAltException";
import { Override } from "antlr4ts/Decorators";
import { Parser } from "antlr4ts/Parser";
import { ParserRuleContext } from "antlr4ts/ParserRuleContext";
import { ParserATNSimulator } from "antlr4ts/atn/ParserATNSimulator";
import { ParseTreeListener } from "antlr4ts/tree/ParseTreeListener";
import { ParseTreeVisitor } from "antlr4ts/tree/ParseTreeVisitor";
import { RecognitionException } from "antlr4ts/RecognitionException";
import { RuleContext } from "antlr4ts/RuleContext";
//import { RuleVersion } from "antlr4ts/RuleVersion";
import { TerminalNode } from "antlr4ts/tree/TerminalNode";
import { Token } from "antlr4ts/Token";
import { TokenStream } from "antlr4ts/TokenStream";
import { Vocabulary } from "antlr4ts/Vocabulary";
import { VocabularyImpl } from "antlr4ts/VocabularyImpl";

import * as Utils from "antlr4ts/misc/Utils";

import { AstigLangListener } from "./AstigLangListener";
import { AstigLangVisitor } from "./AstigLangVisitor";


export class AstigLangParser extends Parser {
	public static readonly T__0 = 1;
	public static readonly T__1 = 2;
	public static readonly T__2 = 3;
	public static readonly T__3 = 4;
	public static readonly T__4 = 5;
	public static readonly T__5 = 6;
	public static readonly T__6 = 7;
	public static readonly T__7 = 8;
	public static readonly INCLUDE_KW = 9;
	public static readonly CONST_KW = 10;
	public static readonly VAR_KW = 11;
	public static readonly LET_KW = 12;
	public static readonly PRINT_KW = 13;
	public static readonly IF_KW = 14;
	public static readonly ELSE_KW = 15;
	public static readonly WHILE_KW = 16;
	public static readonly FUNCTION_KW = 17;
	public static readonly RETURN_KW = 18;
	public static readonly DO_KW = 19;
	public static readonly FOR_KW = 20;
	public static readonly FOREACH_KW = 21;
	public static readonly IN_KW = 22;
	public static readonly BREAK_KW = 23;
	public static readonly CONTINUE_KW = 24;
	public static readonly INT_KW = 25;
	public static readonly FLOAT_KW = 26;
	public static readonly STRING_KW = 27;
	public static readonly CHAR_KW = 28;
	public static readonly BOOLEAN_KW = 29;
	public static readonly TRUE_KW = 30;
	public static readonly FALSE_KW = 31;
	public static readonly VOID_KW = 32;
	public static readonly MAIN_KW = 33;
	public static readonly RECORD_KW = 34;
	public static readonly NEW_KW = 35;
	public static readonly EXPORT_KW = 36;
	public static readonly IDENTIFIER = 37;
	public static readonly FILENAME = 38;
	public static readonly FILE_EXTENSION = 39;
	public static readonly SUBSCRIPT = 40;
	public static readonly ADD_ASSIGN = 41;
	public static readonly SUB_ASSIGN = 42;
	public static readonly ADD = 43;
	public static readonly SUB = 44;
	public static readonly MUL = 45;
	public static readonly DIV = 46;
	public static readonly EQ = 47;
	public static readonly NEQ = 48;
	public static readonly LT = 49;
	public static readonly GT = 50;
	public static readonly LTE = 51;
	public static readonly GTE = 52;
	public static readonly SEMICOLON = 53;
	public static readonly FLOAT = 54;
	public static readonly NUMBER = 55;
	public static readonly STRING = 56;
	public static readonly WS = 57;
	public static readonly RULE_program = 0;
	public static readonly RULE_includeList = 1;
	public static readonly RULE_includeStatement = 2;
	public static readonly RULE_statement = 3;
	public static readonly RULE_variableDeclaration = 4;
	public static readonly RULE_recordDeclaration = 5;
	public static readonly RULE_recordFieldList = 6;
	public static readonly RULE_recordField = 7;
	public static readonly RULE_recordLiteral = 8;
	public static readonly RULE_recordLiteralFieldList = 9;
	public static readonly RULE_recordLiteralField = 10;
	public static readonly RULE_declarationKeyword = 11;
	public static readonly RULE_printStatement = 12;
	public static readonly RULE_ifStatement = 13;
	public static readonly RULE_elseIfPart = 14;
	public static readonly RULE_elsePart = 15;
	public static readonly RULE_whileStatement = 16;
	public static readonly RULE_doWhileStatement = 17;
	public static readonly RULE_forStatement = 18;
	public static readonly RULE_forInit = 19;
	public static readonly RULE_forUpdate = 20;
	public static readonly RULE_assignment = 21;
	public static readonly RULE_recordFieldAccess = 22;
	public static readonly RULE_assignmentOperator = 23;
	public static readonly RULE_foreachStatement = 24;
	public static readonly RULE_breakStatement = 25;
	public static readonly RULE_continueStatement = 26;
	public static readonly RULE_functionDeclaration = 27;
	public static readonly RULE_functionMainDeclaration = 28;
	public static readonly RULE_parameterList = 29;
	public static readonly RULE_parameter = 30;
	public static readonly RULE_returnStatement = 31;
	public static readonly RULE_block = 32;
	public static readonly RULE_argumentList = 33;
	public static readonly RULE_functionCall = 34;
	public static readonly RULE_typeAnnotation = 35;
	public static readonly RULE_returnTypeAnnotation = 36;
	public static readonly RULE_dataType = 37;
	public static readonly RULE_returnDataType = 38;
	public static readonly RULE_expression = 39;
	// tslint:disable:no-trailing-whitespace
	public static readonly ruleNames: string[] = [
		"program", "includeList", "includeStatement", "statement", "variableDeclaration", 
		"recordDeclaration", "recordFieldList", "recordField", "recordLiteral", 
		"recordLiteralFieldList", "recordLiteralField", "declarationKeyword", 
		"printStatement", "ifStatement", "elseIfPart", "elsePart", "whileStatement", 
		"doWhileStatement", "forStatement", "forInit", "forUpdate", "assignment", 
		"recordFieldAccess", "assignmentOperator", "foreachStatement", "breakStatement", 
		"continueStatement", "functionDeclaration", "functionMainDeclaration", 
		"parameterList", "parameter", "returnStatement", "block", "argumentList", 
		"functionCall", "typeAnnotation", "returnTypeAnnotation", "dataType", 
		"returnDataType", "expression",
	];

	private static readonly _LITERAL_NAMES: Array<string | undefined> = [
		undefined, "'='", "'{'", "'}'", "','", "'('", "')'", "'.'", "':'", undefined, 
		undefined, undefined, undefined, undefined, undefined, undefined, undefined, 
		undefined, undefined, undefined, undefined, undefined, undefined, undefined, 
		undefined, undefined, undefined, undefined, undefined, undefined, undefined, 
		undefined, undefined, undefined, undefined, undefined, undefined, undefined, 
		undefined, "'stg'", undefined, "'+='", "'-='", "'+'", "'-'", "'*'", "'/'", 
		"'=='", "'!='", "'<'", "'>'", "'<='", "'>='", "';'",
	];
	private static readonly _SYMBOLIC_NAMES: Array<string | undefined> = [
		undefined, undefined, undefined, undefined, undefined, undefined, undefined, 
		undefined, undefined, "INCLUDE_KW", "CONST_KW", "VAR_KW", "LET_KW", "PRINT_KW", 
		"IF_KW", "ELSE_KW", "WHILE_KW", "FUNCTION_KW", "RETURN_KW", "DO_KW", "FOR_KW", 
		"FOREACH_KW", "IN_KW", "BREAK_KW", "CONTINUE_KW", "INT_KW", "FLOAT_KW", 
		"STRING_KW", "CHAR_KW", "BOOLEAN_KW", "TRUE_KW", "FALSE_KW", "VOID_KW", 
		"MAIN_KW", "RECORD_KW", "NEW_KW", "EXPORT_KW", "IDENTIFIER", "FILENAME", 
		"FILE_EXTENSION", "SUBSCRIPT", "ADD_ASSIGN", "SUB_ASSIGN", "ADD", "SUB", 
		"MUL", "DIV", "EQ", "NEQ", "LT", "GT", "LTE", "GTE", "SEMICOLON", "FLOAT", 
		"NUMBER", "STRING", "WS",
	];
	public static readonly VOCABULARY: Vocabulary = new VocabularyImpl(AstigLangParser._LITERAL_NAMES, AstigLangParser._SYMBOLIC_NAMES, []);

	// @Override
	// @NotNull
	public get vocabulary(): Vocabulary {
		return AstigLangParser.VOCABULARY;
	}
	// tslint:enable:no-trailing-whitespace

	// @Override
	public get grammarFileName(): string { return "AstigLang.g4"; }

	// @Override
	public get ruleNames(): string[] { return AstigLangParser.ruleNames; }

	// @Override
	public get serializedATN(): string { return AstigLangParser._serializedATN; }

	protected createFailedPredicateException(predicate?: string, message?: string): FailedPredicateException {
		return new FailedPredicateException(this, predicate, message);
	}

	constructor(input: TokenStream) {
		super(input);
		this._interp = new ParserATNSimulator(AstigLangParser._ATN, this);
	}
	// @RuleVersion(0)
	public program(): ProgramContext {
		let _localctx: ProgramContext = new ProgramContext(this._ctx, this.state);
		this.enterRule(_localctx, 0, AstigLangParser.RULE_program);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 83;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === AstigLangParser.INCLUDE_KW) {
				{
				{
				this.state = 80;
				this.includeList();
				}
				}
				this.state = 85;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 89;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === AstigLangParser.RECORD_KW) {
				{
				{
				this.state = 86;
				this.recordDeclaration();
				}
				}
				this.state = 91;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 95;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 2, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 92;
					this.functionDeclaration();
					}
					}
				}
				this.state = 97;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 2, this._ctx);
			}
			this.state = 99;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === AstigLangParser.FUNCTION_KW) {
				{
				this.state = 98;
				this.functionMainDeclaration();
				}
			}

			this.state = 101;
			this.match(AstigLangParser.EOF);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public includeList(): IncludeListContext {
		let _localctx: IncludeListContext = new IncludeListContext(this._ctx, this.state);
		this.enterRule(_localctx, 2, AstigLangParser.RULE_includeList);
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 103;
			this.includeStatement();
			this.state = 107;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 4, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 104;
					this.includeList();
					}
					}
				}
				this.state = 109;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 4, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public includeStatement(): IncludeStatementContext {
		let _localctx: IncludeStatementContext = new IncludeStatementContext(this._ctx, this.state);
		this.enterRule(_localctx, 4, AstigLangParser.RULE_includeStatement);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 110;
			this.match(AstigLangParser.INCLUDE_KW);
			this.state = 111;
			this.match(AstigLangParser.FILENAME);
			this.state = 113;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === AstigLangParser.SEMICOLON) {
				{
				this.state = 112;
				this.match(AstigLangParser.SEMICOLON);
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public statement(): StatementContext {
		let _localctx: StatementContext = new StatementContext(this._ctx, this.state);
		this.enterRule(_localctx, 6, AstigLangParser.RULE_statement);
		let _la: number;
		try {
			this.state = 146;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case AstigLangParser.CONST_KW:
			case AstigLangParser.VAR_KW:
			case AstigLangParser.LET_KW:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 115;
				this.variableDeclaration();
				this.state = 117;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === AstigLangParser.SEMICOLON) {
					{
					this.state = 116;
					this.match(AstigLangParser.SEMICOLON);
					}
				}

				}
				break;
			case AstigLangParser.IDENTIFIER:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 119;
				this.assignment();
				this.state = 121;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === AstigLangParser.SEMICOLON) {
					{
					this.state = 120;
					this.match(AstigLangParser.SEMICOLON);
					}
				}

				}
				break;
			case AstigLangParser.PRINT_KW:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 123;
				this.printStatement();
				this.state = 125;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === AstigLangParser.SEMICOLON) {
					{
					this.state = 124;
					this.match(AstigLangParser.SEMICOLON);
					}
				}

				}
				break;
			case AstigLangParser.IF_KW:
				this.enterOuterAlt(_localctx, 4);
				{
				this.state = 127;
				this.ifStatement();
				}
				break;
			case AstigLangParser.WHILE_KW:
				this.enterOuterAlt(_localctx, 5);
				{
				this.state = 128;
				this.whileStatement();
				}
				break;
			case AstigLangParser.DO_KW:
				this.enterOuterAlt(_localctx, 6);
				{
				this.state = 129;
				this.doWhileStatement();
				}
				break;
			case AstigLangParser.FOR_KW:
				this.enterOuterAlt(_localctx, 7);
				{
				this.state = 130;
				this.forStatement();
				}
				break;
			case AstigLangParser.FOREACH_KW:
				this.enterOuterAlt(_localctx, 8);
				{
				this.state = 131;
				this.foreachStatement();
				}
				break;
			case AstigLangParser.FUNCTION_KW:
			case AstigLangParser.EXPORT_KW:
				this.enterOuterAlt(_localctx, 9);
				{
				this.state = 132;
				this.functionDeclaration();
				}
				break;
			case AstigLangParser.RETURN_KW:
				this.enterOuterAlt(_localctx, 10);
				{
				this.state = 133;
				this.returnStatement();
				this.state = 135;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === AstigLangParser.SEMICOLON) {
					{
					this.state = 134;
					this.match(AstigLangParser.SEMICOLON);
					}
				}

				}
				break;
			case AstigLangParser.BREAK_KW:
				this.enterOuterAlt(_localctx, 11);
				{
				this.state = 137;
				this.breakStatement();
				this.state = 139;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === AstigLangParser.SEMICOLON) {
					{
					this.state = 138;
					this.match(AstigLangParser.SEMICOLON);
					}
				}

				}
				break;
			case AstigLangParser.CONTINUE_KW:
				this.enterOuterAlt(_localctx, 12);
				{
				this.state = 141;
				this.continueStatement();
				this.state = 143;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === AstigLangParser.SEMICOLON) {
					{
					this.state = 142;
					this.match(AstigLangParser.SEMICOLON);
					}
				}

				}
				break;
			case AstigLangParser.T__1:
				this.enterOuterAlt(_localctx, 13);
				{
				this.state = 145;
				this.block();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public variableDeclaration(): VariableDeclarationContext {
		let _localctx: VariableDeclarationContext = new VariableDeclarationContext(this._ctx, this.state);
		this.enterRule(_localctx, 8, AstigLangParser.RULE_variableDeclaration);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 148;
			this.declarationKeyword();
			this.state = 149;
			this.match(AstigLangParser.IDENTIFIER);
			this.state = 150;
			this.typeAnnotation();
			this.state = 151;
			this.match(AstigLangParser.T__0);
			this.state = 152;
			this.expression(0);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public recordDeclaration(): RecordDeclarationContext {
		let _localctx: RecordDeclarationContext = new RecordDeclarationContext(this._ctx, this.state);
		this.enterRule(_localctx, 10, AstigLangParser.RULE_recordDeclaration);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 154;
			this.match(AstigLangParser.RECORD_KW);
			this.state = 155;
			this.match(AstigLangParser.IDENTIFIER);
			this.state = 156;
			this.match(AstigLangParser.T__1);
			this.state = 158;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === AstigLangParser.IDENTIFIER) {
				{
				this.state = 157;
				this.recordFieldList();
				}
			}

			this.state = 160;
			this.match(AstigLangParser.T__2);
			this.state = 162;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === AstigLangParser.SEMICOLON) {
				{
				this.state = 161;
				this.match(AstigLangParser.SEMICOLON);
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public recordFieldList(): RecordFieldListContext {
		let _localctx: RecordFieldListContext = new RecordFieldListContext(this._ctx, this.state);
		this.enterRule(_localctx, 12, AstigLangParser.RULE_recordFieldList);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 164;
			this.recordField();
			this.state = 169;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === AstigLangParser.T__3) {
				{
				{
				this.state = 165;
				this.match(AstigLangParser.T__3);
				this.state = 166;
				this.recordField();
				}
				}
				this.state = 171;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public recordField(): RecordFieldContext {
		let _localctx: RecordFieldContext = new RecordFieldContext(this._ctx, this.state);
		this.enterRule(_localctx, 14, AstigLangParser.RULE_recordField);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 172;
			this.match(AstigLangParser.IDENTIFIER);
			this.state = 173;
			this.typeAnnotation();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public recordLiteral(): RecordLiteralContext {
		let _localctx: RecordLiteralContext = new RecordLiteralContext(this._ctx, this.state);
		this.enterRule(_localctx, 16, AstigLangParser.RULE_recordLiteral);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 175;
			this.match(AstigLangParser.NEW_KW);
			this.state = 176;
			this.match(AstigLangParser.IDENTIFIER);
			this.state = 177;
			this.match(AstigLangParser.T__1);
			this.state = 179;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === AstigLangParser.IDENTIFIER) {
				{
				this.state = 178;
				this.recordLiteralFieldList();
				}
			}

			this.state = 181;
			this.match(AstigLangParser.T__2);
			this.state = 183;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 17, this._ctx) ) {
			case 1:
				{
				this.state = 182;
				this.match(AstigLangParser.SEMICOLON);
				}
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public recordLiteralFieldList(): RecordLiteralFieldListContext {
		let _localctx: RecordLiteralFieldListContext = new RecordLiteralFieldListContext(this._ctx, this.state);
		this.enterRule(_localctx, 18, AstigLangParser.RULE_recordLiteralFieldList);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 185;
			this.recordLiteralField();
			this.state = 190;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === AstigLangParser.T__3) {
				{
				{
				this.state = 186;
				this.match(AstigLangParser.T__3);
				this.state = 187;
				this.recordLiteralField();
				}
				}
				this.state = 192;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public recordLiteralField(): RecordLiteralFieldContext {
		let _localctx: RecordLiteralFieldContext = new RecordLiteralFieldContext(this._ctx, this.state);
		this.enterRule(_localctx, 20, AstigLangParser.RULE_recordLiteralField);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 193;
			this.assignment();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public declarationKeyword(): DeclarationKeywordContext {
		let _localctx: DeclarationKeywordContext = new DeclarationKeywordContext(this._ctx, this.state);
		this.enterRule(_localctx, 22, AstigLangParser.RULE_declarationKeyword);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 195;
			_la = this._input.LA(1);
			if (!((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << AstigLangParser.CONST_KW) | (1 << AstigLangParser.VAR_KW) | (1 << AstigLangParser.LET_KW))) !== 0))) {
			this._errHandler.recoverInline(this);
			} else {
				if (this._input.LA(1) === Token.EOF) {
					this.matchedEOF = true;
				}

				this._errHandler.reportMatch(this);
				this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public printStatement(): PrintStatementContext {
		let _localctx: PrintStatementContext = new PrintStatementContext(this._ctx, this.state);
		this.enterRule(_localctx, 24, AstigLangParser.RULE_printStatement);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 197;
			this.match(AstigLangParser.PRINT_KW);
			this.state = 198;
			this.match(AstigLangParser.T__4);
			this.state = 199;
			this.expression(0);
			this.state = 200;
			this.match(AstigLangParser.T__5);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public ifStatement(): IfStatementContext {
		let _localctx: IfStatementContext = new IfStatementContext(this._ctx, this.state);
		this.enterRule(_localctx, 26, AstigLangParser.RULE_ifStatement);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 202;
			this.match(AstigLangParser.IF_KW);
			this.state = 203;
			this.match(AstigLangParser.T__4);
			this.state = 204;
			this.expression(0);
			this.state = 205;
			this.match(AstigLangParser.T__5);
			this.state = 206;
			this.block();
			this.state = 210;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 19, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 207;
					this.elseIfPart();
					}
					}
				}
				this.state = 212;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 19, this._ctx);
			}
			this.state = 214;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === AstigLangParser.ELSE_KW) {
				{
				this.state = 213;
				this.elsePart();
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public elseIfPart(): ElseIfPartContext {
		let _localctx: ElseIfPartContext = new ElseIfPartContext(this._ctx, this.state);
		this.enterRule(_localctx, 28, AstigLangParser.RULE_elseIfPart);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 216;
			this.match(AstigLangParser.ELSE_KW);
			this.state = 217;
			this.match(AstigLangParser.IF_KW);
			this.state = 218;
			this.match(AstigLangParser.T__4);
			this.state = 219;
			this.expression(0);
			this.state = 220;
			this.match(AstigLangParser.T__5);
			this.state = 221;
			this.block();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public elsePart(): ElsePartContext {
		let _localctx: ElsePartContext = new ElsePartContext(this._ctx, this.state);
		this.enterRule(_localctx, 30, AstigLangParser.RULE_elsePart);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 223;
			this.match(AstigLangParser.ELSE_KW);
			this.state = 224;
			this.block();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public whileStatement(): WhileStatementContext {
		let _localctx: WhileStatementContext = new WhileStatementContext(this._ctx, this.state);
		this.enterRule(_localctx, 32, AstigLangParser.RULE_whileStatement);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 226;
			this.match(AstigLangParser.WHILE_KW);
			this.state = 227;
			this.match(AstigLangParser.T__4);
			this.state = 228;
			this.expression(0);
			this.state = 229;
			this.match(AstigLangParser.T__5);
			this.state = 230;
			this.block();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public doWhileStatement(): DoWhileStatementContext {
		let _localctx: DoWhileStatementContext = new DoWhileStatementContext(this._ctx, this.state);
		this.enterRule(_localctx, 34, AstigLangParser.RULE_doWhileStatement);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 232;
			this.match(AstigLangParser.DO_KW);
			this.state = 233;
			this.block();
			this.state = 234;
			this.match(AstigLangParser.WHILE_KW);
			this.state = 235;
			this.match(AstigLangParser.T__4);
			this.state = 236;
			this.expression(0);
			this.state = 237;
			this.match(AstigLangParser.T__5);
			this.state = 239;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === AstigLangParser.SEMICOLON) {
				{
				this.state = 238;
				this.match(AstigLangParser.SEMICOLON);
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public forStatement(): ForStatementContext {
		let _localctx: ForStatementContext = new ForStatementContext(this._ctx, this.state);
		this.enterRule(_localctx, 36, AstigLangParser.RULE_forStatement);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 241;
			this.match(AstigLangParser.FOR_KW);
			this.state = 242;
			this.match(AstigLangParser.T__4);
			this.state = 244;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 10)) & ~0x1F) === 0 && ((1 << (_la - 10)) & ((1 << (AstigLangParser.CONST_KW - 10)) | (1 << (AstigLangParser.VAR_KW - 10)) | (1 << (AstigLangParser.LET_KW - 10)) | (1 << (AstigLangParser.IDENTIFIER - 10)))) !== 0)) {
				{
				this.state = 243;
				this.forInit();
				}
			}

			this.state = 246;
			this.match(AstigLangParser.SEMICOLON);
			this.state = 248;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << AstigLangParser.T__4) | (1 << AstigLangParser.TRUE_KW) | (1 << AstigLangParser.FALSE_KW))) !== 0) || ((((_la - 35)) & ~0x1F) === 0 && ((1 << (_la - 35)) & ((1 << (AstigLangParser.NEW_KW - 35)) | (1 << (AstigLangParser.IDENTIFIER - 35)) | (1 << (AstigLangParser.SUB - 35)) | (1 << (AstigLangParser.FLOAT - 35)) | (1 << (AstigLangParser.NUMBER - 35)) | (1 << (AstigLangParser.STRING - 35)))) !== 0)) {
				{
				this.state = 247;
				this.expression(0);
				}
			}

			this.state = 250;
			this.match(AstigLangParser.SEMICOLON);
			this.state = 252;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === AstigLangParser.IDENTIFIER) {
				{
				this.state = 251;
				this.forUpdate();
				}
			}

			this.state = 254;
			this.match(AstigLangParser.T__5);
			this.state = 255;
			this.block();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public forInit(): ForInitContext {
		let _localctx: ForInitContext = new ForInitContext(this._ctx, this.state);
		this.enterRule(_localctx, 38, AstigLangParser.RULE_forInit);
		try {
			this.state = 259;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case AstigLangParser.CONST_KW:
			case AstigLangParser.VAR_KW:
			case AstigLangParser.LET_KW:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 257;
				this.variableDeclaration();
				}
				break;
			case AstigLangParser.IDENTIFIER:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 258;
				this.assignment();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public forUpdate(): ForUpdateContext {
		let _localctx: ForUpdateContext = new ForUpdateContext(this._ctx, this.state);
		this.enterRule(_localctx, 40, AstigLangParser.RULE_forUpdate);
		try {
			this.state = 263;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 26, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 261;
				this.assignment();
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 262;
				this.functionCall();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public assignment(): AssignmentContext {
		let _localctx: AssignmentContext = new AssignmentContext(this._ctx, this.state);
		this.enterRule(_localctx, 42, AstigLangParser.RULE_assignment);
		try {
			this.state = 273;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 27, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 265;
				this.match(AstigLangParser.IDENTIFIER);
				this.state = 266;
				this.assignmentOperator();
				this.state = 267;
				this.expression(0);
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 269;
				this.recordFieldAccess();
				this.state = 270;
				this.assignmentOperator();
				this.state = 271;
				this.expression(0);
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public recordFieldAccess(): RecordFieldAccessContext {
		let _localctx: RecordFieldAccessContext = new RecordFieldAccessContext(this._ctx, this.state);
		this.enterRule(_localctx, 44, AstigLangParser.RULE_recordFieldAccess);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 275;
			this.match(AstigLangParser.IDENTIFIER);
			this.state = 278;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			do {
				{
				{
				this.state = 276;
				this.match(AstigLangParser.T__6);
				this.state = 277;
				this.match(AstigLangParser.IDENTIFIER);
				}
				}
				this.state = 280;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			} while (_la === AstigLangParser.T__6);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public assignmentOperator(): AssignmentOperatorContext {
		let _localctx: AssignmentOperatorContext = new AssignmentOperatorContext(this._ctx, this.state);
		this.enterRule(_localctx, 46, AstigLangParser.RULE_assignmentOperator);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 282;
			_la = this._input.LA(1);
			if (!(_la === AstigLangParser.T__0 || _la === AstigLangParser.ADD_ASSIGN || _la === AstigLangParser.SUB_ASSIGN)) {
			this._errHandler.recoverInline(this);
			} else {
				if (this._input.LA(1) === Token.EOF) {
					this.matchedEOF = true;
				}

				this._errHandler.reportMatch(this);
				this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public foreachStatement(): ForeachStatementContext {
		let _localctx: ForeachStatementContext = new ForeachStatementContext(this._ctx, this.state);
		this.enterRule(_localctx, 48, AstigLangParser.RULE_foreachStatement);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 284;
			this.match(AstigLangParser.FOREACH_KW);
			this.state = 285;
			this.match(AstigLangParser.T__4);
			this.state = 286;
			this.match(AstigLangParser.IDENTIFIER);
			this.state = 287;
			this.match(AstigLangParser.IN_KW);
			this.state = 288;
			this.expression(0);
			this.state = 289;
			this.match(AstigLangParser.T__5);
			this.state = 290;
			this.block();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public breakStatement(): BreakStatementContext {
		let _localctx: BreakStatementContext = new BreakStatementContext(this._ctx, this.state);
		this.enterRule(_localctx, 50, AstigLangParser.RULE_breakStatement);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 292;
			this.match(AstigLangParser.BREAK_KW);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public continueStatement(): ContinueStatementContext {
		let _localctx: ContinueStatementContext = new ContinueStatementContext(this._ctx, this.state);
		this.enterRule(_localctx, 52, AstigLangParser.RULE_continueStatement);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 294;
			this.match(AstigLangParser.CONTINUE_KW);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public functionDeclaration(): FunctionDeclarationContext {
		let _localctx: FunctionDeclarationContext = new FunctionDeclarationContext(this._ctx, this.state);
		this.enterRule(_localctx, 54, AstigLangParser.RULE_functionDeclaration);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 297;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === AstigLangParser.EXPORT_KW) {
				{
				this.state = 296;
				this.match(AstigLangParser.EXPORT_KW);
				}
			}

			this.state = 299;
			this.match(AstigLangParser.FUNCTION_KW);
			this.state = 300;
			this.match(AstigLangParser.IDENTIFIER);
			this.state = 301;
			this.match(AstigLangParser.T__4);
			this.state = 303;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === AstigLangParser.IDENTIFIER) {
				{
				this.state = 302;
				this.parameterList();
				}
			}

			this.state = 305;
			this.match(AstigLangParser.T__5);
			this.state = 307;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === AstigLangParser.T__7) {
				{
				this.state = 306;
				this.returnTypeAnnotation();
				}
			}

			this.state = 309;
			this.block();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public functionMainDeclaration(): FunctionMainDeclarationContext {
		let _localctx: FunctionMainDeclarationContext = new FunctionMainDeclarationContext(this._ctx, this.state);
		this.enterRule(_localctx, 56, AstigLangParser.RULE_functionMainDeclaration);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 311;
			this.match(AstigLangParser.FUNCTION_KW);
			this.state = 312;
			this.match(AstigLangParser.MAIN_KW);
			this.state = 313;
			this.match(AstigLangParser.T__4);
			this.state = 314;
			this.match(AstigLangParser.T__5);
			this.state = 315;
			this.block();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public parameterList(): ParameterListContext {
		let _localctx: ParameterListContext = new ParameterListContext(this._ctx, this.state);
		this.enterRule(_localctx, 58, AstigLangParser.RULE_parameterList);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 317;
			this.parameter();
			this.state = 322;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === AstigLangParser.T__3) {
				{
				{
				this.state = 318;
				this.match(AstigLangParser.T__3);
				this.state = 319;
				this.parameter();
				}
				}
				this.state = 324;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public parameter(): ParameterContext {
		let _localctx: ParameterContext = new ParameterContext(this._ctx, this.state);
		this.enterRule(_localctx, 60, AstigLangParser.RULE_parameter);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 325;
			this.match(AstigLangParser.IDENTIFIER);
			this.state = 327;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === AstigLangParser.T__7) {
				{
				this.state = 326;
				this.typeAnnotation();
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public returnStatement(): ReturnStatementContext {
		let _localctx: ReturnStatementContext = new ReturnStatementContext(this._ctx, this.state);
		this.enterRule(_localctx, 62, AstigLangParser.RULE_returnStatement);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 329;
			this.match(AstigLangParser.RETURN_KW);
			this.state = 331;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 34, this._ctx) ) {
			case 1:
				{
				this.state = 330;
				this.expression(0);
				}
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public block(): BlockContext {
		let _localctx: BlockContext = new BlockContext(this._ctx, this.state);
		this.enterRule(_localctx, 64, AstigLangParser.RULE_block);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 333;
			this.match(AstigLangParser.T__1);
			this.state = 337;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << AstigLangParser.T__1) | (1 << AstigLangParser.CONST_KW) | (1 << AstigLangParser.VAR_KW) | (1 << AstigLangParser.LET_KW) | (1 << AstigLangParser.PRINT_KW) | (1 << AstigLangParser.IF_KW) | (1 << AstigLangParser.WHILE_KW) | (1 << AstigLangParser.FUNCTION_KW) | (1 << AstigLangParser.RETURN_KW) | (1 << AstigLangParser.DO_KW) | (1 << AstigLangParser.FOR_KW) | (1 << AstigLangParser.FOREACH_KW) | (1 << AstigLangParser.BREAK_KW) | (1 << AstigLangParser.CONTINUE_KW))) !== 0) || _la === AstigLangParser.EXPORT_KW || _la === AstigLangParser.IDENTIFIER) {
				{
				{
				this.state = 334;
				this.statement();
				}
				}
				this.state = 339;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 340;
			this.match(AstigLangParser.T__2);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public argumentList(): ArgumentListContext {
		let _localctx: ArgumentListContext = new ArgumentListContext(this._ctx, this.state);
		this.enterRule(_localctx, 66, AstigLangParser.RULE_argumentList);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 342;
			this.expression(0);
			this.state = 347;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === AstigLangParser.T__3) {
				{
				{
				this.state = 343;
				this.match(AstigLangParser.T__3);
				this.state = 344;
				this.expression(0);
				}
				}
				this.state = 349;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public functionCall(): FunctionCallContext {
		let _localctx: FunctionCallContext = new FunctionCallContext(this._ctx, this.state);
		this.enterRule(_localctx, 68, AstigLangParser.RULE_functionCall);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 350;
			this.match(AstigLangParser.IDENTIFIER);
			this.state = 351;
			this.match(AstigLangParser.T__4);
			this.state = 353;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << AstigLangParser.T__4) | (1 << AstigLangParser.TRUE_KW) | (1 << AstigLangParser.FALSE_KW))) !== 0) || ((((_la - 35)) & ~0x1F) === 0 && ((1 << (_la - 35)) & ((1 << (AstigLangParser.NEW_KW - 35)) | (1 << (AstigLangParser.IDENTIFIER - 35)) | (1 << (AstigLangParser.SUB - 35)) | (1 << (AstigLangParser.FLOAT - 35)) | (1 << (AstigLangParser.NUMBER - 35)) | (1 << (AstigLangParser.STRING - 35)))) !== 0)) {
				{
				this.state = 352;
				this.argumentList();
				}
			}

			this.state = 355;
			this.match(AstigLangParser.T__5);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public typeAnnotation(): TypeAnnotationContext {
		let _localctx: TypeAnnotationContext = new TypeAnnotationContext(this._ctx, this.state);
		this.enterRule(_localctx, 70, AstigLangParser.RULE_typeAnnotation);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 357;
			this.match(AstigLangParser.T__7);
			this.state = 358;
			this.dataType();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public returnTypeAnnotation(): ReturnTypeAnnotationContext {
		let _localctx: ReturnTypeAnnotationContext = new ReturnTypeAnnotationContext(this._ctx, this.state);
		this.enterRule(_localctx, 72, AstigLangParser.RULE_returnTypeAnnotation);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 360;
			this.match(AstigLangParser.T__7);
			this.state = 361;
			this.returnDataType();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public dataType(): DataTypeContext {
		let _localctx: DataTypeContext = new DataTypeContext(this._ctx, this.state);
		this.enterRule(_localctx, 74, AstigLangParser.RULE_dataType);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 363;
			_la = this._input.LA(1);
			if (!(((((_la - 25)) & ~0x1F) === 0 && ((1 << (_la - 25)) & ((1 << (AstigLangParser.INT_KW - 25)) | (1 << (AstigLangParser.FLOAT_KW - 25)) | (1 << (AstigLangParser.STRING_KW - 25)) | (1 << (AstigLangParser.CHAR_KW - 25)) | (1 << (AstigLangParser.BOOLEAN_KW - 25)) | (1 << (AstigLangParser.IDENTIFIER - 25)))) !== 0))) {
			this._errHandler.recoverInline(this);
			} else {
				if (this._input.LA(1) === Token.EOF) {
					this.matchedEOF = true;
				}

				this._errHandler.reportMatch(this);
				this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public returnDataType(): ReturnDataTypeContext {
		let _localctx: ReturnDataTypeContext = new ReturnDataTypeContext(this._ctx, this.state);
		this.enterRule(_localctx, 76, AstigLangParser.RULE_returnDataType);
		try {
			this.state = 367;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case AstigLangParser.INT_KW:
			case AstigLangParser.FLOAT_KW:
			case AstigLangParser.STRING_KW:
			case AstigLangParser.CHAR_KW:
			case AstigLangParser.BOOLEAN_KW:
			case AstigLangParser.IDENTIFIER:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 365;
				this.dataType();
				}
				break;
			case AstigLangParser.VOID_KW:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 366;
				this.match(AstigLangParser.VOID_KW);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}

	public expression(): ExpressionContext;
	public expression(_p: number): ExpressionContext;
	// @RuleVersion(0)
	public expression(_p?: number): ExpressionContext {
		if (_p === undefined) {
			_p = 0;
		}

		let _parentctx: ParserRuleContext = this._ctx;
		let _parentState: number = this.state;
		let _localctx: ExpressionContext = new ExpressionContext(this._ctx, _parentState);
		let _prevctx: ExpressionContext = _localctx;
		let _startState: number = 78;
		this.enterRecursionRule(_localctx, 78, AstigLangParser.RULE_expression, _p);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 384;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 39, this._ctx) ) {
			case 1:
				{
				this.state = 370;
				this.match(AstigLangParser.SUB);
				this.state = 371;
				this.expression(11);
				}
				break;

			case 2:
				{
				this.state = 372;
				this.match(AstigLangParser.T__4);
				this.state = 373;
				this.expression(0);
				this.state = 374;
				this.match(AstigLangParser.T__5);
				}
				break;

			case 3:
				{
				this.state = 376;
				this.functionCall();
				}
				break;

			case 4:
				{
				this.state = 377;
				this.recordLiteral();
				}
				break;

			case 5:
				{
				this.state = 378;
				this.match(AstigLangParser.NUMBER);
				}
				break;

			case 6:
				{
				this.state = 379;
				this.match(AstigLangParser.FLOAT);
				}
				break;

			case 7:
				{
				this.state = 380;
				this.match(AstigLangParser.STRING);
				}
				break;

			case 8:
				{
				this.state = 381;
				this.match(AstigLangParser.TRUE_KW);
				}
				break;

			case 9:
				{
				this.state = 382;
				this.match(AstigLangParser.FALSE_KW);
				}
				break;

			case 10:
				{
				this.state = 383;
				this.match(AstigLangParser.IDENTIFIER);
				}
				break;
			}
			this._ctx._stop = this._input.tryLT(-1);
			this.state = 400;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 41, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					if (this._parseListeners != null) {
						this.triggerExitRuleEvent();
					}
					_prevctx = _localctx;
					{
					this.state = 398;
					this._errHandler.sync(this);
					switch ( this.interpreter.adaptivePredict(this._input, 40, this._ctx) ) {
					case 1:
						{
						_localctx = new ExpressionContext(_parentctx, _parentState);
						this.pushNewRecursionContext(_localctx, _startState, AstigLangParser.RULE_expression);
						this.state = 386;
						if (!(this.precpred(this._ctx, 14))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 14)");
						}
						this.state = 387;
						_localctx._op = this._input.LT(1);
						_la = this._input.LA(1);
						if (!(_la === AstigLangParser.MUL || _la === AstigLangParser.DIV)) {
							_localctx._op = this._errHandler.recoverInline(this);
						} else {
							if (this._input.LA(1) === Token.EOF) {
								this.matchedEOF = true;
							}

							this._errHandler.reportMatch(this);
							this.consume();
						}
						this.state = 388;
						this.expression(15);
						}
						break;

					case 2:
						{
						_localctx = new ExpressionContext(_parentctx, _parentState);
						this.pushNewRecursionContext(_localctx, _startState, AstigLangParser.RULE_expression);
						this.state = 389;
						if (!(this.precpred(this._ctx, 13))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 13)");
						}
						this.state = 390;
						_localctx._op = this._input.LT(1);
						_la = this._input.LA(1);
						if (!(_la === AstigLangParser.ADD || _la === AstigLangParser.SUB)) {
							_localctx._op = this._errHandler.recoverInline(this);
						} else {
							if (this._input.LA(1) === Token.EOF) {
								this.matchedEOF = true;
							}

							this._errHandler.reportMatch(this);
							this.consume();
						}
						this.state = 391;
						this.expression(14);
						}
						break;

					case 3:
						{
						_localctx = new ExpressionContext(_parentctx, _parentState);
						this.pushNewRecursionContext(_localctx, _startState, AstigLangParser.RULE_expression);
						this.state = 392;
						if (!(this.precpred(this._ctx, 12))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 12)");
						}
						this.state = 393;
						_localctx._op = this._input.LT(1);
						_la = this._input.LA(1);
						if (!(((((_la - 47)) & ~0x1F) === 0 && ((1 << (_la - 47)) & ((1 << (AstigLangParser.EQ - 47)) | (1 << (AstigLangParser.NEQ - 47)) | (1 << (AstigLangParser.LT - 47)) | (1 << (AstigLangParser.GT - 47)) | (1 << (AstigLangParser.LTE - 47)) | (1 << (AstigLangParser.GTE - 47)))) !== 0))) {
							_localctx._op = this._errHandler.recoverInline(this);
						} else {
							if (this._input.LA(1) === Token.EOF) {
								this.matchedEOF = true;
							}

							this._errHandler.reportMatch(this);
							this.consume();
						}
						this.state = 394;
						this.expression(13);
						}
						break;

					case 4:
						{
						_localctx = new ExpressionContext(_parentctx, _parentState);
						this.pushNewRecursionContext(_localctx, _startState, AstigLangParser.RULE_expression);
						this.state = 395;
						if (!(this.precpred(this._ctx, 7))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 7)");
						}
						this.state = 396;
						this.match(AstigLangParser.T__6);
						this.state = 397;
						this.match(AstigLangParser.IDENTIFIER);
						}
						break;
					}
					}
				}
				this.state = 402;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 41, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.unrollRecursionContexts(_parentctx);
		}
		return _localctx;
	}

	public sempred(_localctx: RuleContext, ruleIndex: number, predIndex: number): boolean {
		switch (ruleIndex) {
		case 39:
			return this.expression_sempred(_localctx as ExpressionContext, predIndex);
		}
		return true;
	}
	private expression_sempred(_localctx: ExpressionContext, predIndex: number): boolean {
		switch (predIndex) {
		case 0:
			return this.precpred(this._ctx, 14);

		case 1:
			return this.precpred(this._ctx, 13);

		case 2:
			return this.precpred(this._ctx, 12);

		case 3:
			return this.precpred(this._ctx, 7);
		}
		return true;
	}

	public static readonly _serializedATN: string =
		"\x03\uC91D\uCABA\u058D\uAFBA\u4F53\u0607\uEA8B\uC241\x03;\u0196\x04\x02" +
		"\t\x02\x04\x03\t\x03\x04\x04\t\x04\x04\x05\t\x05\x04\x06\t\x06\x04\x07" +
		"\t\x07\x04\b\t\b\x04\t\t\t\x04\n\t\n\x04\v\t\v\x04\f\t\f\x04\r\t\r\x04" +
		"\x0E\t\x0E\x04\x0F\t\x0F\x04\x10\t\x10\x04\x11\t\x11\x04\x12\t\x12\x04" +
		"\x13\t\x13\x04\x14\t\x14\x04\x15\t\x15\x04\x16\t\x16\x04\x17\t\x17\x04" +
		"\x18\t\x18\x04\x19\t\x19\x04\x1A\t\x1A\x04\x1B\t\x1B\x04\x1C\t\x1C\x04" +
		"\x1D\t\x1D\x04\x1E\t\x1E\x04\x1F\t\x1F\x04 \t \x04!\t!\x04\"\t\"\x04#" +
		"\t#\x04$\t$\x04%\t%\x04&\t&\x04\'\t\'\x04(\t(\x04)\t)\x03\x02\x07\x02" +
		"T\n\x02\f\x02\x0E\x02W\v\x02\x03\x02\x07\x02Z\n\x02\f\x02\x0E\x02]\v\x02" +
		"\x03\x02\x07\x02`\n\x02\f\x02\x0E\x02c\v\x02\x03\x02\x05\x02f\n\x02\x03" +
		"\x02\x03\x02\x03\x03\x03\x03\x07\x03l\n\x03\f\x03\x0E\x03o\v\x03\x03\x04" +
		"\x03\x04\x03\x04\x05\x04t\n\x04\x03\x05\x03\x05\x05\x05x\n\x05\x03\x05" +
		"\x03\x05\x05\x05|\n\x05\x03\x05\x03\x05\x05\x05\x80\n\x05\x03\x05\x03" +
		"\x05\x03\x05\x03\x05\x03\x05\x03\x05\x03\x05\x03\x05\x05\x05\x8A\n\x05" +
		"\x03\x05\x03\x05\x05\x05\x8E\n\x05\x03\x05\x03\x05\x05\x05\x92\n\x05\x03" +
		"\x05\x05\x05\x95\n\x05\x03\x06\x03\x06\x03\x06\x03\x06\x03\x06\x03\x06" +
		"\x03\x07\x03\x07\x03\x07\x03\x07\x05\x07\xA1\n\x07\x03\x07\x03\x07\x05" +
		"\x07\xA5\n\x07\x03\b\x03\b\x03\b\x07\b\xAA\n\b\f\b\x0E\b\xAD\v\b\x03\t" +
		"\x03\t\x03\t\x03\n\x03\n\x03\n\x03\n\x05\n\xB6\n\n\x03\n\x03\n\x05\n\xBA" +
		"\n\n\x03\v\x03\v\x03\v\x07\v\xBF\n\v\f\v\x0E\v\xC2\v\v\x03\f\x03\f\x03" +
		"\r\x03\r\x03\x0E\x03\x0E\x03\x0E\x03\x0E\x03\x0E\x03\x0F\x03\x0F\x03\x0F" +
		"\x03\x0F\x03\x0F\x03\x0F\x07\x0F\xD3\n\x0F\f\x0F\x0E\x0F\xD6\v\x0F\x03" +
		"\x0F\x05\x0F\xD9\n\x0F\x03\x10\x03\x10\x03\x10\x03\x10\x03\x10\x03\x10" +
		"\x03\x10\x03\x11\x03\x11\x03\x11\x03\x12\x03\x12\x03\x12\x03\x12\x03\x12" +
		"\x03\x12\x03\x13\x03\x13\x03\x13\x03\x13\x03\x13\x03\x13\x03\x13\x05\x13" +
		"\xF2\n\x13\x03\x14\x03\x14\x03\x14\x05\x14\xF7\n\x14\x03\x14\x03\x14\x05" +
		"\x14\xFB\n\x14\x03\x14\x03\x14\x05\x14\xFF\n\x14\x03\x14\x03\x14\x03\x14" +
		"\x03\x15\x03\x15\x05\x15\u0106\n\x15\x03\x16\x03\x16\x05\x16\u010A\n\x16" +
		"\x03\x17\x03\x17\x03\x17\x03\x17\x03\x17\x03\x17\x03\x17\x03\x17\x05\x17" +
		"\u0114\n\x17\x03\x18\x03\x18\x03\x18\x06\x18\u0119\n\x18\r\x18\x0E\x18" +
		"\u011A\x03\x19\x03\x19\x03\x1A\x03\x1A\x03\x1A\x03\x1A\x03\x1A\x03\x1A" +
		"\x03\x1A\x03\x1A\x03\x1B\x03\x1B\x03\x1C\x03\x1C\x03\x1D\x05\x1D\u012C" +
		"\n\x1D\x03\x1D\x03\x1D\x03\x1D\x03\x1D\x05\x1D\u0132\n\x1D\x03\x1D\x03" +
		"\x1D\x05\x1D\u0136\n\x1D\x03\x1D\x03\x1D\x03\x1E\x03\x1E\x03\x1E\x03\x1E" +
		"\x03\x1E\x03\x1E\x03\x1F\x03\x1F\x03\x1F\x07\x1F\u0143\n\x1F\f\x1F\x0E" +
		"\x1F\u0146\v\x1F\x03 \x03 \x05 \u014A\n \x03!\x03!\x05!\u014E\n!\x03\"" +
		"\x03\"\x07\"\u0152\n\"\f\"\x0E\"\u0155\v\"\x03\"\x03\"\x03#\x03#\x03#" +
		"\x07#\u015C\n#\f#\x0E#\u015F\v#\x03$\x03$\x03$\x05$\u0164\n$\x03$\x03" +
		"$\x03%\x03%\x03%\x03&\x03&\x03&\x03\'\x03\'\x03(\x03(\x05(\u0172\n(\x03" +
		")\x03)\x03)\x03)\x03)\x03)\x03)\x03)\x03)\x03)\x03)\x03)\x03)\x03)\x03" +
		")\x05)\u0183\n)\x03)\x03)\x03)\x03)\x03)\x03)\x03)\x03)\x03)\x03)\x03" +
		")\x03)\x07)\u0191\n)\f)\x0E)\u0194\v)\x03)\x02\x02\x03P*\x02\x02\x04\x02" +
		"\x06\x02\b\x02\n\x02\f\x02\x0E\x02\x10\x02\x12\x02\x14\x02\x16\x02\x18" +
		"\x02\x1A\x02\x1C\x02\x1E\x02 \x02\"\x02$\x02&\x02(\x02*\x02,\x02.\x02" +
		"0\x022\x024\x026\x028\x02:\x02<\x02>\x02@\x02B\x02D\x02F\x02H\x02J\x02" +
		"L\x02N\x02P\x02\x02\b\x03\x02\f\x0E\x04\x02\x03\x03+,\x04\x02\x1B\x1F" +
		"\'\'\x03\x02/0\x03\x02-.\x03\x0216\x02\u01AC\x02U\x03\x02\x02\x02\x04" +
		"i\x03\x02\x02\x02\x06p\x03\x02\x02\x02\b\x94\x03\x02\x02\x02\n\x96\x03" +
		"\x02\x02\x02\f\x9C\x03\x02\x02\x02\x0E\xA6\x03\x02\x02\x02\x10\xAE\x03" +
		"\x02\x02\x02\x12\xB1\x03\x02\x02\x02\x14\xBB\x03\x02\x02\x02\x16\xC3\x03" +
		"\x02\x02\x02\x18\xC5\x03\x02\x02\x02\x1A\xC7\x03\x02\x02\x02\x1C\xCC\x03" +
		"\x02\x02\x02\x1E\xDA\x03\x02\x02\x02 \xE1\x03\x02\x02\x02\"\xE4\x03\x02" +
		"\x02\x02$\xEA\x03\x02\x02\x02&\xF3\x03\x02\x02\x02(\u0105\x03\x02\x02" +
		"\x02*\u0109\x03\x02\x02\x02,\u0113\x03\x02\x02\x02.\u0115\x03\x02\x02" +
		"\x020\u011C\x03\x02\x02\x022\u011E\x03\x02\x02\x024\u0126\x03\x02\x02" +
		"\x026\u0128\x03\x02\x02\x028\u012B\x03\x02\x02\x02:\u0139\x03\x02\x02" +
		"\x02<\u013F\x03\x02\x02\x02>\u0147\x03\x02\x02\x02@\u014B\x03\x02\x02" +
		"\x02B\u014F\x03\x02\x02\x02D\u0158\x03\x02\x02\x02F\u0160\x03\x02\x02" +
		"\x02H\u0167\x03\x02\x02\x02J\u016A\x03\x02\x02\x02L\u016D\x03\x02\x02" +
		"\x02N\u0171\x03\x02\x02\x02P\u0182\x03\x02\x02\x02RT\x05\x04\x03\x02S" +
		"R\x03\x02\x02\x02TW\x03\x02\x02\x02US\x03\x02\x02\x02UV\x03\x02\x02\x02" +
		"V[\x03\x02\x02\x02WU\x03\x02\x02\x02XZ\x05\f\x07\x02YX\x03\x02\x02\x02" +
		"Z]\x03\x02\x02\x02[Y\x03\x02\x02\x02[\\\x03\x02\x02\x02\\a\x03\x02\x02" +
		"\x02][\x03\x02\x02\x02^`\x058\x1D\x02_^\x03\x02\x02\x02`c\x03\x02\x02" +
		"\x02a_\x03\x02\x02\x02ab\x03\x02\x02\x02be\x03\x02\x02\x02ca\x03\x02\x02" +
		"\x02df\x05:\x1E\x02ed\x03\x02\x02\x02ef\x03\x02\x02\x02fg\x03\x02\x02" +
		"\x02gh\x07\x02\x02\x03h\x03\x03\x02\x02\x02im\x05\x06\x04\x02jl\x05\x04" +
		"\x03\x02kj\x03\x02\x02\x02lo\x03\x02\x02\x02mk\x03\x02\x02\x02mn\x03\x02" +
		"\x02\x02n\x05\x03\x02\x02\x02om\x03\x02\x02\x02pq\x07\v\x02\x02qs\x07" +
		"(\x02\x02rt\x077\x02\x02sr\x03\x02\x02\x02st\x03\x02\x02\x02t\x07\x03" +
		"\x02\x02\x02uw\x05\n\x06\x02vx\x077\x02\x02wv\x03\x02\x02\x02wx\x03\x02" +
		"\x02\x02x\x95\x03\x02\x02\x02y{\x05,\x17\x02z|\x077\x02\x02{z\x03\x02" +
		"\x02\x02{|\x03\x02\x02\x02|\x95\x03\x02\x02\x02}\x7F\x05\x1A\x0E\x02~" +
		"\x80\x077\x02\x02\x7F~\x03\x02\x02\x02\x7F\x80\x03\x02\x02\x02\x80\x95" +
		"\x03\x02\x02\x02\x81\x95\x05\x1C\x0F\x02\x82\x95\x05\"\x12\x02\x83\x95" +
		"\x05$\x13\x02\x84\x95\x05&\x14\x02\x85\x95\x052\x1A\x02\x86\x95\x058\x1D" +
		"\x02\x87\x89\x05@!\x02\x88\x8A\x077\x02\x02\x89\x88\x03\x02\x02\x02\x89" +
		"\x8A\x03\x02\x02\x02\x8A\x95\x03\x02\x02\x02\x8B\x8D\x054\x1B\x02\x8C" +
		"\x8E\x077\x02\x02\x8D\x8C\x03\x02\x02\x02\x8D\x8E\x03\x02\x02\x02\x8E" +
		"\x95\x03\x02\x02\x02\x8F\x91\x056\x1C\x02\x90\x92\x077\x02\x02\x91\x90" +
		"\x03\x02\x02\x02\x91\x92\x03\x02\x02\x02\x92\x95\x03\x02\x02\x02\x93\x95" +
		"\x05B\"\x02\x94u\x03\x02\x02\x02\x94y\x03\x02\x02\x02\x94}\x03\x02\x02" +
		"\x02\x94\x81\x03\x02\x02\x02\x94\x82\x03\x02\x02\x02\x94\x83\x03\x02\x02" +
		"\x02\x94\x84\x03\x02\x02\x02\x94\x85\x03\x02\x02\x02\x94\x86\x03\x02\x02" +
		"\x02\x94\x87\x03\x02\x02\x02\x94\x8B\x03\x02\x02\x02\x94\x8F\x03\x02\x02" +
		"\x02\x94\x93\x03\x02\x02\x02\x95\t\x03\x02\x02\x02\x96\x97\x05\x18\r\x02" +
		"\x97\x98\x07\'\x02\x02\x98\x99\x05H%\x02\x99\x9A\x07\x03\x02\x02\x9A\x9B" +
		"\x05P)\x02\x9B\v\x03\x02\x02\x02\x9C\x9D\x07$\x02\x02\x9D\x9E\x07\'\x02" +
		"\x02\x9E\xA0\x07\x04\x02\x02\x9F\xA1\x05\x0E\b\x02\xA0\x9F\x03\x02\x02" +
		"\x02\xA0\xA1\x03\x02\x02\x02\xA1\xA2\x03\x02\x02\x02\xA2\xA4\x07\x05\x02" +
		"\x02\xA3\xA5\x077\x02\x02\xA4\xA3\x03\x02\x02\x02\xA4\xA5\x03\x02\x02" +
		"\x02\xA5\r\x03\x02\x02\x02\xA6\xAB\x05\x10\t\x02\xA7\xA8\x07\x06\x02\x02" +
		"\xA8\xAA\x05\x10\t\x02\xA9\xA7\x03\x02\x02\x02\xAA\xAD\x03\x02\x02\x02" +
		"\xAB\xA9\x03\x02\x02\x02\xAB\xAC\x03\x02\x02\x02\xAC\x0F\x03\x02\x02\x02" +
		"\xAD\xAB\x03\x02\x02\x02\xAE\xAF\x07\'\x02\x02\xAF\xB0\x05H%\x02\xB0\x11" +
		"\x03\x02\x02\x02\xB1\xB2\x07%\x02\x02\xB2\xB3\x07\'\x02\x02\xB3\xB5\x07" +
		"\x04\x02\x02\xB4\xB6\x05\x14\v\x02\xB5\xB4\x03\x02\x02\x02\xB5\xB6\x03" +
		"\x02\x02\x02\xB6\xB7\x03\x02\x02\x02\xB7\xB9\x07\x05\x02\x02\xB8\xBA\x07" +
		"7\x02\x02\xB9\xB8\x03\x02\x02\x02\xB9\xBA\x03\x02\x02\x02\xBA\x13\x03" +
		"\x02\x02\x02\xBB\xC0\x05\x16\f\x02\xBC\xBD\x07\x06\x02\x02\xBD\xBF\x05" +
		"\x16\f\x02\xBE\xBC\x03\x02\x02\x02\xBF\xC2\x03\x02\x02\x02\xC0\xBE\x03" +
		"\x02\x02\x02\xC0\xC1\x03\x02\x02\x02\xC1\x15\x03\x02\x02\x02\xC2\xC0\x03" +
		"\x02\x02\x02\xC3\xC4\x05,\x17\x02\xC4\x17\x03\x02\x02\x02\xC5\xC6\t\x02" +
		"\x02\x02\xC6\x19\x03\x02\x02\x02\xC7\xC8\x07\x0F\x02\x02\xC8\xC9\x07\x07" +
		"\x02\x02\xC9\xCA\x05P)\x02\xCA\xCB\x07\b\x02\x02\xCB\x1B\x03\x02\x02\x02" +
		"\xCC\xCD\x07\x10\x02\x02\xCD\xCE\x07\x07\x02\x02\xCE\xCF\x05P)\x02\xCF" +
		"\xD0\x07\b\x02\x02\xD0\xD4\x05B\"\x02\xD1\xD3\x05\x1E\x10\x02\xD2\xD1" +
		"\x03\x02\x02\x02\xD3\xD6\x03\x02\x02\x02\xD4\xD2\x03\x02\x02\x02\xD4\xD5" +
		"\x03\x02\x02\x02\xD5\xD8\x03\x02\x02\x02\xD6\xD4\x03\x02\x02\x02\xD7\xD9" +
		"\x05 \x11\x02\xD8\xD7\x03\x02\x02\x02\xD8\xD9\x03\x02\x02\x02\xD9\x1D" +
		"\x03\x02\x02\x02\xDA\xDB\x07\x11\x02\x02\xDB\xDC\x07\x10\x02\x02\xDC\xDD" +
		"\x07\x07\x02\x02\xDD\xDE\x05P)\x02\xDE\xDF\x07\b\x02\x02\xDF\xE0\x05B" +
		"\"\x02\xE0\x1F\x03\x02\x02\x02\xE1\xE2\x07\x11\x02\x02\xE2\xE3\x05B\"" +
		"\x02\xE3!\x03\x02\x02\x02\xE4\xE5\x07\x12\x02\x02\xE5\xE6\x07\x07\x02" +
		"\x02\xE6\xE7\x05P)\x02\xE7\xE8\x07\b\x02\x02\xE8\xE9\x05B\"\x02\xE9#\x03" +
		"\x02\x02\x02\xEA\xEB\x07\x15\x02\x02\xEB\xEC\x05B\"\x02\xEC\xED\x07\x12" +
		"\x02\x02\xED\xEE\x07\x07\x02\x02\xEE\xEF\x05P)\x02\xEF\xF1\x07\b\x02\x02" +
		"\xF0\xF2\x077\x02\x02\xF1\xF0\x03\x02\x02\x02\xF1\xF2\x03\x02\x02\x02" +
		"\xF2%\x03\x02\x02\x02\xF3\xF4\x07\x16\x02\x02\xF4\xF6\x07\x07\x02\x02" +
		"\xF5\xF7\x05(\x15\x02\xF6\xF5\x03\x02\x02\x02\xF6\xF7\x03\x02\x02\x02" +
		"\xF7\xF8\x03\x02\x02\x02\xF8\xFA\x077\x02\x02\xF9\xFB\x05P)\x02\xFA\xF9" +
		"\x03\x02\x02\x02\xFA\xFB\x03\x02\x02\x02\xFB\xFC\x03\x02\x02\x02\xFC\xFE" +
		"\x077\x02\x02\xFD\xFF\x05*\x16\x02\xFE\xFD\x03\x02\x02\x02\xFE\xFF\x03" +
		"\x02\x02\x02\xFF\u0100\x03\x02\x02\x02\u0100\u0101\x07\b\x02\x02\u0101" +
		"\u0102\x05B\"\x02\u0102\'\x03\x02\x02\x02\u0103\u0106\x05\n\x06\x02\u0104" +
		"\u0106\x05,\x17\x02\u0105\u0103\x03\x02\x02\x02\u0105\u0104\x03\x02\x02" +
		"\x02\u0106)\x03\x02\x02\x02\u0107\u010A\x05,\x17\x02\u0108\u010A\x05F" +
		"$\x02\u0109\u0107\x03\x02\x02\x02\u0109\u0108\x03\x02\x02\x02\u010A+\x03" +
		"\x02\x02\x02\u010B\u010C\x07\'\x02\x02\u010C\u010D\x050\x19\x02\u010D" +
		"\u010E\x05P)\x02\u010E\u0114\x03\x02\x02\x02\u010F\u0110\x05.\x18\x02" +
		"\u0110\u0111\x050\x19\x02\u0111\u0112\x05P)\x02\u0112\u0114\x03\x02\x02" +
		"\x02\u0113\u010B\x03\x02\x02\x02\u0113\u010F\x03\x02\x02\x02\u0114-\x03" +
		"\x02\x02\x02\u0115\u0118\x07\'\x02\x02\u0116\u0117\x07\t\x02\x02\u0117" +
		"\u0119\x07\'\x02\x02\u0118\u0116\x03\x02\x02\x02\u0119\u011A\x03\x02\x02" +
		"\x02\u011A\u0118\x03\x02\x02\x02\u011A\u011B\x03\x02\x02\x02\u011B/\x03" +
		"\x02\x02\x02\u011C\u011D\t\x03\x02\x02\u011D1\x03\x02\x02\x02\u011E\u011F" +
		"\x07\x17\x02\x02\u011F\u0120\x07\x07\x02\x02\u0120\u0121\x07\'\x02\x02" +
		"\u0121\u0122\x07\x18\x02\x02\u0122\u0123\x05P)\x02\u0123\u0124\x07\b\x02" +
		"\x02\u0124\u0125\x05B\"\x02\u01253\x03\x02\x02\x02\u0126\u0127\x07\x19" +
		"\x02\x02\u01275\x03\x02\x02\x02\u0128\u0129\x07\x1A\x02\x02\u01297\x03" +
		"\x02\x02\x02\u012A\u012C\x07&\x02\x02\u012B\u012A\x03\x02\x02\x02\u012B" +
		"\u012C\x03\x02\x02\x02\u012C\u012D\x03\x02\x02\x02\u012D\u012E\x07\x13" +
		"\x02\x02\u012E\u012F\x07\'\x02\x02\u012F\u0131\x07\x07\x02\x02\u0130\u0132" +
		"\x05<\x1F\x02\u0131\u0130\x03\x02\x02\x02\u0131\u0132\x03\x02\x02\x02" +
		"\u0132\u0133\x03\x02\x02\x02\u0133\u0135\x07\b\x02\x02\u0134\u0136\x05" +
		"J&\x02\u0135\u0134\x03\x02\x02\x02\u0135\u0136\x03\x02\x02\x02\u0136\u0137" +
		"\x03\x02\x02\x02\u0137\u0138\x05B\"\x02\u01389\x03\x02\x02\x02\u0139\u013A" +
		"\x07\x13\x02\x02\u013A\u013B\x07#\x02\x02\u013B\u013C\x07\x07\x02\x02" +
		"\u013C\u013D\x07\b\x02\x02\u013D\u013E\x05B\"\x02\u013E;\x03\x02\x02\x02" +
		"\u013F\u0144\x05> \x02\u0140\u0141\x07\x06\x02\x02\u0141\u0143\x05> \x02" +
		"\u0142\u0140\x03\x02\x02\x02\u0143\u0146\x03\x02\x02\x02\u0144\u0142\x03" +
		"\x02\x02\x02\u0144\u0145\x03\x02\x02\x02\u0145=\x03\x02\x02\x02\u0146" +
		"\u0144\x03\x02\x02\x02\u0147\u0149\x07\'\x02\x02\u0148\u014A\x05H%\x02" +
		"\u0149\u0148\x03\x02\x02\x02\u0149\u014A\x03\x02\x02\x02\u014A?\x03\x02" +
		"\x02\x02\u014B\u014D\x07\x14\x02\x02\u014C\u014E\x05P)\x02\u014D\u014C" +
		"\x03\x02\x02\x02\u014D\u014E\x03\x02\x02\x02\u014EA\x03\x02\x02\x02\u014F" +
		"\u0153\x07\x04\x02\x02\u0150\u0152\x05\b\x05\x02\u0151\u0150\x03\x02\x02" +
		"\x02\u0152\u0155\x03\x02\x02\x02\u0153\u0151\x03\x02\x02\x02\u0153\u0154" +
		"\x03\x02\x02\x02\u0154\u0156\x03\x02\x02\x02\u0155\u0153\x03\x02\x02\x02" +
		"\u0156\u0157\x07\x05\x02\x02\u0157C\x03\x02\x02\x02\u0158\u015D\x05P)" +
		"\x02\u0159\u015A\x07\x06\x02\x02\u015A\u015C\x05P)\x02\u015B\u0159\x03" +
		"\x02\x02\x02\u015C\u015F\x03\x02\x02\x02\u015D\u015B\x03\x02\x02\x02\u015D" +
		"\u015E\x03\x02\x02\x02\u015EE\x03\x02\x02\x02\u015F\u015D\x03\x02\x02" +
		"\x02\u0160\u0161\x07\'\x02\x02\u0161\u0163\x07\x07\x02\x02\u0162\u0164" +
		"\x05D#\x02\u0163\u0162\x03\x02\x02\x02\u0163\u0164\x03\x02\x02\x02\u0164" +
		"\u0165\x03\x02\x02\x02\u0165\u0166\x07\b\x02\x02\u0166G\x03\x02\x02\x02" +
		"\u0167\u0168\x07\n\x02\x02\u0168\u0169\x05L\'\x02\u0169I\x03\x02\x02\x02" +
		"\u016A\u016B\x07\n\x02\x02\u016B\u016C\x05N(\x02\u016CK\x03\x02\x02\x02" +
		"\u016D\u016E\t\x04\x02\x02\u016EM\x03\x02\x02\x02\u016F\u0172\x05L\'\x02" +
		"\u0170\u0172\x07\"\x02\x02\u0171\u016F\x03\x02\x02\x02\u0171\u0170\x03" +
		"\x02\x02\x02\u0172O\x03\x02\x02\x02\u0173\u0174\b)\x01\x02\u0174\u0175" +
		"\x07.\x02\x02\u0175\u0183\x05P)\r\u0176\u0177\x07\x07\x02\x02\u0177\u0178" +
		"\x05P)\x02\u0178\u0179\x07\b\x02\x02\u0179\u0183\x03\x02\x02\x02\u017A" +
		"\u0183\x05F$\x02\u017B\u0183\x05\x12\n\x02\u017C\u0183\x079\x02\x02\u017D" +
		"\u0183\x078\x02\x02\u017E\u0183\x07:\x02\x02\u017F\u0183\x07 \x02\x02" +
		"\u0180\u0183\x07!\x02\x02\u0181\u0183\x07\'\x02\x02\u0182\u0173\x03\x02" +
		"\x02\x02\u0182\u0176\x03\x02\x02\x02\u0182\u017A\x03\x02\x02\x02\u0182" +
		"\u017B\x03\x02\x02\x02\u0182\u017C\x03\x02\x02\x02\u0182\u017D\x03\x02" +
		"\x02\x02\u0182\u017E\x03\x02\x02\x02\u0182\u017F\x03\x02\x02\x02\u0182" +
		"\u0180\x03\x02\x02\x02\u0182\u0181\x03\x02\x02\x02\u0183\u0192\x03\x02" +
		"\x02\x02\u0184\u0185\f\x10\x02\x02\u0185\u0186\t\x05\x02\x02\u0186\u0191" +
		"\x05P)\x11\u0187\u0188\f\x0F\x02\x02\u0188\u0189\t\x06\x02\x02\u0189\u0191" +
		"\x05P)\x10\u018A\u018B\f\x0E\x02\x02\u018B\u018C\t\x07\x02\x02\u018C\u0191" +
		"\x05P)\x0F\u018D\u018E\f\t\x02\x02\u018E\u018F\x07\t\x02\x02\u018F\u0191" +
		"\x07\'\x02\x02\u0190\u0184\x03\x02\x02\x02\u0190\u0187\x03\x02\x02\x02" +
		"\u0190\u018A\x03\x02\x02\x02\u0190\u018D\x03\x02\x02\x02\u0191\u0194\x03" +
		"\x02\x02\x02\u0192\u0190\x03\x02\x02\x02\u0192\u0193\x03\x02\x02\x02\u0193" +
		"Q\x03\x02\x02\x02\u0194\u0192\x03\x02\x02\x02,U[aemsw{\x7F\x89\x8D\x91" +
		"\x94\xA0\xA4\xAB\xB5\xB9\xC0\xD4\xD8\xF1\xF6\xFA\xFE\u0105\u0109\u0113" +
		"\u011A\u012B\u0131\u0135\u0144\u0149\u014D\u0153\u015D\u0163\u0171\u0182" +
		"\u0190\u0192";
	public static __ATN: ATN;
	public static get _ATN(): ATN {
		if (!AstigLangParser.__ATN) {
			AstigLangParser.__ATN = new ATNDeserializer().deserialize(Utils.toCharArray(AstigLangParser._serializedATN));
		}

		return AstigLangParser.__ATN;
	}

}

export class ProgramContext extends ParserRuleContext {
	public EOF(): TerminalNode { return this.getToken(AstigLangParser.EOF, 0); }
	public includeList(): IncludeListContext[];
	public includeList(i: number): IncludeListContext;
	public includeList(i?: number): IncludeListContext | IncludeListContext[] {
		if (i === undefined) {
			return this.getRuleContexts(IncludeListContext);
		} else {
			return this.getRuleContext(i, IncludeListContext);
		}
	}
	public recordDeclaration(): RecordDeclarationContext[];
	public recordDeclaration(i: number): RecordDeclarationContext;
	public recordDeclaration(i?: number): RecordDeclarationContext | RecordDeclarationContext[] {
		if (i === undefined) {
			return this.getRuleContexts(RecordDeclarationContext);
		} else {
			return this.getRuleContext(i, RecordDeclarationContext);
		}
	}
	public functionDeclaration(): FunctionDeclarationContext[];
	public functionDeclaration(i: number): FunctionDeclarationContext;
	public functionDeclaration(i?: number): FunctionDeclarationContext | FunctionDeclarationContext[] {
		if (i === undefined) {
			return this.getRuleContexts(FunctionDeclarationContext);
		} else {
			return this.getRuleContext(i, FunctionDeclarationContext);
		}
	}
	public functionMainDeclaration(): FunctionMainDeclarationContext | undefined {
		return this.tryGetRuleContext(0, FunctionMainDeclarationContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return AstigLangParser.RULE_program; }
	// @Override
	public enterRule(listener: AstigLangListener): void {
		if (listener.enterProgram) {
			listener.enterProgram(this);
		}
	}
	// @Override
	public exitRule(listener: AstigLangListener): void {
		if (listener.exitProgram) {
			listener.exitProgram(this);
		}
	}
	// @Override
	public accept<Result>(visitor: AstigLangVisitor<Result>): Result {
		if (visitor.visitProgram) {
			return visitor.visitProgram(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class IncludeListContext extends ParserRuleContext {
	public includeStatement(): IncludeStatementContext {
		return this.getRuleContext(0, IncludeStatementContext);
	}
	public includeList(): IncludeListContext[];
	public includeList(i: number): IncludeListContext;
	public includeList(i?: number): IncludeListContext | IncludeListContext[] {
		if (i === undefined) {
			return this.getRuleContexts(IncludeListContext);
		} else {
			return this.getRuleContext(i, IncludeListContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return AstigLangParser.RULE_includeList; }
	// @Override
	public enterRule(listener: AstigLangListener): void {
		if (listener.enterIncludeList) {
			listener.enterIncludeList(this);
		}
	}
	// @Override
	public exitRule(listener: AstigLangListener): void {
		if (listener.exitIncludeList) {
			listener.exitIncludeList(this);
		}
	}
	// @Override
	public accept<Result>(visitor: AstigLangVisitor<Result>): Result {
		if (visitor.visitIncludeList) {
			return visitor.visitIncludeList(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class IncludeStatementContext extends ParserRuleContext {
	public INCLUDE_KW(): TerminalNode { return this.getToken(AstigLangParser.INCLUDE_KW, 0); }
	public FILENAME(): TerminalNode { return this.getToken(AstigLangParser.FILENAME, 0); }
	public SEMICOLON(): TerminalNode | undefined { return this.tryGetToken(AstigLangParser.SEMICOLON, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return AstigLangParser.RULE_includeStatement; }
	// @Override
	public enterRule(listener: AstigLangListener): void {
		if (listener.enterIncludeStatement) {
			listener.enterIncludeStatement(this);
		}
	}
	// @Override
	public exitRule(listener: AstigLangListener): void {
		if (listener.exitIncludeStatement) {
			listener.exitIncludeStatement(this);
		}
	}
	// @Override
	public accept<Result>(visitor: AstigLangVisitor<Result>): Result {
		if (visitor.visitIncludeStatement) {
			return visitor.visitIncludeStatement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class StatementContext extends ParserRuleContext {
	public variableDeclaration(): VariableDeclarationContext | undefined {
		return this.tryGetRuleContext(0, VariableDeclarationContext);
	}
	public SEMICOLON(): TerminalNode | undefined { return this.tryGetToken(AstigLangParser.SEMICOLON, 0); }
	public assignment(): AssignmentContext | undefined {
		return this.tryGetRuleContext(0, AssignmentContext);
	}
	public printStatement(): PrintStatementContext | undefined {
		return this.tryGetRuleContext(0, PrintStatementContext);
	}
	public ifStatement(): IfStatementContext | undefined {
		return this.tryGetRuleContext(0, IfStatementContext);
	}
	public whileStatement(): WhileStatementContext | undefined {
		return this.tryGetRuleContext(0, WhileStatementContext);
	}
	public doWhileStatement(): DoWhileStatementContext | undefined {
		return this.tryGetRuleContext(0, DoWhileStatementContext);
	}
	public forStatement(): ForStatementContext | undefined {
		return this.tryGetRuleContext(0, ForStatementContext);
	}
	public foreachStatement(): ForeachStatementContext | undefined {
		return this.tryGetRuleContext(0, ForeachStatementContext);
	}
	public functionDeclaration(): FunctionDeclarationContext | undefined {
		return this.tryGetRuleContext(0, FunctionDeclarationContext);
	}
	public returnStatement(): ReturnStatementContext | undefined {
		return this.tryGetRuleContext(0, ReturnStatementContext);
	}
	public breakStatement(): BreakStatementContext | undefined {
		return this.tryGetRuleContext(0, BreakStatementContext);
	}
	public continueStatement(): ContinueStatementContext | undefined {
		return this.tryGetRuleContext(0, ContinueStatementContext);
	}
	public block(): BlockContext | undefined {
		return this.tryGetRuleContext(0, BlockContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return AstigLangParser.RULE_statement; }
	// @Override
	public enterRule(listener: AstigLangListener): void {
		if (listener.enterStatement) {
			listener.enterStatement(this);
		}
	}
	// @Override
	public exitRule(listener: AstigLangListener): void {
		if (listener.exitStatement) {
			listener.exitStatement(this);
		}
	}
	// @Override
	public accept<Result>(visitor: AstigLangVisitor<Result>): Result {
		if (visitor.visitStatement) {
			return visitor.visitStatement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class VariableDeclarationContext extends ParserRuleContext {
	public declarationKeyword(): DeclarationKeywordContext {
		return this.getRuleContext(0, DeclarationKeywordContext);
	}
	public IDENTIFIER(): TerminalNode { return this.getToken(AstigLangParser.IDENTIFIER, 0); }
	public typeAnnotation(): TypeAnnotationContext {
		return this.getRuleContext(0, TypeAnnotationContext);
	}
	public expression(): ExpressionContext {
		return this.getRuleContext(0, ExpressionContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return AstigLangParser.RULE_variableDeclaration; }
	// @Override
	public enterRule(listener: AstigLangListener): void {
		if (listener.enterVariableDeclaration) {
			listener.enterVariableDeclaration(this);
		}
	}
	// @Override
	public exitRule(listener: AstigLangListener): void {
		if (listener.exitVariableDeclaration) {
			listener.exitVariableDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: AstigLangVisitor<Result>): Result {
		if (visitor.visitVariableDeclaration) {
			return visitor.visitVariableDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class RecordDeclarationContext extends ParserRuleContext {
	public RECORD_KW(): TerminalNode { return this.getToken(AstigLangParser.RECORD_KW, 0); }
	public IDENTIFIER(): TerminalNode { return this.getToken(AstigLangParser.IDENTIFIER, 0); }
	public recordFieldList(): RecordFieldListContext | undefined {
		return this.tryGetRuleContext(0, RecordFieldListContext);
	}
	public SEMICOLON(): TerminalNode | undefined { return this.tryGetToken(AstigLangParser.SEMICOLON, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return AstigLangParser.RULE_recordDeclaration; }
	// @Override
	public enterRule(listener: AstigLangListener): void {
		if (listener.enterRecordDeclaration) {
			listener.enterRecordDeclaration(this);
		}
	}
	// @Override
	public exitRule(listener: AstigLangListener): void {
		if (listener.exitRecordDeclaration) {
			listener.exitRecordDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: AstigLangVisitor<Result>): Result {
		if (visitor.visitRecordDeclaration) {
			return visitor.visitRecordDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class RecordFieldListContext extends ParserRuleContext {
	public recordField(): RecordFieldContext[];
	public recordField(i: number): RecordFieldContext;
	public recordField(i?: number): RecordFieldContext | RecordFieldContext[] {
		if (i === undefined) {
			return this.getRuleContexts(RecordFieldContext);
		} else {
			return this.getRuleContext(i, RecordFieldContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return AstigLangParser.RULE_recordFieldList; }
	// @Override
	public enterRule(listener: AstigLangListener): void {
		if (listener.enterRecordFieldList) {
			listener.enterRecordFieldList(this);
		}
	}
	// @Override
	public exitRule(listener: AstigLangListener): void {
		if (listener.exitRecordFieldList) {
			listener.exitRecordFieldList(this);
		}
	}
	// @Override
	public accept<Result>(visitor: AstigLangVisitor<Result>): Result {
		if (visitor.visitRecordFieldList) {
			return visitor.visitRecordFieldList(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class RecordFieldContext extends ParserRuleContext {
	public IDENTIFIER(): TerminalNode { return this.getToken(AstigLangParser.IDENTIFIER, 0); }
	public typeAnnotation(): TypeAnnotationContext {
		return this.getRuleContext(0, TypeAnnotationContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return AstigLangParser.RULE_recordField; }
	// @Override
	public enterRule(listener: AstigLangListener): void {
		if (listener.enterRecordField) {
			listener.enterRecordField(this);
		}
	}
	// @Override
	public exitRule(listener: AstigLangListener): void {
		if (listener.exitRecordField) {
			listener.exitRecordField(this);
		}
	}
	// @Override
	public accept<Result>(visitor: AstigLangVisitor<Result>): Result {
		if (visitor.visitRecordField) {
			return visitor.visitRecordField(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class RecordLiteralContext extends ParserRuleContext {
	public NEW_KW(): TerminalNode { return this.getToken(AstigLangParser.NEW_KW, 0); }
	public IDENTIFIER(): TerminalNode { return this.getToken(AstigLangParser.IDENTIFIER, 0); }
	public recordLiteralFieldList(): RecordLiteralFieldListContext | undefined {
		return this.tryGetRuleContext(0, RecordLiteralFieldListContext);
	}
	public SEMICOLON(): TerminalNode | undefined { return this.tryGetToken(AstigLangParser.SEMICOLON, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return AstigLangParser.RULE_recordLiteral; }
	// @Override
	public enterRule(listener: AstigLangListener): void {
		if (listener.enterRecordLiteral) {
			listener.enterRecordLiteral(this);
		}
	}
	// @Override
	public exitRule(listener: AstigLangListener): void {
		if (listener.exitRecordLiteral) {
			listener.exitRecordLiteral(this);
		}
	}
	// @Override
	public accept<Result>(visitor: AstigLangVisitor<Result>): Result {
		if (visitor.visitRecordLiteral) {
			return visitor.visitRecordLiteral(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class RecordLiteralFieldListContext extends ParserRuleContext {
	public recordLiteralField(): RecordLiteralFieldContext[];
	public recordLiteralField(i: number): RecordLiteralFieldContext;
	public recordLiteralField(i?: number): RecordLiteralFieldContext | RecordLiteralFieldContext[] {
		if (i === undefined) {
			return this.getRuleContexts(RecordLiteralFieldContext);
		} else {
			return this.getRuleContext(i, RecordLiteralFieldContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return AstigLangParser.RULE_recordLiteralFieldList; }
	// @Override
	public enterRule(listener: AstigLangListener): void {
		if (listener.enterRecordLiteralFieldList) {
			listener.enterRecordLiteralFieldList(this);
		}
	}
	// @Override
	public exitRule(listener: AstigLangListener): void {
		if (listener.exitRecordLiteralFieldList) {
			listener.exitRecordLiteralFieldList(this);
		}
	}
	// @Override
	public accept<Result>(visitor: AstigLangVisitor<Result>): Result {
		if (visitor.visitRecordLiteralFieldList) {
			return visitor.visitRecordLiteralFieldList(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class RecordLiteralFieldContext extends ParserRuleContext {
	public assignment(): AssignmentContext {
		return this.getRuleContext(0, AssignmentContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return AstigLangParser.RULE_recordLiteralField; }
	// @Override
	public enterRule(listener: AstigLangListener): void {
		if (listener.enterRecordLiteralField) {
			listener.enterRecordLiteralField(this);
		}
	}
	// @Override
	public exitRule(listener: AstigLangListener): void {
		if (listener.exitRecordLiteralField) {
			listener.exitRecordLiteralField(this);
		}
	}
	// @Override
	public accept<Result>(visitor: AstigLangVisitor<Result>): Result {
		if (visitor.visitRecordLiteralField) {
			return visitor.visitRecordLiteralField(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class DeclarationKeywordContext extends ParserRuleContext {
	public CONST_KW(): TerminalNode | undefined { return this.tryGetToken(AstigLangParser.CONST_KW, 0); }
	public VAR_KW(): TerminalNode | undefined { return this.tryGetToken(AstigLangParser.VAR_KW, 0); }
	public LET_KW(): TerminalNode | undefined { return this.tryGetToken(AstigLangParser.LET_KW, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return AstigLangParser.RULE_declarationKeyword; }
	// @Override
	public enterRule(listener: AstigLangListener): void {
		if (listener.enterDeclarationKeyword) {
			listener.enterDeclarationKeyword(this);
		}
	}
	// @Override
	public exitRule(listener: AstigLangListener): void {
		if (listener.exitDeclarationKeyword) {
			listener.exitDeclarationKeyword(this);
		}
	}
	// @Override
	public accept<Result>(visitor: AstigLangVisitor<Result>): Result {
		if (visitor.visitDeclarationKeyword) {
			return visitor.visitDeclarationKeyword(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class PrintStatementContext extends ParserRuleContext {
	public PRINT_KW(): TerminalNode { return this.getToken(AstigLangParser.PRINT_KW, 0); }
	public expression(): ExpressionContext {
		return this.getRuleContext(0, ExpressionContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return AstigLangParser.RULE_printStatement; }
	// @Override
	public enterRule(listener: AstigLangListener): void {
		if (listener.enterPrintStatement) {
			listener.enterPrintStatement(this);
		}
	}
	// @Override
	public exitRule(listener: AstigLangListener): void {
		if (listener.exitPrintStatement) {
			listener.exitPrintStatement(this);
		}
	}
	// @Override
	public accept<Result>(visitor: AstigLangVisitor<Result>): Result {
		if (visitor.visitPrintStatement) {
			return visitor.visitPrintStatement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class IfStatementContext extends ParserRuleContext {
	public IF_KW(): TerminalNode { return this.getToken(AstigLangParser.IF_KW, 0); }
	public expression(): ExpressionContext {
		return this.getRuleContext(0, ExpressionContext);
	}
	public block(): BlockContext {
		return this.getRuleContext(0, BlockContext);
	}
	public elseIfPart(): ElseIfPartContext[];
	public elseIfPart(i: number): ElseIfPartContext;
	public elseIfPart(i?: number): ElseIfPartContext | ElseIfPartContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ElseIfPartContext);
		} else {
			return this.getRuleContext(i, ElseIfPartContext);
		}
	}
	public elsePart(): ElsePartContext | undefined {
		return this.tryGetRuleContext(0, ElsePartContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return AstigLangParser.RULE_ifStatement; }
	// @Override
	public enterRule(listener: AstigLangListener): void {
		if (listener.enterIfStatement) {
			listener.enterIfStatement(this);
		}
	}
	// @Override
	public exitRule(listener: AstigLangListener): void {
		if (listener.exitIfStatement) {
			listener.exitIfStatement(this);
		}
	}
	// @Override
	public accept<Result>(visitor: AstigLangVisitor<Result>): Result {
		if (visitor.visitIfStatement) {
			return visitor.visitIfStatement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ElseIfPartContext extends ParserRuleContext {
	public ELSE_KW(): TerminalNode { return this.getToken(AstigLangParser.ELSE_KW, 0); }
	public IF_KW(): TerminalNode { return this.getToken(AstigLangParser.IF_KW, 0); }
	public expression(): ExpressionContext {
		return this.getRuleContext(0, ExpressionContext);
	}
	public block(): BlockContext {
		return this.getRuleContext(0, BlockContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return AstigLangParser.RULE_elseIfPart; }
	// @Override
	public enterRule(listener: AstigLangListener): void {
		if (listener.enterElseIfPart) {
			listener.enterElseIfPart(this);
		}
	}
	// @Override
	public exitRule(listener: AstigLangListener): void {
		if (listener.exitElseIfPart) {
			listener.exitElseIfPart(this);
		}
	}
	// @Override
	public accept<Result>(visitor: AstigLangVisitor<Result>): Result {
		if (visitor.visitElseIfPart) {
			return visitor.visitElseIfPart(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ElsePartContext extends ParserRuleContext {
	public ELSE_KW(): TerminalNode { return this.getToken(AstigLangParser.ELSE_KW, 0); }
	public block(): BlockContext {
		return this.getRuleContext(0, BlockContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return AstigLangParser.RULE_elsePart; }
	// @Override
	public enterRule(listener: AstigLangListener): void {
		if (listener.enterElsePart) {
			listener.enterElsePart(this);
		}
	}
	// @Override
	public exitRule(listener: AstigLangListener): void {
		if (listener.exitElsePart) {
			listener.exitElsePart(this);
		}
	}
	// @Override
	public accept<Result>(visitor: AstigLangVisitor<Result>): Result {
		if (visitor.visitElsePart) {
			return visitor.visitElsePart(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class WhileStatementContext extends ParserRuleContext {
	public WHILE_KW(): TerminalNode { return this.getToken(AstigLangParser.WHILE_KW, 0); }
	public expression(): ExpressionContext {
		return this.getRuleContext(0, ExpressionContext);
	}
	public block(): BlockContext {
		return this.getRuleContext(0, BlockContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return AstigLangParser.RULE_whileStatement; }
	// @Override
	public enterRule(listener: AstigLangListener): void {
		if (listener.enterWhileStatement) {
			listener.enterWhileStatement(this);
		}
	}
	// @Override
	public exitRule(listener: AstigLangListener): void {
		if (listener.exitWhileStatement) {
			listener.exitWhileStatement(this);
		}
	}
	// @Override
	public accept<Result>(visitor: AstigLangVisitor<Result>): Result {
		if (visitor.visitWhileStatement) {
			return visitor.visitWhileStatement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class DoWhileStatementContext extends ParserRuleContext {
	public DO_KW(): TerminalNode { return this.getToken(AstigLangParser.DO_KW, 0); }
	public block(): BlockContext {
		return this.getRuleContext(0, BlockContext);
	}
	public WHILE_KW(): TerminalNode { return this.getToken(AstigLangParser.WHILE_KW, 0); }
	public expression(): ExpressionContext {
		return this.getRuleContext(0, ExpressionContext);
	}
	public SEMICOLON(): TerminalNode | undefined { return this.tryGetToken(AstigLangParser.SEMICOLON, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return AstigLangParser.RULE_doWhileStatement; }
	// @Override
	public enterRule(listener: AstigLangListener): void {
		if (listener.enterDoWhileStatement) {
			listener.enterDoWhileStatement(this);
		}
	}
	// @Override
	public exitRule(listener: AstigLangListener): void {
		if (listener.exitDoWhileStatement) {
			listener.exitDoWhileStatement(this);
		}
	}
	// @Override
	public accept<Result>(visitor: AstigLangVisitor<Result>): Result {
		if (visitor.visitDoWhileStatement) {
			return visitor.visitDoWhileStatement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ForStatementContext extends ParserRuleContext {
	public FOR_KW(): TerminalNode { return this.getToken(AstigLangParser.FOR_KW, 0); }
	public SEMICOLON(): TerminalNode[];
	public SEMICOLON(i: number): TerminalNode;
	public SEMICOLON(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(AstigLangParser.SEMICOLON);
		} else {
			return this.getToken(AstigLangParser.SEMICOLON, i);
		}
	}
	public block(): BlockContext {
		return this.getRuleContext(0, BlockContext);
	}
	public forInit(): ForInitContext | undefined {
		return this.tryGetRuleContext(0, ForInitContext);
	}
	public expression(): ExpressionContext | undefined {
		return this.tryGetRuleContext(0, ExpressionContext);
	}
	public forUpdate(): ForUpdateContext | undefined {
		return this.tryGetRuleContext(0, ForUpdateContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return AstigLangParser.RULE_forStatement; }
	// @Override
	public enterRule(listener: AstigLangListener): void {
		if (listener.enterForStatement) {
			listener.enterForStatement(this);
		}
	}
	// @Override
	public exitRule(listener: AstigLangListener): void {
		if (listener.exitForStatement) {
			listener.exitForStatement(this);
		}
	}
	// @Override
	public accept<Result>(visitor: AstigLangVisitor<Result>): Result {
		if (visitor.visitForStatement) {
			return visitor.visitForStatement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ForInitContext extends ParserRuleContext {
	public variableDeclaration(): VariableDeclarationContext | undefined {
		return this.tryGetRuleContext(0, VariableDeclarationContext);
	}
	public assignment(): AssignmentContext | undefined {
		return this.tryGetRuleContext(0, AssignmentContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return AstigLangParser.RULE_forInit; }
	// @Override
	public enterRule(listener: AstigLangListener): void {
		if (listener.enterForInit) {
			listener.enterForInit(this);
		}
	}
	// @Override
	public exitRule(listener: AstigLangListener): void {
		if (listener.exitForInit) {
			listener.exitForInit(this);
		}
	}
	// @Override
	public accept<Result>(visitor: AstigLangVisitor<Result>): Result {
		if (visitor.visitForInit) {
			return visitor.visitForInit(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ForUpdateContext extends ParserRuleContext {
	public assignment(): AssignmentContext | undefined {
		return this.tryGetRuleContext(0, AssignmentContext);
	}
	public functionCall(): FunctionCallContext | undefined {
		return this.tryGetRuleContext(0, FunctionCallContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return AstigLangParser.RULE_forUpdate; }
	// @Override
	public enterRule(listener: AstigLangListener): void {
		if (listener.enterForUpdate) {
			listener.enterForUpdate(this);
		}
	}
	// @Override
	public exitRule(listener: AstigLangListener): void {
		if (listener.exitForUpdate) {
			listener.exitForUpdate(this);
		}
	}
	// @Override
	public accept<Result>(visitor: AstigLangVisitor<Result>): Result {
		if (visitor.visitForUpdate) {
			return visitor.visitForUpdate(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class AssignmentContext extends ParserRuleContext {
	public IDENTIFIER(): TerminalNode | undefined { return this.tryGetToken(AstigLangParser.IDENTIFIER, 0); }
	public assignmentOperator(): AssignmentOperatorContext {
		return this.getRuleContext(0, AssignmentOperatorContext);
	}
	public expression(): ExpressionContext {
		return this.getRuleContext(0, ExpressionContext);
	}
	public recordFieldAccess(): RecordFieldAccessContext | undefined {
		return this.tryGetRuleContext(0, RecordFieldAccessContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return AstigLangParser.RULE_assignment; }
	// @Override
	public enterRule(listener: AstigLangListener): void {
		if (listener.enterAssignment) {
			listener.enterAssignment(this);
		}
	}
	// @Override
	public exitRule(listener: AstigLangListener): void {
		if (listener.exitAssignment) {
			listener.exitAssignment(this);
		}
	}
	// @Override
	public accept<Result>(visitor: AstigLangVisitor<Result>): Result {
		if (visitor.visitAssignment) {
			return visitor.visitAssignment(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class RecordFieldAccessContext extends ParserRuleContext {
	public IDENTIFIER(): TerminalNode[];
	public IDENTIFIER(i: number): TerminalNode;
	public IDENTIFIER(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(AstigLangParser.IDENTIFIER);
		} else {
			return this.getToken(AstigLangParser.IDENTIFIER, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return AstigLangParser.RULE_recordFieldAccess; }
	// @Override
	public enterRule(listener: AstigLangListener): void {
		if (listener.enterRecordFieldAccess) {
			listener.enterRecordFieldAccess(this);
		}
	}
	// @Override
	public exitRule(listener: AstigLangListener): void {
		if (listener.exitRecordFieldAccess) {
			listener.exitRecordFieldAccess(this);
		}
	}
	// @Override
	public accept<Result>(visitor: AstigLangVisitor<Result>): Result {
		if (visitor.visitRecordFieldAccess) {
			return visitor.visitRecordFieldAccess(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class AssignmentOperatorContext extends ParserRuleContext {
	public ADD_ASSIGN(): TerminalNode | undefined { return this.tryGetToken(AstigLangParser.ADD_ASSIGN, 0); }
	public SUB_ASSIGN(): TerminalNode | undefined { return this.tryGetToken(AstigLangParser.SUB_ASSIGN, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return AstigLangParser.RULE_assignmentOperator; }
	// @Override
	public enterRule(listener: AstigLangListener): void {
		if (listener.enterAssignmentOperator) {
			listener.enterAssignmentOperator(this);
		}
	}
	// @Override
	public exitRule(listener: AstigLangListener): void {
		if (listener.exitAssignmentOperator) {
			listener.exitAssignmentOperator(this);
		}
	}
	// @Override
	public accept<Result>(visitor: AstigLangVisitor<Result>): Result {
		if (visitor.visitAssignmentOperator) {
			return visitor.visitAssignmentOperator(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ForeachStatementContext extends ParserRuleContext {
	public FOREACH_KW(): TerminalNode { return this.getToken(AstigLangParser.FOREACH_KW, 0); }
	public IDENTIFIER(): TerminalNode { return this.getToken(AstigLangParser.IDENTIFIER, 0); }
	public IN_KW(): TerminalNode { return this.getToken(AstigLangParser.IN_KW, 0); }
	public expression(): ExpressionContext {
		return this.getRuleContext(0, ExpressionContext);
	}
	public block(): BlockContext {
		return this.getRuleContext(0, BlockContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return AstigLangParser.RULE_foreachStatement; }
	// @Override
	public enterRule(listener: AstigLangListener): void {
		if (listener.enterForeachStatement) {
			listener.enterForeachStatement(this);
		}
	}
	// @Override
	public exitRule(listener: AstigLangListener): void {
		if (listener.exitForeachStatement) {
			listener.exitForeachStatement(this);
		}
	}
	// @Override
	public accept<Result>(visitor: AstigLangVisitor<Result>): Result {
		if (visitor.visitForeachStatement) {
			return visitor.visitForeachStatement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class BreakStatementContext extends ParserRuleContext {
	public BREAK_KW(): TerminalNode { return this.getToken(AstigLangParser.BREAK_KW, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return AstigLangParser.RULE_breakStatement; }
	// @Override
	public enterRule(listener: AstigLangListener): void {
		if (listener.enterBreakStatement) {
			listener.enterBreakStatement(this);
		}
	}
	// @Override
	public exitRule(listener: AstigLangListener): void {
		if (listener.exitBreakStatement) {
			listener.exitBreakStatement(this);
		}
	}
	// @Override
	public accept<Result>(visitor: AstigLangVisitor<Result>): Result {
		if (visitor.visitBreakStatement) {
			return visitor.visitBreakStatement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ContinueStatementContext extends ParserRuleContext {
	public CONTINUE_KW(): TerminalNode { return this.getToken(AstigLangParser.CONTINUE_KW, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return AstigLangParser.RULE_continueStatement; }
	// @Override
	public enterRule(listener: AstigLangListener): void {
		if (listener.enterContinueStatement) {
			listener.enterContinueStatement(this);
		}
	}
	// @Override
	public exitRule(listener: AstigLangListener): void {
		if (listener.exitContinueStatement) {
			listener.exitContinueStatement(this);
		}
	}
	// @Override
	public accept<Result>(visitor: AstigLangVisitor<Result>): Result {
		if (visitor.visitContinueStatement) {
			return visitor.visitContinueStatement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class FunctionDeclarationContext extends ParserRuleContext {
	public FUNCTION_KW(): TerminalNode { return this.getToken(AstigLangParser.FUNCTION_KW, 0); }
	public IDENTIFIER(): TerminalNode { return this.getToken(AstigLangParser.IDENTIFIER, 0); }
	public block(): BlockContext {
		return this.getRuleContext(0, BlockContext);
	}
	public EXPORT_KW(): TerminalNode | undefined { return this.tryGetToken(AstigLangParser.EXPORT_KW, 0); }
	public parameterList(): ParameterListContext | undefined {
		return this.tryGetRuleContext(0, ParameterListContext);
	}
	public returnTypeAnnotation(): ReturnTypeAnnotationContext | undefined {
		return this.tryGetRuleContext(0, ReturnTypeAnnotationContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return AstigLangParser.RULE_functionDeclaration; }
	// @Override
	public enterRule(listener: AstigLangListener): void {
		if (listener.enterFunctionDeclaration) {
			listener.enterFunctionDeclaration(this);
		}
	}
	// @Override
	public exitRule(listener: AstigLangListener): void {
		if (listener.exitFunctionDeclaration) {
			listener.exitFunctionDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: AstigLangVisitor<Result>): Result {
		if (visitor.visitFunctionDeclaration) {
			return visitor.visitFunctionDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class FunctionMainDeclarationContext extends ParserRuleContext {
	public FUNCTION_KW(): TerminalNode { return this.getToken(AstigLangParser.FUNCTION_KW, 0); }
	public MAIN_KW(): TerminalNode { return this.getToken(AstigLangParser.MAIN_KW, 0); }
	public block(): BlockContext {
		return this.getRuleContext(0, BlockContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return AstigLangParser.RULE_functionMainDeclaration; }
	// @Override
	public enterRule(listener: AstigLangListener): void {
		if (listener.enterFunctionMainDeclaration) {
			listener.enterFunctionMainDeclaration(this);
		}
	}
	// @Override
	public exitRule(listener: AstigLangListener): void {
		if (listener.exitFunctionMainDeclaration) {
			listener.exitFunctionMainDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: AstigLangVisitor<Result>): Result {
		if (visitor.visitFunctionMainDeclaration) {
			return visitor.visitFunctionMainDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ParameterListContext extends ParserRuleContext {
	public parameter(): ParameterContext[];
	public parameter(i: number): ParameterContext;
	public parameter(i?: number): ParameterContext | ParameterContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ParameterContext);
		} else {
			return this.getRuleContext(i, ParameterContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return AstigLangParser.RULE_parameterList; }
	// @Override
	public enterRule(listener: AstigLangListener): void {
		if (listener.enterParameterList) {
			listener.enterParameterList(this);
		}
	}
	// @Override
	public exitRule(listener: AstigLangListener): void {
		if (listener.exitParameterList) {
			listener.exitParameterList(this);
		}
	}
	// @Override
	public accept<Result>(visitor: AstigLangVisitor<Result>): Result {
		if (visitor.visitParameterList) {
			return visitor.visitParameterList(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ParameterContext extends ParserRuleContext {
	public IDENTIFIER(): TerminalNode { return this.getToken(AstigLangParser.IDENTIFIER, 0); }
	public typeAnnotation(): TypeAnnotationContext | undefined {
		return this.tryGetRuleContext(0, TypeAnnotationContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return AstigLangParser.RULE_parameter; }
	// @Override
	public enterRule(listener: AstigLangListener): void {
		if (listener.enterParameter) {
			listener.enterParameter(this);
		}
	}
	// @Override
	public exitRule(listener: AstigLangListener): void {
		if (listener.exitParameter) {
			listener.exitParameter(this);
		}
	}
	// @Override
	public accept<Result>(visitor: AstigLangVisitor<Result>): Result {
		if (visitor.visitParameter) {
			return visitor.visitParameter(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ReturnStatementContext extends ParserRuleContext {
	public RETURN_KW(): TerminalNode { return this.getToken(AstigLangParser.RETURN_KW, 0); }
	public expression(): ExpressionContext | undefined {
		return this.tryGetRuleContext(0, ExpressionContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return AstigLangParser.RULE_returnStatement; }
	// @Override
	public enterRule(listener: AstigLangListener): void {
		if (listener.enterReturnStatement) {
			listener.enterReturnStatement(this);
		}
	}
	// @Override
	public exitRule(listener: AstigLangListener): void {
		if (listener.exitReturnStatement) {
			listener.exitReturnStatement(this);
		}
	}
	// @Override
	public accept<Result>(visitor: AstigLangVisitor<Result>): Result {
		if (visitor.visitReturnStatement) {
			return visitor.visitReturnStatement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class BlockContext extends ParserRuleContext {
	public statement(): StatementContext[];
	public statement(i: number): StatementContext;
	public statement(i?: number): StatementContext | StatementContext[] {
		if (i === undefined) {
			return this.getRuleContexts(StatementContext);
		} else {
			return this.getRuleContext(i, StatementContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return AstigLangParser.RULE_block; }
	// @Override
	public enterRule(listener: AstigLangListener): void {
		if (listener.enterBlock) {
			listener.enterBlock(this);
		}
	}
	// @Override
	public exitRule(listener: AstigLangListener): void {
		if (listener.exitBlock) {
			listener.exitBlock(this);
		}
	}
	// @Override
	public accept<Result>(visitor: AstigLangVisitor<Result>): Result {
		if (visitor.visitBlock) {
			return visitor.visitBlock(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ArgumentListContext extends ParserRuleContext {
	public expression(): ExpressionContext[];
	public expression(i: number): ExpressionContext;
	public expression(i?: number): ExpressionContext | ExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ExpressionContext);
		} else {
			return this.getRuleContext(i, ExpressionContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return AstigLangParser.RULE_argumentList; }
	// @Override
	public enterRule(listener: AstigLangListener): void {
		if (listener.enterArgumentList) {
			listener.enterArgumentList(this);
		}
	}
	// @Override
	public exitRule(listener: AstigLangListener): void {
		if (listener.exitArgumentList) {
			listener.exitArgumentList(this);
		}
	}
	// @Override
	public accept<Result>(visitor: AstigLangVisitor<Result>): Result {
		if (visitor.visitArgumentList) {
			return visitor.visitArgumentList(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class FunctionCallContext extends ParserRuleContext {
	public IDENTIFIER(): TerminalNode { return this.getToken(AstigLangParser.IDENTIFIER, 0); }
	public argumentList(): ArgumentListContext | undefined {
		return this.tryGetRuleContext(0, ArgumentListContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return AstigLangParser.RULE_functionCall; }
	// @Override
	public enterRule(listener: AstigLangListener): void {
		if (listener.enterFunctionCall) {
			listener.enterFunctionCall(this);
		}
	}
	// @Override
	public exitRule(listener: AstigLangListener): void {
		if (listener.exitFunctionCall) {
			listener.exitFunctionCall(this);
		}
	}
	// @Override
	public accept<Result>(visitor: AstigLangVisitor<Result>): Result {
		if (visitor.visitFunctionCall) {
			return visitor.visitFunctionCall(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class TypeAnnotationContext extends ParserRuleContext {
	public dataType(): DataTypeContext {
		return this.getRuleContext(0, DataTypeContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return AstigLangParser.RULE_typeAnnotation; }
	// @Override
	public enterRule(listener: AstigLangListener): void {
		if (listener.enterTypeAnnotation) {
			listener.enterTypeAnnotation(this);
		}
	}
	// @Override
	public exitRule(listener: AstigLangListener): void {
		if (listener.exitTypeAnnotation) {
			listener.exitTypeAnnotation(this);
		}
	}
	// @Override
	public accept<Result>(visitor: AstigLangVisitor<Result>): Result {
		if (visitor.visitTypeAnnotation) {
			return visitor.visitTypeAnnotation(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ReturnTypeAnnotationContext extends ParserRuleContext {
	public returnDataType(): ReturnDataTypeContext {
		return this.getRuleContext(0, ReturnDataTypeContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return AstigLangParser.RULE_returnTypeAnnotation; }
	// @Override
	public enterRule(listener: AstigLangListener): void {
		if (listener.enterReturnTypeAnnotation) {
			listener.enterReturnTypeAnnotation(this);
		}
	}
	// @Override
	public exitRule(listener: AstigLangListener): void {
		if (listener.exitReturnTypeAnnotation) {
			listener.exitReturnTypeAnnotation(this);
		}
	}
	// @Override
	public accept<Result>(visitor: AstigLangVisitor<Result>): Result {
		if (visitor.visitReturnTypeAnnotation) {
			return visitor.visitReturnTypeAnnotation(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class DataTypeContext extends ParserRuleContext {
	public INT_KW(): TerminalNode | undefined { return this.tryGetToken(AstigLangParser.INT_KW, 0); }
	public FLOAT_KW(): TerminalNode | undefined { return this.tryGetToken(AstigLangParser.FLOAT_KW, 0); }
	public STRING_KW(): TerminalNode | undefined { return this.tryGetToken(AstigLangParser.STRING_KW, 0); }
	public CHAR_KW(): TerminalNode | undefined { return this.tryGetToken(AstigLangParser.CHAR_KW, 0); }
	public BOOLEAN_KW(): TerminalNode | undefined { return this.tryGetToken(AstigLangParser.BOOLEAN_KW, 0); }
	public IDENTIFIER(): TerminalNode | undefined { return this.tryGetToken(AstigLangParser.IDENTIFIER, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return AstigLangParser.RULE_dataType; }
	// @Override
	public enterRule(listener: AstigLangListener): void {
		if (listener.enterDataType) {
			listener.enterDataType(this);
		}
	}
	// @Override
	public exitRule(listener: AstigLangListener): void {
		if (listener.exitDataType) {
			listener.exitDataType(this);
		}
	}
	// @Override
	public accept<Result>(visitor: AstigLangVisitor<Result>): Result {
		if (visitor.visitDataType) {
			return visitor.visitDataType(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ReturnDataTypeContext extends ParserRuleContext {
	public dataType(): DataTypeContext | undefined {
		return this.tryGetRuleContext(0, DataTypeContext);
	}
	public VOID_KW(): TerminalNode | undefined { return this.tryGetToken(AstigLangParser.VOID_KW, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return AstigLangParser.RULE_returnDataType; }
	// @Override
	public enterRule(listener: AstigLangListener): void {
		if (listener.enterReturnDataType) {
			listener.enterReturnDataType(this);
		}
	}
	// @Override
	public exitRule(listener: AstigLangListener): void {
		if (listener.exitReturnDataType) {
			listener.exitReturnDataType(this);
		}
	}
	// @Override
	public accept<Result>(visitor: AstigLangVisitor<Result>): Result {
		if (visitor.visitReturnDataType) {
			return visitor.visitReturnDataType(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ExpressionContext extends ParserRuleContext {
	public _op!: Token;
	public expression(): ExpressionContext[];
	public expression(i: number): ExpressionContext;
	public expression(i?: number): ExpressionContext | ExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ExpressionContext);
		} else {
			return this.getRuleContext(i, ExpressionContext);
		}
	}
	public MUL(): TerminalNode | undefined { return this.tryGetToken(AstigLangParser.MUL, 0); }
	public DIV(): TerminalNode | undefined { return this.tryGetToken(AstigLangParser.DIV, 0); }
	public ADD(): TerminalNode | undefined { return this.tryGetToken(AstigLangParser.ADD, 0); }
	public SUB(): TerminalNode | undefined { return this.tryGetToken(AstigLangParser.SUB, 0); }
	public EQ(): TerminalNode | undefined { return this.tryGetToken(AstigLangParser.EQ, 0); }
	public NEQ(): TerminalNode | undefined { return this.tryGetToken(AstigLangParser.NEQ, 0); }
	public LT(): TerminalNode | undefined { return this.tryGetToken(AstigLangParser.LT, 0); }
	public GT(): TerminalNode | undefined { return this.tryGetToken(AstigLangParser.GT, 0); }
	public LTE(): TerminalNode | undefined { return this.tryGetToken(AstigLangParser.LTE, 0); }
	public GTE(): TerminalNode | undefined { return this.tryGetToken(AstigLangParser.GTE, 0); }
	public functionCall(): FunctionCallContext | undefined {
		return this.tryGetRuleContext(0, FunctionCallContext);
	}
	public recordLiteral(): RecordLiteralContext | undefined {
		return this.tryGetRuleContext(0, RecordLiteralContext);
	}
	public IDENTIFIER(): TerminalNode | undefined { return this.tryGetToken(AstigLangParser.IDENTIFIER, 0); }
	public NUMBER(): TerminalNode | undefined { return this.tryGetToken(AstigLangParser.NUMBER, 0); }
	public FLOAT(): TerminalNode | undefined { return this.tryGetToken(AstigLangParser.FLOAT, 0); }
	public STRING(): TerminalNode | undefined { return this.tryGetToken(AstigLangParser.STRING, 0); }
	public TRUE_KW(): TerminalNode | undefined { return this.tryGetToken(AstigLangParser.TRUE_KW, 0); }
	public FALSE_KW(): TerminalNode | undefined { return this.tryGetToken(AstigLangParser.FALSE_KW, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return AstigLangParser.RULE_expression; }
	// @Override
	public enterRule(listener: AstigLangListener): void {
		if (listener.enterExpression) {
			listener.enterExpression(this);
		}
	}
	// @Override
	public exitRule(listener: AstigLangListener): void {
		if (listener.exitExpression) {
			listener.exitExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: AstigLangVisitor<Result>): Result {
		if (visitor.visitExpression) {
			return visitor.visitExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


