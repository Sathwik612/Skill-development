import express from "express";
import Player from "../models/Player.js";

const router = express.Router();

// ✅ Fetch players by Coach ID
router.get("/", async (req, res) => {
    try {
        const { coachId } = req.query;
        if (!coachId) {
            return res.status(400).json({ error: "Coach ID is required" });
        }

        console.log("🔹 Fetching players for Coach ID:", coachId);  // Debugging log

        const players = await Player.find({ coach: coachId });

        if (players.length === 0) {
            return res.status(404).json({ error: "No players found for this coach" });
        }

        console.log("✅ Players found:", players);
        res.json(players);
    } catch (error) {
        console.error("❌ Error fetching players:", error);
        res.status(500).json({ error: "Server error" });
    }
});
// ✅ Fetch a single player by ID
router.get("/:id", async (req, res) => {
    try {
        const player = await Player.findById(req.params.id);

        if (!player) {
            return res.status(404).json({ error: "Player not found" });
        }

        console.log("✅ Player found:", player);
        res.json(player);
    } catch (error) {
        console.error("❌ Error fetching player:", error);
        res.status(500).json({ error: "Server error" });
    }
});


export default router;
