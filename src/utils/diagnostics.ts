/**
 * Human-readable error reporting for all compiler phases.
 *
 * Translates raw ANTLR messages, formats diagnostics with filename/line/column,
 * source lines, and carets, and prints batched reports (including recovery
 * footers). Used by `main.ts`, `parseWithDiagnostics.ts`, and `typeCheckRecovery.ts`.
 */

import { SourceLocation } from '../models/StatementNode';

/** Compiler phase that produced a diagnostic. */
export type DiagnosticPhase = 'lex' | 'parse' | 'type' | 'runtime' | 'include';

/** A single error with location, message, and optional hint for the user. */
export type SourceDiagnostic = {
  phase: DiagnosticPhase;
  filename: string;
  line: number;
  column: number;
  message: string;
  hint?: string;
  rawMessage?: string;
};

const TOP_LEVEL_RULE_HINT =
  'At the top level, only includes, record declarations, functions, and main are allowed. ' +
  'Move statements like print, scan, and assignments inside mHA1Ns() or another function.';

const EXPECTING_KEYWORD_MAP: Record<string, string> = {
  INCLUDE_KW: 'include (iHNcHLuHD3s)',
  FUNCTION_KW: 'function (fHUncTH!0Ns)',
  RECORD_KW: 'record (rH3cH0rHDz)',
  EXPORT_KW: 'export (eHXpH0RTz)',
  CONST_KW: 'const (c0hNsTz)',
  VAR_KW: 'var (vH4rs)',
  LET_KW: 'let (lH3tsz)',
  PRINT_KW: 'print (pHR!HNTs)',
  SCAN_KW: 'scan (scH4nz)',
  IF_KW: 'if (!HFs)',
  WHILE_KW: 'while (wH1lEs)',
  RETURN_KW: 'return (rH3tHUrns)',
  EOF: 'end of file',
};

function extractQuotedToken(message: string): string | undefined {
  const match = message.match(/'([^']*)'/);
  return match?.[1];
}

function extractExpectingList(message: string): string | undefined {
  const match = message.match(/expecting \{([^}]+)\}/);
  return match?.[1];
}

function humanizeExpectingList(expectingList: string): string {
  const tokens = expectingList.split(',').map((token) => token.trim());
  const labels = tokens.map((token) => EXPECTING_KEYWORD_MAP[token] ?? token);
  return labels.join(', ');
}

/** Suggests a fix based on the offending token and raw ANTLR message. */
function hintForOffendingToken(token: string, rawMessage: string): string | undefined {
  if (/^[a-z][a-z]+$/.test(token) && !token.includes('H')) {
    return (
      `"${token}" looks like plain English. AstigLang identifiers and keywords must use jejemon spellings ` +
      '(for example nH4mH3s, pHR!HNTs, fHUncTH!0Ns).'
    );
  }

  if (token === '&&' || token === '||' || token === '!') {
    return (
      `The operator "${token}" is not valid AstigLang syntax. Use jejemon logical operators instead ` +
      '(nH0ts for NOT, aHNdz for AND, 0hrS for OR).'
    );
  }

  if (rawMessage.includes('token recognition error')) {
    return (
      'The lexer could not recognize this text as a valid token. ' +
      'Check jejemon spelling, string quotes, and punctuation.'
    );
  }

  if (rawMessage.includes('no viable alternative')) {
    return (
      'This token cannot start a valid statement here. ' +
      'Function calls must appear inside print, scan, assignment, or another expression — not alone as a statement.'
    );
  }

  return undefined;
}

/**
 * Turns a raw ANTLR lexer/parser message into a short user-facing message and hint.
 *
 * Handles token recognition errors, mismatched/extraneous input, missing tokens,
 * and adds AstigLang-specific hints (jejemon spellings, top-level layout, types).
 */
export function humanizeAntlrMessage(rawMessage: string): {
  message: string;
  hint?: string;
} {
  const offendingToken = extractQuotedToken(rawMessage);
  const tokenHint = offendingToken
    ? hintForOffendingToken(offendingToken, rawMessage)
    : undefined;

  if (rawMessage.includes('token recognition error')) {
    const invalid = offendingToken ?? 'invalid characters';
    return {
      message: `Unrecognized input: "${invalid}"`,
      hint:
        tokenHint ??
        'Use valid AstigLang tokens (jejemon keywords/identifiers, numbers, strings, operators).',
    };
  }

  if (rawMessage.startsWith('mismatched input')) {
    const expectingList = extractExpectingList(rawMessage);
    const expectingText = expectingList
      ? humanizeExpectingList(expectingList)
      : 'something else';

    let message = `Unexpected "${offendingToken ?? 'token'}". Expected ${expectingText}.`;
    let hint = tokenHint;

    if (
      expectingList &&
      (expectingList.includes('INCLUDE_KW') ||
        expectingList.includes('FUNCTION_KW') ||
        expectingList.includes('RECORD_KW'))
    ) {
      hint = hint ?? TOP_LEVEL_RULE_HINT;
    }

    if (offendingToken === '=' && expectingList?.includes(':')) {
      hint =
        'Variable declarations require a type annotation before = (for example vH4rs xH1s:iHNtSZ = 1).';
      message = 'Missing type annotation before assignment.';
    }

    return { message, hint };
  }

  if (rawMessage.startsWith('extraneous input')) {
    const expectingList = extractExpectingList(rawMessage);
    return {
      message: `Unexpected extra token "${offendingToken ?? 'token'}".`,
      hint:
        tokenHint ??
        (expectingList
          ? `Expected ${humanizeExpectingList(expectingList)}.`
          : 'Remove or relocate this token.'),
    };
  }

  if (rawMessage.startsWith('no viable alternative')) {
    return {
      message: `Invalid syntax near "${offendingToken ?? 'this token'}".`,
      hint:
        tokenHint ??
        'Check statement structure: bare function calls, missing types, or misplaced punctuation are common causes.',
    };
  }

  if (rawMessage.startsWith('missing')) {
    return {
      message: rawMessage.replace(/^missing /, 'Missing '),
      hint: tokenHint,
    };
  }

  return {
    message: rawMessage,
    hint: tokenHint,
  };
}

/**
 * Returns the text of a source line (1-based line number).
 *
 * @param source - Full source file contents.
 * @param line - 1-based line number from a diagnostic.
 */
export function getSourceLine(source: string, line: number): string | undefined {
  const lines = source.split('\n');
  return lines[line - 1];
}

/**
 * Formats one diagnostic for console output.
 *
 * Output includes phase label, `file:line:column`, message, optional source
 * line with caret, and optional hint.
 */
export function formatDiagnostic(
  diagnostic: SourceDiagnostic,
  source?: string,
): string {
  const location = `${diagnostic.filename}:${diagnostic.line}:${diagnostic.column}`;
  const phaseLabel =
    diagnostic.phase === 'lex'
      ? 'Lexical error'
      : diagnostic.phase === 'parse'
        ? 'Syntax error'
        : diagnostic.phase === 'type'
          ? 'Type error'
          : diagnostic.phase === 'runtime'
            ? 'Runtime error'
            : 'Include error';

  const lines = [`${phaseLabel} at ${location}`, `  ${diagnostic.message}`];

  if (source) {
    const sourceLine = getSourceLine(source, diagnostic.line);
    if (sourceLine !== undefined) {
      lines.push(`  | ${sourceLine}`);
      const caretPadding = '  | ' + ' '.repeat(Math.max(0, diagnostic.column - 1));
      lines.push(`${caretPadding}^`);
    }
  }

  if (diagnostic.hint) {
    lines.push(`  hint: ${diagnostic.hint}`);
  }

  return lines.join('\n');
}

/**
 * Returns a footer note explaining that the compiler continued after errors.
 *
 * @param phase - The phase that used recovery (`lex`, `parse`, or `type`).
 */
export function formatRecoveryFooter(phase: 'lex' | 'parse' | 'type'): string {
  if (phase === 'lex') {
    return 'Note: Lexer skipped invalid input and continued scanning (error recovery).';
  }
  if (phase === 'parse') {
    return 'Note: Parser used ANTLR error recovery and continued after syntax errors.';
  }
  return 'Note: Type checker continued after errors and reported all issues found (error recovery).';
}

/**
 * Formats a batch of diagnostics with a count header and optional recovery footer.
 *
 * @param diagnostics - All errors to display.
 * @param source - Optional source text for line/caret context.
 * @param options.showRecoveryNote - When true, appends a phase-specific recovery note.
 */
export function formatDiagnosticReport(
  diagnostics: SourceDiagnostic[],
  source?: string,
  options?: { showRecoveryNote?: boolean },
): string {
  if (diagnostics.length === 0) {
    return 'Unknown error.';
  }

  const header =
    diagnostics.length === 1
      ? '1 error found:'
      : `${diagnostics.length} errors found:`;

  const lines = [
    header,
    '',
    ...diagnostics.map((diagnostic) => formatDiagnostic(diagnostic, source)),
  ];

  if (options?.showRecoveryNote && diagnostics.length > 0) {
    const phase = diagnostics[0].phase;
    if (phase === 'lex' || phase === 'parse' || phase === 'type') {
      lines.push('', formatRecoveryFooter(phase));
    }
  }

  return lines.join('\n\n');
}

/**
 * Reads `location` from errors that carry it (`TypeCheckError`, `RuntimeError`).
 */
export function getErrorSourceLocation(error: Error): SourceLocation | undefined {
  if (!('location' in error)) {
    return undefined;
  }

  const location = (error as Error & { location?: SourceLocation }).location;
  if (
    location &&
    typeof location.line === 'number' &&
    typeof location.column === 'number'
  ) {
    return location;
  }

  return undefined;
}

/**
 * Builds a {@link SourceDiagnostic} from a thrown `Error`.
 *
 * Used for single type/runtime/include failures and by type-check recovery
 * when batching semantic errors.
 */
export function diagnosticFromError(
  error: Error,
  phase: DiagnosticPhase,
  filename: string,
  location?: Pick<SourceDiagnostic, 'line' | 'column'>,
): SourceDiagnostic {
  const resolvedLocation = location ?? getErrorSourceLocation(error);

  return {
    phase,
    filename,
    line: resolvedLocation?.line ?? 1,
    column: resolvedLocation?.column ?? 1,
    message: error.message,
  };
}

/**
 * Prints a formatted diagnostic report to stderr.
 *
 * @param diagnostics - Errors to display.
 * @param source - Optional source text for carets.
 * @param options.showRecoveryNote - Append recovery footer when multiple errors were collected.
 */
export function reportDiagnostics(
  diagnostics: SourceDiagnostic[],
  source?: string,
  options?: { showRecoveryNote?: boolean },
): void {
  console.error(formatDiagnosticReport(diagnostics, source, options));
}
