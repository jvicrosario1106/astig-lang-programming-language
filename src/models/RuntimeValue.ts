export type RuntimeValue = number | string | boolean | RuntimeRecord | null;

export interface RuntimeRecord {
    recordTypeName: string;
    fields: Map<string, RuntimeValue>;
}