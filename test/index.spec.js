const assert = require('assert')
const sinon = require('sinon')
const timeoutable = require('..')

describe('timeoutable', function () {

    it('calls wrapped function with the args passed to the wrapper',
        async function () {

        const fn = sinon.stub()

        const wrapped = timeoutable(fn)

        await wrapped(1, 'abc', true, undefined)

        assert.deepStrictEqual(fn.args, [
            [ 1, 'abc', true, undefined ]
        ])
    })

    it('returns the result of the wrapped function', async function () {

        const expected = {}

        const fn = sinon.stub().resolves(expected)

        const wrapped = timeoutable(fn)

        const result = await wrapped(1, 'abc', true, undefined)

        assert.strictEqual(result, expected)
    })

    it('supports node-callbacks', async function () {

        const fn = sinon.spy(function (a, b, cb) {
            setTimeout(function () {
                cb(null, a + b)
            }, 10)
        })

        const wrapped = timeoutable(fn, 20)

        const result = await wrapped(1, 2)

        assert.strictEqual(fn.args[0][0], 1)
        assert.strictEqual(fn.args[0][1], 2)
        assert.strictEqual(typeof fn.args[0][2], 'function')

        assert.deepStrictEqual(result, 3)
    })

    it('rejects when wrapped function throws', async function () {

        const e = new Error('A test error')
        const fn = sinon.stub().throws(e)

        const wrapped = timeoutable(fn)

        try {

            await wrapped()

            shouldNotBeCalled()

        } catch (err) {
            assert.strictEqual(err, e)
        }
    })

    it('rejects when wrapped function rejects', async function () {

        const e = new Error('A test error')
        const fn = sinon.stub().rejects(e)

        const wrapped = timeoutable(fn)

        try {

            await wrapped()

            shouldNotBeCalled()

        } catch (err) {
            assert.strictEqual(err, e)
        }
    })

    it('rejects when wrapped function calls node-callback with an error',
        async function () {

        const e = new Error('A test error')
        const fn = sinon.spy(function (cb) {
            cb(e)
        })

        const wrapped = timeoutable(fn)

        try {

            await wrapped()

            shouldNotBeCalled()

        } catch (err) {
            assert.strictEqual(err, e)
        }
    })

    it('throws TimeoutError when wrapped function takes longer '
        + 'than specified timeout', async function () {

        const fn = sinon.stub().resolves(timeout(1000))

        const wrapped = timeoutable(fn, 500)

        try {

            await wrapped()

            shouldNotBeCalled()

        } catch (err) {

            assert.strictEqual(err.name, 'TimeoutError')
            assert(err instanceof timeoutable.TimeoutError)
            assert.strictEqual(err.message, 'Timeout of 500ms expired.')
        }
    })

    it('passes this reference to the wrapped function', async function () {

        const fn = function (v) { return this.a + v }

        const o = {
            a: 1000,
            wrapped: timeoutable(fn, 10),
        }

        const result = await o.wrapped(111)

        assert.strictEqual(result, 1111)
    })
})

function timeout (ms) {
    return new Promise(function (resolve) {
        setTimeout(resolve, ms)
    })
}

function shouldNotBeCalled () {
    throw new Error('Should not be called.')
}
