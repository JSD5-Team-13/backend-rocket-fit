const express = require("express");
const router = express.Router();
const User = require("../models/users");

router.get("/", (req, res) => {
  res.json(connections);
});

// Follow a connection
router.post("/follow/:id", async (req, res) => {
  const id = req.params.id;
  const userid = req.body.userid;
  try {
    const currentUser = await User.findById(userid);
    const userToFollow = await User.findById(id);

    if (!userToFollow) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the current user is already following the target user
    if (currentUser.following.includes(id)) {
      return res.status(400).json({ message: "User is already being followed" });
    }

    currentUser.following.push(id);
    userToFollow.followers.push(userid);

    await currentUser.save();
    await userToFollow.save();

    res.json({ message: "Successfully followed the user" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


// Unfollow a connection
router.post("/unfollow/:id", async (req, res) => {
  const id = req.params.id;
  const userid = req.body.userid;
  try {
    const currentUser = await User.findById(userid);
    const userToUnfollow = await User.findById(id);

    if (!userToUnfollow) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the current user is already following the target user
    if (!currentUser.following.includes(id)) {
      return res.status(400).json({ message: "User is not being followed" });
    }

    currentUser.following = currentUser.following.filter((followedId) => followedId != id);
    userToUnfollow.followers = userToUnfollow.followers.filter((followerId) => followerId != userid);

    await currentUser.save();
    await userToUnfollow.save();

    res.json({ message: "Successfully unfollowed the user" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
