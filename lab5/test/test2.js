//Źródło: https://codeforgeek.com/2015/07/unit-testing-nodejs-application-using-mocha/
let supertest = require("supertest");

// This agent refers to PORT where program is runninng.
let server = supertest.agent("http://localhost:3000");

// UNIT test begin
describe('GET /', function() {
    it('respond with html', function(done) {
        server
            .get('/')
            .expect('Content-Type', /html/)
            // .end(function(err, res){
            //     if(err){
            //         console.log("error");
            //         done(err);
            //     }
            //     else {
            //         console.log(res);
                    // done();
                // }
            // });
            .expect(200, done);
    });
    it(`test addition`, (done) => {
        let x = parseInt(process.env.X);
        let y = parseInt(process.env.Y);
        let z = x + y;
        server
            .post('/add')
            .send({x: x, y: y})
            .expect("Content-Type", /json/)
            // .expect(200, {z: z}, done)
            .expect(200, {z: z});
        done();
        console.log(`\tok: ${x} + ${y} = ${z}`);

    })
});
