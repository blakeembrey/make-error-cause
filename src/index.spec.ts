import test = require('blue-tape')
import { BaseError } from './index'

const SEP_TEXT = '\n\nDuring the above error, another error occurred:\n\n'

test('make error cause', t => {
  class TestError extends BaseError {}
  class SubTestError extends TestError {}

  t.test('render the cause', t => {
    const cause = new Error('boom!')
    const testError = new TestError('something bad', cause)
    const subTestError = new SubTestError('more bad', testError)

    t.equal(testError.cause, cause)
    t.equal(testError.fullStack, `${cause.stack}${SEP_TEXT}${testError.stack}`)
    t.ok(testError instanceof Error)
    t.ok(testError instanceof BaseError)
    t.ok(testError instanceof TestError)

    t.equal(subTestError.cause, testError)
    t.equal(subTestError.fullStack, `${cause.stack}${SEP_TEXT}${testError.stack}${SEP_TEXT}${subTestError.stack}`)
    t.ok(subTestError instanceof Error)
    t.ok(subTestError instanceof BaseError)
    t.ok(subTestError instanceof TestError)
    t.ok(subTestError instanceof SubTestError)

    t.end()
  })
})
