import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import calendarRoutes from "./routes/calendar.routes.js";
import emailRoutes from "./routes/email.routes.js";
import botRoutes from "./routes/bot.routes.js";

import { startTelegramBot } from "./chatapp/telegram/index.js";

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" })); // REQUIRED

// Serve static files from public directory
app.use(express.static(path.join(__dirname, "public")));

// app.use("/dev/api/calendar", calendarRoutes);
// app.use("/dev/api/email", emailRoutes);

app.use("/api/bot", botRoutes);

// Serve index.html for root path
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});


// app.get("/oauth2callback", async (req, res) => {
//   const code = req.query.code;
//   const { tokens } = await oauth2Client.getToken(code);
//   res.send("✅ Tokens received. Check console.");
//   console.log(tokens);
// });



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

  
  startTelegramBot();
});
  