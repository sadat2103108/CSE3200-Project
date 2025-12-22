import { sendEmail } from "../utils/email.js";

export const emailSendController = async (req, res) => {
  try {
    const result = await sendEmail(req.body);
    res.json({ result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send email" });
  }
}