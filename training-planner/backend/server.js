import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import playerRoutes from "./routes/playerRoutes.js";
import coachRoutes from "./routes/coachRoutes.js";
import Coach from "./models/Coach.js";
import Player from "./models/Player.js";
import bcrypt from "bcryptjs";
import axios from "axios";

dotenv.config();
const app = express();
app.use(express.json());

// ✅ Configure CORS Properly
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};
app.use(cors(corsOptions));

// ✅ MongoDB Connection
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

// ✅ Insert Static Coaches & Players (Runs Once)
const insertStaticData = async () => {
  try {
    await Coach.deleteMany();
    await Player.deleteMany();

    const hashedPassword = await bcrypt.hash("password123", 10); // Securely hash passwords

    const coaches = [
      { name: "Coach A", email: "coachA@example.com", password: hashedPassword },
      { name: "Coach B", email: "coachB@example.com", password: hashedPassword },
      { name: "Coach C", email: "coachC@example.com", password: hashedPassword },
    ];
    const insertedCoaches = await Coach.insertMany(coaches);

    const players = [
      { name: "Player 1", position: "Forward", height: 180, weight: 75, coach: insertedCoaches[0]._id },
      { name: "Player 2", position: "Midfielder", height: 175, weight: 72, coach: insertedCoaches[1]._id },
      { name: "Player 3", position: "Defender", height: 185, weight: 80, coach: insertedCoaches[2]._id },
    ];
    await Player.insertMany(players);

    console.log("✅ Static Coaches and Players added successfully!");
  } catch (error) {
    console.error("❌ Error inserting static data:", error);
  }
};
insertStaticData();

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/players", playerRoutes);
app.use("/api/coaches", coachRoutes);

app.get("/", (req, res) => res.send("API is running..."));

// ✅ GameSensei AI Chatbot API
app.post("/api/chatbot", async (req, res) => {
  try {
    const { message, playerId } = req.body;
    if (!message || !playerId) return res.status(400).json({ error: "Message and Player ID are required" });

    const response = await axios.post("http://localhost:5001/api/chatbot", { message });
    const aiReply = response.data.reply;

    await Player.findByIdAndUpdate(playerId, { $push: { aiInsights: aiReply } });
    res.json({ reply: aiReply });
  } catch (error) {
    console.error("❌ AI Chatbot Error:", error);
    res.status(500).json({ error: "Failed to process AI response" });
  }
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
