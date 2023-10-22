const mongoose = require("mongoose");
const User = require("./users");

const activitySchema = new mongoose.Schema(
  {
    activity_type: String,
    activity_name: String,
    activity_describe: String,
    date: Date,
    duration: Number,
    image: String,
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    activity_status: {
      type: Boolean,
      default: true,
    },
  },
  { collection: "activities", timestamps: true }
);

const Activity = mongoose.model("Activity", activitySchema);

module.exports = Activity;
