/**
 * Type-check error recovery.
 *
 * Wraps per-statement type checks so recoverable semantic errors are recorded
 * and checking continues. At the end of `typeCheckProgram()`, all collected
 * diagnostics are thrown as {@link TypeCheckErrors} so `main.ts` can print
 * every issue in one run (e.g. `test-case/semantic-errors.stg`).
 */
import { TypeCheckError } from '../classes/TypeCheckError';
import { SourceLocation } from '../models/StatementNode';
import {
  diagnosticFromError,
  getErrorSourceLocation,
  SourceDiagnostic,
} from './diagnostics';

/** Mutable session that accumulates type diagnostics during a type-check pass. */
export type TypeCheckRecoverySession = {
  /** Entry filename shown in each diagnostic. */
  filename: string;
  /** Errors collected so far; thrown together when checking finishes. */
  diagnostics: SourceDiagnostic[];
};

/** Errors enforced at runtime — never report these as type-check diagnostics. */
const RUNTIME_SEMANTIC_PATTERN =
  /undefined variable|cannot redeclare variable|cannot scan into const|cannot assign to const variable|expected \d+ arguments but got/i;

function isRuntimeSemanticMessage(message: string): boolean {
  return RUNTIME_SEMANTIC_PATTERN.test(message);
}

/**
 * Returns whether a caught error should be recorded instead of aborting the pass.
 *
 * All {@link TypeCheckError} instances are recoverable except runtime-semantics.
 * Plain `Error` messages matching type/mismatch patterns are also recoverable.
 */
export function isRecoverableTypeError(error: unknown): boolean {
  if (error instanceof TypeCheckError) {
    if (isRuntimeSemanticMessage(error.message)) {
      return false;
    }
    return true;
  }

  if (error instanceof Error) {
    if (isRuntimeSemanticMessage(error.message)) {
      return false;
    }

    const message = error.message;
    if (/type error/i.test(message)) {
      return true;
    }
    if (/type mismatch/i.test(message)) {
      return true;
    }
  }

  return false;
}

/**
 * Appends one recoverable type error to the session as a {@link SourceDiagnostic}.
 *
 * @param session - Active recovery session from `typeCheckProgram()`.
 * @param error - The caught error (or any value coerced to `Error`).
 * @param location - Statement location for the caret; falls back to `error.location`.
 */
export function recordRecoverableTypeError(
  session: TypeCheckRecoverySession,
  error: unknown,
  location?: SourceLocation,
): void {
  const err = error instanceof Error ? error : new Error(String(error));

  if (isRuntimeSemanticMessage(err.message)) {
    return;
  }

  const resolvedLocation =
    location ?? getErrorSourceLocation(err as Error);
  session.diagnostics.push(
    diagnosticFromError(err, 'type', session.filename, resolvedLocation),
  );
}

/**
 * Runs a type-check action with optional error recovery.
 *
 * When `session` is defined, recoverable errors are recorded and execution
 * continues. When `session` is `undefined` (recovery disabled), errors propagate
 * immediately. Non-recoverable errors always rethrow.
 *
 * @param session - Recovery session, or `undefined` to disable recovery.
 * @param action - Type-check logic to run (e.g. `checkStatement` for one statement).
 * @param location - Source span used for the diagnostic caret on failure.
 */
export function runWithTypeRecovery(
  session: TypeCheckRecoverySession | undefined,
  action: () => void,
  location?: SourceLocation,
): void {
  if (!session) {
    action();
    return;
  }

  try {
    action();
  } catch (error) {
    // Runtime semantic rules are checked during interpretation, not static typing.
    if (error instanceof Error && isRuntimeSemanticMessage(error.message)) {
      return;
    }

    if (!isRecoverableTypeError(error)) {
      throw error;
    }
    recordRecoverableTypeError(session, error, location);
  }
}
