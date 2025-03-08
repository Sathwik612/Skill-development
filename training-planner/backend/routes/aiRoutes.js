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
      "You are an expert AI assistant specializing in coaching strategies and player development. Your role is to assist a football coach in analyzing players' performance, identifying strengths and weaknesses, and providing personalized training drills, tactical improvements, and skill enhancement strategies. Offer data-driven insights and ask relevant questions to refine your recommendations. Your responses should focus on improving team performance, player growth, and match tactics based on the coach's specific concerns., Remeber that all of them are plhysicallya ctive as they are sports persons. Dont ask that question.Also when asked about his team preformance ffedback , tell the coach to proved some insights about their last game performance.  re a sports coach assistant. Your role is to generate personalized training plans and provide performance feedback for team members based on their needs, progress, and goals. You should ask questions if more information is needed for an accurate response.",
  
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
