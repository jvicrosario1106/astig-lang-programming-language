/**
 * A fully resolved type used during static type checking.
 *
 * Primitive types come from jejemon keywords; record types are user-defined
 * names registered in `RecordRegistry`.
 */
export type ResolvedType =
  | { kind: 'primitive'; type: import('./AstigType').AstigType }
  | { kind: 'record'; name: string };
