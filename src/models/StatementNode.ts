import { ExpressionNode } from './ExpressionNode';
import { ParameterNode } from './ParameterNode';

export enum StatementNodeType {
  VariableDeclaration = 'VariableDeclaration',
  Assignment = 'Assignment',
  PrintStatement = 'PrintStatement',
  ScanStatement = 'ScanStatement',
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
  FieldAssignmentStatement = 'FieldAssignmentStatement',
  ArrayIndexAssignment = 'ArrayIndexAssignment',
}

export type StatementNode =
  | VariableDeclarationNode
  | AssignmentNode
  | PrintStatementNode
  | ScanStatementNode
  | IfStatementNode
  | WhileStatementNode
  | DoWhileStatementNode
  | ForStatementNode
  | ForeachStatementNode
  | BreakStatementNode
  | ContinueStatementNode
  | FunctionDeclarationNode
  | ReturnStatementNode
  | BlockStatementNode
  | FieldAssignmentNode
  | ArrayIndexAssignmentNode;

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

export type FieldAssignmentNode = {
  type: StatementNodeType.FieldAssignmentStatement; // Node type enum
  path: string[];                                   // Store identifiers from chaining (['Player', 'Health'])
  operator: '=' | '+=' | '-=' | '-+';
  value: ExpressionNode;
};

export interface ArrayIndexAssignmentNode {
  type: StatementNodeType.ArrayIndexAssignment; // Make sure to add this enum/string value if needed
  arrayName: string;                            // e.g., "aHs"
  index: ExpressionNode;                        // e.g., 0
  operator: string;                             // Tracks the assignment operator like '='
  value: ExpressionNode;                        // The new value expression being assigned
};

export interface ScanStatementNode{
  type: StatementNodeType.ScanStatement;
  promptMessage?: string;
  variableName: string;
};