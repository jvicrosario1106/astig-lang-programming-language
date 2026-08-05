import { ExpressionNode } from './ExpressionNode';
import { ParameterNode } from './ParameterNode';

export type SourceLocation = {
  line: number;
  column: number;
};

/** Optional source span attached during AST construction from ANTLR tokens. */
export type AstNodeLocation = {
  location?: SourceLocation;
};

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
  FreeStatement = 'FreeStatement',
  MemsetStatement = 'MemsetStatement',
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
  | ArrayIndexAssignmentNode
  | FreeStatementNode
  | MemsetStatementNode;

export type VariableDeclarationNode = AstNodeLocation & {
  type: StatementNodeType.VariableDeclaration;
  declarationKind: DeclarationKind;
  name: string;
  declaredType?: string;
  value?: ExpressionNode;
  isArray: boolean;
};

export type DeclarationKind = 'const' | 'let' | 'var';

export type PrintStatementNode = AstNodeLocation & {
  type: StatementNodeType.PrintStatement;
  value: ExpressionNode;
};

export type IfStatementNode = AstNodeLocation & {
  type: StatementNodeType.IfStatement;
  condition: ExpressionNode;
  thenBranch: StatementNode[];
  elseIfChains: Array<{
    condition: ExpressionNode;
    body: StatementNode[];
  }>;
  elseBranch?: StatementNode[];
};

export type WhileStatementNode = AstNodeLocation & {
  type: StatementNodeType.WhileStatement;
  condition: ExpressionNode;
  body: StatementNode[];
};

export type DoWhileStatementNode = AstNodeLocation & {
  type: StatementNodeType.DoWhileStatement;
  body: StatementNode[];
  condition: ExpressionNode;
};

export type ForStatementNode = AstNodeLocation & {
  type: StatementNodeType.ForStatement;
  init?: VariableDeclarationNode | AssignmentNode;
  condition?: ExpressionNode;
  update?: AssignmentNode;
  body: StatementNode[];
};

export type ForeachStatementNode = AstNodeLocation & {
  type: StatementNodeType.ForeachStatement;
  variable: string;
  iterable: ExpressionNode;
  body: StatementNode[];
};

export type BreakStatementNode = AstNodeLocation & {
  type: StatementNodeType.BreakStatement;
};

export type ContinueStatementNode = AstNodeLocation & {
  type: StatementNodeType.ContinueStatement;
};

/** Left-hand side of an assignment: either a variable or a dotted record field path. */
export type AssignmentTarget =
  | { kind: 'variable'; name: string }
  | { kind: 'recordField'; rootVariable: string; fieldPath: string[] }
  | { kind: 'dereference'; pointerExpression: ExpressionNode }

export type AssignmentNode = AstNodeLocation & {
  type: StatementNodeType.Assignment;
  target: AssignmentTarget;
  operator: '=' | '+=' | '-=' | '-+';
  value: ExpressionNode;
};

/** User-defined function; `isExported` controls cross-file visibility via `include`. */
export type FunctionDeclarationNode = AstNodeLocation & {
  type: StatementNodeType.FunctionDeclaration;
  name: string;
  isExported: boolean;
  /** Source `.stg` filename; private helpers stay callable within this module. */
  sourceModule?: string;
  parameters: ParameterNode[];
  returnType?: string;
  body: StatementNode[];
};

export type ReturnStatementNode = AstNodeLocation & {
  type: StatementNodeType.ReturnStatement;
  value?: ExpressionNode;
};

export type BlockStatementNode = AstNodeLocation & {
  type: StatementNodeType.BlockStatement;
  body: StatementNode[];
};

export interface ArrayIndexAssignmentNode extends AstNodeLocation {
  type: StatementNodeType.ArrayIndexAssignment; // Make sure to add this enum/string value if needed
  arrayName: string;                            // e.g., "aHs"
  index: ExpressionNode;                                // e.g., 0
  operator: string;                             // Tracks the assignment operator like '='
  value: ExpressionNode;                        // The new value expression being assigned
};

export interface ScanStatementNode extends AstNodeLocation {
  type: StatementNodeType.ScanStatement;
  promptMessage?: string;
  variableName: string;
};

export type FreeStatementNode = AstNodeLocation & {
  type: StatementNodeType.FreeStatement;
  ptrExpr: ExpressionNode;
};

export type MemsetStatementNode = AstNodeLocation & {
  type: StatementNodeType.MemsetStatement;
  ptrExpr: ExpressionNode;
  valueExpr: ExpressionNode;
  sizeExpr: ExpressionNode;
};