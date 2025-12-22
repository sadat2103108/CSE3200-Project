import { google } from "googleapis";
import { getOAuthClient } from "./googleAuth.js";

const gmail = google.gmail({ version: "v1" });

function makeEmail(to, subject, message) {
  const raw = [
    `To: ${to}`,
    "Content-Type: text/plain; charset=utf-8",
    "MIME-Version: 1.0",
    `Subject: ${subject}`,
    "",
    message
  ].join("\n");

  return Buffer.from(raw)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export async function sendEmail({ to, subject, body }) {
  const auth = getOAuthClient();
  const rawMessage = makeEmail(to, subject, body);

  const res = await gmail.users.messages.send({
    auth,
    userId: "me",
    requestBody: {
      raw: rawMessage
    }
  });

  return res.data;
}
