import test = require('blue-tape')
import { inspect } from 'util'
import { BaseError, fullStack } from './index'

const SEP_TEXT = '\n\nDuring the above error, another error occurred:\n\n'

test('make error cause', t => {
  class TestError extends BaseError {}
  class SubTestError extends TestError {}

  t.test('render the cause', t => {
    const cause = new Error('boom!')
    const testError = new TestError('test boom!', cause)
    const subTestError = new SubTestError('sub test boom!', testError)

    t.equal(fullStack(cause), cause.stack)
    t.ok(cause instanceof Error)

    t.equal(testError.cause, cause)
    t.equal(fullStack(testError), `${cause.stack}${SEP_TEXT}${testError.stack}`)
    t.equal(inspect(testError), fullStack(testError))
    t.ok(testError instanceof Error)
    t.ok(testError instanceof BaseError)
    t.ok(testError instanceof TestError)

    t.equal(subTestError.cause, testError)
    t.equal(fullStack(subTestError), `${cause.stack}${SEP_TEXT}${testError.stack}${SEP_TEXT}${subTestError.stack}`)
    t.equal(inspect(subTestError), fullStack(subTestError))
    t.ok(subTestError instanceof Error)
    t.ok(subTestError instanceof BaseError)
    t.ok(subTestError instanceof TestError)
    t.ok(subTestError instanceof SubTestError)

    t.end()
  })
})
