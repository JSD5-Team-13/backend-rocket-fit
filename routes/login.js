const User = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const express = require('express')
const router = express.Router()

const SecretKey = process.env.JWT_SECRET_KEY
require('dotenv').config()

router.post("/" , async (req , res) => {
    try {
        //รับ username and password มาจากที่ user กรอกเข้ามา
        const { username, password } = req.body;
    
        //สร้างตัวแปรมา check ว่ามี user นั้นในระบบไหมถ้ามีก็จะมา Check Password ต่อใน function ต่อไป ส่วน update คือเราสามารถเอาไปใช้หน้าบ้านว่าเรา login มาเมื่อไหร่ก็จะ update ให้ได้เป็นต้น
        let user = await User.findOneAndUpdate({ username }, { new: true });
        if (user && user.user_status) {
          // Check Password
          const isMatch = await bcrypt.compare(password, user.password);
          console.log(isMatch);
    
          //ถ้า Password ไม่ Match จะส่งไปบอก หน้าบ้านว่า Username or Password Invalid!!
          if (!isMatch) {
            return res.status(401).send("Username or Password Invalid!!");
          }
    
          //PayLoad เอาไว้เก็บข้อมูลของ User Token , _id(User) , user_status เพื่อที่จะเอาไปเข้ารหัสเป็น Token อีกที
          const payload = {
            user: {
              id: user._id,
              username: user.username,
              user_status: user.user_status,
            },
          };
    
          // Generate Token
          jwt.sign(
            payload, // นำสิ่งที่เรียกจาก Payload ไปเข้ารหัส
            SecretKey, // เป็น SecretOrPrivatekey เป็นชื่อที่แล้วแต่เราจะตั้งเราจะตั้งเป็นชื่ออะไรก็ได้
            { expiresIn: "1h" }, //ตั้งเวลาว่า Token นี้หมดอายุตอนไหน
            // เป็น call back function เอาไว้เช็ค error รับ parameter มา 2 ตัว ถ้ามี error จะเก็บไว้ในตัวแปร error ถ้าไม่ error จะได้ token มา ก็จะเก็บ token ไว้ในตัวแปร token
            (error, token) => {
              if (error) throw error; //ถ้ามี error ก็จะโยน user ออกมาเลย
              res.json({ token ,
              isCreatedProfile : user.isCreatedProflie }); //ถ้าไม่มีก็จะส่งข้อมูลมาตามที่เราขอไป ในที่นี้คือ token และ ข้อมูลใน payload มาในรูปแบบ json
            }
          );
          res.cookie;
        } else {
          return res.status(400).send("Username or Password Invalid!!");
        }
      } catch (error) {
        console.log(error);
        res.status(501).send("User Not found!!");
      }
})

module.exports = router