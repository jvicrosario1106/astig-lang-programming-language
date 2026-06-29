/** AST node for an `include filename.stg` directive at the top of a program. */
export type IncludeNode = {
  type: 'Include';
  /** Included file name as written in source (e.g. `utils.stg`). */
  filename: string;
};
