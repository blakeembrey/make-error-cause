import * as makeError from "make-error";
import { inspect } from "util";

/**
 * @internal
 */
export const SEPARATOR_TEXT = `\n\nThe following exception was the direct cause of the above exception:\n\n`;

/**
 * Create a new error instance of `cause` property support.
 */
export class BaseError extends makeError.BaseError {
  constructor(message?: string, public cause?: Error) {
    super(message);

    Object.defineProperty(this, "cause", {
      writable: false,
      enumerable: false,
      configurable: false
    });
  }

  [inspect.custom || /* istanbul ignore next */ "inspect"]() {
    return fullStack(this);
  }
}

/**
 * Capture the full stack trace of any error instance.
 */
export function fullStack(error: Error | BaseError) {
  const chain: Error[] = [];
  let cause: Error | undefined = error;

  while (cause) {
    chain.push(cause);
    cause = (cause as BaseError).cause;
  }

  return chain
    .map(err => inspect(err, { customInspect: false }))
    .join(SEPARATOR_TEXT);
}
