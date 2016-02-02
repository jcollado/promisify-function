import 'babel-register'

import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import test from 'ava'

import promisify from './src'

chai.use(chaiAsPromised)
chai.use(sinonChai)

const expect = chai.expect

test('promisify calls wrapped function with arguments', () => {
  const fn = sinon.stub().yields()
  const promisified = promisify(fn)
  return expect(promisified('some', 'arguments'))
    .to.be.eventually.fulfilled.then(function () {
      expect(fn).to.have.been.calledWith('some', 'arguments')
    })
})

test('promisify rejects when wrapped function returns error', () => {
  const fn = sinon.stub().yields('some error')
  const promisified = promisify(fn)
  return expect(promisified('some', 'arguments'))
    .to.be.eventually.rejectedWith('some error')
})

test('promisify resolves when wrapped function returns no error', () => {
  const fn = sinon.stub().yields(null, 'a', 'result')
  const promisified = promisify(fn)
  return expect(promisified('some', 'arguments'))
    .to.eventually.be.fulfilled
})

test('promisify resolves single value as such', () => {
  const fn = sinon.stub().yields(null, 42)
  const promisified = promisify(fn)
  return expect(promisified('some', 'arguments'))
    .to.eventually.deep.equal(42)
})

test('promisify resolves multiple value as an array', () => {
  const fn = sinon.stub().yields(null, 'a', 'result')
  const promisified = promisify(fn)
  return expect(promisified('some', 'arguments'))
    .to.eventually.deep.equal(['a', 'result'])
})

test('promisify throws when no function is passed', () => {
  expect(promisify).to.throw(Error, 'fn parameter must be a function')
})
