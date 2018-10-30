t-able
======

A wrapper for a potentially long-running task to signal it's timed out. Does not halt the wrapped task, only signals it's timed out (it's your business how to react on the timeout) by throwing `TimeoutError`. Supports both promises and node-style callbacks.

Install
=======

```sh
    npm i --save t-able
```

Usage
=====

```javascript

const timeoutable = require('t-able')

const potentiallyLongRunningTask = function (arg1, arg2) {
    /* some long-running code */
    return result
}

/*
// or, with callback
const potentiallyLongRunningTask = function (arg1, arg2, cb) {
    // some long-running code
    cb(null, result)
}
*/

const timeoutableTask = timeoutable(potentiallyLongRunningTask, 5000)

try {

    // if task is not completed within 5000 msecs - throw TimeoutError
    cosnt result = await timeoutableTask(arg1, arg2)

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

#### `timeoutable.TimeoutError`

#### `timeoutable.using(PromiseLib) -> timeoutable`
