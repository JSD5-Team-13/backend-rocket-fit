const jwt = require("jsonwebtoken");

exports.auth = (req, res, next) => {
  try {
    const token = req.headers["rockettoken"];
    if (!token) {
      return res.status(401).send("No Token , Authorization denied");
    }
    // Check ว่า Token ที่ได้มาถูกต้องรึเปล่า ใน jwt.verify ตัวที่2 ให้ใส่ชื่อให้ตรงกับ Secret key เราตั้งไว้ใน Controllers ตรงส่วนของ Login
    const decoded = jwt.verify(token, "rockettoken");

    // สร้างตัวแปรมาเก็บ decoded user ไว้
    req.user = decoded.user;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).send("Token Invavaid!!");
  }
};