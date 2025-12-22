import "dotenv/config";
import express from "express";
import cors from "cors";

import calendarRoutes from "./routes/calendar.routes.js";
import emailRoutes from "./routes/email.routes.js";
import botRoutes from "./routes/bot.routes.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.json({ limit: "1mb" })); // REQUIRED

// app.use("/dev/api/calendar", calendarRoutes);
// app.use("/dev/api/email", emailRoutes);

app.use("/api/bot", botRoutes);

app.get("/", (req, res) => {
  res.send("Bot test API running...");
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
  