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

// Chat history (static, in-memory)
const chatHistory = [
  {
    role: "system",
    content:
     "You are an expert AI assistant specializing in coaching strategies and player development. Your role is to assist a football coach in analyzing players' performance, identifying strengths and weaknesses, and providing personalized training drills, tactical improvements, and skill enhancement strategies. Offer data-driven insights and ask relevant questions to refine your recommendations. Your responses should focus on improving team performance, player growth, and match tactics based on the coach's specific concerns., Remeber that all of them are plhysicallya ctive as they are sports persons. Dont ask that question.Also when asked about his team preformance ffedback , tell the coach to proved some insights about their last game performance.  "
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

    const reply =
      response.data?.choices?.[0]?.message?.content ||
      "No response from chatbot.";

    // Add chatbot response to history
    chatHistory.push({ role: "assistant", content: reply });

    res.json({ reply });
  } catch (error) {
    console.error("Chatbot API error:", error.message);
    res.status(500).json({ error: "Chatbot request failed" });
  }
});

export default router;
