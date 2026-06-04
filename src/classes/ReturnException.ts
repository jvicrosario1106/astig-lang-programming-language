import { RuntimeValue } from '../models/RuntimeValue';

export class ReturnException extends Error {
  constructor(readonly value: RuntimeValue) {
    super('return');
  }
}
