import { RecordDeclarationNode, RecordFieldNode } from '../models/RecordNode';

/**
 * Stores record type definitions declared with `rH3cH0rHDz` (record keyword).
 *
 * Used by the type checker to resolve field types and by the interpreter when
 * validating record literals (`nHEWs TypeName { ... }`).
 */
export class RecordRegistry {
  private readonly records = new Map<string, RecordFieldNode[]>();

  /** Registers a record type; throws if the name is already declared. */
  register(recordDeclaration: RecordDeclarationNode): void {
    if (this.records.has(recordDeclaration.name)) {
      throw new Error(`Cannot redeclare record "${recordDeclaration.name}"`);
    }

    this.records.set(recordDeclaration.name, recordDeclaration.fields);
  }

  /** Returns whether a user-defined record type name exists. */
  has(recordName: string): boolean {
    return this.records.has(recordName);
  }

  /** Returns all fields for a record type; throws if the type is unknown. */
  getFields(recordName: string): RecordFieldNode[] {
    const fields = this.records.get(recordName);
    if (!fields) {
      throw new Error(`Unknown record type "${recordName}"`);
    }

    return fields;
  }

  /** Returns the declared type annotation string for a field, if it exists. */
  getFieldType(recordName: string, fieldName: string): string | undefined {
    return this.getFields(recordName).find((field) => field.name === fieldName)
      ?.declaredType;
  }
}

/** Builds a registry from all record declarations in a program. */
export function buildRecordRegistry(
  recordDeclarations: RecordDeclarationNode[],
): RecordRegistry {
  const registry = new RecordRegistry();

  for (const recordDeclaration of recordDeclarations) {
    registry.register(recordDeclaration);
  }

  return registry;
}
