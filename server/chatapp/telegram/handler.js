import { runBot } from "../../bot/bot.js";

export async function handleTelegramMessage(bot, msg) {
  const chatId = msg.chat.id;
  const text = msg.text;

  // Ignore non-text messages
  if (!text) return;

  try {
    const result = await runBot(text);
    await bot.sendMessage(chatId, result.user_reply);
  } catch (err) {
    console.error("Telegram Handler Error:", err);
    await bot.sendMessage(chatId, "Something went wrong 😕");
  }
}
