import test = require('blue-tape')
import makeErrorCause = require('./index')

test('make error cause', t => {
  const TestError = makeErrorCause('TestError')

  t.test('render the cause', t => {
    const cause = new Error('boom!')
    const error = new TestError('something bad', cause)
    const again = new TestError('more bad', error)

    t.equal(error.cause, cause)
    t.equal(error.toString(), 'TestError: something bad\nCaused by: Error: boom!')

    t.equal(again.cause, error)
    t.equal(again.toString(), 'TestError: more bad\nCaused by: TestError: something bad\nCaused by: Error: boom!')

    t.end()
  })
})
