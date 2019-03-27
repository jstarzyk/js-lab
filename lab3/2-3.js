let x, y;
let id;
let posX = 0;
let posY = 0;
let elem = document.getElementById("animated");

function getRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

function getRandomElement() {
    let baseX = window.innerWidth / 100;
    let baseY = window.innerHeight / 100;
    x = Math.round(getRandomFloat(0, baseX));
    y = Math.round(getRandomFloat(0, baseY));
}

window.addEventListener("load", getRandomElement);
// getRandomElement();

function frame() {
    posX += x;
    posY += y;
    elem.style.top = posY + 'px';
    elem.style.left = posX + 'px';
}

function startAnimation() {
    // let startX = 0;
    // let startY = 0;
    // let endPosX = 200;
    // let posX = 0;
    // let posY = 0;
    id = window.setInterval(frame, 100);

}

function endAnimation() {
    window.clearInterval(id);
}
