import { RuntimeValue } from '../models/RuntimeValue';
import {
  DeclarationKind,
  FunctionDeclarationNode,
} from '../models/StatementNode';

type RuntimeBinding = {
  kind: DeclarationKind;
  value: RuntimeValue;
  isInitialized: boolean; // Tracks if the variable has been assigned a value
};

/**
 * RuntimeEnvironment models the interpreter's lexical scope at runtime.
 *
 * Each environment holds variable bindings and function declarations for a
 * single block or function scope and may be linked to a parent environment.
 * This lets the interpreter implement nested scope lookup, shadowing, and
 * function-level `var` semantics separately from block-scoped `let`/`const`.
 *
 * Variables declared with `let`/`const` stay in the current block scope, while
 * variables declared with `var` are hoisted to the nearest enclosing function
 * or global environment.
 *
 * Functions are stored separately so function declarations can be resolved
 * independently of normal variable bindings.
 */
export class RuntimeEnvironment {
  private readonly bindings = new Map<string, RuntimeBinding>();
  private readonly functions = new Map<string, FunctionDeclarationNode>();

  // Creates an environment, optionally linked to a parent scope.
  constructor(
    private readonly parent?: RuntimeEnvironment,
    private readonly isFunctionScope = false,
  ) {}

  // Creates a child scope for block-scoped let/const variables.
  createBlockScope(): RuntimeEnvironment {
    return new RuntimeEnvironment(this);
  }

  // Creates a child scope where var declarations stay inside the function.
  createFunctionScope(): RuntimeEnvironment {
    return new RuntimeEnvironment(this, true);
  }

  // Declares a new const, let, or var variable.
  // let/const are always initialized at declaration, var is not until assigned.
  declare(kind: DeclarationKind, name: string, value: RuntimeValue): void {
    if (kind === 'var') {
      this.declareVar(name, value);
      return;
    }

    if (this.bindings.has(name)) {
      throw new Error(`Cannot redeclare block-scoped variable "${name}"`);
    }

    // let/const are always initialized at declaration time
    this.bindings.set(name, { kind, value, isInitialized: true });
  }

  // Updates an existing variable and rejects const reassignment.
  // Marks the variable as initialized when assigned.
  assign(name: string, value: RuntimeValue): void {
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
    binding.isInitialized = true; // Mark as initialized when assigned
  }

  // Reads a variable value from the nearest scope that has it.
  // Throws if the variable is used before being assigned (TypeScript behavior).
  get(name: string): RuntimeValue {
    const environment = this.findEnvironmentWithBinding(name);
    const binding = environment?.bindings.get(name);
    if (!binding) {
      throw new Error(`Undefined variable "${name}"`);
    }

    if (!binding.isInitialized) {
      throw new Error(`Variable '${name}' is used before being assigned.`);
    }

    return binding.value;
  }

  // Stores a function declaration by name.
  declareFunction(functionNode: FunctionDeclarationNode): void {
    if (this.functions.has(functionNode.name)) {
      throw new Error(`Cannot redeclare function "${functionNode.name}"`);
    }

    this.functions.set(functionNode.name, functionNode);
  }

  // Reads a function from the nearest scope that has it.
  getFunction(name: string): FunctionDeclarationNode {
    const environment = this.findEnvironmentWithFunction(name);
    const functionNode = environment?.functions.get(name);
    if (!functionNode) {
      throw new Error(`Undefined function "${name}"`);
    }

    return functionNode;
  }

  // Declares var in the nearest function/global scope.
  // var declarations with values are always initialized at declaration.
  private declareVar(name: string, value: RuntimeValue): void {
    const scope = this.findVarScope();
    const existing = scope.bindings.get(name);
    if (existing?.kind === 'const' || existing?.kind === 'let') {
      throw new Error(
        `Cannot redeclare block-scoped variable "${name}" with var`,
      );
    }

    // var is always initialized when declared with a value in the statement
    scope.bindings.set(name, { kind: 'var', value, isInitialized: true });
  }

  // Finds where var declarations should be stored.
  private findVarScope(): RuntimeEnvironment {
    if (this.isFunctionScope || !this.parent) {
      return this;
    }

    return this.parent.findVarScope();
  }

  // Finds the nearest scope containing a variable.
  private findEnvironmentWithBinding(
    name: string,
  ): RuntimeEnvironment | undefined {
    if (this.bindings.has(name)) {
      return this;
    }

    return this.parent?.findEnvironmentWithBinding(name);
  }

  // Finds the nearest scope containing a function.
  private findEnvironmentWithFunction(
    name: string,
  ): RuntimeEnvironment | undefined {
    if (this.functions.has(name)) {
      return this;
    }

    return this.parent?.findEnvironmentWithFunction(name);
  }
}
