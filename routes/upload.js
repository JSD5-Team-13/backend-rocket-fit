const express = require("express");
const router = express.Router();
const multer = require("multer");
const { cloudinary } = require("../configs/cloudinay");
const User = require("../models/users");
router.use(express.json({ limit: "50mb" }));
router.use(express.urlencoded({ limit: "50mb", extended: true }));

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
});

const fs = require("fs");
const tempFilePath = "temp-file.png"; // เลือกที่จะใช้เป็นไฟล์ชั่วคราว

router.put("/image/profile/:id", upload.single("image"), async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(400).json({ error: "User ID is missing" });
    }

    const file = req.file.buffer; // แอคเซสเข้อมูลไฟล์ที่อัปโหลด

    // ตรวจสอบ userId ก่อนที่จะอัปโหลด
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // บันทึกข้อมูลจากไฟล์ไปยังไฟล์ชั่วคราว
    fs.writeFileSync(tempFilePath, file);

    const upload = await cloudinary.uploader.upload(tempFilePath, {
      upload_preset: "profile_pic",
      public_id: userId,
      width: 200,
      height: 200,
      crop: "fill",
      gravity: "face",
      quality: 80, // หรือใช้ "crop: 'thumb'" หรือ "crop: 'scale'" ตามที่คุณต้องการ
    });

    console.log(upload);
    const pictureUrl = `https://res.cloudinary.com/dlfc9bqct/image/upload/v${upload.version}/${upload.public_id}.${upload.format}`;

    // อัปเดต URL ในฐานข้อมูล
    await User.findByIdAndUpdate(userId, { profile_url: pictureUrl });

    // ลบไฟล์ชั่วคราว
    fs.unlinkSync(tempFilePath);

    res.status(200).json({ message: "Profile image uploaded successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
