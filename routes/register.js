const User = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const express = require('express')
const router = express.Router()

router.post("/" , async (req,res) => {
    try {
        //Check User ว่ามีในระบบแล้วหรือยัง โดยเช็คจาก email ถ้ามี email นี้ในระบบแล้วให้ทำ function ใน if
        const { username, email, password } = req.body;
        let user = await User.findOne({ email });
        if (user) {
          return res.status(401).send("User Already exists");
        }
    
        // แต่ถ้า Check email แล้วไม่มี email นั้นในระบบ จะมาทำส่วนต่อไป คือการลงทะเบียน
        user = new User({
          username,
          email,
          password,
        });
    
        // Encrypt คือการนำ password ที่ user ส่งมา มาทำการ hash
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();
    
        res.send("Register Success");
      } catch (error) {
        console.log(error);
        res.status(500).send("Server Error!!");
      }
})

module.exports = router