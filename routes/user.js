const express = require("express");
const router = express.Router();
const Users = require("../models/users");
const auth = require("../middleware/auth");

router.get("/", auth, async (req, res) => {
  try {
    const { username } = req.user;
    const userData = await Users.findOne({ username });

    if (!userData) {
      res.status(404).json({ error: "User not found" });
    }

    const dob = new Date(userData.DateOfBirth);
    const age = new Date().getFullYear() - dob.getFullYear();

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
