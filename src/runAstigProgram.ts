import { buildAst } from './ast';
import { ParseError } from './classes/ParseError';
import { RuntimeError } from './classes/RuntimeError';
import { RuntimeErrors } from './classes/RuntimeErrors';
import { TypeCheckError } from './classes/TypeCheckError';
import { TypeCheckErrors } from './classes/TypeCheckErrors';
import { runProgram } from './interpreter';
import { optimizeProgram } from './optimizer';
import { ProgramNode } from './models/ProgramNode';
import {
  RuntimeDebugSession,
  writeRuntimeDebugFile,
} from './classes/RuntimeDebugger';
import {
  finalizeStandaloneProgram,
  loadProgram,
  parseProgramSource,
} from './programLoader';
import { typeCheckProgram } from './typeChecker';
import {
  diagnosticFromError,
  formatDiagnostic,
  getErrorSourceLocation,
  reportDiagnostics,
  SourceDiagnostic,
} from './utils/diagnostics';
import {
  ProgramInput,
  readInteractiveSourceBlock,
} from './utils/readProgramSource';
import { relative } from 'path';

const replFilename = '<interactive>';

/** REPL: type code, empty line to run, repeat; empty submit with no code exits. */
export function runInteractiveRepl(): void {
  let isFirstPrompt = true;
  let hasRunCode = false;

  while (true) {
    const sourceCode = readInteractiveSourceBlock(isFirstPrompt);
    isFirstPrompt = false;

    if (sourceCode === null) {
      console.log(hasRunCode ? 'Bye.' : 'No code entered.');
      return;
    }

    hasRunCode = true;
    executeProgram({
      sourceCode,
      programFilename: replFilename,
      baseDirectory: process.cwd(),
    });
    console.log('');
  }
}

/** Parses, type-checks, and runs one program. Returns process exit code. */
export function executeProgram(programInput: ProgramInput): number {
  const { sourceCode, programFilename } = programInput;

  const parseResult = parseProgramSource(sourceCode, programFilename);
  if (parseResult.syntaxErrors > 0) {
    reportDiagnostics(parseResult.diagnostics, sourceCode, {
      showRecoveryNote: parseResult.diagnostics.length > 0,
    });
    return 1;
  }

  try {
    // Build the AST
    const ast = buildProgramAst(programInput, parseResult.tree);

    // Collect type diagnostics
    const typeDiagnostics = collectTypeDiagnostics(ast, programFilename);

    // Optimize the AST
    const optimizedAst = optimizeProgram(ast);

    // Run the program
    return runWithDiagnostics(
      optimizedAst,
      sourceCode,
      programFilename,
      typeDiagnostics,
      programInput,
    );
  } catch (error) {
    reportExecutionError(error, sourceCode, programFilename);
    return 1;
  }
}

function buildProgramAst(
  programInput: ProgramInput,
  parseTree: Parameters<typeof buildAst>[0],
): ProgramNode {
  if (programInput.sourcePath) {
    return loadProgram(
      programInput.sourceCode,
      programInput.baseDirectory,
      programInput.programFilename,
    );
  }

  return finalizeStandaloneProgram(buildAst(parseTree));
}

function collectTypeDiagnostics(
  ast: ProgramNode,
  filename: string,
): SourceDiagnostic[] {
  try {
    typeCheckProgram(ast, filename);
    return [];
  } catch (error) {
    if (error instanceof TypeCheckErrors) {
      return error.diagnostics;
    }
    throw error;
  }
}

function runWithDiagnostics(
  ast: ProgramNode,
  sourceCode: string,
  programFilename: string,
  typeDiagnostics: SourceDiagnostic[],
  programInput: ProgramInput,
): number {
  const debugSession = programInput.sourcePath
    ? new RuntimeDebugSession()
    : undefined;
  const debugSourceLabel = programInput.sourcePath
    ? relative(process.cwd(), programInput.sourcePath)
    : programFilename;

  try {
    const output = runProgram(ast, programFilename, true, debugSession);

    if (debugSession) {
      const debugPath = writeRuntimeDebugFile(
        debugSession.formatReport(debugSourceLabel, output),
      );
      console.log(`Runtime debug written to ${debugPath}`);
    }

    if (typeDiagnostics.length > 0) {
      reportDiagnostics(typeDiagnostics, sourceCode, { showRecoveryNote: true });
      return 1;
    }

    console.log('Output:');
    console.log(output.join('\n'));
    return 0;
  } catch (error) {
    if (debugSession) {
      debugSession.setError(
        error instanceof Error ? error.message : String(error),
      );
      const debugPath = writeRuntimeDebugFile(
        debugSession.formatReport(debugSourceLabel, []),
      );
      console.log(`Runtime debug written to ${debugPath}`);
    }

    if (error instanceof RuntimeErrors) {
      reportDiagnostics(
        [...typeDiagnostics, ...error.diagnostics],
        sourceCode,
        { showRecoveryNote: true },
      );
      return 1;
    }

    const runtimeDiagnostic = toRuntimeDiagnostic(error, programFilename);
    if (typeDiagnostics.length > 0 || runtimeDiagnostic) {
      reportDiagnostics(
        runtimeDiagnostic
          ? [...typeDiagnostics, runtimeDiagnostic]
          : typeDiagnostics,
        sourceCode,
        { showRecoveryNote: true },
      );
      return 1;
    }

    reportExecutionError(error, sourceCode, programFilename);
    return 1;
  }
}

function toRuntimeDiagnostic(
  error: unknown,
  filename: string,
): SourceDiagnostic | undefined {
  if (error instanceof RuntimeError) {
    return diagnosticFromError(error, 'runtime', filename, error.location);
  }

  if (error instanceof Error) {
    const phase = error.message.includes('Include file') ? 'include' : 'runtime';
    return diagnosticFromError(
      error,
      phase,
      filename,
      getErrorSourceLocation(error),
    );
  }

  return undefined;
}

export function reportExecutionError(
  error: unknown,
  sourceCode: string,
  programFilename: string,
): void {
  if (error instanceof ParseError) {
    reportDiagnostics(error.diagnostics, error.source);
    return;
  }

  if (error instanceof TypeCheckErrors || error instanceof RuntimeErrors) {
    reportDiagnostics(error.diagnostics, sourceCode, { showRecoveryNote: true });
    return;
  }

  if (error instanceof TypeCheckError) {
    console.error(
      formatDiagnostic(
        diagnosticFromError(error, 'type', programFilename, error.location),
        sourceCode,
      ),
    );
    return;
  }

  if (error instanceof RuntimeError) {
    console.error(
      formatDiagnostic(
        diagnosticFromError(error, 'runtime', programFilename, error.location),
        sourceCode,
      ),
    );
    return;
  }

  if (error instanceof Error) {
    console.error(error.message);
    return;
  }

  throw error;
}
