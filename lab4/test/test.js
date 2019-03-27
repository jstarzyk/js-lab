var expect = require('chai').expect;
var modul = require('../modul');

let x = parseFloat(process.env.X);
let y = parseFloat(process.env.Y);

describe('Funkcja suma()', function() {
  it('Zwraca ' + (x+y) + ' dla ' + x + '+' + y, function() {
    expect(modul.suma(x,y)).to.equal(x+y);
  });
//   it('Zwraca 0 dla -2+2', function() {
//     expect(modul.suma(-2,2)).to.equal(0);
//   });
});