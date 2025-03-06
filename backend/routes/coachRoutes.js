import express from "express";
import Coach from "../models/Coach.js";

const router = express.Router();

// Get all coaches
router.get("/", async (req, res) => {
  try {
    const coaches = await Coach.find();
    res.json(coaches);
  } catch (error) {
    res.status(500).json({ message: "Error fetching coaches" });
  }
});

// Get a single coach with players
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
