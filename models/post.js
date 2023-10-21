const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    activity_type: String,
    activity_name: String,
    activity_describe: String,
    duration: Number,
    image: String,
    // user: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "User",
    // },
    post_status: {
      type: Boolean,
      default: true,
    },
  },
  { collection: "posts", timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
