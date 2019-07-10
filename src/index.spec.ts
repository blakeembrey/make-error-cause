import { inspect } from "util";
import { BaseError, fullStack, SEPARATOR_TEXT } from "./index";

describe("make error cause", () => {
  class TestError extends BaseError {}
  class SubTestError extends TestError {}

  it("should render the cause", () => {
    const cause = new Error("boom!");
    const testError = new TestError("test boom!", cause);
    const subTestError = new SubTestError("sub test boom!", testError);

    expect(fullStack(cause)).toEqual(cause.stack);
    expect(cause).toBeInstanceOf(Error);

    expect(testError.cause).toEqual(cause);
    expect(fullStack(testError)).toEqual(
      `${testError.stack}${SEPARATOR_TEXT}${cause.stack}`
    );
    expect(inspect(testError)).toEqual(fullStack(testError));
    expect(testError).toBeInstanceOf(Error);
    expect(testError).toBeInstanceOf(BaseError);
    expect(testError).toBeInstanceOf(TestError);

    expect(subTestError.cause).toEqual(testError);
    expect(fullStack(subTestError)).toEqual(
      `${subTestError.stack}${SEPARATOR_TEXT}${testError.stack}${SEPARATOR_TEXT}${cause.stack}`
    );
    expect(inspect(subTestError)).toEqual(fullStack(subTestError));
    expect(subTestError).toBeInstanceOf(Error);
    expect(subTestError).toBeInstanceOf(BaseError);
    expect(subTestError).toBeInstanceOf(TestError);
    expect(subTestError).toBeInstanceOf(SubTestError);
  });
});
