import { StatementNode } from './StatementNode';

export type ProgramNode = {
  type: 'Program';
  body: StatementNode[];
};
