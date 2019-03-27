"use strict";

var expect = chai.expect;
 
function suma(num, x) {
    var px = parseInt(x);
    var nx = 0;
    if (!isNaN(px)) {
        nx = px;
    }
    return num + nx;
}

function litery(x) {
    return x.replace(/[\s\d\W]/g, '').length;

}
 
function cyfry(x) {
    var y = x.replace(/[\s\D]/g, '');
    var sum = 0;
    for (i = 0; i < y.length; i++) {
        var c = y.charAt(i);
        sum = sum + Number(c);
    }
    return sum;
}
 
describe('Funkcja suma()', function() {
 it('Zwraca 4 dla 2+2', function() {
   expect(suma(2,2)).to.equal(4);
 });
 it('Zwraca 0 dla -2+2', function() {
   expect(suma(-2,2)).to.equal(0);
 });
});

var i = 1;
var all_sum = 0;
var curr;

while (i < 5) {
    curr = window.prompt("Test " + i, "wartość");
    all_sum = suma(all_sum, curr);
    console.log("\t" + cyfry(curr) + "\t" + litery(curr) + "\t" + all_sum);
    i++;
}

