// api/bot.js or wherever your routes live
import express from "express";
import { runBot } from "../bot/bot.js";

const router = express.Router();

router.post("/send-message", async (req, res) => {
  try {
    console.log("Incoming body:", req.body);

    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        error: "Missing 'prompt' in request body"
      });
    }

    const result = await runBot(prompt);

    return res.status(200).json({
      success: true,
      data: result
    });

  } catch (err) {
    console.error("🔥 /send-message error:", err);

    return res.status(500).json({
      success: false,
      error: err.message || "Internal Server Error"
    });
  }
});

export default router;
