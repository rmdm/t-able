timeoutable-wrapper
===================
[![Build Status](https://travis-ci.org/rmdm/timeoutable-wrapper.svg?branch=master)](https://travis-ci.org/rmdm/timeoutable-wrapper)
[![Coverage Status](https://coveralls.io/repos/github/rmdm/timeoutable-wrapper/badge.svg?branch=master)](https://coveralls.io/github/rmdm/timeoutable-wrapper?branch=master)

A wrapper for a potentially long-running task to signal it's timed out. Does not halt the wrapped task, only signals it's timed out (it's your business how to react on the timeout) by throwing `TimeoutError`. Supports both promises and node-style callbacks.

Install
=======

```sh
    npm i --save timeoutable-wrapper
```

Usage
=====

```javascript

const timeoutable = require('timeoutable-wrapper')

const potentiallyLongRunningTask = async function (arg1, arg2) {
    /* some long-running code */
    return result
}

// or, with callback
const anotherPotentiallyLongRunningTask = function (arg1, arg2, cb) {
    /* some long-running code */
    cb(null, result)
}

const timeoutableTask = timeoutable(potentiallyLongRunningTask, 5000)
const anotherTimeoutableTask = timeoutable(anotherPotentiallyLongRunningTask, 5000)

try {

    // if task is not completed within 5000 msecs - throw TimeoutError
    const result = await timeoutableTask(arg1, arg2)

    // if another task is not called callback within 5000 msecs - throw TimeoutError
    const result2 = await anotherTimeoutableTask(arg1, arg2)

} catch (err) {
    if (err.name === 'TimeoutError') { // or err instanceof timeoutable.TimeoutError
        // it's timeout
    } else {
        // it's something else
    }
}
```

API
===

#### `timeoutable (fn, ms) -> Function`

Wraps passed function and returns another one, which throws `TimeoutError` when specified `ms` expired before `fn` returned result.

#### `timeoutable.using(PromiseLib) -> timeoutable`

Returns an instance of **timeoutable-wrapper** that uses specified `PromiseLib` to construct and return promises from the lib.

#### `timeoutable.TimeoutError`

Type for errors thrown on expired timeouts.
