/** Control-flow signal thrown by `break` and caught by enclosing loops. */
export class BreakException extends Error {
  constructor() {
    super('break');
  }
}
