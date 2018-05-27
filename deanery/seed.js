const schemas = require('./schemas/schema');
const User = schemas.User;
const Subject = schemas.Subject;
const Assignment = schemas.Assignment;
const Student = schemas.Student;
const Teacher = schemas.Teacher;
// const ObjectId = require('mongoose').Schema.ObjectId;

// let teacherUser = new User({
//     username: "spolak",
//     password: "alamakota",
//     role: "teacher"
// });
//
// let teacher = new Teacher({
//     firstName: "Stanislaw",
//     lastName: "Polak",
//     user: teacherUser._id
// });


function seed() {
    let subjects = [];
    let students = [];



    let teacherPromise = addPersonWithUser("spolak", "alamakota", "Stanislaw", "Polak", "teacher");
    teacherPromise.then((t))
    addSubjectWithAssignments("JavaScript", 7, )
}

function addSubjectWithAssignments(name, nAssignments, students) {
    let assignments = [];

    for (let i = 1; i <= nAssignments; i++) {
        let assignment = new Assignment({
            name: "lab" + i
        });
        assignments.push(assignment);
    }

    Assignment.insertMany(assignments).then((assignments) => {
        let subject = new Subject({
            name: name,
            assignments: assignments,
            students: students
        });
        return subject.save();
    });

    // for (let i = 1; i <= nAssignments; i++) {
    //     let assignment = new Assignment({
    //         name: "lab" + i
    //     });
    //
    //     assignments.push(assignment);

    //     assignment.save()
    //         .then((assignment) => {
    //             if (i === nAssignments) {
    //                 let subject = new Subject({
    //                     name: name,
    //                     assignments: assignments,
    //                     students: students
    //                 });
    //
    //                 // subject.save((err) => {
    //                 //     if (err) console.error("save failed");
    //                 // });
    //
    //                 return subject.save();
    //             }
    //         });
    // }
}

function addPersonWithUser(username, password, firstName, lastName, role) {
    let user = new User({
        username: username,
        password: password,
        role: role
    });

    return user.save((err) => {
        if (err) console.error("save failed");
    }).then((user) => {
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

function addSubjectsToTeacher(id, subjects) {
    Teacher.findById(id).exec((err, teacher) => {
        if (err) console.error("findById failed");

        teacher.subjects = subjects;
    });
}

// function addStudentWithUser(username, password, firstName, lastName) {
//     let studentUser = new User({
//         username: username,
//         password: password,
//         role: "student"
//     });
//
//     studentUser.save((err) => {
//         if (err) console.error("save failed");
//
//         let student = new Student({
//             user: studentUser._id,
//             firstName: firstName,
//             lastName: lastName,
//         });
//
//         student.save((err) => {
//             if (err) console.error("save failed");
//         })
//     });
//
//     return studentUser._id;
// }

function addRandomMarksToStudent(id, nMarks, subject) {
    Student.findById(id).exec((err, student) => {
        if (err) console.error("findById failed");

        Subject.findById(subject._id).exec((err, subject) => {
            let marks = [];
            let assignments = subject.assignments;

            for (let i = 0; i < nMarks; i++) {
                marks.push({
                    subject: subject,
                    assignment: assignments[i],
                    value: Math.floor(Math.random() * ((5 - 2) + 1) + 2)
                })
            }

            student.marks = marks;
        });
    });
}


