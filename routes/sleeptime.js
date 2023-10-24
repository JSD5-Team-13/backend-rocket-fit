const express = require("express");
const router = express.Router();
const SleepTime = require("../models/sleep");
const moment = require('moment'); // Require the moment library to work with dates

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
        const { userId, ...data } = req.body;

        // Check if a sleep entry already exists for the current day
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().slice(0, 10);
        const existingSleep = await SleepTime.findOne({
            created_by: userId,
            date: formattedDate,
        });

        if (existingSleep) {
            return res.status(400).json({ message: "You've already created a sleep entry for today" });
        } else {}

        const sleep = await SleepTime.create({
            created_by: userId,
            ...data,
        });

        if (!sleep) {
            return res.status(404).json({ message: "Sleep not found" });
        }

        return res.status(200).json(sleep);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;