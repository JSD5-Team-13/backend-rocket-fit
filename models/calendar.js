const mongoose = require("mongoose");

const memoSchema = new mongoose.Schema({
  date: String,
  title: String,
  startTime: String,
  endTime: String,
  activity: String,
  description: String,
});

module.exports = mongoose.model("memo", memoSchema);
