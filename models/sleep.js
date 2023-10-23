const mongoose = require("mongoose");
const User = require("../models/users");

const sleepSchema = new mongoose.Schema({
    sleeptime : Number,
    date : Date,
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model("sleep", sleepSchema);