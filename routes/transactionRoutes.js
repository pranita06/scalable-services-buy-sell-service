const express = require('express');
const User = require('../models/user');
const Stock = require('../models/stock');
const Transaction = require('../models/transaction');

const router = express.Router();

// Buy stock
router.post("/buy", async (req, res) => {
    const { userId, stockSymbol, quantity } = req.body;
  
    try {
      // Check if user exists
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ error: "User not found" });
  
      // Check if stock exists
      const stock = await Stock.findOne({ symbol: stockSymbol });
      if (!stock) return res.status(404).json({ error: "Stock not found" });
  
      // Check if enough stock is available
      if (stock.availableQuantity < quantity) {
        return res.status(400).json({ error: "Not enough stock available" });
      }
  
      // Calculate total price
      const totalPrice = stock.price * quantity;
  
      // Check if user has enough balance
      if (user.balance < totalPrice) {
        return res.status(400).json({ error: "Insufficient balance" });
      }
  
      // Deduct balance and update user's portfolio
      user.balance -= totalPrice;
      const existingStock = user.portfolio.find((item) => item.stockSymbol === stockSymbol);
      if (existingStock) {
        existingStock.quantity += quantity;
      } else {
        user.portfolio.push({ stockSymbol, quantity });
      }
  
      // Save user
      await user.save();
  
      // Deduct stock quantity
      stock.availableQuantity -= quantity;
      await stock.save();
  
      // Return success response
      res.status(200).json({ message: "Stock purchased successfully", user });
    } catch (err) {
      console.error("Error occurred:", err);
      res.status(500).json({ error: "An error occurred" });
    }
});
  
  

// Sell stock
router.post('/sell', async (req, res) => {
    const { userId, stockSymbol, quantity } = req.body;

    try {
        const user = await User.findById(userId);
        const stock = await Stock.findOne({ symbol: stockSymbol });

        if (!user || !stock) return res.status(404).send({ error: 'User or Stock not found' });

        const portfolioStock = user.portfolio.find((s) => s.stockSymbol === stockSymbol);
        if (!portfolioStock || portfolioStock.quantity < quantity)
            return res.status(400).send({ error: 'Insufficient stock in portfolio' });

        const totalRevenue = stock.price * quantity;

        // Update balances and stock quantities
        user.balance += totalRevenue;
        portfolioStock.quantity -= quantity;
        if (portfolioStock.quantity === 0) {
            user.portfolio = user.portfolio.filter((s) => s.stockSymbol !== stockSymbol);
        }
        stock.availableQuantity += quantity;

        await user.save();
        await stock.save();

        const transaction = new Transaction({
            userId,
            stockSymbol,
            type: 'sell',
            quantity,
            price: stock.price,
        });
        await transaction.save();

        res.send(transaction);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Route to get all transactions
router.get("/list", async (req, res) => {
    try {
      const transactions = await Transaction.find();
      res.status(200).json(transactions);
    } catch (err) {
      res.status(500).json({ error: "An error occurred while fetching transactions" });
    }
});

module.exports = router;
