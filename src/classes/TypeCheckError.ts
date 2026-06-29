/** Thrown by the type checker when a static type rule is violated. */
export class TypeCheckError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TypeCheckError';
  }
}
