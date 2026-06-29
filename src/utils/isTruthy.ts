import { RuntimeValue } from '../models/RuntimeValue';

/** Returns whether a runtime value should be treated as true in conditions and loops. */
export const isTruthy = (value: RuntimeValue): boolean => {
  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'number') {
    return value !== 0;
  }
  if (typeof value === 'string') {
    return value.length > 0;
  }
  return false;
};
