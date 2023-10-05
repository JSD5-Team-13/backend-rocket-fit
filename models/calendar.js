const mongoose = require ('mongoose');

const memoSchema = new mongoose.Schema({
    title : String,
    activity_type : String,
    description : String
})

module.exports = mongoose.model('memo' , memoSchema);