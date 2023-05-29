const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userid: {
        type: String,
        required: true,
    },
    orderitems: [],
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

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;