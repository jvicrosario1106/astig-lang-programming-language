import { SourceLocation } from '../models/StatementNode';

/** Thrown by the type checker when a static type rule is violated. */
export class TypeCheckError extends Error {
  readonly location?: SourceLocation;

  constructor(message: string, location?: SourceLocation) {
    super(message);
    this.name = 'TypeCheckError';
    this.location = location;
  }
}
