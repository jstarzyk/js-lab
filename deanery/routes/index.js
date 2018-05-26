const express = require('express');
const router = express.Router();
const passport = require('passport');

const schemas = require('../schemas/schema');
const User = schemas.User;
const Subject = schemas.Subject;
const Assignment = schemas.Assignment;
const Student = schemas.Student;
const Teacher = schemas.Teacher;

/* GET home page. */
router.get('/', function(req, res, next) {
    let user1 = new User({ username: "js", password: "ala", role: "student" });
    user1.save((err) => {
        if (err) res.send('err');
        let student1 = new Student({
            user: user1._id,
            firstName: "Jakub",
            lastName: "Starzyk",
        });
        student1.save((err) => {
            if (err) res.send('err');
        });
    });


    res.render('index', { title: 'Express' });
});

router.get('/subjectlist', function(req, res) {
    // const db = req.db;
    // const collection = db.get('subjects');
    // const collection = db.collection('subjects');
    // collection.find({},{},function(e,docs){
    Subject.find({},function(e,docs){
        res.render('subjectlist', {
            "subjectlist" : docs
        });
    });
});

// /* GET New User page. */
// router.get('/newsubject', function(req, res) {
//     res.render('newsubject', { title: 'Add New Subject' });
// });

router.get('/student', (req, res) => {
    // console.log(`logged user: ${req.user}`);
    // console.log(`logged user role: ${req.user.role}`);
    // res.redirect('/');

    Student.
    findOne({user: req.user.id}).
    populate('user').exec((err, student) => {
       if (err) res.send('error123');
       console.log(student);
    });
    res.redirect('/logout');

});

// /* POST to Add User Service */
// router.post('/addsubject', function(req, res) {
//
//     // Set our internal DB variable
//     const db = req.db;
//
//     // Get our form values. These rely on the "name" attributes
//     const name = req.body.name;
//     const assignments = req.body.assignments;
//
//     // Set our collection
//     const collection = db.collection('subjects');
//     // const collection = db.get('subjects');
//
//     // Submit to the DB
//     collection.insert({
//         "name" : name,
//         "assignments" : [assignments]
//     }, function (err, doc) {
//         if (err) {
//             // If it failed, return error
//             res.send("There was a problem adding the information to the database.");
//         }
//         else {
//             // And forward to success page
//             res.redirect("subjectlist");
//         }
//     });
// });

router.get('/login', function(req, res) {
    res.render('login', { title: 'Login' });
});

router.post('/login',
    passport.authenticate('local',
        {
            // successRedirect: '/student',
            failureRedirect: '/login',
            session: true
        }),
    (req, res) => {
        if (req.user.role === 'student') {
            res.redirect('/student');
        } else if (req.user.role === 'teacher') {
            res.redirect('/teacher');
        }
    }
);

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;
