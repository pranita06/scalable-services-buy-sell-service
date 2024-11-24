const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema({
  symbol: { type: String, unique: true },
  price: Number,
  availableQuantity: Number,
});

module.exports = mongoose.model("Stock", stockSchema);
