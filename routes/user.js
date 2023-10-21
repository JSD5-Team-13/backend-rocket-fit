const express = require('express');
const router = express.Router();
const User = require('../models/users');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
    try {
        const user = req.user;
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ error: 'Error fetching user data' });
    }
});

module.exports = router;