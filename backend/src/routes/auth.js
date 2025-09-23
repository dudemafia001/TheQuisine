import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";


const router = express.Router();

// POST /api/auth
router.post("/", async (req, res) => {
  const { username, password } = req.body;

  try {
    let user = await User.findOne({ username });

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
      return res.json({ message: "Login successful", userId: user._id });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      user = new User({ username, password: hashedPassword });
      await user.save();
      return res.json({ message: "User created & logged in", userId: user._id });
    }
  } catch (err) {
    console.error("Auth error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
