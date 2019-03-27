let x;
let index = 0;

function submitForm() {
    if (index > 0) {
        return;
    }
    index += 1;
    x = document.getElementById("licznik").value;
    updateCounters(x);
    window.setInterval(decrement, 1000);
}

function updateCounters(value) {
    let counters = document.getElementsByTagName("span");
    for (let i = 0; i < counters.length; i += 1) {
        counters[i].childNodes[0].textContent = value;
    }
}

function decrement() {
    if (x > 0) {
        x -= 1;
        document.getElementById("licznik").value = x;
        updateCounters(x);
    }
}