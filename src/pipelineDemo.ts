/**
 * Unified pipeline demo — Lexer → Parser → AST → Interpreter
 *
 * Run: npm run pipeline
 *
 * Writes to `text-files/`:
 *   scanner-output.txt
 *   scanner-error-dump.txt
 *   parse.txt
 *   ast.txt
 *   interpreter-output.txt
 *   pipeline-output.txt   (all phases combined, per file)
 */
import { ANTLRErrorListener, CharStreams } from 'antlr4ts';
import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { AstigLangLexer } from '../generated/grammar/AstigLangLexer';
import { buildAst } from './ast';
import { runProgram } from './interpreter';
import {
  finalizeStandaloneProgram,
  loadProgram,
  parseProgramSource,
} from './programLoader';
import {
  pipelineDemoFiles,
  pipelineDemoNeedsStdin,
} from './pipelineDemoFiles';
import { typeCheckProgram } from './typeChecker';
import { formatDiagnostic, humanizeAntlrMessage } from './utils/diagnostics';
import { formatProgramAst, formatProgramAstJson } from './utils/formatAst';
import { formatParseTree } from './utils/formatParseTree';
import { parseSourceWithDiagnostics } from './utils/parseWithDiagnostics';

const TEXT_FILES_DIR = 'text-files';

const OUTPUT_FILES = {
  scanner: 'scanner-output.txt',
  scannerErrors: 'scanner-error-dump.txt',
  parse: 'parse.txt',
  ast: 'ast.txt',
  interpret: 'interpreter-output.txt',
  pipeline: 'pipeline-output.txt',
} as const;

function ensureTextFilesDir(): void {
  mkdirSync(TEXT_FILES_DIR, { recursive: true });
}

function textFilePath(filename: string): string {
  return join(TEXT_FILES_DIR, filename);
}

const maxDisplayedTokens = 60;
const sourcePreviewLines = 10;

type LexerError = {
  line: number;
  column: number;
  message: string;
  hint?: string;
  recovery: string;
};

type FilePipelineResult = {
  filePath: string;
  description: string;
  scanSection: string;
  parseSection: string;
  astSection: string;
  interpretSection: string;
  combinedSection: string;
  lexerErrors: LexerError[];
};

function getTokenName(tokenType: number): string {
  return AstigLangLexer.VOCABULARY.getDisplayName(tokenType);
}

function formatTokenText(text: string): string {
  const escapedText = text
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t');
  return escapedText.length > 50
    ? `${escapedText.slice(0, 47)}...`
    : escapedText;
}

function sourcePreview(source: string): string[] {
  return [
    'Source preview:',
    ...source.split('\n').slice(0, sourcePreviewLines).map((line) => `  ${line}`),
    '  ...',
  ];
}

function createLexerErrorListener(errors: LexerError[]): ANTLRErrorListener<number> {
  return {
    syntaxError: (
      _recognizer,
      _offendingSymbol,
      line,
      charPositionInLine,
      message,
    ) => {
      const match = message.match(/at: '([\s\S]*)'$/);
      const invalidInput = match ? formatTokenText(match[1]) : 'unknown input';
      const { message: friendlyMessage, hint } = humanizeAntlrMessage(message);
      errors.push({
        line,
        column: charPositionInLine + 1,
        message: friendlyMessage,
        hint,
        recovery: `Skipped invalid input "${invalidInput}" and continued scanning.`,
      });
    },
  };
}

function buildScanSection(source: string, filePath: string): {
  section: string;
  errors: LexerError[];
} {
  const lexerErrors: LexerError[] = [];
  const lexer = new AstigLangLexer(CharStreams.fromString(source));
  lexer.removeErrorListeners();
  lexer.addErrorListener(createLexerErrorListener(lexerErrors));

  const startTime = process.hrtime.bigint();
  const tokens = lexer.getAllTokens();
  const elapsedMs = Number(process.hrtime.bigint() - startTime) / 1_000_000;

  const lines: string[] = [
    'PHASE 1 — LEXER (Scanner)',
    '-------------------------',
    ...sourcePreview(source),
    '',
    `Tokens (${tokens.length} total, showing first ${maxDisplayedTokens}):`,
  ];

  for (const token of tokens.slice(0, maxDisplayedTokens)) {
    lines.push(
      `  ${getTokenName(token.type)} "${formatTokenText(token.text ?? '')}" @ line ${token.line} col ${token.charPositionInLine + 1}`,
    );
  }

  if (tokens.length > maxDisplayedTokens) {
    lines.push(`  ... ${tokens.length - maxDisplayedTokens} more tokens`);
  }

  if (lexerErrors.length === 0) {
    lines.push('', 'Lexical errors: none');
  } else {
    lines.push('', `Lexical errors: ${lexerErrors.length}`);
    for (const error of lexerErrors.slice(0, 10)) {
      lines.push(
        `  line ${error.line} col ${error.column}: ${error.message}`,
      );
    }
  }

  lines.push(
    '',
    `Scan time: ${elapsedMs.toFixed(3)} ms`,
    `Characters: ${source.length}`,
  );

  return { section: lines.join('\n'), errors: lexerErrors };
}

function buildParseSection(source: string, filePath: string): string {
  const result = parseSourceWithDiagnostics(source, filePath);
  const lines: string[] = [
    'PHASE 2 — PARSER',
    '----------------',
    `Syntax errors: ${result.syntaxErrors}`,
  ];

  if (result.diagnostics.length > 0) {
    lines.push(
      '',
      ...result.diagnostics.map((diagnostic) =>
        formatDiagnostic(diagnostic, source),
      ),
    );
  }

  lines.push(
    '',
    'Parse tree:',
    result.syntaxErrors === 0
      ? formatParseTree(result.parseTree)
      : '(skipped — fix syntax errors first)',
  );

  return lines.join('\n');
}

function buildAstSection(source: string, filePath: string): string {
  const result = parseSourceWithDiagnostics(source, filePath);
  const lines: string[] = [
    'PHASE 3 — AST (buildAst)',
    '------------------------',
    `Syntax errors: ${result.syntaxErrors}`,
  ];

  if (result.syntaxErrors > 0) {
    lines.push('', 'AST:', '(skipped — fix syntax errors first)');
    return lines.join('\n');
  }

  const program = finalizeStandaloneProgram(buildAst(result.tree));
  lines.push(
    '',
    'ProgramNode (ASCII tree):',
    formatProgramAst(program),
    '',
    'ProgramNode (JSON):',
    formatProgramAstJson(program),
  );
  return lines.join('\n');
}

function loadDemoProgram(filePath: string, source: string) {
  if (source.includes('iHNcHLuHD3s')) {
    return loadProgram(source, dirname(filePath), filePath);
  }

  const parseResult = parseProgramSource(source, filePath);
  if (parseResult.syntaxErrors > 0) {
    throw new Error(`Syntax errors in ${filePath}`);
  }

  return finalizeStandaloneProgram(buildAst(parseResult.tree));
}

function buildInterpretSection(
  source: string,
  filePath: string,
): string {
  const lines: string[] = [
    'PHASE 4 — TYPE CHECK + INTERPRETER',
    '----------------------------------',
  ];

  if (pipelineDemoNeedsStdin.has(filePath)) {
    lines.push(
      'Skipped: this demo uses scH4nz (stdin). Run manually:',
      `  npm start -- ${filePath}`,
      '',
      'Example input: 42',
    );
    return lines.join('\n');
  }

  try {
    const program = loadDemoProgram(filePath, source);
    typeCheckProgram(program, filePath);
    const output = runProgram(program);

    lines.push('Type check: passed', '', 'Print output:');
    if (output.length === 0) {
      lines.push('  (none)');
    } else {
      output.forEach((line, index) => {
        lines.push(`  [${index + 1}] ${line}`);
      });
    }
  } catch (error) {
    lines.push('Failed:', '');
    lines.push(
      `  ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  return lines.join('\n');
}

function processFile(
  filePath: string,
  description: string,
  index: number,
): FilePipelineResult {
  const source = readFileSync(filePath, 'utf8');
  const header = [
    `${'='.repeat(72)}`,
    `Example ${index + 1}: ${filePath}`,
    description,
    `${'='.repeat(72)}`,
    '',
  ].join('\n');

  const { section: scanSection, errors: lexerErrors } = buildScanSection(
    source,
    filePath,
  );
  const parseSection = buildParseSection(source, filePath);
  const astSection = buildAstSection(source, filePath);
  const interpretSection = buildInterpretSection(source, filePath);

  const combinedSection = [
    header,
    scanSection,
    '',
    parseSection,
    '',
    astSection,
    '',
    interpretSection,
    '',
  ].join('\n');

  return {
    filePath,
    description,
    scanSection: [header, scanSection, ''].join('\n'),
    parseSection: [header, parseSection, ''].join('\n'),
    astSection: [header, astSection, ''].join('\n'),
    interpretSection: [header, interpretSection, ''].join('\n'),
    combinedSection,
    lexerErrors,
  };
}

function writeLexerErrorDump(results: FilePipelineResult[]): void {
  const lines = ['Scanner Error Dump', '==================', ''];

  for (const result of results) {
    lines.push(`File: ${result.filePath}`);
    lines.push(`Lexical errors: ${result.lexerErrors.length}`);
    if (result.lexerErrors.length === 0) {
      lines.push('No lexical errors.');
    } else {
      for (const error of result.lexerErrors) {
        lines.push(
          `  line ${error.line} col ${error.column}: ${error.message}`,
        );
      }
    }
    lines.push('');
  }

  writeFileSync(
    textFilePath(OUTPUT_FILES.scannerErrors),
    lines.join('\n'),
    'utf8',
  );
}

/** Runs the full pipeline demo and writes all output `.txt` files. */
export function runPipelineDemo(): void {
  ensureTextFilesDir();

  const results = pipelineDemoFiles.map((file, index) =>
    processFile(file.path, file.description, index),
  );

  const outputListing = Object.values(OUTPUT_FILES).map(
    (name) => `  text-files/${name}`,
  );

  const intro = [
    'AstigLang Pipeline Demo',
    '=======================',
    '',
    'Source → Lexer → Parser → AST → Type check → Interpreter',
    '',
    'Sample files:',
    ...pipelineDemoFiles.map(
      (file, index) => `  ${index + 1}. ${file.path} — ${file.description}`,
    ),
    '',
  ].join('\n');

  const scanReport = [
    intro.replace('Pipeline Demo', 'Scanner / Lexer Demo'),
    ...results.map((result) => result.scanSection),
    `Written to text-files/${OUTPUT_FILES.scanner}`,
  ].join('\n');

  const parseReport = [
    intro.replace('Pipeline Demo', 'Parser Demo'),
    ...results.map((result) => result.parseSection),
    `Written to text-files/${OUTPUT_FILES.parse}`,
  ].join('\n');

  const astReport = [
    intro.replace('Pipeline Demo', 'AST Demo'),
    ...results.map((result) => result.astSection),
    `Written to text-files/${OUTPUT_FILES.ast}`,
  ].join('\n');

  const interpretReport = [
    intro.replace('Pipeline Demo', 'Interpreter Demo'),
    ...results.map((result) => result.interpretSection),
    `Written to text-files/${OUTPUT_FILES.interpret}`,
  ].join('\n');

  const combinedReport = [
    intro,
    ...results.map((result) => result.combinedSection),
    'Output files:',
    ...outputListing,
    `  text-files/${OUTPUT_FILES.scannerErrors}`,
  ].join('\n');

  writeFileSync(textFilePath(OUTPUT_FILES.scanner), scanReport, 'utf8');
  writeLexerErrorDump(results);
  writeFileSync(textFilePath(OUTPUT_FILES.parse), parseReport, 'utf8');
  writeFileSync(textFilePath(OUTPUT_FILES.ast), astReport, 'utf8');
  writeFileSync(textFilePath(OUTPUT_FILES.interpret), interpretReport, 'utf8');
  writeFileSync(textFilePath(OUTPUT_FILES.pipeline), combinedReport, 'utf8');

  console.log(combinedReport);
  console.log('\n--- Files written to text-files/ ---');
  console.log(`  ${OUTPUT_FILES.pipeline}  (all phases — recommended for presentation)`);
  console.log(`  ${OUTPUT_FILES.scanner}`);
  console.log(`  ${OUTPUT_FILES.parse}`);
  console.log(`  ${OUTPUT_FILES.ast}`);
  console.log(`  ${OUTPUT_FILES.interpret}`);
  console.log(`  ${OUTPUT_FILES.scannerErrors}`);
}

if (require.main === module) {
  runPipelineDemo();
}
