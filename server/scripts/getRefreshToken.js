import express from "express";
import { google } from "googleapis";
import open from "open"; // optional: auto-opens browser
import "dotenv/config";

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI
} = process.env;

const app = express();
const PORT = 3000; // make sure this matches your REDIRECT_URI

const oauth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI
);

const SCOPES = [
  "https://www.googleapis.com/auth/gmail.send",
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/documents",
  "https://www.googleapis.com/auth/drive"
];

// Generate auth URL
const authUrl = oauth2Client.generateAuthUrl({
  access_type: "offline",
  prompt: "consent",
  scope: SCOPES
});

console.log("🔗 Open this URL to authorize the app:\n", authUrl);

// Optionally, auto-open browser
open(authUrl);

// Callback route to catch Google's redirect
app.get("/oauth2callback", async (req, res) => {
  const code = req.query.code;
  if (!code) return res.send("❌ No code received");

  try {
    const { tokens } = await oauth2Client.getToken(code);
    console.log("\n✅ TOKENS RECEIVED:");
    console.log(tokens);

    // Save refresh token in a file or just print it
    console.log("\n👉 Copy this into your .env:");
    console.log(`GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`);

    res.send("✅ Token received! Check console.");
    process.exit(0); // stop server
  } catch (err) {
    console.error("❌ Failed to get token:", err.response?.data || err.message);
    res.send("❌ Failed to get token. See console.");
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/oauth2callback`);
});
