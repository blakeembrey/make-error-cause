import * as makeError from 'make-error'

export class BaseError extends makeError.BaseError {

  constructor (message: string, public cause?: Error) {
    super(message)
  }

  get fullStack () {
    let err: Error | undefined = this.cause
    let fullStack = this.stack

    while (err) {
      fullStack = `${err.stack}\n\nDuring the above error, another error occurred:\n\n${fullStack}`
      err = (err as BaseError).cause
    }

    return fullStack
  }

}
