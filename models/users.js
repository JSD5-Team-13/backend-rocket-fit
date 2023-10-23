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
    age: {
      type: Number,
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
    profile_url: {
      type: String,
      default: null,
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
