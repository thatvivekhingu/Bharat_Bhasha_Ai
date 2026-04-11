// server.js
import express from "express";
import cors from "cors";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const dotenv = require("dotenv");
dotenv.config();

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.static("public")); // move index.html here later

const GROQ_API_KEY = process.env.GROQ_API_KEY;

app.post("/api/chat", async (req, res) => {
  if (!GROQ_API_KEY) {
    return res.status(500).json({ error: { message: "❌ API key missing in .env" } });
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.status(response.status).json(data);

  } catch (err) {
    res.status(500).json({ error: { message: err.message } });
  }
});

app.listen(3000, () => {
  console.log("✅ Server running at http://localhost:3000");
  console.log("🔑 API Key loaded:", GROQ_API_KEY ? "YES ✅" : "NO ❌");
});

export default app; 
