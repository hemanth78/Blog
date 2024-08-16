const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Register a new user
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if (await User.findOne({ email })) return res.status(400).json({ msg: "User already exists" });

    const newUser = new User({ username, email, password });
    await newUser.save();
    res.status(201).json({ msg: "User registered successfully" });
  } catch {
    res.status(500).json({ msg: "Server error" });
  }
});

// Login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, "your_jwt_secret", { expiresIn: "1h" });
    res.json({ token, role: user.role, username: user.username, userId: user._id });
  } catch {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
