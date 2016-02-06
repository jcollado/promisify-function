import sinon from 'sinon'
import test from 'ava'

import promisify from './src'

test('promisify calls wrapped function with arguments', (t) => {
  const fn = sinon.stub().yields()
  const promisified = promisify(fn)
  return promisified('some', 'arguments').then(() => {
    t.true(fn.calledWith('some', 'arguments'))
  })
})

test('promisify rejects when wrapped function returns error', (t) => {
  const expected = 'some error'
  const fn = sinon.stub().yields(expected)
  const promisified = promisify(fn)
  return t.throws(promisified('some', 'arguments'), expected)
})

test('promisify resolves when wrapped function returns no error', (t) => {
  const fn = sinon.stub().yields(null, 'a', 'result')
  const promisified = promisify(fn)
  return t.doesNotThrow(promisified('some', 'arguments'))
})

test('promisify resolves single value as such', (t) => {
  const fn = sinon.stub().yields(null, 42)
  const promisified = promisify(fn)
  return promisified('some', 'arguments').then((result) => {
    t.is(result, 42)
  })
})

test('promisify resolves multiple value as an array', (t) => {
  const fn = sinon.stub().yields(null, 'a', 'result')
  const promisified = promisify(fn)
  return promisified('some', 'arguments').then((result) => {
    t.same(result, ['a', 'result'])
  })
})

test('promisify throws when no function is passed', (t) => {
  t.throws(promisify, 'fn parameter must be a function')
})
