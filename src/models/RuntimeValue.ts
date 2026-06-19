export type RuntimeValue = number | string | boolean | RuntimeRecord | null | RuntimeValue[];

export interface RuntimeRecord {
    recordTypeName: string;
    fields: Map<string, RuntimeValue>;
}