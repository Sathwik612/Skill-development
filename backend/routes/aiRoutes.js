import express from "express";
import axios from "axios";
import protect from "../middleware/authMiddleware.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const API_KEY = process.env.IVISLABS_API_KEY;
if (!API_KEY) {
  throw new Error("API key not found. Set IVISLABS_API_KEY in environment variables.");
}

const headers = {
  Authorization: `Bearer ${API_KEY}`,
  "Content-Type": "application/json",
};

// Chat history for each session
const chatHistory = [
  {
    role: "system",
    content:
      "You are a sports coach assistant. Your role is to generate personalized training plans and provide performance feedback for team members based on their needs, progress, and goals. You should ask questions if more information is needed for an accurate response.",
  },
];

// Route to handle AI-generated training plans
router.post("/generate-plan", protect, async (req, res) => {
  const { playerHistory } = req.body;

  // Append user input to chat history
  chatHistory.push({ role: "user", content: playerHistory });

  const jsonData = {
    model: "gemma2:2b",
    messages: chatHistory,
  };

  try {
    const response = await axios.post("https://chat.ivislabs.in/api/chat/completions", jsonData, { headers });
    
    if (response.data?.choices?.length) {
      const reply = response.data.choices[0].message.content;
      chatHistory.push({ role: "assistant", content: reply });
      return res.json({ newPlan: reply });
    } else {
      return res.status(500).json({ message: "No response found in API output." });
    }
  } catch (error) {
    return res.status(500).json({ message: `Error making API request: ${error.message}` });
  }
});

export default router;
