let timeFunInterval;
let timeFunTimeout;
let timeFunRequest;

let idFunInterval;
let idFunTimeout;
let idFunRequest;

const interval = 2000;
const timeout = 2000;

// let startButton = document.getElementById("start");
// let endButton = document.getElementById("stop");

function submitForm(buttonId) {
    if (buttonId === "start") {
        timeFunInterval = Date.now();
        idFunInterval = window.setInterval(funInterval, interval);
        timeFunTimeout = Date.now();
        idFunTimeout = window.setTimeout(funTimeout, timeout);
        timeFunRequest = Date.now();
        idFunRequest = window.requestAnimationFrame(funRequest);
    } else if (buttonId === "stop") {
        window.clearInterval(idFunInterval);
        window.clearTimeout(idFunTimeout);
        window.cancelAnimationFrame(idFunRequest);
    }
}

// startButton.onclick = function() {
//     timeFunInterval = Date.now();
//     idFunInterval = window.setInterval(funInterval, interval);
//     timeFunTimeout = Date.now();
//     idFunTimeout = window.setTimeout(funTimeout, timeout);
//     timeFunRequest = Date.now();
//     idFunRequest = window.requestAnimationFrame(funRequest);
// };
//
// endButton.onclick = function() {
//     window.clearInterval(idFunInterval);
//     window.clearTimeout(idFunTimeout);
//     window.cancelAnimationFrame(idFunRequest);
// };

function funInterval() {
    let elapsedTime = -timeFunInterval;
    timeFunInterval = Date.now();
    console.log("funInterval: " + (elapsedTime + timeFunInterval));
}

function funTimeout() {
    let elapsedTime = -timeFunTimeout;
    timeFunTimeout = Date.now();
    console.log("funTimeout: " + (elapsedTime + timeFunTimeout));
    idFunTimeout = window.setTimeout(funTimeout, timeout);
}

function funRequest() {
    let elapsedTime = -timeFunRequest;
    timeFunRequest = Date.now();
    console.log("funRequest: " + (elapsedTime + timeFunRequest));
    idFunRequest = window.requestAnimationFrame(funRequest);
}
