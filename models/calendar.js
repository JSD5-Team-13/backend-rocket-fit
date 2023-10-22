const mongoose = require("mongoose");
const User = require("./users")

const memoSchema = new mongoose.Schema({
  date: String,
  title: String,
  startTime: String,
  endTime: String,
  activity: String,
  description: String,
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model("memo", memoSchema);
