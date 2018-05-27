const schemas = require('./schemas/schema');
const User = schemas.User;
const Subject = schemas.Subject;
const Assignment = schemas.Assignment;
const Student = schemas.Student;
const Teacher = schemas.Teacher;

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/deanery')
    .then(db => console.log('connected'))
    .catch(err => console.error(err.message));

seed();

function seed() {
    let subjects = [];
    let students = [];

    let personPromises = [
        addPersonWithUser("jkowalski", "abc123jk", "Jan", "Kowalski", "student"),
        addPersonWithUser("amalinowski", "abc123am", "Adam", "Malinowski", "student")
    ];

    Promise.all(personPromises)
        .then(results => results.forEach(student => students.push(student)))
        .then(() => Promise.all([
            addSubjectWithAssignments("JavaScript", 7, students),
            addSubjectWithAssignments("Erlang", 7, students),
        ]))
        .then(results => results.forEach(subject => subjects.push(subject)))
        .then(() => {
            let marksPromises = [];
            students.forEach(student => {
                // console.log(student);
                subjects.forEach(subject => marksPromises.push(addRandomMarksToStudent(student._id, subject._id)));
                // subjects.forEach(subject => {
                //     console.log(subject);
                //     marksPromises.push(addRandomMarksToStudent(student, subject))
                // });
            });
            return Promise.all(marksPromises);
        })
        .then(() => addPersonWithUser("spolak", "abc123sp", "Stanisław", "Polak", "teacher"))
        .then(teacher => addSubjectsToTeacher(teacher._id, subjects))
        .then(() => mongoose.disconnect())
        .catch(err => console.error(err));
}

function addSubjectWithAssignments(name, nAssignments, students) {
    let assignments = [];

    for (let i = 1; i <= nAssignments; i++) {
        let assignment = new Assignment({
            name: "lab" + i
        });
        assignments.push(assignment);
    }

    return Assignment.insertMany(assignments).then((assignments) => {
        let subject = new Subject({
            name: name,
            assignments: assignments,
            students: students
        });

        return subject.save();
    });
}

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

function addSubjectsToTeacher(id, subjects) {
    return Teacher.findById(id).then(teacher => {
        teacher.subjects = subjects;

        return teacher.save();
    });
}

function addRandomMarksToStudent(studentId, subjectId) {
    let studentPromise = Student.findById(studentId);
    let subjectPromise = Subject.findById(subjectId);

    Promise.all([studentPromise, subjectPromise]).then(([student, subject]) => {
        subject.assignments.map(assignment => {
            return {
                subject: subject._id,
                assignment: assignment._id,
                value: Math.floor(Math.random() * ((5 - 2) + 1) + 2)
            }
        }).forEach(mark => student.marks.push(mark));

        return student.save();
    });
}

// TODO: Check if possible to pass object instead of id
// function addRandomMarksToStudent(student, subject) {
//     subject.assignments.map(a => {
//         return {
//             subject: subject._id,
//             assignment: a._id,
//             value: Math.floor(Math.random() * ((5 - 2) + 1) + 2)
//         }
//     }).forEach(m => student.marks.push(m));
//
//     return student.save();
// }
//