import express from "express";
import Coach from "../models/Coach.js";

const router = express.Router();

// ✅ Coach Login (Now includes password)
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find coach by email
    const coach = await Coach.findOne({ email });

    if (!coach) {
      return res.status(400).json({ message: "Coach not found" });
    }

    // Check password (since it's not hashed, we compare directly)
    if (coach.password !== password) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    res.status(200).json({
      _id: coach._id,
      name: coach.name,
      email: coach.email,
      message: "Login successful!",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
