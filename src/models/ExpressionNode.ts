export enum ExpressionNodeType {
  NumberLiteral = 'NumberLiteral',
  StringLiteral = 'StringLiteral',
  Identifier = 'Identifier',
  FunctionCall = 'FunctionCall',
  BinaryExpression = 'BinaryExpression',
  UnaryExpression = 'UnaryExpression',
}

export type ExpressionNode =
  | NumberLiteralNode
  | StringLiteralNode
  | IdentifierNode
  | FunctionCallNode
  | BinaryExpressionNode
  | UnaryExpressionNode;

export type NumberLiteralNode = {
  type: ExpressionNodeType.NumberLiteral;
  value: number;
};

export type StringLiteralNode = {
  type: ExpressionNodeType.StringLiteral;
  value: string;
};

export type IdentifierNode = {
  type: ExpressionNodeType.Identifier;
  name: string;
};

export type FunctionCallNode = {
  type: ExpressionNodeType.FunctionCall;
  name: string;
  arguments: ExpressionNode[];
};

export type BinaryExpressionNode = {
  type: ExpressionNodeType.BinaryExpression;
  operator: '+' | '-' | '*' | '/' | '==' | '!=' | '<' | '>' | '<=' | '>=';
  left: ExpressionNode;
  right: ExpressionNode;
};

export type UnaryExpressionNode = {
  type: ExpressionNodeType.UnaryExpression;
  operator: '-';
  argument: ExpressionNode;
};
