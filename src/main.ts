// e.g npm start demo-examples/include-main.stg
import { existsSync, readFileSync } from 'fs';
import { basename, dirname, resolve } from 'path';
import { buildAst } from './ast';
import { ParseError } from './classes/ParseError';
import { RuntimeError } from './classes/RuntimeError';
import { RuntimeErrors } from './classes/RuntimeErrors';
import { TypeCheckError } from './classes/TypeCheckError';
import { TypeCheckErrors } from './classes/TypeCheckErrors';
import { runProgram } from './interpreter';
import { ProgramNode } from './models/ProgramNode';
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

const defaultCode = `
fHUncTH!0Ns mHA1Ns() {
  vH4rs nH4mH3s:sTRh1Ngz = "Hello";
  vH4rs cH0uHNtHs:iHNtSZ = 10;
  pHR!HNTs(nH4mH3s);
}
`;

// e.g npm start test-files/<filename>.stg
const inputArg = process.argv.slice(2).join(' ');
const sourcePath = inputArg && existsSync(inputArg) ? resolve(inputArg) : undefined;
const sourceCode = sourcePath ? readFileSync(sourcePath, 'utf8') : defaultCode;
const baseDirectory = sourcePath ? dirname(sourcePath) : process.cwd();
const programFilename = sourcePath ? basename(sourcePath) : '<stdin>';
const parseResult = parseProgramSource(sourceCode, programFilename);

if (parseResult.syntaxErrors > 0) {
  // Report syntax errors and exit with error code 1.
  reportDiagnostics(parseResult.diagnostics, sourceCode, { showRecoveryNote: parseResult.diagnostics.length > 0, });
  process.exit(1);
}

// Try to type check and run the program.
try {
  const ast = sourcePath
    ? loadProgram(sourceCode, baseDirectory, programFilename)
    : finalizeStandaloneProgram(buildAst(parseResult.tree));

  const typeDiagnostics = runTypeCheck(ast, programFilename);

  try {
    const output = runProgram(ast, programFilename);

    if (typeDiagnostics.length > 0) {
      reportDiagnostics(typeDiagnostics, sourceCode, { showRecoveryNote: true });
      process.exit(1);
    }

    console.log('Output:');
    console.log(output.join('\n'));
  } catch (runtimeError) {
    if (runtimeError instanceof RuntimeErrors) {
      reportDiagnostics(
        [...typeDiagnostics, ...runtimeError.diagnostics],
        sourceCode,
        { showRecoveryNote: true },
      );
      process.exit(1);
    }

    if (typeDiagnostics.length > 0) {
      const runtimeDiagnostic = toRuntimeDiagnostic(
        runtimeError,
        programFilename,
      );
      reportDiagnostics(
        runtimeDiagnostic
          ? [...typeDiagnostics, runtimeDiagnostic]
          : typeDiagnostics,
        sourceCode,
        { showRecoveryNote: true },
      );
      process.exit(1);
    }

    reportErrors(runtimeError);
    process.exit(1);
  }
} catch (error) {
  reportErrors(error);
  process.exit(1);
}

/** Type-checks the program and returns collected diagnostics (recovery mode). */
function runTypeCheck(
  ast: ProgramNode,
  programFilename: string,
): SourceDiagnostic[] {
  try {
    typeCheckProgram(ast, programFilename);
    return [];
  } catch (error) {
    if (error instanceof TypeCheckErrors) {
      return error.diagnostics;
    }

    throw error;
  }
}

/** Builds a runtime-phase diagnostic from a thrown value, when possible. */
function toRuntimeDiagnostic(
  error: unknown,
  programFilename: string,
): SourceDiagnostic | undefined {
  if (error instanceof RuntimeError) {
    return diagnosticFromError(error, 'runtime', programFilename, error.location);
  }

  if (error instanceof Error) {
    const phase = classifyErrorPhase(error.message);
    return diagnosticFromError(
      error,
      phase,
      programFilename,
      getErrorSourceLocation(error),
    );
  }

  return undefined;
}


// Report errors to the console.
function reportErrors(error: unknown): void {

  if (error instanceof ParseError) {
    // Report syntax errors.
    reportDiagnostics(error.diagnostics, error.source);
    return;
  }

  if (error instanceof TypeCheckErrors) {
    // Report type check errors.
    reportDiagnostics(error.diagnostics, sourceCode, { showRecoveryNote: true });
    return;
  }

  if (error instanceof RuntimeErrors) {
    reportDiagnostics(error.diagnostics, sourceCode, { showRecoveryNote: true });
    return;
  }

  if (error instanceof TypeCheckError) {
    // Report type check errors.
    console.error(
      formatDiagnostic(
        diagnosticFromError(error, 'type', programFilename, error.location),
        sourceCode,
      ),
    );
    return;
  }

  if (error instanceof RuntimeError) {
    // Report runtime errors.
    console.error(
      formatDiagnostic(
        diagnosticFromError(error, 'runtime', programFilename, error.location),
        sourceCode,
      ),
    );
    return;
  }

  if (error instanceof Error) {
    const phase = classifyErrorPhase(error.message);
    // Report other errors.
    console.error(
      formatDiagnostic(
        diagnosticFromError(error, phase, programFilename),
        sourceCode,
      ),
    );
    return;
  }

  throw error;
}

// Classify the error phase.
function classifyErrorPhase(message: string): 'include' | 'runtime' {
  if (
    message.includes('Include file') ||
    message.includes('Circular include') ||
    message.includes('Include file not found')
  ) {
    return 'include';
  }

  return 'runtime';
}
