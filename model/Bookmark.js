var mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Bookmark = new Schema({
    userId: { type: String },
    href: { type: String },
    title: { type: String },
    tags: { type: String },
    createdAt: { type: Date },
    lastModifiedAt: { type: Date }
});

module.exports = mongoose.model('bookmark', Bookmark);