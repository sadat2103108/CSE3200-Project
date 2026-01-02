import fetch from "node-fetch";
import 'dotenv/config';
import { systemPrompt } from '../data/systemPrompt.js';
import { botCommands } from '../data/botCommands.js';


const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = process.env.GEMINI_MODEL;
const BASE_URL = process.env.GEMINI_BASE_URL;


if (!API_KEY) throw new Error("Missing GEMINI_API_KEY in .env");






export async function callAgent({userPrompt, memory}) {
  try {

    const now = new Date();
    const localTimeInfo =
      "Current local time context:\n" +
      "- ISO datetime: " + now.toISOString() + "\n" +
      "- Local date: " + now.toDateString() + "\n" +
      "- Local time: " + now.toTimeString() + "\n" +
      "- Timezone offset (minutes): " + now.getTimezoneOffset() + "\n" +
      "- Timezone: Asia/Dhaka";



    const response = await fetch(`${BASE_URL}/${MODEL}:generateContent?key=${API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text:
                  systemPrompt +
                  "\n\n=== TIME CONTEXT (IMPORTANT) ===\n" +
                  localTimeInfo +
                  "\n\n=== BOT COMMANDS METADATA ===\n" +
                  JSON.stringify(botCommands, null, 2) +
                  "\n\n=== USER PROMPT ===\n" +
                  userPrompt +
                  "\n\n=== USER MEMORY ===\n" +
                  JSON.stringify(memory, null, 2)
              }
            ]
          }
        ]
      })
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message || "Agent API error");

    // Extract text from response
    let agentText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    agentText = agentText.replace(/```json|```/g, "").trim();

    return agentText; // raw JSON string
  } catch (err) {
    console.error("Agent Error:", err);
    throw err;
  }
}