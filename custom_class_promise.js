var PENDING = 0;
var FULFILLED = 1;
var REJECTED = 2;

function CustomPromise(fn) {
    var state = PENDING;
    var value = null;
    var handlers = [];

    function fulfill(result) {
        state = FULFILLED;
        value = result;
        handlers.forEach(handle);
        handlers = null;
    }

    function reject(error) {
        state = REJECTED;
        value = error;
        handlers.forEach(handle);
        handlers = null;
    }

    function resolve(result) {
        try {
            var then = getThen(result);
            if (then) {
                doResolve(then.bind(result), resolve, reject)
                return
            }
            fulfill(result);
        } catch (e) {
            reject(e);
        }
    }

    function handle(handler) {
        if (state === PENDING) {
            handlers.push(handler);
        } else {
            if (state === FULFILLED &&
                typeof handler.onFulfilled === 'function') {
                handler.onFulfilled(value);
            }
            if (state === REJECTED &&
                typeof handler.onRejected === 'function') {
                handler.onRejected(value);
            }
        }
    }

    function getThen(value) {
        var t = typeof value;
        if (value && (t === 'object' || t === 'function')) {
            var then = value.then;
            if (typeof then === 'function') {
                return then;
            }
        }
        return null;
    }

    function doResolve(fn, onFulfilled, onRejected) {
        var done = false;
        try {
            fn(function (value) {
                if (done) return
                done = true
                onFulfilled(value)
            }, function (reason) {
                if (done) return
                done = true
                onRejected(reason)
            })
        } catch (ex) {
            if (done) return
            done = true
            onRejected(ex)
        }
    }

    this.done = function (onFulfilled, onRejected) {
        setTimeout(function () {
            handle({
                onFulfilled: onFulfilled,
                onRejected: onRejected
            });
        }, 0);
    }

    this.then = function (onFulfilled, onRejected) {
        var self = this;
        return new CustomPromise(function (resolve, reject) {
            return self.done(function (result) {
                if (typeof onFulfilled === 'function') {
                    try {
                        return resolve(onFulfilled(result));
                    } catch (ex) {
                        return reject(ex);
                    }
                } else {
                    return resolve(result);
                }
            }, function (error) {
                if (typeof onRejected === 'function') {
                    try {
                        return resolve(onRejected(error));
                    } catch (ex) {
                        return reject(ex);
                    }
                } else {
                    return reject(error);
                }
            });
        });
    }

    doResolve(fn, resolve, reject);
}

CustomPromise.all = function (arrayPromises) {
    var accumulator = [];
    var ready = new CustomPromise((resolve) => { return resolve(null)});

    arrayPromises.forEach(function (promise) {
        ready = ready.then(function () {
            return promise;
        }).then(function (value) {
            accumulator.push(value);
        });
    });

    return ready.then(function () { return accumulator; });
}


'use strict';
function getRandomColor1() {
    var promise = new CustomPromise((resolve) => {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.round(Math.random() * 15)];
        }
        let timer = getRandomTime();
        setTimeout(() => {
            resolve('Color: ' + color);
        }, timer);
    });
    return promise;
}

function getRandomNumber1() {
    var promise = new CustomPromise((resolve) => {
        let timer = getRandomTime();
        setTimeout(() => {
            resolve('Number: ' + Math.round(Math.random() * 100));
        }, timer);
    });
    return promise;
}

function getRandomName1() {
    var promise = new CustomPromise((resolve) => {
        var names = ['Jane', 'Yarik', 'Alla', 'Pasha', 'Ivan', 'Oleg', 'Ivan', 'Tom'];
        let timer = getRandomTime();
        setTimeout(() => {
            resolve('Name: ' + names[Math.round(Math.random() * (names.length - 1))]);
        }, timer);
    });
    return promise;
}

function firstTask1() {
    getRandomColor1().then(toastr["warning"]);
    getRandomName1().then(toastr["info"]);
    getRandomNumber1().then(toastr["error"]);
    let requestPromise = fetch('https://test-api.javascript.ru/v1/ssuvorov/tasks');
    requestPromise.then((response) => {

        let dataPromise = response.json();

        dataPromise.then((data) => {
            data.filter(index => { toastr["success"](index.title, 'Real request:');})
        })
    })
}

function secondTask1() {
    turnOnLoading();
    var resolvesArr = [];
    getRandomColor1().then(resolve);
    getRandomName1().then(resolve);
    getRandomNumber1().then(resolve);
    fetch('https://test-api.javascript.ru/v1/ssuvorov/tasks')
        .then((response) => {
            return response.json();
        })
        .then((res) => {
            let arr1 = [];
            res.forEach((item) => { arr1.push(item.title) });
            return arr1;
        }).then(resolve);


    function resolve(data) {
        if (data) {
            resolvesArr.push(data);
        }
        if (resolvesArr.length === 4) {
            resolvesArr.forEach((item) => {
                turnOfLoading();
                if (typeof item === 'object') {
                    item.forEach((elem) => { toastr["warning"](elem, 'Real request:') })
                } else {
                    toastr["success"](item);
                }
            });
        }
    }
}
function thirdTask1() {
    turnOnLoading();
    let requestPromise = fetch('https://test-api.javascript.ru/v1/ssuvorov/tasks')
        .then((response) => {
            return response.json();
        })
        .then((res) => {
            let arr1 = [];
            res.forEach((item) => { arr1.push(item.title) });
            return arr1;
        });

    let promises = [getRandomName2(), getRandomColor2(), getRandomNumber2(), requestPromise];

    CustomPromise.all(promises).then((promisesArray) => {
        promisesArray.forEach((item) => {
            turnOfLoading();
            if (typeof item === 'object') {
                item.forEach((elem) => { toastr["error"](elem, 'Real request:') })
            } else {
                toastr["info"](item);
            }
        });
    });
}

var tasks1 = document.querySelectorAll('.second');
tasks1[0].addEventListener("click", firstTask1);
tasks1[1].addEventListener("click", secondTask1);
tasks1[2].addEventListener("click", thirdTask1);