'use strict'

function promisify (fn) {
  if (typeof fn !== 'function') {
    throw new Error('fn parameter must be a function')
  }
  return function () {
    const args = Array.prototype.slice.call(arguments)
    return new Promise(function (resolve, reject) {
      function callback (err) {
        if (err) {
          reject(err)
        } else {
          const data = arguments.length === 2
            ? arguments[1]
            : Array.prototype.slice.call(arguments, 1)
          resolve(data)
        }
      }
      fn.apply(null, args.concat(callback))
    })
  }
}

module.exports = promisify
