import { ExpressionNode } from './ExpressionNode';
import { ParameterNode } from './ParameterNode';

/** Discriminator for every statement node shape in the AST. */
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
  ArrayIndexAssignment = 'ArrayIndexAssignment',
}

/** Union of all statement node types produced by `buildStatement` in `ast.ts`. */
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
  | ArrayIndexAssignmentNode;

export type VariableDeclarationNode = {
  type: StatementNodeType.VariableDeclaration;
  declarationKind: DeclarationKind;
  name: string;
  declaredType?: string;
  value: ExpressionNode;
  isArray: boolean;
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

/** Left-hand side of an assignment: either a variable or a dotted record field path. */
export type AssignmentTarget =
  | { kind: 'variable'; name: string }
  | { kind: 'recordField'; rootVariable: string; fieldPath: string[] };

export type AssignmentNode = {
  type: StatementNodeType.Assignment;
  target: AssignmentTarget;
  operator: '=' | '+=' | '-=' | '-+';
  value: ExpressionNode;
};

/** User-defined function; `isExported` controls cross-file visibility via `include`. */
export type FunctionDeclarationNode = {
  type: StatementNodeType.FunctionDeclaration;
  name: string;
  isExported: boolean;
  /** Source `.stg` filename; private helpers stay callable within this module. */
  sourceModule?: string;
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

export interface ArrayIndexAssignmentNode {
  type: StatementNodeType.ArrayIndexAssignment; // Make sure to add this enum/string value if needed
  arrayName: string;                            // e.g., "aHs"
  index: ExpressionNode;                                // e.g., 0
  operator: string;                             // Tracks the assignment operator like '='
  value: ExpressionNode;                        // The new value expression being assigned
};

export interface ScanStatementNode{
  type: StatementNodeType.ScanStatement;
  promptMessage?: string;
  variableName: string;
};