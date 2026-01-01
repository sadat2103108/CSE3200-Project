import TelegramBot from "node-telegram-bot-api";
import { handleTelegramMessage } from "./handler.js";

export function startTelegramBot() {
  const token = process.env.TELEGRAM_BOT_TOKEN;

  if (!token) {
    console.error("❌ TELEGRAM_BOT_TOKEN not set");
    return;
  }

  const bot = new TelegramBot(token, { polling: true });

  console.log("🤖 Telegram bot started");

  bot.on("message", (msg) => {
    handleTelegramMessage(bot, msg);
  });
}
