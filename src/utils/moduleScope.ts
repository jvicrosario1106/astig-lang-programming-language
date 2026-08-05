/**
 * Module export visibility helpers.
 *
 * Library files keep all functions in `moduleFunctions`, but only `export`
 * functions are added to the global `program.functions` list. Same-file calls
 * use `withModuleFunctions` to see private helpers too.
 */
import { FunctionDeclarationNode } from '../models/StatementNode';

/** Minimal interface shared by TypeEnvironment and RuntimeEnvironment. */
export type ModuleScopeHost = {
  createFunctionScope(functionName?: string): ModuleScopeHost;
  declareFunction(functionNode: FunctionDeclarationNode): void;
};

/** Tags each function with its source `.stg` filename. */
export function tagModuleFunctions(
  functions: FunctionDeclarationNode[],
  sourceModule: string,
): FunctionDeclarationNode[] {
  return functions.map((functionNode) => ({
    ...functionNode,
    sourceModule,
  }));
}

/** Entry files expose all functions; library files expose only exported ones. */
export function publicModuleFunctions(
  functions: FunctionDeclarationNode[],
  sourceModule: string,
  isEntryFile: boolean,
): FunctionDeclarationNode[] {
  const taggedFunctions = tagModuleFunctions(functions, sourceModule);
  return isEntryFile ? taggedFunctions : taggedFunctions.filter((fn) => fn.isExported);
}

/**
 * Adds every function from `sourceModule` on top of `parent` so private helpers
 * in the same file remain callable.
 */
export function withModuleFunctions<T extends ModuleScopeHost>(
  parent: T,
  sourceModule: string | undefined,
  moduleFunctions: Record<string, FunctionDeclarationNode[]>,
): T {
  if (!sourceModule) {
    return parent;
  }

  const moduleFileFunctions = moduleFunctions[sourceModule];
  if (!moduleFileFunctions?.length) {
    return parent;
  }

  const moduleEnvironment = parent.createFunctionScope('module') as T;
  for (const functionNode of moduleFileFunctions) {
    moduleEnvironment.declareFunction(functionNode);
  }

  return moduleEnvironment;
}

/** Finds a function name declared in any included module. */
export function findFunctionInModules(
  name: string,
  moduleFunctions: Record<string, FunctionDeclarationNode[]>,
): FunctionDeclarationNode | undefined {
  for (const functions of Object.values(moduleFunctions)) {
    const match = functions.find((functionNode) => functionNode.name === name);
    if (match) {
      return match;
    }
  }

  return undefined;
}
