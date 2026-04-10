const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
    leadId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Lead',
        required: true
    },
    adminId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: [true, 'Please add some content']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Note', NoteSchema);
