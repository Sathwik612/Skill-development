import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import playerRoutes from "./routes/playerRoutes.js";
import coachRoutes from "./routes/coachRoutes.js"; // ✅ Added missing import
import axios from "axios";
import Coach from "./models/Coach.js";
import Player from "./models/Player.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// 🔹 MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};
connectDB();

// 🔹 Insert Static Coaches and Players (Runs Once)
const insertStaticData = async () => {
  try {
    await Coach.deleteMany(); 
    await Player.deleteMany(); 

    const coaches = [
      { name: "Coach A", email: "coachA@example.com", password: "password123" },
      { name: "Coach B", email: "coachB@example.com", password: "password123" },
      { name: "Coach C", email: "coachC@example.com", password: "password123" },
    ];

    const insertedCoaches = await Coach.insertMany(coaches);

    const players = [
      {
        name: "Player 1",
        position: "Forward",
        height: 180,
        weight: 75,
        dietPlan: "High Protein",
        trainingPlan: "Speed & Agility",
        performanceReview: "Excellent",
        tactics: "Aggressive play",
        aiInsights: [],
        coach: insertedCoaches[0]._id,
      },
      {
        name: "Player 2",
        position: "Midfielder",
        height: 175,
        weight: 72,
        dietPlan: "Balanced Diet",
        trainingPlan: "Endurance Training",
        performanceReview: "Good",
        tactics: "Ball control focus",
        aiInsights: [],
        coach: insertedCoaches[1]._id,
      },
      {
        name: "Player 3",
        position: "Defender",
        height: 185,
        weight: 80,
        dietPlan: "Lean Protein",
        trainingPlan: "Strength Training",
        performanceReview: "Average",
        tactics: "Defensive strategy",
        aiInsights: [],
        coach: insertedCoaches[2]._id,
      },
    ];

    await Player.insertMany(players);
    console.log("✅ Static Coaches and Players added successfully!");
  } catch (error) {
    console.error("❌ Error inserting static data:", error);
  }
};

// Call function once
insertStaticData();

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/players", playerRoutes);
app.use("/api/coach", coachRoutes);

app.get("/", (req, res) => res.send("API is running..."));

// ✅ GameSensei AI Chatbot API
app.post("/api/chatbot", async (req, res) => {
  try {
    const { message, playerId } = req.body;
    
    if (!message || !playerId) {
      return res.status(400).json({ error: "Message and Player ID are required" });
    }

    // 🔹 Call external AI API (Replace with actual AI API)
    const response = await axios.post("http://localhost:5001/api/chatbot", { message });
    
    const aiReply = response.data.reply;
    
    // 🔹 Store AI insights in MongoDB under player's data
    await Player.findByIdAndUpdate(playerId, {
      $push: { aiInsights: aiReply },
    });

    res.json({ reply: aiReply });
  } catch (error) {
    console.error("❌ AI Chatbot Error:", error);
    res.status(500).json({ error: "Failed to process AI response" });
  }
});

// ✅ API to Update Player Tactics
app.post("/api/update-tactics", async (req, res) => {
  try {
    const { playerId, newTactics } = req.body;

    if (!playerId || !newTactics) {
      return res.status(400).json({ error: "Player ID and new tactics are required" });
    }

    // 🔹 Update tactics in MongoDB
    await Player.findByIdAndUpdate(playerId, { tactics: newTactics });

    res.json({ message: "Tactics updated successfully" });
  } catch (error) {
    console.error("❌ Error updating tactics:", error);
    res.status(500).json({ error: "Failed to update tactics" });
  }
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
