import express from "express";
import { runAgent } from "../agent/agent.js";

const router = express.Router();

// POST /bot/send-prompt
router.post("/send-prompt", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "Missing 'prompt'" });

  const result = await runAgent(prompt);
  res.json(result);
});

export default router;
