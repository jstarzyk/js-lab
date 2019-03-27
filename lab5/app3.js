const fs = require('fs');

function readJSON(file, cb) {
    fs.readFile(file, 'utf8', (err, data) => {
        if (err) cb(null);
        else cb(data);
    })
}

function add(previousValue, currentValue, index, array) {
    return previousValue + currentValue;
}

function sub(previousValue, currentValue, index, array) {
    return previousValue - currentValue;
}

function mul(previousValue, currentValue, index, array) {
    return previousValue * currentValue;
}

function div(previousValue, currentValue, index, array) {
    return previousValue / currentValue;
}

readJSON(process.argv[2], (text) => {
    if (!text) return;
    const math = JSON.parse(text)['math'];
    if (!math) return;

    math.forEach((operation, index, array) => {
        let str = `line ${index}: `;

        if (!operation['type'] || !operation['data']) {
            return;
        } else if (operation['data'].length === 0) {
            console.log(str);
            return;
        }

        switch (operation['type']) {
            case 'add':
                // console.log(operation['data'].reduce(add));
                str += operation['data'].reduce(add);
                break;
            case 'sub':
                // console.log(operation['data'].reduce(sub));
                str += operation['data'].reduce(sub);
                break;
            case 'div':
                // console.log(operation['data'].reduce(div));
                str += operation['data'].reduce(div);
                break;
            case 'mul':
                // console.log(operation['data'].reduce(mul));
                str += operation['data'].reduce(mul);
                break;
            default:
                break;
        }

        console.log(str);
    });
});
