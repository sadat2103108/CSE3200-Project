import { google } from "googleapis";
import "dotenv/config";

const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

oAuth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN
});

async function test() {
  try {
    const accessToken = await oAuth2Client.getAccessToken();
    console.log("✅ Access token works:", accessToken.token);
  } catch (err) {
    console.error("❌ Token failed:", err.response?.data || err.message);
  }
}

test();
