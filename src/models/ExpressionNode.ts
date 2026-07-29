/** Discriminator for every expression node shape in the AST. */
export enum ExpressionNodeType {
  NumberLiteral = 'NumberLiteral',
  FloatLiteral = 'FloatLiteral',
  StringLiteral = 'StringLiteral',
  ArrayLiteral = 'ArrayLiteral',
  ArrayIndexAccess = 'ArrayIndexAccess',
  BooleanLiteral = 'BooleanLiteral',
  Identifier = 'Identifier',
  FunctionCall = 'FunctionCall',
  BinaryExpression = 'BinaryExpression',
  UnaryExpression = 'UnaryExpression',
  RecordLiteral = 'RecordLiteral',
  MemberAccess = 'MemberAccess',
  Malloc = 'Malloc',
  Realloc = 'Realloc',
}

/** Union of all expression node types produced by `buildExpression` in `ast.ts`. */
export type ExpressionNode =
  | NumberLiteralNode
  | FloatLiteralNode
  | StringLiteralNode
  | ArrayLiteralNode
  | ArrayIndexAccessNode
  | BooleanLiteralNode
  | IdentifierNode
  | FunctionCallNode
  | BinaryExpressionNode
  | UnaryExpressionNode
  | RecordLiteralNode
  | MemberAccessNode
  | MallocNode
  | ReallocNode;

export type NumberLiteralNode = {
  type: ExpressionNodeType.NumberLiteral;
  value: number;
};

export type FloatLiteralNode = {
  type: ExpressionNodeType.FloatLiteral;
  value: number;
};

export type StringLiteralNode = {
  type: ExpressionNodeType.StringLiteral;
  value: string;
};

export type ArrayLiteralNode = {
    type: ExpressionNodeType.ArrayLiteral;
    elements: ExpressionNode[];
};

export type ArrayIndexAccessNode = {
  type: ExpressionNodeType.ArrayIndexAccess
  arrayName: string;
  index: ExpressionNode;
};

export type BooleanLiteralNode = {
  type: ExpressionNodeType.BooleanLiteral;
  value: boolean;
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
  operator: '+' | '-' | '*' | '/' | '%' | '==' | '!=' | '<' | '>' | '<=' | '>=' | '<<' | '>>' | '&' | '|' | 'AND' | 'OR';
  left: ExpressionNode;
  right: ExpressionNode;
};

export type UnaryExpressionNode = {
  type: ExpressionNodeType.UnaryExpression;
  operator: '-' | 'NOT' | '&' | '*';
  argument: ExpressionNode;
};

/** One field initializer inside `new TypeName { name = expr, ... }`. */
export type RecordLiteralFieldNode = {
  name: string;
  value: ExpressionNode;
};

/** Record constructor expression: `new TypeName { field = value, ... }`. */
export type RecordLiteralNode = {
  type: ExpressionNodeType.RecordLiteral;
  recordTypeName: string;
  fields: RecordLiteralFieldNode[];
};

/** Field access on a record or nested expression: `expr.fieldName`. */
export type MemberAccessNode = {
  type: ExpressionNodeType.MemberAccess;
  object: ExpressionNode;
  field: string;
};

export type MallocNode = {
  type: ExpressionNodeType.Malloc;
  sizeExpr: ExpressionNode;
}

export type ReallocNode = {
  type: ExpressionNodeType.Realloc;
  ptrExpr: ExpressionNode;
  sizeExpr: ExpressionNode;
}