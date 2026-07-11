/**
 * Lexical and syntactic analysis with diagnostic collection.
 *
 * Runs the generated ANTLR lexer and parser on source text, attaches custom
 * error listeners, and returns a parse tree plus human-readable diagnostics
 * (via {@link humanizeAntlrMessage}). Used by `main.ts` as an early syntax
 * gate and by `programLoader.ts` when building the AST.
 */
import { ANTLRErrorListener, CharStreams, CommonTokenStream } from 'antlr4ts';
import { AstigLangLexer } from '../../generated/grammar/AstigLangLexer';
import { AstigLangParser, ProgramContext } from '../../generated/grammar/AstigLangParser';
import {
  humanizeAntlrMessage,
  SourceDiagnostic,
} from './diagnostics';

/** Result of lexing and parsing a single source file. */
export type ParseResult = {
  /** ANTLR parse tree root (`program` rule). */
  tree: ProgramContext;
  /** Number of lex/parse errors detected. */
  syntaxErrors: number;
  /** Human-readable diagnostics with line, column, message, and optional hint. */
  diagnostics: SourceDiagnostic[];
  /** ASCII representation of the parse tree for debugging (`text-files/parse.txt`). */
  parseTree: string;
};

/** Converts a raw ANTLR error into a {@link SourceDiagnostic} and appends it. */
function pushAntlrDiagnostic(
  diagnostics: SourceDiagnostic[],
  phase: 'lex' | 'parse',
  filename: string,
  line: number,
  column: number,
  rawMessage: string,
): void {
  const { message, hint } = humanizeAntlrMessage(rawMessage);
  diagnostics.push({
    phase,
    filename,
    line,
    column: column + 1,
    message,
    hint,
    rawMessage,
  });
}

/**
 * Replaces ANTLR's default error listeners with ones that collect diagnostics
 * instead of printing to stderr. Lexer errors are tagged `lex`; parser errors `parse`.
 */
function attachDiagnosticListeners(
  lexer: AstigLangLexer,
  parser: AstigLangParser,
  diagnostics: SourceDiagnostic[],
  filename: string,
): void {
  const listener: ANTLRErrorListener<unknown> = {
    syntaxError: (
      _recognizer,
      _offendingSymbol,
      line,
      charPositionInLine,
      message,
    ) => {
      pushAntlrDiagnostic(
        diagnostics,
        'parse',
        filename,
        line,
        charPositionInLine,
        message,
      );
    },
  };

  const lexerListener: ANTLRErrorListener<number> = {
    syntaxError: (
      _recognizer,
      _offendingSymbol,
      line,
      charPositionInLine,
      message,
    ) => {
      pushAntlrDiagnostic(
        diagnostics,
        'lex',
        filename,
        line,
        charPositionInLine,
        message,
      );
    },
  };

  lexer.removeErrorListeners();
  parser.removeErrorListeners();
  lexer.addErrorListener(lexerListener);
  parser.addErrorListener(listener);
}

/**
 * Lexes and parses source text, collecting all lex/parse diagnostics.
 *
 * ANTLR may still produce a partial parse tree when errors occur; callers
 * should check `syntaxErrors` before proceeding to AST build or execution.
 *
 * @param source - Raw `.stg` source text.
 * @param filename - Filename shown in diagnostics (default `'<input>'`).
 * @returns Parse tree, error count, diagnostics, and a debug parse-tree string.
 */
export function parseSourceWithDiagnostics(
  source: string,
  filename = '<input>',
): ParseResult {
  const diagnostics: SourceDiagnostic[] = [];
  const lexer = new AstigLangLexer(CharStreams.fromString(source));
  const parser = new AstigLangParser(new CommonTokenStream(lexer));

  attachDiagnosticListeners(lexer, parser, diagnostics, filename);

  const tree = parser.program();

  return {
    tree,
    syntaxErrors: diagnostics.length > 0 ? diagnostics.length : parser.numberOfSyntaxErrors,
    diagnostics,
    parseTree: tree.toStringTree(parser.ruleNames),
  };
}
