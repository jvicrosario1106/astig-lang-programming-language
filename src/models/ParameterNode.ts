/** AST node for a single function parameter with an optional type annotation. */
export type ParameterNode = {
  type: 'Parameter';
  name: string;
  declaredType?: string;
};
