const mongoose = require('mongoose');

const boardgameSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    CategoryName: {
        type: String,
        required: true,
    },
    img: {
        type: String,
        required: true,
    },
    lendingPrice: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    }
});

const Boardgame = mongoose.model('Boardgame', boardgameSchema);

module.exports = Boardgame;