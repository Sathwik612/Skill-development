import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Coach from "../models/Coach.js";

dotenv.config();
const router = express.Router();

// ✅ Coach Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const coach = await Coach.findOne({ email });

    if (!coach) return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, coach.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign({ coachId: coach._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ coachId: coach._id, token });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get all coaches
router.get("/", async (req, res) => {
  try {
    const coaches = await Coach.find();
    res.json(coaches);
  } catch (error) {
    res.status(500).json({ message: "Error fetching coaches" });
  }
});

// ✅ Get a single coach with players
router.get("/:id", async (req, res) => {
  try {
    const coach = await Coach.findById(req.params.id).populate("players");
    if (!coach) return res.status(404).json({ message: "Coach not found" });

    res.json(coach);
  } catch (error) {
    res.status(500).json({ message: "Error fetching coach" });
  }
});

export default router;
