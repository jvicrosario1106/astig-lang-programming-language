/**
 * AstigLang compiler driver: parse → AST → type check → interpret.
 *
 * Usage:
 *   npm start                         — runs built-in sample code
 *   npm start -- path/to/program.stg  — loads file and resolves includes
 *
 * For scanner-only demos, use `npm run scan` (`src/scanner.ts`).
 */
import { existsSync, readFileSync } from 'fs';
import { basename, dirname, resolve } from 'path';
import { buildAst } from './ast';
import { runProgram } from './interpreter';
import { TypeCheckError } from './classes/TypeCheckError';
import { loadProgram, parseProgramSource, finalizeStandaloneProgram } from './programLoader';
import { typeCheckProgram } from './typeChecker';

const defaultCode = `
fHUncTH!0Ns mHA1Ns() {
  vH4rs nH4mH3s:sTRh1Ngz = "Hello";
  vH4rs cH0uHNtHs:iHNtSZ = 10;
  pHR!HNTs(nH4mH3s);
}
`;

// e.g npm start demo-examples/include-main.stg 

const inputArg = process.argv.slice(2).join(' ');
const sourcePath = inputArg && existsSync(inputArg) ? resolve(inputArg) : undefined;
const sourceCode = sourcePath ? readFileSync(sourcePath, 'utf8') : defaultCode;
const baseDirectory = sourcePath ? dirname(sourcePath) : process.cwd();

const { tree, syntaxErrors } = parseProgramSource(sourceCode);

if (syntaxErrors > 0) {
  process.exitCode = 1;
} else {
  const ast = sourcePath
    ? loadProgram(sourceCode, baseDirectory, basename(sourcePath))
    : finalizeStandaloneProgram(buildAst(tree));

  try {
    typeCheckProgram(ast);
  } catch (error) {
    if (error instanceof TypeCheckError) {
      console.error(`Type error: ${error.message}`);
      process.exitCode = 1;
    } else if (error instanceof Error) {
      console.error(error.message);
      process.exitCode = 1;
    } else {
      throw error;
    }
  }

  if (process.exitCode === 1) {
    process.exit(1);
  }

  const output = runProgram(ast);

  console.log('Output:');
  console.log(output.join('\n'));
}
