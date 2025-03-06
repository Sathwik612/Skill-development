import mongoose from "mongoose";

const PlayerSchema = new mongoose.Schema({
    name: String,
    position: String,
    height: Number,
    weight: Number,
    dietPlan: String,
    tactics: String,  // New field for storing tactics
    aiInsights: [String],  // New field for storing AI-generated insights
});

const Player = mongoose.model("Player", PlayerSchema);
export default Player;