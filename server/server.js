import "dotenv/config";
import express from "express";
import cors from "cors";

import calendarRoutes from "./routes/calendar.routes.js";
import emailRoutes from "./routes/email.routes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/calendar", calendarRoutes);
app.use("/email", emailRoutes);

app.get("/", (req, res) => {
  res.send("Bot test API running...");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
  