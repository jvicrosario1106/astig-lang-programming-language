import { SourceLocation } from '../models/StatementNode';
import { RuntimeError } from './RuntimeError';

/** Maps unexpected Error throws to a typed runtime exception when possible. */
export function toRuntimeError(
  error: unknown,
  location?: SourceLocation,
): RuntimeError {
  if (error instanceof RuntimeError) {
    return error;
  }

  if (!(error instanceof Error)) {
    return new RuntimeError('Unknown runtime error', location);
  }

  const message = error.message;

  if (message.includes('Undefined variable')) {
    const name = message.match(/"([^"]+)"/)?.[1] ?? 'unknown';
    return new UndefinedVariableError(name, location);
  }

  if (message.includes('Cannot assign to const variable')) {
    const name = message.match(/"([^"]+)"/)?.[1] ?? 'unknown';
    return new ConstAssignmentError(name, location);
  }

  if (message.includes('used before being assigned')) {
    const name = message.match(/'([^']+)'/)?.[1] ?? 'unknown';
    return new UninitializedVariableError(name, location);
  }

  if (message.includes('Undefined function')) {
    const name = message.match(/"([^"]+)"/)?.[1] ?? 'unknown';
    return new UndefinedFunctionError(name, location);
  }

  if (message.includes('out of bounds')) {
    return new ArrayBoundsError(message, location);
  }

  if (message.includes('is not an array')) {
    return new ArrayTypeError(message, location);
  }

  if (message.includes('Cannot scan into') || message.includes('EAGAIN')) {
    return new ScanError(message, location);
  }

  return new RuntimeError(message, location);
}

export class UndefinedVariableError extends RuntimeError {
  readonly variableName: string;

  constructor(variableName: string, location?: SourceLocation) {
    super(`Runtime Error: Undefined variable "${variableName}"`, location);
    this.name = 'UndefinedVariableError';
    this.variableName = variableName;
  }
}

export class ConstAssignmentError extends RuntimeError {
  readonly variableName: string;

  constructor(variableName: string, location?: SourceLocation) {
    super(`Runtime Error: Cannot assign to const variable "${variableName}"`, location);
    this.name = 'ConstAssignmentError';
    this.variableName = variableName;
  }
}

export class UninitializedVariableError extends RuntimeError {
  readonly variableName: string;

  constructor(variableName: string, location?: SourceLocation) {
    super(`Runtime Error: Variable '${variableName}' is used before being assigned.`, location);
    this.name = 'UninitializedVariableError';
    this.variableName = variableName;
  }
}

export class UndefinedFunctionError extends RuntimeError {
  readonly functionName: string;

  constructor(functionName: string, location?: SourceLocation) {
    super(`Runtime Error: Undefined function "${functionName}"`, location);
    this.name = 'UndefinedFunctionError';
    this.functionName = functionName;
  }
}

export class ArrayBoundsError extends RuntimeError {
  constructor(message: string, location?: SourceLocation) {
    super(message.startsWith('Runtime Error:') ? message : `Runtime Error: ${message}`, location);
    this.name = 'ArrayBoundsError';
  }
}

export class ArrayTypeError extends RuntimeError {
  constructor(message: string, location?: SourceLocation) {
    super(message.startsWith('Runtime Error:') ? message : `Runtime Error: ${message}`, location);
    this.name = 'ArrayTypeError';
  }
}

export class InvalidOperationError extends RuntimeError {
  constructor(message: string, location?: SourceLocation) {
    super(message.startsWith('Runtime Error:') ? message : `Runtime Error: ${message}`, location);
    this.name = 'InvalidOperationError';
  }
}

/** Thrown when print (pHR!HNTs) fails at runtime. */
export class PrintError extends RuntimeError {
  constructor(message: string, location?: SourceLocation) {
    super(message.startsWith('Runtime Error:') ? message : `Runtime Error: ${message}`, location);
    this.name = 'PrintError';
  }
}

/** Thrown when scan (scH4nz) fails at runtime. */
export class ScanError extends RuntimeError {
  constructor(message: string, location?: SourceLocation) {
    super(message.startsWith('Runtime Error:') ? message : `Runtime Error: ${message}`, location);
    this.name = 'ScanError';
  }
}
