import makeError = require('make-error')

function makeErrorCause (value: string | Function): makeErrorCause.Constructor<makeErrorCause.BaseError>
function makeErrorCause <T extends Error> (
  value: string | Function,
  super_: { new (...args: any[]): T } = makeErrorCause.BaseError as any
): makeErrorCause.Constructor<T> {
  return makeError(value, super_)
}

namespace makeErrorCause {

  export class BaseError extends makeError.BaseError {

    cause: Error

    constructor (message: string, cause: Error) {
      super(message)
      this.cause = cause
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
