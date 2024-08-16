const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Post = require("../models/BlogPost");

// Like a post
router.post("/:id/like", authMiddleware, async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id; // Assuming you're using some authentication middleware

    // Find the post
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Ensure likes is an array
    if (!Array.isArray(post.likes)) {
      post.likes = [];
    }

    // Check if user has already liked the post
    if (post.likes.includes(userId)) {
      // User already liked the post, so remove the like
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
      // User has not liked the post, so add the like
      post.likes.push(userId);
    }

    // Save the post
    await post.save();
    res.json({ likes: post.likes.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:category/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id).populate({
      path: 'comments.user',
      select: 'username',
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post("/:postId/comments", authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;
    const { text } = req.body;
    const userId = req.user.id;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.comments.push({ text, user: userId });
    await post.save();

    res.status(201).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


// Update a comment
router.put("/:postId/comments/:commentId", authMiddleware, async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const { text } = req.body;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = post.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.user.toString() !== req.user.id) return res.status(403).json({ message: "Unauthorized" });

    comment.text = text;
    await post.save();

    res.status(200).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a comment
router.delete("/:postId/comments/:commentId", authMiddleware, async (req, res) => {
  try {
    const { postId, commentId } = req.params;

    // Find the post by ID
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Find the comment within the post
    const commentIndex = post.comments.findIndex((comment) => comment._id.toString() === commentId);
    if (commentIndex === -1) return res.status(404).json({ message: "Comment not found" });

    // Check if the user is authorized to delete the comment
    if (post.comments[commentIndex].user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Remove the comment from the post
    post.comments.splice(commentIndex, 1);
    await post.save();

    res.status(200).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Create a post (only admin)
router.post("/", authMiddleware, async (req, res) => {
  const { title, content, category, tags, imageUrl } = req.body;
  const { role, id } = req.user;

  if (role !== "admin") return res.status(403).json({ msg: "Access denied" });

  try {
    const newPost = new Post({ title, content, category, tags, imageUrl, author: id });
    await newPost.save();
    res.status(201).json(newPost);
  } catch {
    res.status(500).json({ msg: "Server error" });
  }
});

router.get("/:postId", async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId)
      .populate("comments.user", "username") // Populate user field
      .exec();
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get a single post by id
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("author", "username");
    if (!post) return res.status(404).json({ msg: "Post not found" });
    res.json(post);
  } catch {
    res.status(500).json({ msg: "Server error" });
  }
});

// Get all posts
router.get("/", async (req, res) => {
  const { category } = req.query;
  try {
    let query = {};
    if (category) {
      query.category = category;
    }
    const posts = await Post.find(query).populate("author", "username");
    res.json(posts);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Update a post (only admin)
router.put("/:id", authMiddleware, async (req, res) => {
  const { title, content, category, tags, imageUrl } = req.body;
  const { role } = req.user;

  if (role !== "admin") return res.status(403).json({ msg: "Access denied" });

  try {
    const post = await Post.findByIdAndUpdate(req.params.id, { title, content }, { new: true });
    if (!post) return res.status(404).json({ msg: "Post not found" });
    res.json(post);
  } catch {
    res.status(500).json({ msg: "Server error" });
  }
});

// Delete a post (only admin)
router.delete("/:id", authMiddleware, async (req, res) => {
  const { role } = req.user;

  if (role !== "admin") return res.status(403).json({ msg: "Access denied" });

  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ msg: "Post not found" });
    res.json({ msg: "Post deleted" });
  } catch {
    res.status(500).json({ msg: "Server error" });
  }
});

// Get a post by category and id
router.get("/:category/:id", async (req, res) => {
  try {
    const { category, id } = req.params;
    const post = await Post.findOne({ _id: id, category }).populate("author", "username");
    if (!post) return res.status(404).json({ msg: "Post not found" });
    res.json(post);
  } catch {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
