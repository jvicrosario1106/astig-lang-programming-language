import { StatementNode } from './StatementNode';

/**
 * AST node for the program entry point: `function main() { ... }`.
 * Only the entry program file may define this; include modules must omit it.
 */
export type MainFunctionNode = {
  type: 'MainFunction';
  body: StatementNode[];
};
