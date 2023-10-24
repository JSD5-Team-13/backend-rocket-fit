const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    },
    FirstName: {
      type: String,
      default: null,
      // required: true,
    },
    LastName: {
      type: String,
      default: null,
      // required: true,
    },
    DateOfBirth: {
      type: Date,
      default: null,
    },
    height: {
      type: Number,
      default: 0,
    },
    weight: {
      type: Number,
      default: 0,
    },
    gender: {
      type: String,
      default: "Not specified",
    },

    aboutMe: {
      type: String,
      default: "Let others know more about you",
    },
    following: {
      type: Array,
    },
    followers: {
      type: Array,
    },
    user_status: {
      type: Boolean,
      default: true,
    },
    isCreatedProflie: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("users", userSchema);
