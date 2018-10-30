const promback = require('promback')

function using (PromiseLib) {

    const pback = promback.using(PromiseLib)

    return function timeoutable (fn, ms) {

        return function (...args) {

            return new PromiseLib(function (resolve, reject) {

                const t = setTimeout(function () {
                    reject(new TimeoutError(`Timeout of ${ms}ms expired.`))
                }, ms)

                PromiseLib.resolve(pback(fn)(...args))
                    .then(function (result) {
                        clearTimeout(t)
                        resolve(result)
                    }, function (err) {
                        clearTimeout(t)
                        reject(err)
                    })
            })
        }
    }
}

class TimeoutError extends Error {
    constructor (message) {
        super(message)
        this.name = 'TimeoutError'
        Error.captureStackTrace(this, TimeoutError)
    }
}

module.exports = using(Promise)
module.exports.using = using
module.exports.TimeoutError = TimeoutError
