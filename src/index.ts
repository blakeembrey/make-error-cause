import * as makeError from "make-error";
import { inspect } from "util";

/**
 * @internal
 */
export const SEPARATOR_TEXT = `\n\nThe following exception was the direct cause of the above exception:\n\n`;

const customInspect: symbol | string = inspect.custom || "inspect";

/**
 * Create a new error instance of `cause` property support.
 */
export class BaseError extends makeError.BaseError {
  constructor(message?: string, public cause?: Error) {
    super(message);
  }

  [customInspect]() {
    return fullStack(this);
  }
}

/**
 * Capture the full stack trace of any error instance.
 */
export function fullStack(error: Error | BaseError): string {
  const causeChain = getCauseChain(error);
  const inspections = causeChain.map(e => inspectSingleCauseLink(e));
  return inspections.join(SEPARATOR_TEXT);
}

/**
 * Get an array of errors, with the first array entry being the given
 * error itself, and all the causes following afterwards.
 *
 * @param error The error whose cause chain is to be extracted.
 * @return An array containing the cause chain.
 */
function getCauseChain(error: Error | BaseError): Array<Error | BaseError> {
  const links: Array<Error | BaseError> = [];
  let currentError = error;

  while (true) {
    links.push(currentError);

    if (currentError instanceof BaseError && currentError.cause !== undefined) {
      currentError = currentError.cause;
    } else {
      break;
    }
  }

  return links;
}

function inspectSingleCauseLink(error: Error | BaseError): string {
  let properties = Object.getOwnPropertyDescriptors(error);

  delete properties["cause"];
  Reflect.set(properties, customInspect, {
    writable: false,
    configurable: false,
    enumerable: false,
    value: undefined
  } as PropertyDescriptor);

  // create a shallow copy, omitting "cause" and the custom inspect method
  // so we only get this one error without its cause nicely formatted
  // and with support for custom inspections for any data on the error
  // (turning off customInspect is not necessary this way)
  return inspect(Object.create(Object.getPrototypeOf(error), properties));
}
