const express = require('express');
const User = require('../models/user');

const router = express.Router();

// Register a user
router.post('/register', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).send(user);
    } catch (error) {
        res.status(400).send(error);
    }
});

// View user portfolio
router.get('/:id/portfolio', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).send({ error: 'User not found' });
        res.send(user.portfolio);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
