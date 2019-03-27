// Draw a bar
function drawBar(context, X, Y, width, height, color) {
    context.save();
    context.fillStyle = color;
    context.fillRect(X, Y, width, height);
    context.restore();
}

// Create a new canvas with default size
function newCanvas(baseWidth, baseHeight) {
    let parentElem = document.getElementById("canvasArea");
    let newCanvas = document.createElement("CANVAS");
    newCanvas.setAttribute("class", "chart");
    newCanvas.style.background = "white";
    newCanvas.width = baseWidth;
    newCanvas.height = baseHeight;

    let newDiv = document.createElement("DIV");
    newDiv.setAttribute("class", "canvasContainer");

    // Possible to set individual scrolling on each canvas
    // newDiv.style.overflow = "auto";
    newDiv.appendChild(newCanvas);

    parentElem.appendChild(newDiv);
    return newCanvas;
}

// Remove all canvases
function removeAllCanvases() {
    let parentElem = document.getElementById("canvasArea");
    parentElem.innerHTML = "";
}

// Create a bar chart
let BarChart = function (options) {
    this.options = options;
    this.colors = options.colors;

    const baseWidth = options.baseWidth;
    const baseHeight = options.baseHeight;

    removeAllCanvases();

    this.canvases = [];
    this.canvases.push(
        {
            obj: newCanvas(baseWidth, baseHeight),
            contentWidth: (baseWidth - this.options.padding * 2),
            barWidthScale: 1,
            toIndex: this.options.data.length - 1,
            maxValue: this.options.data[0].value
        });

    const spaceBetweenBars = 10;
    const maxCanvasWidth = 32767;
    const fontString = "bold " + this.options.padding * 0.8 + "px Go";

    // Draw a bar chart
    this.draw = function () {
        let barWidths = [];

        let index = 0;
        let canvasIndex = 0;
        let totalWidth = -spaceBetweenBars;

        // Create canvases
        while (index < this.options.data.length) {
            let context = this.canvases[canvasIndex].obj.getContext("2d", {alpha: false});
            context.font = fontString;
            let nameLength = context.measureText(this.options.data[index].name).width;
            let valueLength = context.measureText(this.options.data[index].value).width;
            let maxLength = Math.round(Math.max(nameLength, valueLength));

            if (totalWidth + maxLength + spaceBetweenBars + this.options.padding * 2 > maxCanvasWidth) {
                this.canvases[canvasIndex].obj.width = maxCanvasWidth;
                this.canvases[canvasIndex].contentWidth = totalWidth;
                this.canvases[canvasIndex].barWidthScale = 1;
                this.canvases[canvasIndex].toIndex = index - 1;

                this.canvases.push(
                    {
                        obj: newCanvas(baseWidth, baseHeight),
                        contentWidth: (baseWidth - this.options.padding * 2),
                        barWidthScale: 1,
                        toIndex: this.options.data.length - 1,
                        maxValue: this.options.data[index].value
                    });

                totalWidth = -spaceBetweenBars;
                canvasIndex += 1;
                continue;

            } else {
                totalWidth += maxLength + spaceBetweenBars;
                index += 1;
            }

            barWidths.push(maxLength);
        }

        let heightSum = 0;
        for (let index in this.canvases) {
            heightSum += this.canvases[index].maxValue;
        }

        let lastCanvas = this.canvases[this.canvases.length - 1];
        lastCanvas.obj.width = Math.max(lastCanvas.contentWidth, totalWidth) + this.options.padding * 2;
        lastCanvas.barWidthScale = Math.max(lastCanvas.contentWidth, totalWidth) / totalWidth;

        // Set canvas properties
        for (let index in this.canvases) {
            let canvas = this.canvases[index];
            canvas.obj.height = canvas.maxValue / heightSum * baseHeight + this.options.padding * 2;
            let context = canvas.obj.getContext("2d", {alpha: false});
            context.fillStyle = "#ffffff";
            context.fillRect(0, 0, canvas.obj.width, canvas.obj.height);

        }

        let currentCanvas = 0;
        let currentWidth = this.options.padding;
        let canvas = this.canvases[currentCanvas];
        let maxBarHeight = canvas.obj.height - this.options.padding * 2;
        let context = canvas.obj.getContext("2d", {alpha: false});

        let barIndex = 0;
        let index2 = 0;

        // Draw bars with labels
        while (index2 < this.options.data.length) {
            let barWidth = barWidths[index2] * canvas.barWidthScale;

            // Switch to next canvas
            if (index2 === canvas.toIndex + 1) {
                currentCanvas += 1;
                currentWidth = this.options.padding;
                canvas = this.canvases[currentCanvas];
                maxBarHeight = canvas.obj.height - this.options.padding * 2;
                context = canvas.obj.getContext("2d", {alpha: false});
                continue;
            }

            let value = this.options.data[index2].value;
            let name = this.options.data[index2].name;

            let barHeight = Math.round(maxBarHeight * value / canvas.maxValue);

            context.fillStyle = "#000000";
            context.textAlign = "center";
            context.font = fontString;

            // Print word
            context.textBaseline = "bottom";
            context.fillText(
                value,
                currentWidth + (barWidth / 2),
                canvas.obj.height - barHeight - this.options.padding,
                barWidth);

            // Print word frequency
            context.textBaseline = "top";
            context.fillText(
                name,
                currentWidth + (barWidth / 2),
                canvas.obj.height - this.options.padding,
                barWidth);

            // Draw the bar
            drawBar(
                context,
                currentWidth,
                canvas.obj.height - this.options.padding - barHeight,
                barWidth,
                barHeight,
                this.colors[barIndex % this.colors.length]
            );

            currentWidth += barWidth + spaceBetweenBars * canvas.barWidthScale;

            index2 += 1;
            barIndex += 1;
        }
    }
};


let data;
let textArea = document.getElementById("textarea");

function resize() {
    textArea.style.width = Math.round(window.innerWidth * 0.8) + "px";
    textArea.style.height = Math.round(window.innerHeight * 0.2) + "px";

    if (data !== undefined) {
        drawBarChart(data);
    }
}

// Redraw chart on whitespace or enter
function redraw(event) {
    let key = event.key;
    if (/\s/.test(key) || key === "Enter") {
        let newData = sortByValue(getWordsFrequency(textArea.value));
        if (newData !== undefined && JSON.stringify(newData) !== JSON.stringify(data)) {
            data = newData;
            drawBarChart(data);
        }
    }
}

resize();

textArea.addEventListener("keydown", redraw);
window.addEventListener("resize", resize);
document.getElementById("updateButton").onclick = function() {
    redraw({key: "Enter"});
};


function drawBarChart(data) {
    let barChart = new BarChart(
        {
            padding: 20,
            data: data,
            colors: ["#bf616a", "#81a1c1"],
            baseWidth: window.innerWidth,
            baseHeight: Math.round(2 / 3 * window.innerHeight)
        }
    );
    barChart.draw();
}

function sortByValue(obj) {
    let entries = [];

    for (let key in obj) {
        entries.push(
            {
                name: key,
                value: obj[key]
            });
    }

    return entries.sort(function (a, b) {
        return (a.value > b.value) ? -1 : ((b.value > a.value) ? 1 : 0);
    });
}

function getWordsFrequency(inputValue) {
    let words = inputValue
        .trim()
        .split(/\s+/);
    let frequency = {};

    for (let index in words) {
        let word = words[index].replace(/^[^ęóąśłżźćń\w\d]+|[^ęóąśłżźćń\w\d]+$/gu, "");
        if (word === "") {
            continue;
        }

        let count = frequency[word];

        switch (count) {
            case undefined:
                frequency[word] = 1;
                break;
            default:
                frequency[word] = count + 1;
                break;
        }
    }

    return frequency;
}
