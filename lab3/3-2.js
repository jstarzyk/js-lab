let elems = document.getElementsByTagName("body")[0].childNodes;

function hide(event) {
    let e = event.target;
    e.style.visibility = "hidden";
    window.setTimeout(function () {
        e.style.visibility = "visible";
    }, 10000);
}

for (let e = 0; e < elems.length; e++) {
    if (elems[e].nodeType === Node.ELEMENT_NODE) {
        elems[e].addEventListener("click", hide);
    }
}