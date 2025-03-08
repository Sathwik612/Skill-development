import express from "express";

const app = express();
app.use(express.json());

app.post("/api/chatbot", (req, res) => {
  const { message } = req.body;
  // Simulate an AI response by echoing the message with a prefix.
  const reply = `AI says: ${message}`;
  res.json({ reply });
});

const PORT = 5001;
app.listen(PORT, () => console.log(`Dummy Chatbot Service running on port ${PORT}`));
