import test = require('blue-tape')
import makeErrorCause, { BaseError } from './index'

test('make error cause', t => {
  const TestError = makeErrorCause('TestError')
  const SubTestError = makeErrorCause('SubTestError', TestError)

  t.test('render the cause', t => {
    const cause = new Error('boom!')
    const error = new TestError('something bad', cause)
    const again = new SubTestError('more bad', error)

    t.equal(error.cause, cause)
    t.equal(error.toString(), 'TestError: something bad\nCaused by: Error: boom!')
    t.ok(error instanceof Error)
    t.ok(error instanceof BaseError)
    t.ok(error instanceof TestError)

    t.equal(again.cause, error)
    t.equal(again.toString(), 'SubTestError: more bad\nCaused by: TestError: something bad\nCaused by: Error: boom!')
    t.ok(again instanceof Error)
    t.ok(again instanceof BaseError)
    t.ok(again instanceof TestError)
    t.ok(again instanceof SubTestError)

    t.end()
  })
})
