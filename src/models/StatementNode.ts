import { ExpressionNode } from './ExpressionNode';
import { ParameterNode } from './ParameterNode';

export enum StatementNodeType {
  VariableDeclaration = 'VariableDeclaration',
  PrintStatement = 'PrintStatement',
  FunctionDeclaration = 'FunctionDeclaration',
  ReturnStatement = 'ReturnStatement',
  BlockStatement = 'BlockStatement',
}

export type StatementNode =
  | VariableDeclarationNode
  | PrintStatementNode
  | FunctionDeclarationNode
  | ReturnStatementNode
  | BlockStatementNode;

export type VariableDeclarationNode = {
  type: StatementNodeType.VariableDeclaration;
  name: string;
  declaredType?: string;
  value: ExpressionNode;
};

export type PrintStatementNode = {
  type: StatementNodeType.PrintStatement;
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
