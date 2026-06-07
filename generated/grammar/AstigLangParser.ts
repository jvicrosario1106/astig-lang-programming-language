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
	public static readonly CONST_KW = 8;
	public static readonly VAR_KW = 9;
	public static readonly LET_KW = 10;
	public static readonly PRINT_KW = 11;
	public static readonly IF_KW = 12;
	public static readonly ELSE_KW = 13;
	public static readonly WHILE_KW = 14;
	public static readonly FUNCTION_KW = 15;
	public static readonly RETURN_KW = 16;
	public static readonly DO_KW = 17;
	public static readonly FOR_KW = 18;
	public static readonly FOREACH_KW = 19;
	public static readonly IN_KW = 20;
	public static readonly BREAK_KW = 21;
	public static readonly CONTINUE_KW = 22;
	public static readonly INT_KW = 23;
	public static readonly FLOAT_KW = 24;
	public static readonly STRING_KW = 25;
	public static readonly CHAR_KW = 26;
	public static readonly BOOLEAN_KW = 27;
	public static readonly VOID_KW = 28;
	public static readonly IDENTIFIER = 29;
	public static readonly SUBSCRIPT = 30;
	public static readonly ADD_ASSIGN = 31;
	public static readonly SUB_ASSIGN = 32;
	public static readonly ADD = 33;
	public static readonly SUB = 34;
	public static readonly MUL = 35;
	public static readonly DIV = 36;
	public static readonly EQ = 37;
	public static readonly NEQ = 38;
	public static readonly LT = 39;
	public static readonly GT = 40;
	public static readonly LTE = 41;
	public static readonly GTE = 42;
	public static readonly SEMICOLON = 43;
	public static readonly NUMBER = 44;
	public static readonly STRING = 45;
	public static readonly WS = 46;
	public static readonly WORD = 47;
	public static readonly SYLLABLE_LOWCASE = 48;
	public static readonly SYLLABLE_UPCASE = 49;
	public static readonly LETTER = 50;
	public static readonly RULE_program = 0;
	public static readonly RULE_statement = 1;
	public static readonly RULE_variableDeclaration = 2;
	public static readonly RULE_declarationKeyword = 3;
	public static readonly RULE_printStatement = 4;
	public static readonly RULE_ifStatement = 5;
	public static readonly RULE_elseIfPart = 6;
	public static readonly RULE_elsePart = 7;
	public static readonly RULE_whileStatement = 8;
	public static readonly RULE_doWhileStatement = 9;
	public static readonly RULE_forStatement = 10;
	public static readonly RULE_forInit = 11;
	public static readonly RULE_forUpdate = 12;
	public static readonly RULE_assignment = 13;
	public static readonly RULE_assignmentOperator = 14;
	public static readonly RULE_foreachStatement = 15;
	public static readonly RULE_breakStatement = 16;
	public static readonly RULE_continueStatement = 17;
	public static readonly RULE_functionDeclaration = 18;
	public static readonly RULE_parameterList = 19;
	public static readonly RULE_parameter = 20;
	public static readonly RULE_returnStatement = 21;
	public static readonly RULE_block = 22;
	public static readonly RULE_argumentList = 23;
	public static readonly RULE_functionCall = 24;
	public static readonly RULE_typeAnnotation = 25;
	public static readonly RULE_returnTypeAnnotation = 26;
	public static readonly RULE_dataType = 27;
	public static readonly RULE_returnDataType = 28;
	public static readonly RULE_expression = 29;
	// tslint:disable:no-trailing-whitespace
	public static readonly ruleNames: string[] = [
		"program", "statement", "variableDeclaration", "declarationKeyword", "printStatement", 
		"ifStatement", "elseIfPart", "elsePart", "whileStatement", "doWhileStatement", 
		"forStatement", "forInit", "forUpdate", "assignment", "assignmentOperator", 
		"foreachStatement", "breakStatement", "continueStatement", "functionDeclaration", 
		"parameterList", "parameter", "returnStatement", "block", "argumentList", 
		"functionCall", "typeAnnotation", "returnTypeAnnotation", "dataType", 
		"returnDataType", "expression",
	];

	private static readonly _LITERAL_NAMES: Array<string | undefined> = [
		undefined, "'='", "'('", "')'", "','", "'{'", "'}'", "':'", undefined, 
		undefined, undefined, undefined, undefined, undefined, undefined, undefined, 
		undefined, undefined, undefined, undefined, undefined, undefined, undefined, 
		undefined, undefined, undefined, undefined, undefined, undefined, undefined, 
		undefined, "'+='", "'-='", "'+'", "'-'", "'*'", "'/'", "'=='", "'!='", 
		"'<'", "'>'", "'<='", "'>='", "';'",
	];
	private static readonly _SYMBOLIC_NAMES: Array<string | undefined> = [
		undefined, undefined, undefined, undefined, undefined, undefined, undefined, 
		undefined, "CONST_KW", "VAR_KW", "LET_KW", "PRINT_KW", "IF_KW", "ELSE_KW", 
		"WHILE_KW", "FUNCTION_KW", "RETURN_KW", "DO_KW", "FOR_KW", "FOREACH_KW", 
		"IN_KW", "BREAK_KW", "CONTINUE_KW", "INT_KW", "FLOAT_KW", "STRING_KW", 
		"CHAR_KW", "BOOLEAN_KW", "VOID_KW", "IDENTIFIER", "SUBSCRIPT", "ADD_ASSIGN", 
		"SUB_ASSIGN", "ADD", "SUB", "MUL", "DIV", "EQ", "NEQ", "LT", "GT", "LTE", 
		"GTE", "SEMICOLON", "NUMBER", "STRING", "WS", "WORD", "SYLLABLE_LOWCASE", 
		"SYLLABLE_UPCASE", "LETTER",
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
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 63;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << AstigLangParser.T__4) | (1 << AstigLangParser.CONST_KW) | (1 << AstigLangParser.VAR_KW) | (1 << AstigLangParser.LET_KW) | (1 << AstigLangParser.PRINT_KW) | (1 << AstigLangParser.IF_KW) | (1 << AstigLangParser.WHILE_KW) | (1 << AstigLangParser.FUNCTION_KW) | (1 << AstigLangParser.RETURN_KW) | (1 << AstigLangParser.DO_KW) | (1 << AstigLangParser.FOR_KW) | (1 << AstigLangParser.FOREACH_KW) | (1 << AstigLangParser.BREAK_KW) | (1 << AstigLangParser.CONTINUE_KW) | (1 << AstigLangParser.IDENTIFIER))) !== 0)) {
				{
				{
				this.state = 60;
				this.statement();
				}
				}
				this.state = 65;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 66;
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
	public statement(): StatementContext {
		let _localctx: StatementContext = new StatementContext(this._ctx, this.state);
		this.enterRule(_localctx, 2, AstigLangParser.RULE_statement);
		let _la: number;
		try {
			this.state = 99;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case AstigLangParser.CONST_KW:
			case AstigLangParser.VAR_KW:
			case AstigLangParser.LET_KW:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 68;
				this.variableDeclaration();
				this.state = 70;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === AstigLangParser.SEMICOLON) {
					{
					this.state = 69;
					this.match(AstigLangParser.SEMICOLON);
					}
				}

				}
				break;
			case AstigLangParser.IDENTIFIER:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 72;
				this.assignment();
				this.state = 74;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === AstigLangParser.SEMICOLON) {
					{
					this.state = 73;
					this.match(AstigLangParser.SEMICOLON);
					}
				}

				}
				break;
			case AstigLangParser.PRINT_KW:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 76;
				this.printStatement();
				this.state = 78;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === AstigLangParser.SEMICOLON) {
					{
					this.state = 77;
					this.match(AstigLangParser.SEMICOLON);
					}
				}

				}
				break;
			case AstigLangParser.IF_KW:
				this.enterOuterAlt(_localctx, 4);
				{
				this.state = 80;
				this.ifStatement();
				}
				break;
			case AstigLangParser.WHILE_KW:
				this.enterOuterAlt(_localctx, 5);
				{
				this.state = 81;
				this.whileStatement();
				}
				break;
			case AstigLangParser.DO_KW:
				this.enterOuterAlt(_localctx, 6);
				{
				this.state = 82;
				this.doWhileStatement();
				}
				break;
			case AstigLangParser.FOR_KW:
				this.enterOuterAlt(_localctx, 7);
				{
				this.state = 83;
				this.forStatement();
				}
				break;
			case AstigLangParser.FOREACH_KW:
				this.enterOuterAlt(_localctx, 8);
				{
				this.state = 84;
				this.foreachStatement();
				}
				break;
			case AstigLangParser.FUNCTION_KW:
				this.enterOuterAlt(_localctx, 9);
				{
				this.state = 85;
				this.functionDeclaration();
				}
				break;
			case AstigLangParser.RETURN_KW:
				this.enterOuterAlt(_localctx, 10);
				{
				this.state = 86;
				this.returnStatement();
				this.state = 88;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === AstigLangParser.SEMICOLON) {
					{
					this.state = 87;
					this.match(AstigLangParser.SEMICOLON);
					}
				}

				}
				break;
			case AstigLangParser.BREAK_KW:
				this.enterOuterAlt(_localctx, 11);
				{
				this.state = 90;
				this.breakStatement();
				this.state = 92;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === AstigLangParser.SEMICOLON) {
					{
					this.state = 91;
					this.match(AstigLangParser.SEMICOLON);
					}
				}

				}
				break;
			case AstigLangParser.CONTINUE_KW:
				this.enterOuterAlt(_localctx, 12);
				{
				this.state = 94;
				this.continueStatement();
				this.state = 96;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === AstigLangParser.SEMICOLON) {
					{
					this.state = 95;
					this.match(AstigLangParser.SEMICOLON);
					}
				}

				}
				break;
			case AstigLangParser.T__4:
				this.enterOuterAlt(_localctx, 13);
				{
				this.state = 98;
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
		this.enterRule(_localctx, 4, AstigLangParser.RULE_variableDeclaration);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 101;
			this.declarationKeyword();
			this.state = 102;
			this.match(AstigLangParser.IDENTIFIER);
			this.state = 103;
			this.typeAnnotation();
			this.state = 104;
			this.match(AstigLangParser.T__0);
			this.state = 105;
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
	public declarationKeyword(): DeclarationKeywordContext {
		let _localctx: DeclarationKeywordContext = new DeclarationKeywordContext(this._ctx, this.state);
		this.enterRule(_localctx, 6, AstigLangParser.RULE_declarationKeyword);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 107;
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
		this.enterRule(_localctx, 8, AstigLangParser.RULE_printStatement);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 109;
			this.match(AstigLangParser.PRINT_KW);
			this.state = 110;
			this.match(AstigLangParser.T__1);
			this.state = 111;
			this.expression(0);
			this.state = 112;
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
	public ifStatement(): IfStatementContext {
		let _localctx: IfStatementContext = new IfStatementContext(this._ctx, this.state);
		this.enterRule(_localctx, 10, AstigLangParser.RULE_ifStatement);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 114;
			this.match(AstigLangParser.IF_KW);
			this.state = 115;
			this.match(AstigLangParser.T__1);
			this.state = 116;
			this.expression(0);
			this.state = 117;
			this.match(AstigLangParser.T__2);
			this.state = 118;
			this.block();
			this.state = 122;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 8, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 119;
					this.elseIfPart();
					}
					}
				}
				this.state = 124;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 8, this._ctx);
			}
			this.state = 126;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === AstigLangParser.ELSE_KW) {
				{
				this.state = 125;
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
		this.enterRule(_localctx, 12, AstigLangParser.RULE_elseIfPart);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 128;
			this.match(AstigLangParser.ELSE_KW);
			this.state = 129;
			this.match(AstigLangParser.IF_KW);
			this.state = 130;
			this.match(AstigLangParser.T__1);
			this.state = 131;
			this.expression(0);
			this.state = 132;
			this.match(AstigLangParser.T__2);
			this.state = 133;
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
		this.enterRule(_localctx, 14, AstigLangParser.RULE_elsePart);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 135;
			this.match(AstigLangParser.ELSE_KW);
			this.state = 136;
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
		this.enterRule(_localctx, 16, AstigLangParser.RULE_whileStatement);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 138;
			this.match(AstigLangParser.WHILE_KW);
			this.state = 139;
			this.match(AstigLangParser.T__1);
			this.state = 140;
			this.expression(0);
			this.state = 141;
			this.match(AstigLangParser.T__2);
			this.state = 142;
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
		this.enterRule(_localctx, 18, AstigLangParser.RULE_doWhileStatement);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 144;
			this.match(AstigLangParser.DO_KW);
			this.state = 145;
			this.block();
			this.state = 146;
			this.match(AstigLangParser.WHILE_KW);
			this.state = 147;
			this.match(AstigLangParser.T__1);
			this.state = 148;
			this.expression(0);
			this.state = 149;
			this.match(AstigLangParser.T__2);
			this.state = 151;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === AstigLangParser.SEMICOLON) {
				{
				this.state = 150;
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
		this.enterRule(_localctx, 20, AstigLangParser.RULE_forStatement);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 153;
			this.match(AstigLangParser.FOR_KW);
			this.state = 154;
			this.match(AstigLangParser.T__1);
			this.state = 156;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << AstigLangParser.CONST_KW) | (1 << AstigLangParser.VAR_KW) | (1 << AstigLangParser.LET_KW) | (1 << AstigLangParser.IDENTIFIER))) !== 0)) {
				{
				this.state = 155;
				this.forInit();
				}
			}

			this.state = 158;
			this.match(AstigLangParser.SEMICOLON);
			this.state = 160;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === AstigLangParser.T__1 || _la === AstigLangParser.IDENTIFIER || ((((_la - 34)) & ~0x1F) === 0 && ((1 << (_la - 34)) & ((1 << (AstigLangParser.SUB - 34)) | (1 << (AstigLangParser.NUMBER - 34)) | (1 << (AstigLangParser.STRING - 34)))) !== 0)) {
				{
				this.state = 159;
				this.expression(0);
				}
			}

			this.state = 162;
			this.match(AstigLangParser.SEMICOLON);
			this.state = 164;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === AstigLangParser.IDENTIFIER) {
				{
				this.state = 163;
				this.forUpdate();
				}
			}

			this.state = 166;
			this.match(AstigLangParser.T__2);
			this.state = 167;
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
		this.enterRule(_localctx, 22, AstigLangParser.RULE_forInit);
		try {
			this.state = 171;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case AstigLangParser.CONST_KW:
			case AstigLangParser.VAR_KW:
			case AstigLangParser.LET_KW:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 169;
				this.variableDeclaration();
				}
				break;
			case AstigLangParser.IDENTIFIER:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 170;
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
		this.enterRule(_localctx, 24, AstigLangParser.RULE_forUpdate);
		try {
			this.state = 175;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 15, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 173;
				this.assignment();
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 174;
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
		this.enterRule(_localctx, 26, AstigLangParser.RULE_assignment);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 177;
			this.match(AstigLangParser.IDENTIFIER);
			this.state = 178;
			this.assignmentOperator();
			this.state = 179;
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
	public assignmentOperator(): AssignmentOperatorContext {
		let _localctx: AssignmentOperatorContext = new AssignmentOperatorContext(this._ctx, this.state);
		this.enterRule(_localctx, 28, AstigLangParser.RULE_assignmentOperator);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 181;
			_la = this._input.LA(1);
			if (!(((((_la - 1)) & ~0x1F) === 0 && ((1 << (_la - 1)) & ((1 << (AstigLangParser.T__0 - 1)) | (1 << (AstigLangParser.ADD_ASSIGN - 1)) | (1 << (AstigLangParser.SUB_ASSIGN - 1)))) !== 0))) {
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
		this.enterRule(_localctx, 30, AstigLangParser.RULE_foreachStatement);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 183;
			this.match(AstigLangParser.FOREACH_KW);
			this.state = 184;
			this.match(AstigLangParser.T__1);
			this.state = 185;
			this.match(AstigLangParser.IDENTIFIER);
			this.state = 186;
			this.match(AstigLangParser.IN_KW);
			this.state = 187;
			this.expression(0);
			this.state = 188;
			this.match(AstigLangParser.T__2);
			this.state = 189;
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
		this.enterRule(_localctx, 32, AstigLangParser.RULE_breakStatement);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 191;
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
		this.enterRule(_localctx, 34, AstigLangParser.RULE_continueStatement);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 193;
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
		this.enterRule(_localctx, 36, AstigLangParser.RULE_functionDeclaration);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 195;
			this.match(AstigLangParser.FUNCTION_KW);
			this.state = 196;
			this.match(AstigLangParser.IDENTIFIER);
			this.state = 197;
			this.match(AstigLangParser.T__1);
			this.state = 199;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === AstigLangParser.IDENTIFIER) {
				{
				this.state = 198;
				this.parameterList();
				}
			}

			this.state = 201;
			this.match(AstigLangParser.T__2);
			this.state = 203;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === AstigLangParser.T__6) {
				{
				this.state = 202;
				this.returnTypeAnnotation();
				}
			}

			this.state = 205;
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
		this.enterRule(_localctx, 38, AstigLangParser.RULE_parameterList);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 207;
			this.parameter();
			this.state = 212;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === AstigLangParser.T__3) {
				{
				{
				this.state = 208;
				this.match(AstigLangParser.T__3);
				this.state = 209;
				this.parameter();
				}
				}
				this.state = 214;
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
		this.enterRule(_localctx, 40, AstigLangParser.RULE_parameter);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 215;
			this.match(AstigLangParser.IDENTIFIER);
			this.state = 217;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === AstigLangParser.T__6) {
				{
				this.state = 216;
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
		this.enterRule(_localctx, 42, AstigLangParser.RULE_returnStatement);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 219;
			this.match(AstigLangParser.RETURN_KW);
			this.state = 221;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 20, this._ctx) ) {
			case 1:
				{
				this.state = 220;
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
		this.enterRule(_localctx, 44, AstigLangParser.RULE_block);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 223;
			this.match(AstigLangParser.T__4);
			this.state = 227;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << AstigLangParser.T__4) | (1 << AstigLangParser.CONST_KW) | (1 << AstigLangParser.VAR_KW) | (1 << AstigLangParser.LET_KW) | (1 << AstigLangParser.PRINT_KW) | (1 << AstigLangParser.IF_KW) | (1 << AstigLangParser.WHILE_KW) | (1 << AstigLangParser.FUNCTION_KW) | (1 << AstigLangParser.RETURN_KW) | (1 << AstigLangParser.DO_KW) | (1 << AstigLangParser.FOR_KW) | (1 << AstigLangParser.FOREACH_KW) | (1 << AstigLangParser.BREAK_KW) | (1 << AstigLangParser.CONTINUE_KW) | (1 << AstigLangParser.IDENTIFIER))) !== 0)) {
				{
				{
				this.state = 224;
				this.statement();
				}
				}
				this.state = 229;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 230;
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
	public argumentList(): ArgumentListContext {
		let _localctx: ArgumentListContext = new ArgumentListContext(this._ctx, this.state);
		this.enterRule(_localctx, 46, AstigLangParser.RULE_argumentList);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 232;
			this.expression(0);
			this.state = 237;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === AstigLangParser.T__3) {
				{
				{
				this.state = 233;
				this.match(AstigLangParser.T__3);
				this.state = 234;
				this.expression(0);
				}
				}
				this.state = 239;
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
		this.enterRule(_localctx, 48, AstigLangParser.RULE_functionCall);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 240;
			this.match(AstigLangParser.IDENTIFIER);
			this.state = 241;
			this.match(AstigLangParser.T__1);
			this.state = 243;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === AstigLangParser.T__1 || _la === AstigLangParser.IDENTIFIER || ((((_la - 34)) & ~0x1F) === 0 && ((1 << (_la - 34)) & ((1 << (AstigLangParser.SUB - 34)) | (1 << (AstigLangParser.NUMBER - 34)) | (1 << (AstigLangParser.STRING - 34)))) !== 0)) {
				{
				this.state = 242;
				this.argumentList();
				}
			}

			this.state = 245;
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
	public typeAnnotation(): TypeAnnotationContext {
		let _localctx: TypeAnnotationContext = new TypeAnnotationContext(this._ctx, this.state);
		this.enterRule(_localctx, 50, AstigLangParser.RULE_typeAnnotation);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 247;
			this.match(AstigLangParser.T__6);
			this.state = 248;
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
		this.enterRule(_localctx, 52, AstigLangParser.RULE_returnTypeAnnotation);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 250;
			this.match(AstigLangParser.T__6);
			this.state = 251;
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
		this.enterRule(_localctx, 54, AstigLangParser.RULE_dataType);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 253;
			_la = this._input.LA(1);
			if (!((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << AstigLangParser.INT_KW) | (1 << AstigLangParser.FLOAT_KW) | (1 << AstigLangParser.STRING_KW) | (1 << AstigLangParser.CHAR_KW) | (1 << AstigLangParser.BOOLEAN_KW) | (1 << AstigLangParser.IDENTIFIER))) !== 0))) {
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
		this.enterRule(_localctx, 56, AstigLangParser.RULE_returnDataType);
		try {
			this.state = 257;
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
				this.state = 255;
				this.dataType();
				}
				break;
			case AstigLangParser.VOID_KW:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 256;
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
		let _startState: number = 58;
		this.enterRecursionRule(_localctx, 58, AstigLangParser.RULE_expression, _p);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 270;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 25, this._ctx) ) {
			case 1:
				{
				this.state = 260;
				this.match(AstigLangParser.SUB);
				this.state = 261;
				this.expression(6);
				}
				break;

			case 2:
				{
				this.state = 262;
				this.match(AstigLangParser.T__1);
				this.state = 263;
				this.expression(0);
				this.state = 264;
				this.match(AstigLangParser.T__2);
				}
				break;

			case 3:
				{
				this.state = 266;
				this.functionCall();
				}
				break;

			case 4:
				{
				this.state = 267;
				this.match(AstigLangParser.NUMBER);
				}
				break;

			case 5:
				{
				this.state = 268;
				this.match(AstigLangParser.STRING);
				}
				break;

			case 6:
				{
				this.state = 269;
				this.match(AstigLangParser.IDENTIFIER);
				}
				break;
			}
			this._ctx._stop = this._input.tryLT(-1);
			this.state = 283;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 27, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					if (this._parseListeners != null) {
						this.triggerExitRuleEvent();
					}
					_prevctx = _localctx;
					{
					this.state = 281;
					this._errHandler.sync(this);
					switch ( this.interpreter.adaptivePredict(this._input, 26, this._ctx) ) {
					case 1:
						{
						_localctx = new ExpressionContext(_parentctx, _parentState);
						this.pushNewRecursionContext(_localctx, _startState, AstigLangParser.RULE_expression);
						this.state = 272;
						if (!(this.precpred(this._ctx, 9))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 9)");
						}
						this.state = 273;
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
						this.state = 274;
						this.expression(10);
						}
						break;

					case 2:
						{
						_localctx = new ExpressionContext(_parentctx, _parentState);
						this.pushNewRecursionContext(_localctx, _startState, AstigLangParser.RULE_expression);
						this.state = 275;
						if (!(this.precpred(this._ctx, 8))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 8)");
						}
						this.state = 276;
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
						this.state = 277;
						this.expression(9);
						}
						break;

					case 3:
						{
						_localctx = new ExpressionContext(_parentctx, _parentState);
						this.pushNewRecursionContext(_localctx, _startState, AstigLangParser.RULE_expression);
						this.state = 278;
						if (!(this.precpred(this._ctx, 7))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 7)");
						}
						this.state = 279;
						_localctx._op = this._input.LT(1);
						_la = this._input.LA(1);
						if (!(((((_la - 37)) & ~0x1F) === 0 && ((1 << (_la - 37)) & ((1 << (AstigLangParser.EQ - 37)) | (1 << (AstigLangParser.NEQ - 37)) | (1 << (AstigLangParser.LT - 37)) | (1 << (AstigLangParser.GT - 37)) | (1 << (AstigLangParser.LTE - 37)) | (1 << (AstigLangParser.GTE - 37)))) !== 0))) {
							_localctx._op = this._errHandler.recoverInline(this);
						} else {
							if (this._input.LA(1) === Token.EOF) {
								this.matchedEOF = true;
							}

							this._errHandler.reportMatch(this);
							this.consume();
						}
						this.state = 280;
						this.expression(8);
						}
						break;
					}
					}
				}
				this.state = 285;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 27, this._ctx);
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
		case 29:
			return this.expression_sempred(_localctx as ExpressionContext, predIndex);
		}
		return true;
	}
	private expression_sempred(_localctx: ExpressionContext, predIndex: number): boolean {
		switch (predIndex) {
		case 0:
			return this.precpred(this._ctx, 9);

		case 1:
			return this.precpred(this._ctx, 8);

		case 2:
			return this.precpred(this._ctx, 7);
		}
		return true;
	}

	public static readonly _serializedATN: string =
		"\x03\uC91D\uCABA\u058D\uAFBA\u4F53\u0607\uEA8B\uC241\x034\u0121\x04\x02" +
		"\t\x02\x04\x03\t\x03\x04\x04\t\x04\x04\x05\t\x05\x04\x06\t\x06\x04\x07" +
		"\t\x07\x04\b\t\b\x04\t\t\t\x04\n\t\n\x04\v\t\v\x04\f\t\f\x04\r\t\r\x04" +
		"\x0E\t\x0E\x04\x0F\t\x0F\x04\x10\t\x10\x04\x11\t\x11\x04\x12\t\x12\x04" +
		"\x13\t\x13\x04\x14\t\x14\x04\x15\t\x15\x04\x16\t\x16\x04\x17\t\x17\x04" +
		"\x18\t\x18\x04\x19\t\x19\x04\x1A\t\x1A\x04\x1B\t\x1B\x04\x1C\t\x1C\x04" +
		"\x1D\t\x1D\x04\x1E\t\x1E\x04\x1F\t\x1F\x03\x02\x07\x02@\n\x02\f\x02\x0E" +
		"\x02C\v\x02\x03\x02\x03\x02\x03\x03\x03\x03\x05\x03I\n\x03\x03\x03\x03" +
		"\x03\x05\x03M\n\x03\x03\x03\x03\x03\x05\x03Q\n\x03\x03\x03\x03\x03\x03" +
		"\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x05\x03[\n\x03\x03\x03\x03" +
		"\x03\x05\x03_\n\x03\x03\x03\x03\x03\x05\x03c\n\x03\x03\x03\x05\x03f\n" +
		"\x03\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x03\x05\x03\x05\x03" +
		"\x06\x03\x06\x03\x06\x03\x06\x03\x06\x03\x07\x03\x07\x03\x07\x03\x07\x03" +
		"\x07\x03\x07\x07\x07{\n\x07\f\x07\x0E\x07~\v\x07\x03\x07\x05\x07\x81\n" +
		"\x07\x03\b\x03\b\x03\b\x03\b\x03\b\x03\b\x03\b\x03\t\x03\t\x03\t\x03\n" +
		"\x03\n\x03\n\x03\n\x03\n\x03\n\x03\v\x03\v\x03\v\x03\v\x03\v\x03\v\x03" +
		"\v\x05\v\x9A\n\v\x03\f\x03\f\x03\f\x05\f\x9F\n\f\x03\f\x03\f\x05\f\xA3" +
		"\n\f\x03\f\x03\f\x05\f\xA7\n\f\x03\f\x03\f\x03\f\x03\r\x03\r\x05\r\xAE" +
		"\n\r\x03\x0E\x03\x0E\x05\x0E\xB2\n\x0E\x03\x0F\x03\x0F\x03\x0F\x03\x0F" +
		"\x03\x10\x03\x10\x03\x11\x03\x11\x03\x11\x03\x11\x03\x11\x03\x11\x03\x11" +
		"\x03\x11\x03\x12\x03\x12\x03\x13\x03\x13\x03\x14\x03\x14\x03\x14\x03\x14" +
		"\x05\x14\xCA\n\x14\x03\x14\x03\x14\x05\x14\xCE\n\x14\x03\x14\x03\x14\x03" +
		"\x15\x03\x15\x03\x15\x07\x15\xD5\n\x15\f\x15\x0E\x15\xD8\v\x15\x03\x16" +
		"\x03\x16\x05\x16\xDC\n\x16\x03\x17\x03\x17\x05\x17\xE0\n\x17\x03\x18\x03" +
		"\x18\x07\x18\xE4\n\x18\f\x18\x0E\x18\xE7\v\x18\x03\x18\x03\x18\x03\x19" +
		"\x03\x19\x03\x19\x07\x19\xEE\n\x19\f\x19\x0E\x19\xF1\v\x19\x03\x1A\x03" +
		"\x1A\x03\x1A\x05\x1A\xF6\n\x1A\x03\x1A\x03\x1A\x03\x1B\x03\x1B\x03\x1B" +
		"\x03\x1C\x03\x1C\x03\x1C\x03\x1D\x03\x1D\x03\x1E\x03\x1E\x05\x1E\u0104" +
		"\n\x1E\x03\x1F\x03\x1F\x03\x1F\x03\x1F\x03\x1F\x03\x1F\x03\x1F\x03\x1F" +
		"\x03\x1F\x03\x1F\x03\x1F\x05\x1F\u0111\n\x1F\x03\x1F\x03\x1F\x03\x1F\x03" +
		"\x1F\x03\x1F\x03\x1F\x03\x1F\x03\x1F\x03\x1F\x07\x1F\u011C\n\x1F\f\x1F" +
		"\x0E\x1F\u011F\v\x1F\x03\x1F\x02\x02\x03< \x02\x02\x04\x02\x06\x02\b\x02" +
		"\n\x02\f\x02\x0E\x02\x10\x02\x12\x02\x14\x02\x16\x02\x18\x02\x1A\x02\x1C" +
		"\x02\x1E\x02 \x02\"\x02$\x02&\x02(\x02*\x02,\x02.\x020\x022\x024\x026" +
		"\x028\x02:\x02<\x02\x02\b\x03\x02\n\f\x04\x02\x03\x03!\"\x04\x02\x19\x1D" +
		"\x1F\x1F\x03\x02%&\x03\x02#$\x03\x02\',\x02\u012E\x02A\x03\x02\x02\x02" +
		"\x04e\x03\x02\x02\x02\x06g\x03\x02\x02\x02\bm\x03\x02\x02\x02\no\x03\x02" +
		"\x02\x02\ft\x03\x02\x02\x02\x0E\x82\x03\x02\x02\x02\x10\x89\x03\x02\x02" +
		"\x02\x12\x8C\x03\x02\x02\x02\x14\x92\x03\x02\x02\x02\x16\x9B\x03\x02\x02" +
		"\x02\x18\xAD\x03\x02\x02\x02\x1A\xB1\x03\x02\x02\x02\x1C\xB3\x03\x02\x02" +
		"\x02\x1E\xB7\x03\x02\x02\x02 \xB9\x03\x02\x02\x02\"\xC1\x03\x02\x02\x02" +
		"$\xC3\x03\x02\x02\x02&\xC5\x03\x02\x02\x02(\xD1\x03\x02\x02\x02*\xD9\x03" +
		"\x02\x02\x02,\xDD\x03\x02\x02\x02.\xE1\x03\x02\x02\x020\xEA\x03\x02\x02" +
		"\x022\xF2\x03\x02\x02\x024\xF9\x03\x02\x02\x026\xFC\x03\x02\x02\x028\xFF" +
		"\x03\x02\x02\x02:\u0103\x03\x02\x02\x02<\u0110\x03\x02\x02\x02>@\x05\x04" +
		"\x03\x02?>\x03\x02\x02\x02@C\x03\x02\x02\x02A?\x03\x02\x02\x02AB\x03\x02" +
		"\x02\x02BD\x03\x02\x02\x02CA\x03\x02\x02\x02DE\x07\x02\x02\x03E\x03\x03" +
		"\x02\x02\x02FH\x05\x06\x04\x02GI\x07-\x02\x02HG\x03\x02\x02\x02HI\x03" +
		"\x02\x02\x02If\x03\x02\x02\x02JL\x05\x1C\x0F\x02KM\x07-\x02\x02LK\x03" +
		"\x02\x02\x02LM\x03\x02\x02\x02Mf\x03\x02\x02\x02NP\x05\n\x06\x02OQ\x07" +
		"-\x02\x02PO\x03\x02\x02\x02PQ\x03\x02\x02\x02Qf\x03\x02\x02\x02Rf\x05" +
		"\f\x07\x02Sf\x05\x12\n\x02Tf\x05\x14\v\x02Uf\x05\x16\f\x02Vf\x05 \x11" +
		"\x02Wf\x05&\x14\x02XZ\x05,\x17\x02Y[\x07-\x02\x02ZY\x03\x02\x02\x02Z[" +
		"\x03\x02\x02\x02[f\x03\x02\x02\x02\\^\x05\"\x12\x02]_\x07-\x02\x02^]\x03" +
		"\x02\x02\x02^_\x03\x02\x02\x02_f\x03\x02\x02\x02`b\x05$\x13\x02ac\x07" +
		"-\x02\x02ba\x03\x02\x02\x02bc\x03\x02\x02\x02cf\x03\x02\x02\x02df\x05" +
		".\x18\x02eF\x03\x02\x02\x02eJ\x03\x02\x02\x02eN\x03\x02\x02\x02eR\x03" +
		"\x02\x02\x02eS\x03\x02\x02\x02eT\x03\x02\x02\x02eU\x03\x02\x02\x02eV\x03" +
		"\x02\x02\x02eW\x03\x02\x02\x02eX\x03\x02\x02\x02e\\\x03\x02\x02\x02e`" +
		"\x03\x02\x02\x02ed\x03\x02\x02\x02f\x05\x03\x02\x02\x02gh\x05\b\x05\x02" +
		"hi\x07\x1F\x02\x02ij\x054\x1B\x02jk\x07\x03\x02\x02kl\x05<\x1F\x02l\x07" +
		"\x03\x02\x02\x02mn\t\x02\x02\x02n\t\x03\x02\x02\x02op\x07\r\x02\x02pq" +
		"\x07\x04\x02\x02qr\x05<\x1F\x02rs\x07\x05\x02\x02s\v\x03\x02\x02\x02t" +
		"u\x07\x0E\x02\x02uv\x07\x04\x02\x02vw\x05<\x1F\x02wx\x07\x05\x02\x02x" +
		"|\x05.\x18\x02y{\x05\x0E\b\x02zy\x03\x02\x02\x02{~\x03\x02\x02\x02|z\x03" +
		"\x02\x02\x02|}\x03\x02\x02\x02}\x80\x03\x02\x02\x02~|\x03\x02\x02\x02" +
		"\x7F\x81\x05\x10\t\x02\x80\x7F\x03\x02\x02\x02\x80\x81\x03\x02\x02\x02" +
		"\x81\r\x03\x02\x02\x02\x82\x83\x07\x0F\x02\x02\x83\x84\x07\x0E\x02\x02" +
		"\x84\x85\x07\x04\x02\x02\x85\x86\x05<\x1F\x02\x86\x87\x07\x05\x02\x02" +
		"\x87\x88\x05.\x18\x02\x88\x0F\x03\x02\x02\x02\x89\x8A\x07\x0F\x02\x02" +
		"\x8A\x8B\x05.\x18\x02\x8B\x11\x03\x02\x02\x02\x8C\x8D\x07\x10\x02\x02" +
		"\x8D\x8E\x07\x04\x02\x02\x8E\x8F\x05<\x1F\x02\x8F\x90\x07\x05\x02\x02" +
		"\x90\x91\x05.\x18\x02\x91\x13\x03\x02\x02\x02\x92\x93\x07\x13\x02\x02" +
		"\x93\x94\x05.\x18\x02\x94\x95\x07\x10\x02\x02\x95\x96\x07\x04\x02\x02" +
		"\x96\x97\x05<\x1F\x02\x97\x99\x07\x05\x02\x02\x98\x9A\x07-\x02\x02\x99" +
		"\x98\x03\x02\x02\x02\x99\x9A\x03\x02\x02\x02\x9A\x15\x03\x02\x02\x02\x9B" +
		"\x9C\x07\x14\x02\x02\x9C\x9E\x07\x04\x02\x02\x9D\x9F\x05\x18\r\x02\x9E" +
		"\x9D\x03\x02\x02\x02\x9E\x9F\x03\x02\x02\x02\x9F\xA0\x03\x02\x02\x02\xA0" +
		"\xA2\x07-\x02\x02\xA1\xA3\x05<\x1F\x02\xA2\xA1\x03\x02\x02\x02\xA2\xA3" +
		"\x03\x02\x02\x02\xA3\xA4\x03\x02\x02\x02\xA4\xA6\x07-\x02\x02\xA5\xA7" +
		"\x05\x1A\x0E\x02\xA6\xA5\x03\x02\x02\x02\xA6\xA7\x03\x02\x02\x02\xA7\xA8" +
		"\x03\x02\x02\x02\xA8\xA9\x07\x05\x02\x02\xA9\xAA\x05.\x18\x02\xAA\x17" +
		"\x03\x02\x02\x02\xAB\xAE\x05\x06\x04\x02\xAC\xAE\x05\x1C\x0F\x02\xAD\xAB" +
		"\x03\x02\x02\x02\xAD\xAC\x03\x02\x02\x02\xAE\x19\x03\x02\x02\x02\xAF\xB2" +
		"\x05\x1C\x0F\x02\xB0\xB2\x052\x1A\x02\xB1\xAF\x03\x02\x02\x02\xB1\xB0" +
		"\x03\x02\x02\x02\xB2\x1B\x03\x02\x02\x02\xB3\xB4\x07\x1F\x02\x02\xB4\xB5" +
		"\x05\x1E\x10\x02\xB5\xB6\x05<\x1F\x02\xB6\x1D\x03\x02\x02\x02\xB7\xB8" +
		"\t\x03\x02\x02\xB8\x1F\x03\x02\x02\x02\xB9\xBA\x07\x15\x02\x02\xBA\xBB" +
		"\x07\x04\x02\x02\xBB\xBC\x07\x1F\x02\x02\xBC\xBD\x07\x16\x02\x02\xBD\xBE" +
		"\x05<\x1F\x02\xBE\xBF\x07\x05\x02\x02\xBF\xC0\x05.\x18\x02\xC0!\x03\x02" +
		"\x02\x02\xC1\xC2\x07\x17\x02\x02\xC2#\x03\x02\x02\x02\xC3\xC4\x07\x18" +
		"\x02\x02\xC4%\x03\x02\x02\x02\xC5\xC6\x07\x11\x02\x02\xC6\xC7\x07\x1F" +
		"\x02\x02\xC7\xC9\x07\x04\x02\x02\xC8\xCA\x05(\x15\x02\xC9\xC8\x03\x02" +
		"\x02\x02\xC9\xCA\x03\x02\x02\x02\xCA\xCB\x03\x02\x02\x02\xCB\xCD\x07\x05" +
		"\x02\x02\xCC\xCE\x056\x1C\x02\xCD\xCC\x03\x02\x02\x02\xCD\xCE\x03\x02" +
		"\x02\x02\xCE\xCF\x03\x02\x02\x02\xCF\xD0\x05.\x18\x02\xD0\'\x03\x02\x02" +
		"\x02\xD1\xD6\x05*\x16\x02\xD2\xD3\x07\x06\x02\x02\xD3\xD5\x05*\x16\x02" +
		"\xD4\xD2\x03\x02\x02\x02\xD5\xD8\x03\x02\x02\x02\xD6\xD4\x03\x02\x02\x02" +
		"\xD6\xD7\x03\x02\x02\x02\xD7)\x03\x02\x02\x02\xD8\xD6\x03\x02\x02\x02" +
		"\xD9\xDB\x07\x1F\x02\x02\xDA\xDC\x054\x1B\x02\xDB\xDA\x03\x02\x02\x02" +
		"\xDB\xDC\x03\x02\x02\x02\xDC+\x03\x02\x02\x02\xDD\xDF\x07\x12\x02\x02" +
		"\xDE\xE0\x05<\x1F\x02\xDF\xDE\x03\x02\x02\x02\xDF\xE0\x03\x02\x02\x02" +
		"\xE0-\x03\x02\x02\x02\xE1\xE5\x07\x07\x02\x02\xE2\xE4\x05\x04\x03\x02" +
		"\xE3\xE2\x03\x02\x02\x02\xE4\xE7\x03\x02\x02\x02\xE5\xE3\x03\x02\x02\x02" +
		"\xE5\xE6\x03\x02\x02\x02\xE6\xE8\x03\x02\x02\x02\xE7\xE5\x03\x02\x02\x02" +
		"\xE8\xE9\x07\b\x02\x02\xE9/\x03\x02\x02\x02\xEA\xEF\x05<\x1F\x02\xEB\xEC" +
		"\x07\x06\x02\x02\xEC\xEE\x05<\x1F\x02\xED\xEB\x03\x02\x02\x02\xEE\xF1" +
		"\x03\x02\x02\x02\xEF\xED\x03\x02\x02\x02\xEF\xF0\x03\x02\x02\x02\xF01" +
		"\x03\x02\x02\x02\xF1\xEF\x03\x02\x02\x02\xF2\xF3\x07\x1F\x02\x02\xF3\xF5" +
		"\x07\x04\x02\x02\xF4\xF6\x050\x19\x02\xF5\xF4\x03\x02\x02\x02\xF5\xF6" +
		"\x03\x02\x02\x02\xF6\xF7\x03\x02\x02\x02\xF7\xF8\x07\x05\x02\x02\xF83" +
		"\x03\x02\x02\x02\xF9\xFA\x07\t\x02\x02\xFA\xFB\x058\x1D\x02\xFB5\x03\x02" +
		"\x02\x02\xFC\xFD\x07\t\x02\x02\xFD\xFE\x05:\x1E\x02\xFE7\x03\x02\x02\x02" +
		"\xFF\u0100\t\x04\x02\x02\u01009\x03\x02\x02\x02\u0101\u0104\x058\x1D\x02" +
		"\u0102\u0104\x07\x1E\x02\x02\u0103\u0101\x03\x02\x02\x02\u0103\u0102\x03" +
		"\x02\x02\x02\u0104;\x03\x02\x02\x02\u0105\u0106\b\x1F\x01\x02\u0106\u0107" +
		"\x07$\x02\x02\u0107\u0111\x05<\x1F\b\u0108\u0109\x07\x04\x02\x02\u0109" +
		"\u010A\x05<\x1F\x02\u010A\u010B\x07\x05\x02\x02\u010B\u0111\x03\x02\x02" +
		"\x02\u010C\u0111\x052\x1A\x02\u010D\u0111\x07.\x02\x02\u010E\u0111\x07" +
		"/\x02\x02\u010F\u0111\x07\x1F\x02\x02\u0110\u0105\x03\x02\x02\x02\u0110" +
		"\u0108\x03\x02\x02\x02\u0110\u010C\x03\x02\x02\x02\u0110\u010D\x03\x02" +
		"\x02\x02\u0110\u010E\x03\x02\x02\x02\u0110\u010F\x03\x02\x02\x02\u0111" +
		"\u011D\x03\x02\x02\x02\u0112\u0113\f\v\x02\x02\u0113\u0114\t\x05\x02\x02" +
		"\u0114\u011C\x05<\x1F\f\u0115\u0116\f\n\x02\x02\u0116\u0117\t\x06\x02" +
		"\x02\u0117\u011C\x05<\x1F\v\u0118\u0119\f\t\x02\x02\u0119\u011A\t\x07" +
		"\x02\x02\u011A\u011C\x05<\x1F\n\u011B\u0112\x03\x02\x02\x02\u011B\u0115" +
		"\x03\x02\x02\x02\u011B\u0118\x03\x02\x02\x02\u011C\u011F\x03\x02\x02\x02" +
		"\u011D\u011B\x03\x02\x02\x02\u011D\u011E\x03\x02\x02\x02\u011E=\x03\x02" +
		"\x02\x02\u011F\u011D\x03\x02\x02\x02\x1EAHLPZ^be|\x80\x99\x9E\xA2\xA6" +
		"\xAD\xB1\xC9\xCD\xD6\xDB\xDF\xE5\xEF\xF5\u0103\u0110\u011B\u011D";
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
	public IDENTIFIER(): TerminalNode { return this.getToken(AstigLangParser.IDENTIFIER, 0); }
	public assignmentOperator(): AssignmentOperatorContext {
		return this.getRuleContext(0, AssignmentOperatorContext);
	}
	public expression(): ExpressionContext {
		return this.getRuleContext(0, ExpressionContext);
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
	public NUMBER(): TerminalNode | undefined { return this.tryGetToken(AstigLangParser.NUMBER, 0); }
	public STRING(): TerminalNode | undefined { return this.tryGetToken(AstigLangParser.STRING, 0); }
	public IDENTIFIER(): TerminalNode | undefined { return this.tryGetToken(AstigLangParser.IDENTIFIER, 0); }
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


