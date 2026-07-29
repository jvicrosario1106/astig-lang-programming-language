import { TypeCheckError } from '../classes/TypeCheckError';
import { RecordRegistry } from '../classes/RecordRegistry';
import { AstigType } from '../models/AstigType';
import { ResolvedType } from '../models/ResolvedType';
import { VariableDeclarationNode } from '../models/StatementNode';
import { ParameterNode } from '../models/ParameterNode';

/**
 * Type-system helpers shared by the type checker.
 *
 * Maps jejemon type spellings (e.g. `iHNtSZ`, `sTRh1Ngz`) to internal types,
 * resolves user-defined record names, and checks assignability rules.
 */

/** Parses a jejemon primitive type keyword into an `AstigType`. */
export function parseDeclaredType(typeName: string): AstigType {
  const lower = typeName.toLowerCase();
  // Remove all h's, numbers, and z's
  const fuzzy = lower.replace(/h/g, '').replace(/[0-9@]/g, '').replace(/z+$/, '');

  if (lower === '1nt' || fuzzy.includes('int')) {
    return AstigType.Int;
  }

  if (fuzzy.includes('float') || fuzzy.includes('flot')) {
    return AstigType.Float;
  }

  if (fuzzy.includes('string') || (fuzzy.includes('str') && fuzzy.includes('ng'))) {
    return AstigType.String;
  }

  if (fuzzy.includes('char') || fuzzy.includes('chr')) {
    return AstigType.Char;
  }

  if (fuzzy.includes('bol') && fuzzy.includes('n')) {
    return AstigType.Boolean;
  }

  if (fuzzy.includes('void') || fuzzy.includes('viod')) {
    return AstigType.Void;
  }

  throw new TypeCheckError(`Unknown type "${typeName}"`);
}

/**
 * Resolves a type annotation to either a primitive or a user-defined record type.
 * Falls back to the record registry when the name is not a built-in primitive.
 */
export function resolveDataType(
  typeName: string,
  recordRegistry: RecordRegistry,
): ResolvedType {
  // Handle trailing pointer symbols recursively (e.g., "int**")
  if (typeName.endsWith('*')) {
    const innerTypeName = typeName.slice(0, -1).trim();
    return {
      kind: 'pointer',
      underlying: resolveDataType(innerTypeName, recordRegistry)
    };
  }

  try {
    return { kind: 'primitive', type: parseDeclaredType(typeName) };
  } catch (error) {
    if (error instanceof TypeCheckError && recordRegistry.has(typeName)) {
      return { kind: 'record', name: typeName };
    }

    throw error;
  }
}

/** Returns true for int and float types. */
export function isNumericType(type: AstigType): boolean {
  return type === AstigType.Int || type === AstigType.Float;
}

/** Checks whether `actual` can be assigned to a variable/parameter of type `expected`. */
export function isAssignableType(
  expected: ResolvedType,
  actual: ResolvedType,
): boolean {
  if (expected.kind === 'primitive' && expected.type === AstigType.Any) {
    return true;
  }

  if (actual.kind === 'primitive' && actual.type === AstigType.Any) {
    return true;
  }

  if (expected.kind === 'pointer' && actual.kind === 'pointer'){
    return isAssignableType(expected.underlying, actual.underlying);
  }

  if (expected.kind === 'record' && actual.kind === 'record') {
    return expected.name === actual.name;
  }

  if (expected.kind === 'array' && actual.kind === 'array') {
    return expected.elementType === actual.elementType; //
  }

  if (expected.kind === 'primitive' && actual.kind === 'primitive') {
    if (expected.type === actual.type) {
      return true;
    }

    if (isNumericType(expected.type) && isNumericType(actual.type)) {
      return true;
    }

    if (expected.type === AstigType.String && actual.type === AstigType.Char) {
      return true;
    }
  }

  return false;
}

/** Formats a primitive type for error messages. */
export function formatAstigType(type: AstigType): string {
  return type;
}

/** Formats a resolved type (primitive or record name) for error messages. */
export function formatResolvedType(resolvedType: ResolvedType): string {
  if (resolvedType.kind === 'record') {
    return resolvedType.name;
  }
  if (resolvedType.kind === 'array'){
    return `${formatAstigType(resolvedType.elementType)}[]`;
  }
  if (resolvedType.kind === 'pointer'){
    return `${formatResolvedType(resolvedType.underlying)}*`;
  }

  return formatAstigType(resolvedType.type);
}

/** Resolves the static type of a variable declaration from its annotation. */
export function resolveVariableDeclarationType(
  declaration: VariableDeclarationNode,
  recordRegistry: RecordRegistry,
): ResolvedType {
  if (!declaration.declaredType) {
    return { kind: 'primitive', type: AstigType.Any };
  }

  const baseResolved = resolveDataType(declaration.declaredType, recordRegistry);

  if (declaration.isArray) {
    if (baseResolved.kind !== 'primitive') {
      throw new TypeCheckError(
        `Arrays of complex kinds are currently unsupported for "${declaration.name}"`,
      );
    }

    return {
      kind: 'array',
      elementType: baseResolved.type,
    };
  }

  return baseResolved;
}

/** Resolves the static type of a function parameter from its annotation. */
export function resolveParameterType(
  parameter: ParameterNode,
  recordRegistry: RecordRegistry,
): ResolvedType {
  if (!parameter.declaredType) {
    return { kind: 'primitive', type: AstigType.Any };
  }

  return resolveDataType(parameter.declaredType, recordRegistry);
}

/** Converts an `AstigType` enum value into a `ResolvedType` wrapper. */
export function expressionTypeToResolved(
  astigType: AstigType,
  recordTypeName?: string,
): ResolvedType {
  if (astigType === AstigType.Record && recordTypeName) {
    return { kind: 'record', name: recordTypeName };
  }

  return { kind: 'primitive', type: astigType };
}
