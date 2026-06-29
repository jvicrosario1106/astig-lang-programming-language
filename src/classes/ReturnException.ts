import { RuntimeValue } from '../models/RuntimeValue';

/** Carries a function return value up to `executeUserFunction` via exception flow. */
export class ReturnException extends Error {
  constructor(readonly value: RuntimeValue) {
    super('return');
  }
}
