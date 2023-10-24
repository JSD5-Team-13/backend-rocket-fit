const mongoose = require("mongoose");
const User = require("./users");
const Comment =  require("./comment");

const postSchema = new mongoose.Schema(
  {
    activity_type: String,
    activity_name: String,
    activity_describe: String,
    duration: Number,
    image: String,
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    post_status: {
      type: Boolean,
      default: true,
    },
  },
  { collection: "posts", timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
