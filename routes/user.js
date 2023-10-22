const express = require ('express');
const router = express.Router();
const bcrypt = require("bcrypt")

const User = require('../models/users');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
    try {
        const user = req.user;
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ error: 'Error fetching user data' });
    }
});


//GET user profile
router.get('/:id' , async (req , res) => {
    try {
      const userId = req.params.id
      console.log('User ID:', userId);
      const token = req.headers.authorization;
      // console.log('Authentication Token:', token);
      const user = await User.findById(userId);
      if (!user) {
          // No user found with the given ID
          return res.status(404).json({ error: 'User not found' });
      }
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//PUT update user
router.put("/:id", auth, async (req, res) => {
  try {
    const userId= req.params.id;
    console.log('User ID:', userId);
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
router.put("/password/:id", async (req, res) => {
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
      return res
        .status(401)
        .json({
            message: "Incorrect current password",
        });
    }

    // Check if the new password and renew password match
    if (newPassword !== renewPassword) {
      return res
        .status(400)
        .json({ 
            message: "New password and renew password do not match" 
        });
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password and set the updated_at field
    const updatedUserPassword = await User.findByIdAndUpdate(
      userId,
      {password: hashedNewPassword}
    );

    res
      .status(200)
      .json({ 
            message: "Password updated successfully",
            user: updatedUserPassword 
        });
  } catch (error) {
    console.error("Update password error:", error);
    res.status(500).json({ error: "Password update error" });
  }
});

router.put("/deactivate/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const reqConfirmToDeactivated = req.body.confirmToDeactivated;

    if (reqConfirmToDeactivated !== "delete account") {
      return res.status(400).json({
        message: "Confirmation is incorrect. Account was not deleted.",
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {user_status: false}
    );

    if (!user) {
      return res.status(404).json({
        message: `User with ID ${userId} not found. Account was not deleted.`,
      });
    }

    res
      .status(201)
      .json({ 
            message: `The account for user "${user.username}" has been successfully deleted` 
        });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the account." });
  }
});



module.exports = router


