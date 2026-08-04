import { RuntimeValue } from '../models/RuntimeValue';
import { ResolvedType } from '../models/ResolvedType';
import {
  DeclarationKind,
  FunctionDeclarationNode,
} from '../models/StatementNode';
import { AstigType } from '../models/AstigType';

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
  ) {}

  createBlockScope(): RuntimeEnvironment {
    return new RuntimeEnvironment(this);
  }

  createFunctionScope(): RuntimeEnvironment {
    return new RuntimeEnvironment(this, true);
  }

  declare(
    kind: DeclarationKind,
    name: string,
    value: RuntimeValue,
    resolvedType: ResolvedType = { kind: 'primitive', type: AstigType.Any },
  ): void {
    if (this.bindings.has(name)) {
      throw new Error(`Cannot redeclare variable "${name}"`);
    }

    this.bindings.set(name, { kind, value, isInitialized: true, resolvedType });
  }

  assign(name: string, value: RuntimeValue | HeapReference): void {
    const environment = this.findEnvironmentWithBinding(name);
    if (!environment) {
      throw new Error(`Undefined variable "${name}"`);
    }

    const binding = environment.bindings.get(name);
    if (!binding) {
      throw new Error(`Undefined variable "${name}"`);
    }

    if (binding.kind === 'const') {
      throw new Error(`Cannot assign to const variable "${name}"`);
    }

    binding.value = value;
    binding.isInitialized = true;
  }

  get(name: string): RuntimeValue | HeapReference {
    return this.getBinding(name).value;
  }

  getVariableKind(name: string): DeclarationKind {
    return this.getBinding(name).kind;
  }

  getResolvedType(name: string): ResolvedType {
    return this.getBinding(name).resolvedType;
  }

  private getBinding(name: string): RuntimeBinding {
    const environment = this.findEnvironmentWithBinding(name);
    const binding = environment?.bindings.get(name);
    if (!binding) {
      throw new Error(`Undefined variable "${name}"`);
    }

    if (!binding.isInitialized) {
      throw new Error(`Variable '${name}' is used before being assigned.`);
    }

    return binding;
  }

  declareFunction(functionNode: FunctionDeclarationNode): void {
    if (this.functions.has(functionNode.name)) {
      throw new Error(`Cannot redeclare function "${functionNode.name}"`);
    }

    this.functions.set(functionNode.name, functionNode);
  }

  getFunction(name: string): FunctionDeclarationNode {
    const environment = this.findEnvironmentWithFunction(name);
    const functionNode = environment?.functions.get(name);
    if (!functionNode) {
      throw new Error(`Undefined function "${name}"`);
    }

    return functionNode;
  }

  lookup(name: string): RuntimeValue | HeapReference {
    // Check if variable is extisting in the current scope block
    if(this.bindings.has(name)){
      return this.bindings.get(name)!.value;
    }

    if (this.parent){
      return this.parent.lookup(name);
    }
    
    // const environment = this.findEnvironmentWithBinding(name);
    // if (!environment) {
    //   throw new Error(`Undefined variable "${name}"`);
    // }
    
    // const binding = environment.bindings.get(name)!;
    // if (!binding.isInitialized) {
    //   throw new Error(`Variable '${name}' is used before being assigned.`);
    // }
    
    // return binding.value;

    throw new Error(`Undefined variable "${name}"`);
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
