const mongoose = require('mongoose');
const { user } = require('./user.js')

const activitySchema = new mongoose.Schema({
    activity_type: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
    duration_time: {
        type: String,
        required: true,
    }, 
    date: {
        type: String,
        default: Date.now,
    },
    img_url: {
        type: String,
        required: false,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userSchema',
        required: true,
    },
});


new mongoose.model('activity', activitySchema) 

module.exports = new mongoose.model('activity', activitySchema) ;