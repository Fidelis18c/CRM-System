const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    message: {
        type: String,
        required: [true, 'Please add a message']
    },
    status: {
        type: String,
        enum: ['NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'LOST'],
        default: 'NEW'
    },
    source: {
        type: String,
        default: 'Website'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for search performance
LeadSchema.index({ name: 'text', email: 'text' });

module.exports = mongoose.model('Lead', LeadSchema);
