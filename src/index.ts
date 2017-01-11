import makeError = require('make-error')

export default function makeErrorCause (value: string | Function): Constructor<BaseError>
export default function makeErrorCause <T extends Error> (
  value: string | Function,
  _super: { new (...args: any[]): T }
): Constructor<T>
export default function makeErrorCause <T extends Error> (
  value: string | Function,
  _super: { new (...args: any[]): T } = BaseError as any
): Constructor<T> {
  return makeError(value, _super)
}

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
