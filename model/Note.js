var mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Note = new Schema({
    userId: { type: String },
    type: { type: String },
    title: { type: String },
    content: { type: String },
    notebook: { type: String },
    tags: { type: String },
    flag: { type: String },
    attributes: Schema.Types.Mixed,
    createdAt: { type: Date },
    lastModifiedAt: { type: Date }
});

module.exports = mongoose.model('note', Note);
