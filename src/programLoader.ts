/**
 * Parses AstigLang source files and resolves `include` directives.
 *
 * Only the **entry program file** (e.g. `main.stg`) may define `main` and is the
 * sole execution entry point. Included library files contribute records and
 * functions only — they must not define `main`.
 *
 * Cross-file function access follows export rules: only `export` functions from
 * a library file are visible outside that file. Same-file private helpers remain
 * callable within their module.
 */
import { existsSync, readFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { buildAst } from './ast';
import { ParseError } from './classes/ParseError';
import { ProgramNode } from './models/ProgramNode';
import { FunctionDeclarationNode } from './models/StatementNode';
import { publicModuleFunctions, tagModuleFunctions } from './utils/moduleScope';
import {
  parseSourceWithDiagnostics,
  ParseResult,
} from './utils/parseWithDiagnostics';

/** Lexes and parses source text, returning the parse tree, diagnostics, and error count. */
export function parseProgramSource(
  source: string,
  filename = '<input>',
): ParseResult {
  return parseSourceWithDiagnostics(source, filename);
}

function parseAndBuildAst(source: string, filename: string): ProgramNode {
  const result = parseProgramSource(source, filename);

  if (result.syntaxErrors > 0) {
    throw new ParseError(`Failed to parse ${filename}`, result.diagnostics, source);
  }

  return buildAst(result.tree);
}

/** Prepares a single-file program (no includes) for type check and interpretation. */
export function finalizeStandaloneProgram(program: ProgramNode): ProgramNode {
  const mainModule = 'main';
  
  // all functions are in the main module
  const moduleFunctions = {
    [mainModule]: tagModuleFunctions(program.functions, mainModule),
  };

  return {
    ...program,
    functions: moduleFunctions[mainModule],
    moduleFunctions,
    entryModule: mainModule,
  };
}

/**
 * Loads an entry program file, resolves includes, and validates that `main` exists
 * only on the entry file (not on any included module).
 */
export function loadProgram(
  source: string,
  baseDirectory: string,
  entryFilename: string,
): ProgramNode {
  const visitedFiles = new Set<string>();
  const program = parseAndBuildAst(source, entryFilename);
  
  const mergedProgram = mergeIncludedModules(
    program,
    baseDirectory,
    entryFilename,
    entryFilename,
    visitedFiles,
    true,
  );

  if (!mergedProgram.mainFunction) {
    throw new Error('Entry program file must define function main()');
  }

  return mergedProgram;
}

/**
 * Loads an included library module. Records and functions are merged into the
 * entry program; `main` must not appear in include files.
 */
function loadModule(
  source: string,
  baseDirectory: string,
  filename: string,
  entryModule: string,
  visitedFiles: Set<string>,
): ProgramNode {
  const program = parseAndBuildAst(source, filename);

  if (program.mainFunction) {
    throw new Error(
      `Include file "${filename}" must not define main; only the entry program file may define main`,
    );
  }

  return mergeIncludedModules(
    program,
    baseDirectory,
    filename,
    entryModule,
    visitedFiles,
    false,
  );
}

/**
 * Merges included modules into the program.
 */
function mergeIncludedModules(
  program: ProgramNode,
  baseDirectory: string,
  currentModule: string,
  entryModule: string,
  visitedFiles: Set<string>,
  isEntryFile: boolean,
): ProgramNode {
  const currentModuleFunctions = tagModuleFunctions(program.functions, currentModule);
  const mergedIncludes: ProgramNode['includes'] = [...program.includes];
  const mergedRecords = [...program.recordDeclarations];

  // Global callable list: entry file = all functions; library file = exported only.
  const mergedFunctions: FunctionDeclarationNode[] = publicModuleFunctions(
    program.functions,
    currentModule,
    isEntryFile,
  );

  // Full per-file list (includes private helpers for same-file lookup).
  const mergedModuleFunctions: Record<string, FunctionDeclarationNode[]> = {
    [currentModule]: currentModuleFunctions,
  };

  const mergedMain = isEntryFile ? program.mainFunction : undefined;

  for (const includeNode of program.includes) {
    const includePath = resolve(baseDirectory, includeNode.filename);

    if (visitedFiles.has(includePath)) {
      throw new Error(`Circular include detected for "${includeNode.filename}"`);
    }

    if (!existsSync(includePath)) {
      throw new Error(`Include file not found: "${includeNode.filename}"`);
    }

    visitedFiles.add(includePath);
    
    const includedSource = readFileSync(includePath, 'utf8');
    const includedModule = loadModule(
      includedSource,
      dirname(includePath),
      includeNode.filename,
      entryModule,
      visitedFiles,
    );
    visitedFiles.delete(includePath);

    mergedIncludes.push(...includedModule.includes);
    mergedRecords.push(...includedModule.recordDeclarations);
    mergedFunctions.push(...includedModule.functions);
    Object.assign(mergedModuleFunctions, includedModule.moduleFunctions);
  }

  return {
    type: 'Program',
    includes: mergedIncludes,
    recordDeclarations: mergedRecords,
    functions: mergedFunctions,
    moduleFunctions: mergedModuleFunctions,
    entryModule,
    mainFunction: mergedMain,
  };
}
