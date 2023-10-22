const express = require("express");
const router = express.Router();
const Activity = require("../models/activity");

// Get all activity cards
router.get("/", async (request, response) => {
  try {
    const userId = request.query.userId
    const activities = await Activity.find({ 
    activity_status: true,
    created_by: userId});
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
    const {userId , ...newActivity} = request.body;
    const activity = await Activity.create({
      ...newActivity,
      created_by : userId
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

router.post("/create", async (request, response) => {
    const reqActivityData = req.body;
    const userId = req.user.id
    try {
      if (!reqData) {
        return res.status(400).json({ error: "Activity data is missing" });
      }
  
      const newActivity = new Activity({
        user: req.user.id,
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
  
      const user = await User.findById(req.user.id);
  
      user.activities.push(newActivity._id);
      await user.save();
  
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
