export enum ExpressionNodeType {
  NumberLiteral = 'NumberLiteral',
  StringLiteral = 'StringLiteral',
  RecordLiteral = 'RecordLiteral',
  ArrayLiteral = 'ArrayLiteral',
  ArrayIndexAccess = 'ArrayIndexAccess',
  Identifier = 'Identifier',
  FunctionCall = 'FunctionCall',
  BinaryExpression = 'BinaryExpression',
  UnaryExpression = 'UnaryExpression',
}

export type ExpressionNode =
  | NumberLiteralNode
  | StringLiteralNode
  | RecordLiteralNode
  | ArrayLiteralNode
  | ArrayIndexAccessNode
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

export type RecordLiteralNode = {
  type: ExpressionNodeType.RecordLiteral; 
  recordTypeName: string;                 // e.g., "vHArH1aHBlH3s"
  fields: { name: string; value: ExpressionNode }[];
}

export type ArrayLiteralNode = {
    type: ExpressionNodeType.ArrayLiteral;
    elements: ExpressionNode[];
};

export type ArrayIndexAccessNode = {
  type: ExpressionNodeType.ArrayIndexAccess
  arrayName: string;
  index: number;
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
