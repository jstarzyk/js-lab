const express = require('express');
const router = express.Router();
const passport = require('passport');
const ObjectId = require('mongoose').Types.ObjectId;

const schemas = require('../schemas/schema');
const Subject = schemas.Subject;
const Student = schemas.Student;
const Teacher = schemas.Teacher;
const User = schemas.User;

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

function ensureNotAuthenticated(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    } else if (req.user.role === 'teacher') {
        res.redirect('/teacher');
    } else if (req.user.role === 'student') {
        res.redirect('/student');
    }
}

function ensureTeacher(req, res, next) {
    ensureAuthenticated(req, res, () => {
        if (req.user.role === 'teacher') {
            return next();
        }
        res.redirect('/student');
    });
}

function ensureStudent(req, res, next) {
    ensureAuthenticated(req, res, () => {
        if (req.user.role === 'student') {
            return next();
        }
        res.redirect('/teacher');
    });
}

router.get('/', ensureNotAuthenticated, (req, res) => {
    res.redirect('/login');
});

router.get('/student', ensureStudent, (req, res) => {
    Student
        .findOne({ user: req.user.id })
        .populate('marks.subject')
        .populate('marks.assignment')
        .then(student => {
            let marks = student.marks;
            marks.sort((a, b) => {
                if (a.subject.name === b.subject.name) {
                    if (a.assignment.name === b.assignment.name) return 0;
                    else return (a.assignment.name < b.assignment.name) ? -1 : 1;
                } else {
                    return a.subject.name < b.subject.name ? -1 : 1;
                }
            });

            let subjectWithMarksList = [];

            marks.forEach(mark => {
                let key = mark.subject;

                let swm = subjectWithMarksList.find(swm => swm.subject === key);

                if (swm !== undefined) {
                    swm.marks.push(mark);
                } else {
                    subjectWithMarksList.push({
                        subject: key,
                        marks: [mark]
                    });
                }
            });

            subjectWithMarksList.sort((a, b) => {
                if (a.subject.name === b.subject.name) return 0;
                else return (a.subject.name < b.subject.name) ? -1 : 1;
            });

            let studentFullName = `${student.firstName} ${student.lastName}`;

            res.render('student', {
                title: `Student ${studentFullName}`,
                role: 'student',
                name: studentFullName,
                subjectWithMarksList: subjectWithMarksList,
            });
        });
});

router.get('/teacher', ensureTeacher, (req, res) => {
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

                let assignments = subject.assignments;
                assignments.sort((a, b) => {
                    if (a.name === b.name) return 0;
                    else return (a.name < b.name) ? -1 : 1;
                });

                subject.students.forEach(student => {
                    studentPromises.push(Student.findById(student._id)
                        .populate('marks.subject')
                        .populate('marks.assignment')
                        .then(student => {
                            let mStudent = student;

                            let newMarks = student.marks
                                .filter(mark => mark.subject._id.toString() === subject._id.toString());

                            mStudent.marks = assignments.map(assignment => {
                                let mark = newMarks.find(mark => mark.assignment.id.toString() === assignment._id.toString());
                                if (mark === undefined) {
                                    return {
                                        subject: null,
                                        assignment: assignment._id,
                                        value: null
                                    };
                                } else {
                                    return mark;
                                }
                            });

                            mStudents.push(mStudent);

                        }));
                });

                subjectPromises.push(Promise.all(studentPromises).then(() => {
                    mStudents.sort((a, b) => {
                        if (a.lastName === b.lastName) {
                            if (a.firstName === b.firstName) return 0;
                            else return (a.firstName < b.firstName) ? -1 : 1;
                        } else {
                            return (a.lastName < b.lastName) ? -1 : 1;
                        }
                    });

                    mSubject.students = mStudents;
                    mSubjects.push(mSubject);
                }));
            });

            Promise.all(subjectPromises).then(() => {
                mSubjects.sort((a, b) => {
                    if (a.name === b.name) return 0;
                    else return (a.name < b.name) ? -1 : 1;
                });

                res.render('teacher', {
                    title: `Teacher ${name}`,
                    name: name,
                    role: 'teacher',
                    subjects: mSubjects,
                });
            })

        });
});

router.get('/register', ensureNotAuthenticated, (req, res) => {
    res.render('register', { title: 'Register' });
});

function addPersonWithUser(username, password, firstName, lastName, role) {
    let user = new User({
        username: username,
        password: password,
        role: role
    });

    return user.save().then((user) => {
        let person;

        if (role === "student") {
            person = new Student({
                user: user._id,
                firstName: firstName,
                lastName: lastName,
            });
        } else if (role === "teacher") {
            person = new Teacher({
                user: user._id,
                firstName: firstName,
                lastName: lastName,
            });
        }

        return person.save();
    });
}

router.post('/add_person', (req, res) => {
    let body = req.body;
    User.count({ username: body.username })
        .then(count => {
            if (count === 0) {
                if (body.username.length === 0 ||
                    body.password.length === 0 ||
                    body.firstName.length === 0 ||
                    body.lastName.length === 0) {
                    res.redirect('/register');
                } else {
                    addPersonWithUser(body.username, body.password, body.firstName, body.lastName, body.role).then(() => {
                    console.log('User added!');
                    res.redirect('/login');
                });
                }
            } else {
                console.log(`User with username '${body.username}' already exists!`);
                res.redirect('/register');
            }
        })
});


router.post('/all_logins', (req, res) => {
    let body = [];
    req.on('data', (chunk) => {
        body.push(chunk);
    }).on('end', () => {
        body = Buffer.concat(body).toString();
        User.find({ username: new RegExp(`^${body}`) })
            .then(users => {
                let userNames = [];
                users.forEach(user => userNames.push(user.username));
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.write(JSON.stringify(userNames));
                res.end();
            });
    });
})

router.post('/add_mark', ensureTeacher, (req, res) => {
    let newValue = Number(req.body.value);
    if (newValue === 2.5) {
        log('Invalid mark, choose from (2, 3, 3.5, 4, 4.5, 5)');
    } else {
        Student.update({
                '_id': ObjectId(req.body.studentId),
            },
            { '$push': {
                    'marks': {
                        subject: ObjectId(req.body.subjectId),
                        assignment: ObjectId(req.body.assignmentId),
                        value: newValue
                    }
                }},
            err => {
                if (err) error(err);
            }
        );
    }

    res.redirect('/teacher');
});

router.delete('/delete_mark', ensureTeacher, (req, res) => {
    Student.update(
        { '_id': ObjectId(req.body.studentId) },
        { '$pull': { 'marks': { '_id': ObjectId(req.body.markId) } } },
        err => {
            if (err) error(err);
        }
    );

    res.redirect('/teacher');
});

router.put('/update_mark', ensureTeacher, (req, res) => {
    let newValue = Number(req.body.value);
    if (newValue === 2.5) {
        log('Invalid mark, choose from (2, 3, 3.5, 4, 4.5, 5)');
    } else {
        Student.update({
                '_id': ObjectId(req.body.studentId),
                'marks._id': ObjectId(req.body.markId)
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

router.get('/login', ensureNotAuthenticated, (req, res) => {
    res.render('login', { title: 'Log In' });
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
