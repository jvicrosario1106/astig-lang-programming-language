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

type RuntimeBinding = {
  kind: DeclarationKind;
  value: RuntimeValue;
  isInitialized: boolean;
  resolvedType: ResolvedType;
};

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

  assign(name: string, value: RuntimeValue): void {
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

  get(name: string): RuntimeValue {
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

  lookup(name: string): RuntimeValue {
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
}

function defaultPlaceholderValue(resolvedType: ResolvedType): RuntimeValue {
  if (resolvedType.kind === 'array') {
    return [];
  }

  if (resolvedType.kind === 'record') {
    return { recordTypeName: resolvedType.name, fields: new Map() };
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
