const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    FirstName: {
      type: String,
      // required: true,
    },
    LastName: {
      type: String,
      // required: true,
    },
    DateOfBirth: {
      type: Date,
      default: null,
    },
    age: {
      type: Number,
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
      default: null,
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
