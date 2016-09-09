function getRandomColor(callback) {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.round(Math.random() * 15)];
    }
    let timer = getRandomTime();
    setTimeout (() => {
        callback(color, 'Color:');
}, timer);
}
function getRandomNumber(callback) {
    let timer = getRandomTime();
    setTimeout (() => {
        callback(Math.round(Math.random() * 100), 'Number:');
}, timer);
}

function getRandomName(callback) {
    var names = ['Jane', 'Yarik', 'Alla', 'Pasha', 'Ivan', 'Oleg', 'Ivan', 'Tom'];
    let timer = getRandomTime();
    setTimeout (() => {
        callback(names[Math.round(Math.random() * (names.length - 1))], 'Name:');
}, timer);
}

function getRandomTime() {
    var second = 1000;
    return (Math.round(Math.random() * 4) + 1) * second;
}

let callback = toastr["info"];

let arr = [];
function callback1 (param, string) {
    if (param) {
        arr.push({ 'type': string, 'value': param});
        if (arr.length === 6) {
            turnOfLoading ();
            arr.forEach((item) => { toastr["success"](item.value, item.type)});
            arr.length = 0;
        }
    }

}
let obj ={ name: '', color: '', number: '', title: []};
let callback2 = function(key, param) {
    if (param) {
        obj[key] = param;
        if (obj.name !== '' && obj.color !== '' && obj.number !== '' && obj.title.length) {
            turnOfLoading();
            toastr["success"](obj.name, 'Name:');
            toastr["info"](obj.color, 'Color:');
            toastr["warning"](obj.number, 'Number:');
            obj.title.filter(item => toastr["error"](item, 'Real request:'));
            obj.name = ''; obj.color = ''; obj.number = ''; obj.title.length = 0;
        }
    }
}
function firstTask1() {
    getRandomColor(callback);
    getRandomName(callback);
    getRandomNumber(callback);
    let requestPromise = fetch('https://test-api.javascript.ru/v1/ssuvorov/tasks');
    requestPromise.then((response) => {

        let dataPromise = response.json();

        dataPromise.then((data) => {
            data.filter(index => { toastr["error"](index.title, 'Real request:');})
        })
    })
}

function secondTask1() {
    turnOnLoading ();
    getRandomColor(callback1, 'Color:');
    getRandomName(callback1, 'Name:');
    getRandomNumber(callback1, 'Number');
    let requestPromise = fetch('https://test-api.javascript.ru/v1/ssuvorov/tasks');
    requestPromise.then((response) => {

        let dataPromise = response.json();

        dataPromise.then((data) => {
            for (let i = 0; i < data.length; i++) {
                arr.push({ 'type': 'Real request', 'value': data[i].title});
                callback1();
            }
        })
    })
}

function thirdTask1() {
    turnOnLoading ();
    getRandomName(callback2.bind(undefined, 'name'));
    getRandomColor(callback2.bind(undefined, 'color'));
    getRandomNumber(callback2.bind(undefined, 'number'));
    let requestPromise = fetch('https://test-api.javascript.ru/v1/ssuvorov/tasks');
    requestPromise.then((response) => {

        let dataPromise = response.json();

        dataPromise.then((data) => {
            for (let i = 0; i < data.length; i++) {
                obj.title.push(data[i].title);
                callback2();
            }
        })
    })
}

var tasks = document.querySelectorAll('.first');
tasks[0].addEventListener( "click" , firstTask1);
tasks[1].addEventListener( "click" , secondTask1);
tasks[2].addEventListener( "click" , thirdTask1);

