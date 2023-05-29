const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    userid: {
        type: String,
        required: true,
    },
    companyName: {
        type: String,
        required: true,
    },
    companyEmail: {
        type: String,
        required: true,
    },
    companyPhone: {
        type: String,
        required: true,
    },
    companyAddress: {
        type: String,
        required: true,
    },
    eventType: {
        type: String,
        required: true,
    },
    fromDate: {
        type: String,
        required: true,
    },
    toDate: {
        type: String,
        required: true,
    },
    eventDetails: {
        type: String,
        required: true,
    },
    eventRequirements: [],
    status: {
        type: String,
        required: true,
        default: 'waiting',
    }
}, {
    timestamps: true,
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;