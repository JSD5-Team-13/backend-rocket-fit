const express = require('express');
const router = express.Router();
const User = require('../models/users');

router.get('/', async (req, res) => {
    try {
        const username = req.query.username;
        const users = await User.find({ user_status: true,
        username: { $regex: username, $options: 'i' }});

        // Check if any users were found.
        if (users.length === 0) {
            return res.status(404).json({ error: "No users found" });
        }

        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching user data", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
