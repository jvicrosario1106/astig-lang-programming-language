/** A single field inside a record type declaration. */
export type RecordFieldNode = {
  name: string;
  /** Raw jejemon type annotation from source (e.g. `iHNtSZ`). */
  declaredType: string;
};

/** AST node for a `record TypeName { field: type, ... }` declaration. */
export type RecordDeclarationNode = {
  type: 'RecordDeclaration';
  name: string;
  fields: RecordFieldNode[];
};
