import { SourceLocation } from '../models/StatementNode';

/** Thrown by the interpreter when execution fails at runtime. */
export class RuntimeError extends Error {
  readonly location?: SourceLocation;

  constructor(message: string, location?: SourceLocation) {
    super(message);
    this.name = 'RuntimeError';
    this.location = location;
  }
}
