const mongoose = require('mongoose');

const ActivityLogSchema = new mongoose.Schema({
    leadId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Lead',
        required: true
    },
    action: {
        type: String,
        required: true
    },
    details: {
        type: String
    },
    adminId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('ActivityLog', ActivityLogSchema);
