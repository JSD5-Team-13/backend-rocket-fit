const express = require("express");
const router = express.Router();
const Comment = require("../models/comment");
const Post = require("../models/post");
const User = require("../models/users");

// Get post by ID and show comments of post
router.get("/:postId", async (request, response) => {
  try {
    const postId = request.params.postId;

    // Find the post by ID and populate the comments, including author details
    const post = await Post.findById(postId).populate({
      path: "comments",
      populate: {
        path: "author",
        model: "users",
        select: "FirstName LastName image", 
      },
    });

    if (!post) {
      return response.status(404).json({ error: "Post not found" });
    }

    response.status(200).json(post.comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    response.status(500).json({ error: "Could not retrieve comments." });
  }
});

// Create a Comment
router.post("/", async (request, response) => {
  try {
    const { content, author, post } = request.body;

    const newComment = new Comment({
      content,
      author,
      post,
    });

    await newComment.save();

    // save the comment in the post comment array
    await Post.findByIdAndUpdate(post, { $push: { comments: newComment._id } });

    response.status(201).json(newComment);
  } catch (error) {
    console.error("Error creating a comment:", error);
    response.status(500).json({ error: "Could not create the comment." });
  }
});

module.exports = router;
