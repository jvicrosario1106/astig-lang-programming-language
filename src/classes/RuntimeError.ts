import { SourceLocation } from '../models/StatementNode';

/**
 * Base class for interpreter runtime failures (Java-style checked hierarchy root).
 * Specialized errors live in {@link RuntimeExceptions}.
 */
export class RuntimeError extends Error {
  readonly location?: SourceLocation;

  constructor(message: string, location?: SourceLocation) {
    super(message);
    this.name = 'RuntimeError';
    this.location = location;
  }
}
