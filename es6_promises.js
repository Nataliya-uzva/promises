'use strict';
function getRandomColor2() {
    var promise = new Promise((resolve) => {
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

function getRandomNumber2() {
    var promise = new Promise((resolve) => {
        let timer = getRandomTime();
        setTimeout(() => {
            resolve('Number: ' + Math.round(Math.random() * 100));
        }, timer);
    });
    return promise;
}

function getRandomName2() {
    var promise = new Promise((resolve) => {
        var names = ['Jane', 'Yarik', 'Alla', 'Pasha', 'Ivan', 'Oleg', 'Ivan', 'Tom'];
        let timer = getRandomTime();
        setTimeout(() => {
            resolve('Name: ' + names[Math.round(Math.random() * (names.length - 1))]);
        }, timer);
    });
    return promise;
}

function firstTask2() {
    getRandomColor2().then(toastr["warning"]);
    getRandomName2().then(toastr["warning"]);
    getRandomNumber2().then(toastr["warning"]);
    let requestPromise = fetch('https://test-api.javascript.ru/v1/ssuvorov/tasks');
    requestPromise.then((response) => {

        let dataPromise = response.json();

        dataPromise.then((data) => {
            data.filter(index => { toastr["error"](index.title, 'Real request:');})
        })
    })
}

function secondTask2() {
    turnOnLoading();
    var resolvesArr = [];
    getRandomColor2().then(resolve);
    getRandomName2().then(resolve);
    getRandomNumber2().then(resolve);
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
            turnOfLoading();
            resolvesArr.forEach((item) => {
                if (typeof item === 'object') {
                    item.forEach((elem) => { toastr["info"](elem, 'Real request:') })
                } else {
                    toastr["success"](item);
                }
            });
        }
    }
}
function thirdTask2() {
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

    Promise.all(promises).then((promisesArray) => {
        promisesArray.forEach((item) => {
            turnOfLoading();
            if (typeof item === 'object') {
                item.forEach((elem) => { toastr["warning"](elem, 'Real request:') })
            } else {
                toastr["error"](item);
            }
        });
    });
}

var tasks2 = document.querySelectorAll('.third');
tasks2[0].addEventListener("click", firstTask2);
tasks2[1].addEventListener("click", secondTask2);
tasks2[2].addEventListener("click", thirdTask2);