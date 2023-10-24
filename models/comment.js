const mongoose = require("mongoose");
const User = require("../models/users");
const Post = require("../models/post");

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    post_status: {
      type: Boolean,
      default: true,
    },
  },
  { collection: "comments", timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
