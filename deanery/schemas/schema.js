const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const User = new Schema(
    {
        username: String,
        password: String,
        role: { type: String, enum: ['student', 'teacher'] }
    },
    {
        collection: 'users'
    });

const Subject = new Schema(
    {
        name: String,
        assignments: [{ type: ObjectId, ref: 'Assignment' }],
        students: [{ type: ObjectId, ref: 'Student' }]
    },
    {
        collection: 'subjects'
    });

const Assignment = new Schema(
    {
        name: String,
    },
    {
        collection: 'assignments'
    });

const Student = new Schema(
    {
        user: { type: ObjectId, ref: 'User' },
        firstName: String,
        lastName: String,
        marks: [{
            subject: { type: ObjectId, ref: 'Subject' },
            assignment: { type: ObjectId, ref: 'Assignment' },
            value: Number
        }],
    },
    {
        collection: 'students'
    });

const Teacher = new Schema(
    {
        user: { type: ObjectId, ref: 'User' },
        firstName: String,
        lastName: String,
        subjects: [{ type: ObjectId, ref: 'Subject' }]
    },
    {
        collection: 'teachers'
    });

module.exports.User = mongoose.model('User', User);
module.exports.Subject = mongoose.model('Subject', Subject);
module.exports.Assignment = mongoose.model('Assignment', Assignment);
module.exports.Student = mongoose.model('Student', Student);
module.exports.Teacher = mongoose.model('Teacher', Teacher);

