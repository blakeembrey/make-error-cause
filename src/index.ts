import * as makeError from "make-error";

/**
 * See https://nodejs.org/docs/latest/api/util.html#custom-inspection-functions-on-objects
 */
const customInspectSymbol = Symbol.for('nodejs.util.inspect.custom');

/**
 * See https://docs.deno.com/api/node/util/~/InspectOptions
 */
type InspectOptions = {
  customInspect: boolean;
}

type InspectFunction = (value: any, options?: InspectOptions) => string;

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

  [customInspectSymbol](depth: number, inspectOptions: InspectOptions, inspect: InspectFunction): string {
    return fullStack(this, inspect);
  }
}

/**
 * Capture the full stack trace of any error instance.
 */
export function fullStack(error: Error | BaseError, inspect: InspectFunction): string {
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
