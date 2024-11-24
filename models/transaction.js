const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    stockSymbol: String,
    type: String, // buy or sell
    quantity: Number,
    price: Number,
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Transaction', transactionSchema);
