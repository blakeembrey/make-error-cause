import makeError = require('make-error')

function makeErrorCause (value: string | Function): makeErrorCause.Constructor<makeErrorCause.BaseError>
function makeErrorCause <T extends Error> (
  value: string | Function,
  _super: { new (...args: any[]): T }
): makeErrorCause.Constructor<T>
function makeErrorCause <T extends Error> (
  value: string | Function,
  _super?: { new (...args: any[]): T } = makeErrorCause.BaseError as any
): makeErrorCause.Constructor<T> {
  return makeError(value, _super)
}

namespace makeErrorCause {

  export class BaseError extends makeError.BaseError {

    constructor (message: string, public cause?: Error) {
      super(message)
    }

    toString () {
      return super.toString() + (this.cause ? `\nCaused by: ${this.cause.toString()}` : '')
    }

  }

  export interface Constructor <T> {
    new (message: string, cause?: Error): T
    super_: any
    prototype: T
  }

}

export = makeErrorCause
