const express = require('express');
const Stock = require('../models/stock');

const router = express.Router();

// Add stock
router.post('/add', async (req, res) => {
    try {
        const stock = new Stock(req.body);
        await stock.save();
        res.status(201).send(stock);
    } catch (error) {
        res.status(400).send(error);
    }
});

// List stocks
router.get('/list', async (req, res) => {
    try {
        const stocks = await Stock.find();
        res.send(stocks);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
