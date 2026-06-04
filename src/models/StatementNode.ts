import { ExpressionNode } from './ExpressionNode';
import { ParameterNode } from './ParameterNode';

export enum StatementNodeType {
  VariableDeclaration = 'VariableDeclaration',
  Assignment = 'Assignment',
  PrintStatement = 'PrintStatement',
  IfStatement = 'IfStatement',
  WhileStatement = 'WhileStatement',
  DoWhileStatement = 'DoWhileStatement',
  ForStatement = 'ForStatement',
  ForeachStatement = 'ForeachStatement',
  BreakStatement = 'BreakStatement',
  ContinueStatement = 'ContinueStatement',
  FunctionDeclaration = 'FunctionDeclaration',
  ReturnStatement = 'ReturnStatement',
  BlockStatement = 'BlockStatement',
}

export type StatementNode =
  | VariableDeclarationNode
  | AssignmentNode
  | PrintStatementNode
  | IfStatementNode
  | WhileStatementNode
  | DoWhileStatementNode
  | ForStatementNode
  | ForeachStatementNode
  | BreakStatementNode
  | ContinueStatementNode
  | FunctionDeclarationNode
  | ReturnStatementNode
  | BlockStatementNode;

export type VariableDeclarationNode = {
  type: StatementNodeType.VariableDeclaration;
  declarationKind: DeclarationKind;
  name: string;
  declaredType?: string;
  value: ExpressionNode;
};

export type DeclarationKind = 'const' | 'let' | 'var';

export type PrintStatementNode = {
  type: StatementNodeType.PrintStatement;
  value: ExpressionNode;
};

export type IfStatementNode = {
  type: StatementNodeType.IfStatement;
  condition: ExpressionNode;
  thenBranch: StatementNode[];
  elseIfChains: Array<{
    condition: ExpressionNode;
    body: StatementNode[];
  }>;
  elseBranch?: StatementNode[];
};

export type WhileStatementNode = {
  type: StatementNodeType.WhileStatement;
  condition: ExpressionNode;
  body: StatementNode[];
};

export type DoWhileStatementNode = {
  type: StatementNodeType.DoWhileStatement;
  body: StatementNode[];
  condition: ExpressionNode;
};

export type ForStatementNode = {
  type: StatementNodeType.ForStatement;
  init?: VariableDeclarationNode | AssignmentNode;
  condition?: ExpressionNode;
  update?: AssignmentNode;
  body: StatementNode[];
};

export type ForeachStatementNode = {
  type: StatementNodeType.ForeachStatement;
  variable: string;
  iterable: ExpressionNode;
  body: StatementNode[];
};

export type BreakStatementNode = {
  type: StatementNodeType.BreakStatement;
};

export type ContinueStatementNode = {
  type: StatementNodeType.ContinueStatement;
};

export type AssignmentNode = {
  type: StatementNodeType.Assignment;
  name: string;
  operator: '=' | '+=' | '-=' | '-+';
  value: ExpressionNode;
};

export type FunctionDeclarationNode = {
  type: StatementNodeType.FunctionDeclaration;
  name: string;
  parameters: ParameterNode[];
  returnType?: string;
  body: StatementNode[];
};

export type ReturnStatementNode = {
  type: StatementNodeType.ReturnStatement;
  value?: ExpressionNode;
};

export type BlockStatementNode = {
  type: StatementNodeType.BlockStatement;
  body: StatementNode[];
};
