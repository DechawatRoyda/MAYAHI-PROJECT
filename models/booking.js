const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    room: {
        type: String,
        required: true,
    },
    roomid: {
        type: String,
        required: true,
    },
    roomtype: {
        type: String,
        required: true,
    },
    userid: {
        type: String,
        required: true,
    },
    fromdate: {
        type: String,
        required: true,
    },
    todate: {
        type: String,
        required: true,
    },
    totalprice: {
        type: Number,
        required: true,
    },
    totaldays: {
        type: Number,
        required: true,
    },
    paymentMethod:[],
    status: {
        type: String,
        required: true,
        default: 'waiting',
    }
}, {
    timestamps: true,
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;