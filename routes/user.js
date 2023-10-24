const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/users");
const auth = require("../middleware/auth");
const multer = require("multer");
const { cloudinary } = require("../configs/cloudinay");
router.use(express.json({ limit: "50mb" }));
router.use(express.urlencoded({ limit: "50mb", extended: true }));

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
});

const fs = require("fs");
const tempFilePath = "temp-file.png"; // เลือกที่จะใช้เป็นไฟล์ชั่วคราว

//GET user profile
router.get("/setting/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    console.log("User ID:", userId);
    const token = req.headers.authorization;
    // console.log('Authentication Token:', token);
    const user = await User.findById(userId);
    if (!user) {
      // No user found with the given ID
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//PUT update user
router.put("/setting/account/:id", auth, async (req, res) => {
  try {
    const userId = req.params.id;
    console.log("User ID:", userId);
    const token = req.headers.authorization;
    // console.log('Authentication Token:', token);
    const userData = req.body;
    const updatedUser = await User.findByIdAndUpdate(userId, userData);

    if (!updatedUser) {
      return res.status(404).json({ message: "user data not found" });
    }

    res
      .status(200)
      .json({ message: "User data updated successfully", updatedUser });
  } catch (error) {
    console.error("Update user account error:", error);
    res.status(500).json({ error: "Update User Account Error" });
  }
});

//PUT update user password
router.put("/setting/password/:id", async (req, res) => {
  try {
    const userData = req.body;
    const userId = req.params.id;
    const currentPassword = userData.currentPassword;
    const newPassword = userData.newPassword;
    const renewPassword = userData.renewPassword;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User data not found" });
    }

    // Compare the current password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Incorrect current password",
      });
    }

    // Check if the new password and renew password match
    if (newPassword !== renewPassword) {
      return res.status(400).json({
        message: "New password and renew password do not match",
      });
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password and set the updated_at field
    const updatedUserPassword = await User.findByIdAndUpdate(userId, {
      password: hashedNewPassword,
    });

    res.status(200).json({
      message: "Password updated successfully",
      user: updatedUserPassword,
    });
  } catch (error) {
    console.error("Update password error:", error);
    res.status(500).json({ error: "Password update error" });
  }
});

router.put("/setting/deactivate/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const reqConfirmToDeactivated = req.body.confirmToDeactivated;

    if (reqConfirmToDeactivated !== "delete account") {
      return res.status(400).json({
        message: "Confirmation is incorrect. Account was not deleted.",
      });
    }

    const user = await User.findByIdAndUpdate(userId, { user_status: false });

    if (!user) {
      return res.status(404).json({
        message: `User with ID ${userId} not found. Account was not deleted.`,
      });
    }

    res.status(201).json({
      message: `The account for user "${user.username}" has been successfully deleted`,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the account." });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateUser = req.body;
    const user = await User.findByIdAndUpdate(id, updateUser);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const file = req.file.buffer; // แอคเซสเข้อมูลไฟล์ที่อัปโหลด

    // บันทึกข้อมูลจากไฟล์ไปยังไฟล์ชั่วคราว
    fs.writeFileSync(tempFilePath, file);

    const upload = await cloudinary.uploader.upload(tempFilePath, {
      upload_preset: "profile_pic",
      public_id: id,
      width: 200,
      height: 200,
      crop: "fill",
      gravity: "face",
      quality: 80, // หรือใช้ "crop: 'thumb'" หรือ "crop: 'scale'" ตามที่คุณต้องการ
    });

    const pictureUrl = `https://res.cloudinary.com/dok87yplt/image/upload/v${upload.version}/${upload.public_id}.${upload.format}`;

    console.log(pictureUrl);

    // อัปเดต URL ในฐานข้อมูล
    await User.findByIdAndUpdate(id, { image: pictureUrl });
    // ลบไฟล์ชั่วคราว

    user.isCreatedProflie = true;
    await user.save();

    fs.unlinkSync(tempFilePath);

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Error fetching user data" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user) {
      res.status(401).json({ user: "user not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Error fetching user data" });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const { email } = req.user;
    const userData = await User.findOne({ email });

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
      firstname: userData.FirstName,
      lastname: userData.LastName,
      email: userData.email,
      user_status: userData.user_status,
      weight: userData.weight,
      height: userData.height,
      following: userData.following,
      followers: userData.followers,
      aboutme: userData.aboutMe,
      image: userData.image,
      age,
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Error fetching user data" });
  }
});

module.exports = router;
