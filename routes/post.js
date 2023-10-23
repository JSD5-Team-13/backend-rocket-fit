const express = require("express");
const router = express.Router();
const Post = require("../models/post");
const Activity = require("../models/activity");

// Get all posts
router.get("/", async (request, response) => {
  try {
    const userId = await request.query.userId
    const posts = await Post.find({ 
      post_status: true ,
      created_by : userId});
    response.status(200).json(posts);
  } catch (error) {
    response
      .status(500)
      .json({ message: "Failed to get posts", error: error.message });
  }
});

//Get user post by params
router.get("/:id", async (request, response) => {
  try {
    const id  = request.params.id;
    const post = await Post.find({created_by : id});
    if (!post) {
      return response.status(404).json({ message: "Post not found" });
    }
    response.status(200).json(post);
  } catch (error) {
    response
      .status(500)
      .json({ message: "Failed to get post", error: error.message });
  }
});

// Get one post by ID
router.get("/:id", async (request, response) => {
  try {
    const { id } = request.params;
    const post = await Post.findById(id);
    if (!post) {
      return response.status(404).json({ message: "Post not found" });
    }
    response.status(200).json(post);
  } catch (error) {
    response
      .status(500)
      .json({ message: "Failed to get post", error: error.message });
  }
});

// Create a new post from share activity card
router.post("/", async (request, response) => {
  try {
    const { _id } = request.body;
    const originalActivity = await Activity.findById(_id);

    if (!originalActivity) {
      return response
        .status(404)
        .json({ message: "Activity not found" });
    }

    const newPost = new Post({
      activity_type: originalActivity.activity_type,
      activity_name: originalActivity.activity_name,
      activity_describe: originalActivity.activity_describe,
      duration: originalActivity.duration,
      image: originalActivity.image,
      created_by:originalActivity.created_by
    });

    await newPost.save();

    response
      .status(200)
      .json({ message: "Post created successfully", newPost });
  } catch (error) {
    response
      .status(500)
      .json({ message: "Failed to create post", error: error.message });
  }
});

// Update a post
router.put("/:id", async (request, response) => {
  try {
    const { id } = request.params;
    const updatePost = request.body;
    const result = await Post.findByIdAndUpdate(id, updatePost);
    if (!result) {
      return response.status(404).json({ message: "Post not found" });
    }
    response.status(200).json({ message: "Post updated successfully", result });
  } catch (error) {
    response
      .status(500)
      .json({ message: "Failed to update post", error: error.message });
  }
});

// Delete a post (soft delete)
router.delete("/:id", async (request, response) => {
  try {
    const { id } = request.params;
    const post = await Post.findById(id);
    if (!post) {
      return response.status(404).json({ message: "Post not found" });
    }

    post.post_status = false;
    await post.save();

    response.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    response
      .status(500)
      .json({ message: "Failed to delete post", error: error.message });
  }
});

module.exports = router;
