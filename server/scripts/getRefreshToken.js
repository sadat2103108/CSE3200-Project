import { google } from "googleapis";
import readline from "readline";
import "dotenv/config";

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI
} = process.env;

const oauth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI
);

// 👉 SCOPES ARE DECLARED HERE
const SCOPES = [
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/gmail.send"
];

const authUrl = oauth2Client.generateAuthUrl({
  access_type: "offline",   // REQUIRED for refresh token
  prompt: "consent",        // REQUIRED (forces refresh token)
  scope: SCOPES
});

console.log("\nAuthorize this app by visiting:\n");
console.log(authUrl, "\n");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question("Paste the code from the page here: ", async (code) => {
  rl.close();

  try {
    const { tokens } = await oauth2Client.getToken(code);

    console.log("\n✅ TOKENS RECEIVED:\n");
    console.log(tokens);

    console.log("\n👉 SAVE THIS IN .env:\n");
    console.log(`GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`);
  } catch (err) {
    console.error("❌ Error retrieving access token", err);
  }
});
