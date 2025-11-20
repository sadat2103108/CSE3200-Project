import 'dotenv/config';
import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = process.env.GEMINI_MODEL;
const BASE_URL = process.env.GEMINI_BASE_URL;

if (!API_KEY) {
  console.error("❌ Missing GEMINI_API_KEY in .env");
  process.exit(1);
}

// ---------------------------
//        ROUTES
// ---------------------------

app.get("/", (req, res) => {
  res.send("Gemini Express API is running 🚀");
});

app.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Missing 'prompt' in body" });
    }

    const url = `${BASE_URL}/${MODEL}:generateContent?key=${API_KEY}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }]
          }
        ]
      })
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error });
    }

    const output = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    return res.json({
      response: output,
      raw: data
    });

  } catch (err) {
    console.error("Server Error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// ---------------------------
//     START THE SERVER
// ---------------------------

app.listen(PORT, () => {
  console.log(`🚀 Express server running on port ${PORT}`);
});
