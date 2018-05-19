import * as makeError from 'make-error'

export class BaseError extends makeError.BaseError {

  constructor (message: string, public cause?: Error) {
    super(message)
  }

  inspect () {
    return fullStack(this)
  }

}

export function fullStack (error: Error | BaseError) {
  let err: Error | undefined = (error as BaseError).cause
  let fullStack = error.stack

  while (err) {
    fullStack = `${err.stack}\n\nThe above exception was the direct cause of the following exception:\n\n${fullStack}`
    err = (err as BaseError).cause
  }

  return fullStack
}
