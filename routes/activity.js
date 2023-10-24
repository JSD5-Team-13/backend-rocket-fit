const express = require("express");
const router = express.Router();
const Activity = require("../models/activity");
const multer = require("multer");
const { cloudinary } = require("../configs/cloudinay");
router.use(express.json({ limit: "50mb" }));
router.use(express.urlencoded({ limit: "50mb", extended: true }));

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
});

const fs = require("fs");
const tempFilePath = "temp-file.png"; 


// Get all activity cards
router.get("/", async (request, response) => {
  try {
    const userId = request.query.userId;
    const activities = await Activity.find({
      created_by: userId,
      activity_status: true,
    });
    response.status(200).json(activities);
  } catch (error) {
    response
      .status(500)
      .json({ message: "Failed to get activities", error: error.message });
  }
});

// Get one activity card by ID
router.get("/:id", async (request, response) => {
  try {
    const { id } = request.params;
    const activity = await Activity.findById(id);
    if (!activity) {
      return response.status(404).json({ message: "Activity not found" });
    }
    response.status(200).json(activity);
  } catch (error) {
    response
      .status(500)
      .json({ message: "Failed to get activity", error: error.message });
  }
});

// Create a new activity card
router.post("/", async (request, response) => {
  try {
    const { userId, ...newActivity } = request.body;
    const activity = await Activity.create({
      ...newActivity,
      created_by: userId,
    });
    response
      .status(200)
      .json({ message: "Activity created successfully", activity });
  } catch (error) {
    response
      .status(500)
      .json({ message: "Failed to create activity", error: error.message });
  }
});

router.post("/create", upload.single("imageActivity"),async (req, res) => {
    const reqData = req.body;
    const userId = req.user.id
    try {
      if (!userId) {
        return res.status(400).json({ error: "User ID is missing" });
      }
  
      const file = req.file.buffer;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      if (!reqData) {
        return res.status(400).json({ error: "Activity data is missing" });
      }

      fs.writeFileSync(tempFilePath, file);

      const upload = await cloudinary.uploader.upload(tempFilePath, {
        upload_preset: "activities_pic",
        public_id: userId,
        width: 1280,
        height: 720,
        crop: "fill",
        gravity: "face",
        quality: 80,
        transformation: [
          { effect: "auto_contrast" }, 
          { bit_rate: "2000k" }]
      });

      console.log(upload);
      const pictureUrl = `https://res.cloudinary.com/dlfc9bqct/image/upload/v${upload.version}/${upload.public_id}.${upload.format}`;

      const newActivity = new Activity({
        created_by: userId,
        image: pictureUrl,
        ...reqData,
      });
  
      const validationError = newActivity.validateSync();
  
      if (validationError) {
        const errors = Object.values(validationError.errors).map(
          (error) => error.message
        );
  
        return res.status(400).json({ error: errors });
      }
      
      const savedActivity = await newActivity.save();
      
      fs.unlinkSync(tempFilePath);
      // const user = await User.findById(req.user.id);
  
      // user.activities.push(newActivity._id);
      // await user.save();
  
      res.status(201).json(savedActivity);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });



// Update a activity card
router.put("/:id", async (request, response) => {
  try {
    const { id } = request.params;
    const updateActivity = request.body;
    const result = await Activity.findByIdAndUpdate(id, updateActivity);
    if (!result) {
      return response.status(404).json({ message: "Activity not found" });
    }
    response
      .status(200)
      .json({ message: "Activity updated successfully", result });
  } catch (error) {
    response
      .status(500)
      .json({ message: "Failed to update activity", error: error.message });
  }
});

// Delete a activity card (soft delete)
router.delete("/:id", async (request, response) => {
  try {
    const { id } = request.params;
    const activity = await Activity.findById(id);
    if (!activity) {
      return response.status(404).json({ message: "Activity not found" });
    }

    activity.activity_status = false;
    await activity.save();

    response.status(200).json({ message: "Activity deleted successfully" });
  } catch (error) {
    response
      .status(500)
      .json({ message: "Failed to delete activity", error: error.message });
  }
});

module.exports = router;
