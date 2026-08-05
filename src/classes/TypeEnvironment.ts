import { ResolvedType } from '../models/ResolvedType';
import { DeclarationKind, FunctionDeclarationNode } from '../models/StatementNode';

type TypeBinding = {
  kind: DeclarationKind;
  resolvedType: ResolvedType;
};

/**
 * TypeEnvironment models lexical scope during static type checking.
 *
 * `const`, `var`, and `let` are all block-scoped, matching RuntimeEnvironment.
 */
export class TypeEnvironment {
  // Symbol Table
  private readonly bindings = new Map<string, TypeBinding>();
  private readonly functions = new Map<string, FunctionDeclarationNode>();

  constructor(
    private readonly parent?: TypeEnvironment,
    private readonly isFunctionScope = false,
  ) {}

  createBlockScope(): TypeEnvironment {
    return new TypeEnvironment(this);
  }

  createFunctionScope(_functionName?: string): TypeEnvironment {
    return new TypeEnvironment(this, true);
  }

  declareVariable(
    kind: DeclarationKind,
    name: string,
    resolvedType: ResolvedType,
  ): void {
    if (this.bindings.has(name)) {
      return;
    }

    this.bindings.set(name, { kind, resolvedType });
  }

  hasVariable(name: string): boolean {
    return this.findBinding(name) !== undefined;
  }

  assignVariable(name: string, resolvedType: ResolvedType): void {
    const binding = this.findBinding(name);
    if (!binding) {
      throw new Error(`Undefined variable "${name}"`);
    }

    binding.resolvedType = resolvedType;
  }

  getVariableType(name: string): ResolvedType {
    const binding = this.findBinding(name);
    if (!binding) {
      throw new Error(`Undefined variable "${name}"`);
    }

    return binding.resolvedType;
  }

  getVariableKind(name: string): DeclarationKind {
    const binding = this.findBinding(name);
    if (!binding) {
      throw new Error(`Undefined variable "${name}"`);
    }

    return binding.kind;
  }

  declareFunction(functionNode: FunctionDeclarationNode): void {
    if (this.functions.has(functionNode.name)) {
      return;
    }

    this.functions.set(functionNode.name, functionNode);
  }

  getFunction(name: string): FunctionDeclarationNode {
    const functionNode = this.findFunction(name);
    if (!functionNode) {
      throw new Error(`Undefined function "${name}"`);
    }

    return functionNode;
  }

  hasFunction(name: string): boolean {
    return this.findFunction(name) !== undefined;
  }

  private findBinding(name: string): TypeBinding | undefined {
    if (this.bindings.has(name)) {
      return this.bindings.get(name);
    }

    return this.parent?.findBinding(name);
  }

  private findFunction(name: string): FunctionDeclarationNode | undefined {
    if (this.functions.has(name)) {
      return this.functions.get(name);
    }

    return this.parent?.findFunction(name);
  }
}
