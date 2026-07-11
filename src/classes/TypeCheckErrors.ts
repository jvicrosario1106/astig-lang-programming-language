import { SourceDiagnostic } from '../utils/diagnostics';

/** Thrown when type checking finds one or more errors (error-recovery mode). */
export class TypeCheckErrors extends Error {
  readonly diagnostics: SourceDiagnostic[];

  constructor(diagnostics: SourceDiagnostic[]) {
    const count = diagnostics.length;
    super(
      count === 1
        ? 'Type checking failed with 1 error'
        : `Type checking failed with ${count} errors`,
    );
    this.name = 'TypeCheckErrors';
    this.diagnostics = diagnostics;
  }
}
