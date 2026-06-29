/** Runtime representation of a record instance created with `new TypeName { ... }`. */
export type RecordRuntimeValue = {
  recordTypeName: string;
  fields: Map<string, RuntimeValue>;
};

/** Any value the interpreter can store in a variable or return from a function. */
export type RuntimeValue = number | string | boolean | null | RecordRuntimeValue;

/** Type guard for record values (used by member access and field assignment). */
export function isRecordRuntimeValue(value: RuntimeValue): value is RecordRuntimeValue {
  return (
    typeof value === 'object' &&
    value !== null &&
    'recordTypeName' in value &&
    'fields' in value
  );
}
