import { IncludeNode } from './IncludeNode';
import { MainFunctionNode } from './MainFunctionNode';
import { RecordDeclarationNode } from './RecordNode';
import { FunctionDeclarationNode } from './StatementNode';

/**
 * Root AST node for an AstigLang program or include module.
 *
 * Entry file layout: includes → records → functions → `main` (required at load time).
 * Include modules: same layout but must not define `main`; they contribute functions/records only.
 *
 * After loading, `functions` holds cross-file visible functions only. `moduleFunctions`
 * keeps every file's full function list so private helpers stay callable in-file.
 */
export type ProgramNode = {
  type: 'Program';
  includes: IncludeNode[];
  recordDeclarations: RecordDeclarationNode[];
  /** Publicly visible functions (exported from libraries + all entry-file functions). */
  functions: FunctionDeclarationNode[];
  /** All top-level functions grouped by source filename (includes private module helpers). */
  moduleFunctions: Record<string, FunctionDeclarationNode[]>;
  /** Entry program filename (e.g. `main.stg`) for same-file visibility in `main`. */
  entryModule?: string;
  /** Present only on the entry program file; include modules must omit this. */
  mainFunction?: MainFunctionNode;
};
