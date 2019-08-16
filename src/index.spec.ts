import { inspect } from "util";
import { BaseError, fullStack, SEPARATOR_TEXT } from "./index";
import { expect } from "chai";

describe("make error cause", () => {
  it("should render the cause", () => {
    class TestError extends BaseError {}

    class SubTestError extends TestError {}

    const cause = new Error("boom!");
    const testError = new TestError("test boom!", cause);
    const subTestError = new SubTestError("sub test boom!", testError);

    expect(fullStack(cause)).to.equal(cause.stack);
    expect(cause).to.be.instanceOf(Error);

    expect(testError.cause).to.equal(cause);
    expect(fullStack(testError)).to.equal(
      `${testError.stack}${SEPARATOR_TEXT}${cause.stack}`
    );
    expect(inspect(testError)).to.equal(fullStack(testError));
    expect(testError).to.be.instanceOf(Error);
    expect(testError).to.be.instanceOf(BaseError);
    expect(testError).to.be.instanceOf(TestError);

    expect(subTestError.cause).to.equal(testError);
    expect(fullStack(subTestError)).to.equal(
      `${subTestError.stack}${SEPARATOR_TEXT}${testError.stack}${SEPARATOR_TEXT}${cause.stack}`
    );
    expect(inspect(subTestError)).to.equal(fullStack(subTestError));
    expect(subTestError).to.be.instanceOf(Error);
    expect(subTestError).to.be.instanceOf(BaseError);
    expect(subTestError).to.be.instanceOf(TestError);
    expect(subTestError).to.be.instanceOf(SubTestError);
  });

  it("should render extra properties in the full stack", function() {
    class TestDataError extends BaseError {
      public constructor(
        public someData: string,
        message?: string,
        cause?: Error
      ) {
        super(message, cause);
      }
    }

    const cause = new TestDataError("data1", "boom!");
    const testError = new TestDataError("data2", "test boom!", cause);

    let formattedCause = `${cause.stack} {\n  someData: 'data1'\n}`;
    let formattedError = `${testError.stack} {\n  someData: 'data2'\n}`;

    expect(inspect(cause)).to.equal(formattedCause);
    expect(inspect(testError)).to.equal(
      formattedError + SEPARATOR_TEXT + formattedCause
    );
  });
});
