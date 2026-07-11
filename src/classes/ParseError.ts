import { SourceDiagnostic } from '../utils/diagnostics';

/** Thrown when source fails lexical or syntactic analysis. */
export class ParseError extends Error {
  readonly diagnostics: SourceDiagnostic[];
  readonly source?: string;

  constructor(
    message: string,
    diagnostics: SourceDiagnostic[],
    source?: string,
  ) {
    super(message);
    this.name = 'ParseError';
    this.diagnostics = diagnostics;
    this.source = source;
  }
}
