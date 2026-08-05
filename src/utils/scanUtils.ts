import { AstigType } from '../models/AstigType';
import { ResolvedType } from '../models/ResolvedType';
import { RuntimeValue } from '../models/RuntimeValue';
import fs from 'fs';
import { ScanError } from '../classes/RuntimeExceptions';
import { formatResolvedType } from './astigTypeUtils';

let stdinBuffer = '';

/** Reads one line from stdin, buffering partial input across multiple scan calls. */
export function readScanLine(): string {
  while (true) {
    const newlineIndex = stdinBuffer.indexOf('\n');
    if (newlineIndex >= 0) {
      const line = stdinBuffer.slice(0, newlineIndex).replace(/\r$/, '');
      stdinBuffer = stdinBuffer.slice(newlineIndex + 1);
      return line;
    }

    const buffer = Buffer.alloc(256);
    const bytesRead = fs.readSync(0, buffer, 0, buffer.length, null);
    if (bytesRead <= 0) {
      const remaining = stdinBuffer;
      stdinBuffer = '';
      return remaining.replace(/\r$/, '');
    }

    stdinBuffer += buffer.toString('utf8', 0, bytesRead);
  }
}

/** Resets buffered stdin (useful for isolated test runs). */
export function resetScanInputBuffer(): void {
  stdinBuffer = '';
}

/** Primitive and scalar types that `scan` may write into. */
export function isScannableType(resolvedType: ResolvedType): boolean {
  if (resolvedType.kind === 'array' || resolvedType.kind === 'record' || resolvedType.kind === 'pointer') {
    return false;
  }

  switch (resolvedType.type) {
    case AstigType.Int:
    case AstigType.Float:
    case AstigType.String:
    case AstigType.Char:
    case AstigType.Boolean:
    case AstigType.Any:
      return true;
    default:
      return false;
  }
}

/** Converts raw stdin text into a runtime value matching the target variable type. */
export function coerceScanInput(
  rawInput: string,
  targetType: ResolvedType,
): RuntimeValue {
  const input = rawInput.trim();

  if (!isScannableType(targetType)) {
    throw new ScanError(`Cannot scan into ${formatResolvedType(targetType)}`);
  }

  if (targetType.kind !== 'primitive') {
    throw new ScanError(`Cannot scan into ${formatResolvedType(targetType)}`);
  }

  switch (targetType.type) {
    case AstigType.Int: {
      const parsed = Number.parseInt(input, 10);
      return Number.isNaN(parsed) ? 0 : parsed;
    }
    case AstigType.Float: {
      const parsed = Number.parseFloat(input);
      return Number.isNaN(parsed) ? 0 : parsed;
    }
    case AstigType.Boolean:
      return input.toLowerCase() === 'true';
    case AstigType.Char:
      return input.length > 0 ? input[0] : '';
    case AstigType.String:
    case AstigType.Any:
      return input;
    default:
      throw new ScanError(
        `Cannot scan into ${formatResolvedType(targetType)}`,
      );
  }
}
