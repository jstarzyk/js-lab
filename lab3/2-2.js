const css = "aside  {\n" +
    "    float: right;\n" +
    "    background-color: #EFF;\n" +
    "    border: 1px solid #A8A8A8;\n" +
    "    width: 50%;\n" +
    "    padding: 0px 0px 0px 10px;\n" +
    "    box-sizing: border-box;\n" +
    "}\n" +
    "footer {\n" +
    "    border: 3px dotted black;\n" +
    "    text-align: center;\n" +
    "    margin: 0 auto;\n" +
    "}\n" +
    "\n" +
    "@keyframes rotate {\n" +
    "    0% {\n" +
    "        transform:translate(0px, 0px);\n" +
    "    }\n" +
    "    50% {\n" +
    "        transform:rotate(90deg);\n" +
    "    }\n" +
    "    100% {\n" +
    "        transform:translate(0px, 400px);\n" +
    "    }\n" +
    "}\n" +
    "\n" +
    "\n" +
    "header {\n" +
    "    text-align: center;\n" +
    "    border: 5px solid #A8A8A8;\n" +
    "    background-color: #EFF;\n" +
    "\n" +
    "}\n" +
    "\n" +
    "header h1 {\n" +
    "    animation: rotate 5s infinite;\n" +
    "}\n" +
    "\n" +
    "main {\n" +
    "\n" +
    "    background-color: #EFF;\n" +
    "    border: 1px solid #A8A8A8;\n" +
    "    width: 35%;\n" +
    "    padding: 10px;\n" +
    "    box-sizing: border-box;\n" +
    "}\n" +
    "main pre {\n" +
    "    white-space: pre-wrap;\n" +
    "    padding: 0px 0px 0px 30px;\n" +
    "}\n" +
    "nav {\n" +
    "    border: 3px solid black;\n" +
    "    margin-left: 25px;\n" +
    "    margin-right: 25px;\n" +
    "    text-align: center;\n" +
    "}\n" +
    "nav ul {\n" +
    "    list-style-type: none;\n" +
    "}\n" +
    "nav li {\n" +
    "    display: inline;\n" +
    "}\n";

function setStyle() {
    let style = document.createElement("style");
    style.setAttribute("type", "text/css");
    style.appendChild(document.createTextNode(css));
    document.getElementsByTagName("head")[0].appendChild(style);
}

function unsetStyle() {
    let style = document.getElementsByTagName("style")[0];
    style.parentNode.removeChild(style);
}

function submitForm(buttonId) {
    if (buttonId === "set") {
        setStyle();
    } else if (buttonId === "unset") {
        unsetStyle();
    }
}