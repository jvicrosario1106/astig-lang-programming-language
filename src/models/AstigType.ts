/*
 * Canonical primitive and special types used by the type checker and interpreter.
 * Jejemon spellings in source (e.g. iHNtSZ) are normalized to these enum values.
 */
export enum AstigType {
  Int = 'int',
  Float = 'float',
  String = 'string',
  Char = 'char',
  Boolean = 'boolean',
  Void = 'void',
  Any = 'any',
  Record = 'record',
  Array = 'array',
}
