/* global describe it */
'use strict'

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')

chai.use(chaiAsPromised)
chai.use(sinonChai)

const expect = chai.expect

const promisify = require('.')

describe('promisify', function () {
  it('calls wrapped function with arguments', function () {
    const fn = sinon.stub().yields()
    const promisified = promisify(fn)
    return expect(promisified('some', 'arguments'))
      .to.be.eventually.fulfilled.then(function () {
        expect(fn).to.have.been.calledWith('some', 'arguments')
      })
  })

  it('rejects when wrapped function returns error', function () {
    const fn = sinon.stub().yields('some error')
    const promisified = promisify(fn)
    return expect(promisified('some', 'arguments'))
      .to.be.eventually.rejectedWith('some error')
  })

  it('resolves when wrapped function returns no error', function () {
    const fn = sinon.stub().yields(null, 'a', 'result')
    const promisified = promisify(fn)
    return expect(promisified('some', 'arguments'))
      .to.eventually.be.fulfilled
  })

  it('resolves single value as such', function () {
    const fn = sinon.stub().yields(null, 42)
    const promisified = promisify(fn)
    return expect(promisified('some', 'arguments'))
      .to.eventually.deep.equal(42)
  })

  it('resolves multiple value as an array', function () {
    const fn = sinon.stub().yields(null, 'a', 'result')
    const promisified = promisify(fn)
    return expect(promisified('some', 'arguments'))
      .to.eventually.deep.equal(['a', 'result'])
  })
})
