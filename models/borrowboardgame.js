const mongoose = require('mongoose');

const borrowSchema = new mongoose.Schema({
    userid: {
        type: String,
        required: true,
    },
    boardgames: [],
    totalprice: {
        type: Number,
        required: true,
    },
    paymentMethod: [],
    status: {
        type: String,
        required: true,
    }
},{
    timestamps: true
});

const Borrow = mongoose.model('Borrow', borrowSchema);

module.exports = Borrow;