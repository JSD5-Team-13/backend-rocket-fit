const express = require("express");
const router = express.Router();
const SleepTime = require("../models/sleep");

router.get("/", async (req, res) => {
  try {
    const userId = req.body.userId;
    const date = req.body.date;
    const sleep = await SleepTime.find({
      created_by: userId,
      date: date,
    });
    response.status(200).json(sleep);
  } catch (error) {
    response
      .status(500)
      .json({ message: "Failed to get sleep", error: error.message });
  }
});

router.post("/", async (req, res) => {
    try {
        const { userId } = req.body.userId;
        const sleepTime = req.body.sleepTime;
        const wakeTime = req.body.wakeTime;
        const date = req.body.date;

        const totalSleep = wakeTime - sleepTime;
        const sleep = await SleepTime.create({
            created_by: userId,
            sleeptime : totalSleep,
            date : date
        });
        if (!sleep) {
            return res.status(404).json({ message: "Sleep not found" });
        }
        if (res.status(200)) {
            return res.status(200).json(sleep);
        } 
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;