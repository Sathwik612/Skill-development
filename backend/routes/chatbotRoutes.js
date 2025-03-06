import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const router = express.Router();

// Chatbot API Key from .env file
const API_KEY = process.env.IVISLABS_API_KEY;

if (!API_KEY) {
  console.error("❌ API key is missing. Set IVISLABS_API_KEY in .env file.");
  process.exit(1);
}

// Chat history
const chatHistory = [
  {
    role: "system",
    content:
      "You are a sports coach assistant. Your role is to generate personalized training plans and provide performance feedback for team members based on their needs, progress, and goals. Ask questions if more information is needed.",
  },
];

// Chatbot API endpoint
router.post("/", async (req, res) => {
  try {
    const userMessage = req.body.message;
    if (!userMessage) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Add user message to history
    chatHistory.push({ role: "user", content: userMessage });

    const jsonData = {
      model: "gemma2:2b",
      messages: chatHistory,
    };

    // Send request to chatbot API
    const response = await axios.post(
      "https://chat.ivislabs.in/api/chat/completions",
      jsonData,
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const reply = response.data?.choices?.[0]?.message?.content || "No response from chatbot.";

    // Add chatbot response to history
    chatHistory.push({ role: "assistant", content: reply });

    res.json({ message: reply });
  } catch (error) {
    console.error("Chatbot API error:", error.message);
    res.status(500).json({ error: "Chatbot request failed" });
  }
});

export default router;
