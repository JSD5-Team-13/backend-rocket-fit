const express = require('express');
const router = express.Router();
const { Activity } = require('../models/activity.js');

router.get('/', async (req, res) => {
    try {
        const activities = await Activity.find();
        res.status(200).json(activities);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Internal Server Error" });
    }
});


router.get('/:id', async (req, res) => {
    try {
        const activityDataById = req.params.id;
        const activity = await Activity.findById(activityDataById);
        res.status(200).json(activity);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Internal Server Error'});
    }

});

router.post('/', async (req, res) => {
    try {
        const activityData = req.body;
        const newActivity = new Activity({
            activity_type: activityData.activity_type,
            title: activityData.title,
            description: activityData.description,
            duration_time: activityData.duration_time,
            img_url: activityData.img_url,
            user: activityData.user,
        })

        res.status(201).json(activity);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Internal Server Error'});
    }

})

router.post("/create", async (req, res) => {
  const reqData = req.body;
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




module.exports = router;