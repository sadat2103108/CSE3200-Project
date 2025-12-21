import 'dotenv/config';
import express from "express";
import cors from "cors";
import botRoutes from "./routes/bot.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/bot", botRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
