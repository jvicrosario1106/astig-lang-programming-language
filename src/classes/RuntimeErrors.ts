import { SourceDiagnostic } from '../utils/diagnostics';

/** Thrown when interpretation finds one or more runtime errors (error-recovery mode). */
export class RuntimeErrors extends Error {
  readonly diagnostics: SourceDiagnostic[];

  constructor(diagnostics: SourceDiagnostic[]) {
    const count = diagnostics.length;
    super(
      count === 1
        ? 'Interpretation failed with 1 runtime error'
        : `Interpretation failed with ${count} runtime errors`,
    );
    this.name = 'RuntimeErrors';
    this.diagnostics = diagnostics;
  }
}
