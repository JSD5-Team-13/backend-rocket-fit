const express = require("express");
const router = express.Router();
const User = require("../models/users");
const auth = require("../middleware/auth");

router.get("/", auth, async (req, res) => {
  try {
    const user = req.user;
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Error fetching user data" });
  }
});

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

module.exports = router;
