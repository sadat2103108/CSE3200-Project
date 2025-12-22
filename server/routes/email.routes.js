import express from "express";
import { sendEmail } from "../utils/email.js";

const router = express.Router();

/**
 * POST /email/send
 */
router.post("/send", async (req, res) => {
  try {
    const result = await sendEmail(req.body);
    res.json({ result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send email" });
  }
});

export default router;
