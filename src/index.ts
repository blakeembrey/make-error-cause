import * as makeError from 'make-error'
import { inspect } from 'util'

/**
 * @internal
 */
export const SEPARATOR_TEXT = `\n\nThe following exception was the direct cause of the above exception:\n\n`

export class BaseError extends makeError.BaseError {

  constructor (message: string, public cause?: Error) {
    super(message)
  }

  [inspect.custom || 'inspect'] () {
    return fullStack(this)
  }

}

export function fullStack (error: Error | BaseError) {
  let err: Error | undefined = (error as BaseError).cause
  let fullStack = error.stack

  while (err) {
    fullStack += SEPARATOR_TEXT
    fullStack += err.stack || err.message

    err = (err as BaseError).cause
  }

  return fullStack
}
