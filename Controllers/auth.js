const User = require("../Model/users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { token } = require("morgan");

// Register
exports.register = async (req, res) => {
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
};

// Login
exports.login = async (req, res) => {
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
        "rockettoken", // เป็น SecretOrPrivatekey เป็นชื่อที่แล้วแต่เราจะตั้งเราจะตั้งเป็นชื่ออะไรก็ได้
        { expiresIn: "30m" }, //ตั้งเวลาว่า Token นี้หมดอายุตอนไหน
        // เป็น call back function เอาไว้เช็ค error รับ parameter มา 2 ตัว ถ้ามี error จะเก็บไว้ในตัวแปร error ถ้าไม่ error จะได้ token มา ก็จะเก็บ token ไว้ในตัวแปร token
        (error, token) => {
          if (error) throw error; //ถ้ามี error ก็จะโยน user ออกมาเลย
          res.json({ token }); //ถ้าไม่มีก็จะส่งข้อมูลมาตามที่เราขอไป ในที่นี้คือ token และ ข้อมูลใน payload มาในรูปแบบ json
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
};
