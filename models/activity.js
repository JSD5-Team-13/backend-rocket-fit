const mongoose = require("mongoose");
const User = require('./users')

const activitySchema = new mongoose.Schema(
  {
    activity_type: String,
    activity_name: String,
    activity_describe: String,
    date: Date,
    duration: Number,
    image: String,
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    activity_status: {
      type: Boolean,
      default: true,
    },
    //ฝนเพิ่มโมเดล
    // userId: Number,
  },
  { collection: "activities", timestamps: true }
);



const Activity = mongoose.model("Activity", activitySchema);

module.exports = Activity;

// const mongoose = require('mongoose');
// const { user } = require('./user.js')

// const activitySchema = new mongoose.Schema({
//     activity_type: {
//         type: String,
//         required: true,
//     },
//     title: {
//         type: String,
//         required: true,
//     },
//     description: {
//         type: String,
//         required: false,
//     },
//     duration_time: {
//         type: String,
//         required: true,
//     }, 
//     date: {
//         type: String,
//         default: Date.now,
//     },
//     img_url: {
//         type: String,
//         required: false,
//     },
//     user: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'userSchema',
//         required: true,
//     },
// });


// new mongoose.model('activity', activitySchema) 

// module.exports = new mongoose.model('activity', activitySchema) ;
// module.exports = mongoose.model("Activity", activitySchema)
