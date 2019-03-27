function fun1(x, y, cb) {
  console.log(`fun1: ${x}, ${y}`);
  cb(x, y);
}

function fun2(x, y, cb) {
  console.log(`fun2: ${x}, ${y}`);
  cb(x, y);
}

function fun3(x, y, cb) {
  console.log(`fun3: ${x}, ${y}`);
  cb(x, y);
}

function fun(cb) {
  fun1(1, 2, (a, b) => {
    fun2(a, b, (c, d) => {
      fun3(c, d, (e, f) => {
        cb(e, f);
      });
    });
  });
}

fun((x, y) => {
  console.log(`ret: ${x}, ${y}`);
});
