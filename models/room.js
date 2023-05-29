const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    phonenumber: {
        type: Number,
        required: true
    },
    rentperday: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imageurls: [],
    currentbookings: [],
    maxcount: {
        type: Number,
        required: true
    }
},{
    timestamps: true
});

const roomModel = mongoose.model('Room', roomSchema);

module.exports = roomModel;