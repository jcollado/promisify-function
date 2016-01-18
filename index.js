'use strict'

function promisify (fn) {
  return function () {
    const args = Array.prototype.slice.call(arguments)
    return new Promise(function (resolve, reject) {
      function callback (err) {
        if (err) {
          reject(err)
        } else {
          const data = Array.prototype.slice.call(arguments, 1)
          resolve(data)
        }
      }
      fn.apply(null, args.concat(callback))
    })
  }
}

module.exports = promisify
