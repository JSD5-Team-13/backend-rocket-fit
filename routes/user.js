const express = require("express");
const router = express.Router();
const User = require("../models/users");
const auth = require("../middleware/auth");

router.put("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const updateUser = req.body;
    const user = await User.findByIdAndUpdate(id, updateUser);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.isCreatedProflie = true;
    await user.save();

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Error fetching user data" });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const { username } = req.user;
    const userData = await User.findOne({ username });

    if (!userData) {
      res.status(404).json({ error: "User not found" });
    }
    //cal age
    const dob = new Date(userData.DateOfBirth);
    const age = new Date().getFullYear() - dob.getFullYear();

    //เตรียมของสำหรับใช้หน้าบ้าน useContext(userData)
    //เตรียม data ให้หน้าบ้านใช้งานได้เลย //ในที่นี้เลือกมาบางส่วน
    //เตรียมของ req ที่รับมา ให้ math กับข้อมูลหลังบ้าน userSchema
    res.status(200).json({
      id: userData._id,
      username: userData.username,
      user_status: userData.user_status,
      weight: userData.weight,
      height: userData.height,
      age,
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Error fetching user data" });
  }
});

module.exports = router;
