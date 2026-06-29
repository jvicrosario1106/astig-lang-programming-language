/**
 * Scanner / lexer demo entry point (`npm run scan`).
 *
 * Tokenizes sample `.stg` files (or large stress inputs), reports lexical errors
 * with line/column, measures scan speed, and writes dumps to:
 *   - scanner-error-dump.txt  (errors only)
 *   - scanner-output.txt      (full console output)
 */
import { ANTLRErrorListener, CharStreams } from 'antlr4ts';
import { appendFileSync, readFileSync, writeFileSync } from 'fs';
import { AstigLangLexer } from '../generated/grammar/AstigLangLexer';

const scannerDemoFiles = [
  'demo-examples/scanner-demo-1.stg',
  'demo-examples/scanner-demo-2.stg',
  'demo-examples/scanner-demo-3.stg',
  'demo-examples/scanner-demo-4.stg',
  'demo-examples/scanner-demo-5.stg',
];

const scannerDemoDescriptions: Record<string, string> = {
  'demo-examples/scanner-demo-1.stg':
    'Declarations (const/var/let), print, if/else — program layout: functionMainDeclaration only',
  'demo-examples/scanner-demo-2.stg':
    'Arithmetic (+, -, *, /), +=, -= — program layout: functionMainDeclaration only',
  'demo-examples/scanner-demo-3.stg':
    'Loops (while, do-while, for) — program layout: functionMainDeclaration only',
  'demo-examples/scanner-demo-4.stg':
    'Full entry layout: includeList*, recordDeclaration*, functionDeclaration*, functionMainDeclaration (libHs.stg has no main)',
  'demo-examples/scanner-demo-5.stg':
    'Lexical error stress test (invalid tokens mixed with valid snippets)',
};

const maxDisplayedTokens = 80;
const errorDumpFilePath = 'scanner-error-dump.txt';
const outputDumpFilePath = 'scanner-output.txt';

const outputLines: string[] = [];

function emitOutput(line = ''): void {
  console.log(line);
  outputLines.push(line);
}

type LexerError = {
  line: number;
  column: number;
  message: string;
  recovery: string;
};

function getTokenName(tokenType: number): string {
  return AstigLangLexer.VOCABULARY.getDisplayName(tokenType);
}

function formatTokenText(text: string): string {
  const escapedText = text
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t');
  return escapedText.length > 60
    ? `${escapedText.slice(0, 57)}...`
    : escapedText;
}

function getInvalidInputFromMessage(message: string): string {
  const match = message.match(/at: '([\s\S]*)'$/);

  return match ? formatTokenText(match[1]) : 'unknown input';
}

function createLexerErrorListener(
  errors: LexerError[],
): ANTLRErrorListener<number> {
  return {
    syntaxError: (
      _recognizer,
      _offendingSymbol,
      line,
      charPositionInLine,
      message,
    ) => {
      const invalidInput = getInvalidInputFromMessage(message);

      errors.push({
        line,
        column: charPositionInLine + 1,
        message,
        recovery: `Skipped invalid input "${invalidInput}" and continued scanning from the next character.`,
      });
    },
  };
}

function dumpLexerErrors(filePath: string, errors: LexerError[]): void {
  const lines = [
    `\nFile: ${filePath}`,
    `Lexical errors found: ${errors.length}`,
  ];

  if (errors.length === 0) {
    lines.push('No lexical errors found.');
  }

  for (const error of errors) {
    lines.push(
      `Error found in line ${error.line} column ${error.column}: ${error.message}`,
    );
    lines.push(`Recovery: ${error.recovery}`);
  }

  appendFileSync(errorDumpFilePath, `${lines.join('\n')}\n`, 'utf8');
}

function printScannerResult(filePath: string, exampleNumber: number): void {
  const sourceCode = readFileSync(filePath, 'utf8');
  const lexerErrors: LexerError[] = [];
  const lexer = new AstigLangLexer(CharStreams.fromString(sourceCode));

  lexer.removeErrorListeners();
  lexer.addErrorListener(createLexerErrorListener(lexerErrors));

  const startTime = process.hrtime.bigint();
  const tokens = lexer.getAllTokens();
  const endTime = process.hrtime.bigint();
  const elapsedMs = Number(endTime - startTime) / 1_000_000;

  emitOutput(`\n${exampleNumber}. ${filePath}`);
  if (scannerDemoDescriptions[filePath]) {
    emitOutput(scannerDemoDescriptions[filePath]);
  }
  emitOutput('============');
  emitOutput('Input Preview:');
  emitOutput('============');
  emitOutput(sourceCode.split('\n').slice(0, 8).join('\n'));
  emitOutput('...');
  emitOutput('\n============');
  emitOutput('Output:');
  emitOutput('============');

  for (const token of tokens.slice(0, maxDisplayedTokens)) {
    const tokenText = formatTokenText(token.text ?? '');
    const tokenName = getTokenName(token.type);

    emitOutput(
      `${tokenName} Token "${tokenText}" found in line ${token.line} column ${
        token.charPositionInLine + 1
      }`,
    );
  }

  if (tokens.length > maxDisplayedTokens) {
    emitOutput(
      `... ${tokens.length - maxDisplayedTokens} more tokens hidden for readability`,
    );
  }

  if (lexerErrors.length > 0) {
    emitOutput('\nLexical Errors:');

    for (const error of lexerErrors.slice(0, 20)) {
      emitOutput(
        `Error found in line ${error.line} column ${error.column}: ${error.message}`,
      );
      emitOutput(`Recovery: ${error.recovery}`);
    }

    if (lexerErrors.length > 20) {
      emitOutput(
        `... ${lexerErrors.length - 20} more errors hidden for readability`,
      );
    }
  } else {
    emitOutput('\nLexical Errors: none');
  }

  emitOutput('\nScanner Speed:');
  emitOutput(`Lines scanned: ${sourceCode.split('\n').length - 1}`);
  emitOutput(`Characters scanned: ${sourceCode.length}`);
  emitOutput(`Tokens produced: ${tokens.length}`);
  emitOutput(`Lexical errors found: ${lexerErrors.length}`);
  emitOutput(`Scan time: ${elapsedMs.toFixed(3)} ms`);

  dumpLexerErrors(filePath, lexerErrors);
}

function runScannerDemo(): void {
  outputLines.length = 0;
  emitOutput('Scanner / Lexer File Demo');
  emitOutput('========================');
  writeFileSync(
    errorDumpFilePath,
    'Scanner Error Dump\n==================\n',
    'utf8',
  );

  for (const [fileIndex, filePath] of scannerDemoFiles.entries()) {
    printScannerResult(filePath, fileIndex + 1);
  }

  emitOutput(`\nError dump written to ${errorDumpFilePath}`);
  emitOutput(`Scanner output written to ${outputDumpFilePath}`);
  writeFileSync(outputDumpFilePath, `${outputLines.join('\n')}\n`, 'utf8');
}

runScannerDemo();
