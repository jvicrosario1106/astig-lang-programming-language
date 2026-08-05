import {
  ConstAssignmentError,
  RedeclarationError,
  UndefinedFunctionError,
  UndefinedVariableError,
  UninitializedVariableError,
} from './RuntimeExceptions';
import { RuntimeValue } from '../models/RuntimeValue';
import { ResolvedType } from '../models/ResolvedType';
import {
  DeclarationKind,
  FunctionDeclarationNode,
} from '../models/StatementNode';
import { AstigType } from '../models/AstigType';
import { HeapEmulator } from './HeapEmulator';
import { formatResolvedType } from '../utils/astigTypeUtils';
import { formatRuntimeValue } from '../utils/formatRuntimeValue';
import type { ScopeSnapshot, VariableSnapshot } from './RuntimeDebugger';

type RuntimeBinding = {
  kind: DeclarationKind;
  value: RuntimeValue | HeapReference;
  isInitialized: boolean;
  resolvedType: ResolvedType;
};

export interface HeapReference {
  isHeapReference: true;
  address: number;
}

/**
 * RuntimeEnvironment models the interpreter's lexical scope at runtime.
 *
 * `const`, `var`, and `let` are all block-scoped: a declaration inside `{ ... }`
 * is not visible outside that block. Function parameters and outer scopes are
 * reached only by walking the parent chain during lookup.
 */
export class RuntimeEnvironment {
  // Symbol Table
  private readonly bindings = new Map<string, RuntimeBinding>();
  private readonly functions = new Map<string, FunctionDeclarationNode>();

  constructor(
    private readonly parent?: RuntimeEnvironment,
    private readonly isFunctionScope = false,
    private readonly scopeName = 'global',
  ) {}

  createBlockScope(): RuntimeEnvironment {
    return new RuntimeEnvironment(this, false, 'block');
  }

  createFunctionScope(functionName = 'function'): RuntimeEnvironment {
    return new RuntimeEnvironment(this, true, functionName);
  }

  /** Outermost-first scope chain ending at the current (innermost) scope. */
  getScopeChain(): RuntimeEnvironment[] {
    const chain: RuntimeEnvironment[] = [];
    let current: RuntimeEnvironment | undefined = this;

    while (current) {
      chain.unshift(current);
      current = current.parent;
    }

    return chain;
  }

  /** Snapshot of bindings and functions declared in this scope level only. */
  snapshot(heap: HeapEmulator): ScopeSnapshot {
    const variables: VariableSnapshot[] = [...this.bindings.entries()]
      .sort(([leftName], [rightName]) => leftName.localeCompare(rightName))
      .map(([name, binding]) => ({
        name,
        kind: binding.kind,
        type: formatResolvedType(binding.resolvedType),
        value: binding.isInitialized
          ? formatRuntimeValue(binding.value, heap)
          : '(uninitialized)',
        initialized: binding.isInitialized,
      }));

    const functions = [...this.functions.keys()].sort((left, right) =>
      left.localeCompare(right),
    );

    return {
      scopeName: this.scopeName,
      isFunctionScope: this.isFunctionScope,
      variables,
      functions,
    };
  }

  declare(
    kind: DeclarationKind,
    name: string,
    value: RuntimeValue | HeapReference,
    resolvedType: ResolvedType = { kind: 'primitive', type: AstigType.Any },
  ): void {
    if (this.bindings.has(name)) {
      throw new RedeclarationError(name);
    }

    this.bindings.set(name, { kind, value, isInitialized: true, resolvedType });
  }

  declareUninitialized(
    kind: DeclarationKind,
    name: string,
    resolvedType: ResolvedType,
  ): void {
    if (this.bindings.has(name)) {
      throw new RedeclarationError(name);
    }

    this.bindings.set(name, {
      kind,
      value: defaultPlaceholderValue(resolvedType),
      isInitialized: false,
      resolvedType,
    });
  }

  assign(name: string, value: RuntimeValue | HeapReference): void {
    const environment = this.findEnvironmentWithBinding(name);
    if (!environment) {
      throw new UndefinedVariableError(name);
    }

    const binding = environment.bindings.get(name);
    if (!binding) {
      throw new UndefinedVariableError(name);
    }

    if (binding.kind === 'const') {
      throw new ConstAssignmentError(name);
    }

    binding.value = value;
    binding.isInitialized = true;
  }

  get(name: string): RuntimeValue | HeapReference {
    return this.getBinding(name).value;
  }

  getVariableKind(name: string): DeclarationKind {
    return this.getBinding(name, false).kind;
  }

  getResolvedType(name: string): ResolvedType {
    return this.getBinding(name, false).resolvedType;
  }

  private getBinding(name: string, requireInitialized = true): RuntimeBinding {
    const environment = this.findEnvironmentWithBinding(name);
    const binding = environment?.bindings.get(name);
    if (!binding) {
      throw new UndefinedVariableError(name);
    }

    if (requireInitialized && !binding.isInitialized) {
      throw new UninitializedVariableError(name);
    }

    return binding;
  }

  declareFunction(functionNode: FunctionDeclarationNode): void {
    if (this.functions.has(functionNode.name)) {
      throw new RedeclarationError(functionNode.name, 'function');
    }

    this.functions.set(functionNode.name, functionNode);
  }

  getFunction(name: string): FunctionDeclarationNode {
    const environment = this.findEnvironmentWithFunction(name);
    const functionNode = environment?.functions.get(name);
    if (!functionNode) {
      throw new UndefinedFunctionError(name);
    }

    return functionNode;
  }

  lookup(name: string): RuntimeValue | HeapReference {
    return this.get(name);
  }

  private findEnvironmentWithBinding(
    name: string,
  ): RuntimeEnvironment | undefined {
    if (this.bindings.has(name)) {
      return this;
    }

    return this.parent?.findEnvironmentWithBinding(name);
  }

  private findEnvironmentWithFunction(
    name: string,
  ): RuntimeEnvironment | undefined {
    if (this.functions.has(name)) {
      return this;
    }

    return this.parent?.findEnvironmentWithFunction(name);
  }

  public collectActiveHeapAddresses(addresses: Set<number> = new Set()): Set<number> {
    // Scan all variable bindings in the current scope level
    for (const [key, binding] of this.bindings.entries()) {
      // Ensure the binding exists and has an initialized value
      if (binding && binding.isInitialized && binding.value) {
          const val = binding.value;
          // Check if the INNER value object is the HeapReference
          if (typeof val === 'object' && 'isHeapReference' in val) {
              addresses.add(Number(val.address));
          }
      }
    }

    // 2. Recursively crawl up the parent scope chain until reaching the global scope
    if (this.parent) {
      this.parent.collectActiveHeapAddresses(addresses);
    }

    return addresses;
}
}

function defaultPlaceholderValue(resolvedType: ResolvedType): RuntimeValue {
  if (resolvedType.kind === 'array') {
    return [];
  }

  if (resolvedType.kind === 'record') {
    return { recordTypeName: resolvedType.name, fields: new Map() };
  }

  if (resolvedType.kind === 'pointer') {
    return 0;
  }

  switch (resolvedType.type) {
    case AstigType.String:
    case AstigType.Char:
      return '';
    case AstigType.Boolean:
      return false;
    case AstigType.Float:
    case AstigType.Int:
      return 0;
    default:
      return 0;
  }
}
