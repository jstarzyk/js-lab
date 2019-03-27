var button = document.getElementById('button');
var formularz = document.getElementById('formularz');
var pole = document.getElementById('pole_tekstowe');

var x = pole.value;

pole.addEventListener('input', function () {
    x = this.value;
});

function eventHandler() {
    console.log(x, typeof x);
    return false;
}

formularz.onsubmit = eventHandler;
button.onclick = eventHandler; 
