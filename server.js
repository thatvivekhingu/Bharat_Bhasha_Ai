import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch"; // 🔥 ADD THIS

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const GROQ_API_KEY = process.env.GROQ_API_KEY;

app.post("/api/chat", async (req, res) => {
  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
  body: JSON.stringify({
  model: "llama-3.3-70b-versatile", // 🔥 FIXED
  temperature: 0.9,
  top_p: 0.9,
  max_tokens: 300,
  messages: req.body.messages,
}),
    });

    const data = await response.json();

    console.log("API RESPONSE:", data); // 🔥 DEBUG

    res.json(data);

  } catch (err) {
    console.error("ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log("🚀 Grok-style AI running at http://localhost:3000");
});