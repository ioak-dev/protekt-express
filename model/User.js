var mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = new Schema({
    name: { type: String },
    email: { type: String },
    problem: { type: String },
    solution: { type: String },
    preferences: Schema.Types.Mixed,
    resetCode: { type: String }
});

module.exports = mongoose.model('user', User);