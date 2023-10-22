const express = require('express');
const router = express.Router();
const User = require('../models/users');

router.get('/', async (req , res) => {
    try {
        const users = await User.find({user_status : true})
        res.status(200).json(users)
    } catch (error) {
        console.log("Error fetching user data" , error);
        res.status(500).send("Internal Error")
    }
})

module.exports = router