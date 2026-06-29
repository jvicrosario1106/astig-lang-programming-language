/** Control-flow signal thrown by `continue` and caught by enclosing loops. */
export class ContinueException extends Error {
  constructor() {
    super('continue');
  }
}
