const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  balance: Number,
  portfolio: [
    {
      stockSymbol: String,
      quantity: Number,
    }
  ],
});

module.exports = mongoose.model("User", userSchema);
