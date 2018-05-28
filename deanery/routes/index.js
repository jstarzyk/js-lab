const express = require('express');
const router = express.Router();
const passport = require('passport');
// const back = require('express-back');

const schemas = require('../schemas/schema');
const User = schemas.User;
const Subject = schemas.Subject;
const Assignment = schemas.Assignment;
const Student = schemas.Student;
const Teacher = schemas.Teacher;

const debug = require('debug');
const log = debug('deanery:index');
const error = debug('deanery:index:error');
log.log = console.log.bind(console);


function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

/* GET home page. */
router.get('/', function(req, res, next) {
    res.redirect('/login');
});

router.get('/subjectlist', ensureAuthenticated, (req, res) => {
        Subject.find({},function(e,docs){
            res.render('subjectlist', {
                "subjectlist" : docs
            });
        });
    }
);

router.get('/student', ensureAuthenticated, (req, res) => {
    Student
        .findOne({ user: req.user.id })
        .populate('marks.subject')
        .populate('marks.assignment')
        .then(student => {
            let marks = student.marks;
            marks.sort((a, b) => {
                if (a.subject.name === b.subject.name) {
                    if (a.assignment.name < b.assignment.name) return -1;
                    else if (a.assignment.name > b.assignment.name) return 1;
                    return 0;
                } else {
                    return a.subject.name < b.subject.name ? -1 : 1;
                }
            });

            let marksBySubject = {};
            marks.forEach(mark => {
                let key = mark.subject.name;
                let m = { assignment: mark.assignment.name, value: mark.value };

                if (marksBySubject[key] !== undefined) {
                    let mbs = marksBySubject[key];
                    mbs.push(m);
                    marksBySubject[key] = mbs;
                } else {
                    marksBySubject[key] = [m];
                }
            });

            res.render('student', {
                name: `${student.firstName} ${student.lastName}`,
                marks: marksBySubject,
            });
        });
});

router.get('/teacher', ensureAuthenticated, (req, res) => {
    let name;

    Teacher
        .findOne({ user: req.user.id })
        .populate('subjects')
        .then(teacher => {
            let subjectPromises = [];
            teacher.subjects.forEach(subject => {
                subjectPromises.push(Subject.findById(subject._id)
                    .populate('assignments')
                    .populate({
                        path: 'students',
                        populate: {
                            path: 'marks.subject'
                        }
                    })
                    .populate({
                        path: 'students',
                        populate: {
                            path: 'marks.assignment'
                        }
                    })
                );
            });

            name = `${teacher.firstName} ${teacher.lastName}`;
            return Promise.all(subjectPromises);
        })
        .then(subjects => {
            let subjectPromises = [];
            let mSubjects = [];

            subjects.forEach(subject => {
                let studentPromises = [];
                let mSubject = subject;
                let mStudents = [];

                subject.students.forEach(student => {
                    studentPromises.push(Student.findById(student._id)
                        .populate('marks.subject')
                        .populate('marks.assignment')
                        .then(student => {
                            let mStudent = student;

                            let newMarks = student.marks
                                // TODO: Check why filter doesn't work when comparing by _id
                                .filter(mark => mark.subject.name === subject.name);
                            newMarks.sort((a, b) => {
                                if (a.assignment.name < b.assignment.name) return -1;
                                else if (a.assignment.name > b.assignment.name) return 1;
                                return 0;
                            });
                            // TODO: Maybe add empty mark when no mark for an assignment
                            mStudent.marks = newMarks;
                            mStudents.push(mStudent);

                        }));
                });

                subjectPromises.push(Promise.all(studentPromises).then(() => {
                    mSubject.students = mStudents;
                    mSubjects.push(mSubject);
                }));
            });

            Promise.all(subjectPromises).then(() => {
                res.render('teacher', {
                    name: name,
                    subjects: mSubjects,
                });
            })

        });
});

router.delete('/delete_mark/:student_id/:mark_id', ensureAuthenticated, (req, res) => {
    if (req.user.role === 'student') {
        res.redirect('/student');
    }

    Student.update(
        { '_id': req.params.student_id },
        { '$pull': { 'marks': { '_id': req.params.mark_id } } },
        err => {
            if (err) error(err);
        }
    );

    res.redirect('/teacher');
});

router.put('/update_mark/:student_id/:mark_id', ensureAuthenticated, (req, res) => {
    if (req.user.role === 'student') {
        res.redirect('/student');
    }

    let newValue = Number(req.body['upd']);
    if (newValue === 2.5) {
        log('Invalid mark, choose from (2, 3, 3.5, 4, 4.5, 5)');
    } else {
        Student.update({
                '_id': req.params.student_id,
                'marks._id': req.params.mark_id
            },
            { '$set': {
                    'marks.$.value': newValue
                }},
            err => {
                if (err) error(err);
            }
        );
    }

    res.redirect('/teacher');
});

router.get('/login', (req, res) => {
    res.render('login', { title: 'Login' });
});

router.post('/login',
    passport.authenticate('local',
        {
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
