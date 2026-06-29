import {
  RecordRuntimeValue,
  RuntimeValue,
  isRecordRuntimeValue,
} from '../models/RuntimeValue';

/**
 * Runtime helpers for reading and writing record fields.
 *
 * Supports dotted paths such as `player.stats.score` via a field path array.
 */

/**
 * Reads a value from a record, following nested record fields along `fieldPath`.
 * Throws if any step is not a record or the field does not exist.
 */
export function getRecordFieldValue(
  recordValue: RecordRuntimeValue,
  fieldPath: string[],
): RuntimeValue {
  let currentValue: RuntimeValue = recordValue;

  for (const fieldName of fieldPath) {
    if (!isRecordRuntimeValue(currentValue)) {
      throw new Error(`Cannot access field "${fieldName}" on non-record value`);
    }

    const nextValue = currentValue.fields.get(fieldName);
    if (nextValue === undefined) {
      throw new Error(
        `Field "${fieldName}" not found on record "${currentValue.recordTypeName}"`,
      );
    }

    currentValue = nextValue;
  }

  return currentValue;
}

/**
 * Writes a value into a record field, creating nested assignments when
 * `fieldPath` has more than one segment (e.g. `root.nested.field`).
 */
export function setRecordFieldValue(
  recordValue: RecordRuntimeValue,
  fieldPath: string[],
  value: RuntimeValue,
): void {
  if (fieldPath.length === 0) {
    throw new Error('Record field path cannot be empty');
  }

  if (fieldPath.length === 1) {
    recordValue.fields.set(fieldPath[0], value);
    return;
  }

  const [nextField, ...remainingPath] = fieldPath;
  const nestedValue = recordValue.fields.get(nextField);

  if (nestedValue === undefined || !isRecordRuntimeValue(nestedValue)) {
    throw new Error(`Cannot access nested field "${nextField}" on non-record value`);
  }

  setRecordFieldValue(nestedValue, remainingPath, value);
}
