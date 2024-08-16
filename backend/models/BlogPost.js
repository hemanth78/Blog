const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

const PostSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200, // Limiting title length
  },
  content: {
    type: String,
    required: true,
    minlength: 10, // Ensuring content is not too short
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
  },
  category: {
    type: String,
    enum: ["Music", "Travel", "Photography", "Another"], // Example categories
    required: true,
  },
  tags: {
    type: [String], // Array of tags for categorization
    default: [],
  },
  imageUrl: {
    type: String,
    default: "", // URL of the image, if any
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set to current date
  },
  updatedAt: {
    type: Date,
    default: Date.now, // Automatically set to current date
  },
  likes: [
    { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User" 
    }
  ],  
  comments: [commentSchema],
});

// Update the updatedAt field before saving
PostSchema.pre("save", function (next) {
  if (this.isModified("content")) {
    this.updatedAt = Date.now();
  }
  next();
});

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
