/**
 * Runtime error recovery.
 *
 * Wraps per-statement interpretation so recoverable runtime errors are recorded
 * and execution continues. At the end of `runProgram()`, all collected
 * diagnostics are thrown as {@link RuntimeErrors}.
 */
import { BreakException } from '../classes/BreakException';
import { ContinueException } from '../classes/ContinueException';
import { ReturnException } from '../classes/ReturnException';
import { RuntimeError } from '../classes/RuntimeError';
import { toRuntimeError } from '../classes/RuntimeExceptions';
import { SourceLocation } from '../models/StatementNode';
import {
  diagnosticFromError,
  getErrorSourceLocation,
  SourceDiagnostic,
} from './diagnostics';

/** Mutable session that accumulates runtime diagnostics during interpretation. */
export type RuntimeRecoverySession = {
  /** Entry filename shown in each diagnostic. */
  filename: string;
  /** Errors collected so far; thrown together when interpretation finishes. */
  diagnostics: SourceDiagnostic[];
};

function isControlFlowException(error: unknown): boolean {
  return (
    error instanceof BreakException ||
    error instanceof ContinueException ||
    error instanceof ReturnException
  );
}

/** Returns whether a caught error should be recorded instead of aborting execution. */
export function isRecoverableRuntimeError(error: unknown): boolean {
  if (isControlFlowException(error)) {
    return false;
  }

  if (error instanceof RuntimeError) {
    return true;
  }

  if (error instanceof Error) {
    return true;
  }

  return false;
}

/**
 * Appends one recoverable runtime error to the session as a {@link SourceDiagnostic}.
 */
export function recordRecoverableRuntimeError(
  session: RuntimeRecoverySession,
  error: unknown,
  location?: SourceLocation,
): void {
  const runtimeError =
    error instanceof RuntimeError
      ? error
      : toRuntimeError(error, location);

  const resolvedLocation =
    location ?? getErrorSourceLocation(runtimeError) ?? runtimeError.location;

  session.diagnostics.push(
    diagnosticFromError(
      runtimeError,
      'runtime',
      session.filename,
      resolvedLocation,
    ),
  );
}

/**
 * Runs an interpreter action with optional error recovery.
 *
 * When `session` is defined, recoverable errors are recorded and execution
 * continues. Control-flow exceptions always rethrow. Non-recoverable errors
 * always rethrow.
 */
export function runWithRuntimeRecovery(
  session: RuntimeRecoverySession | undefined,
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
    if (isControlFlowException(error)) {
      throw error;
    }

    if (!isRecoverableRuntimeError(error)) {
      throw error;
    }

    recordRecoverableRuntimeError(session, error, location);
  }
}
