import fetch from "node-fetch";
import 'dotenv/config';
import fs from "fs";
import { fileURLToPath } from 'url';
import path from 'path';
import { executeBotCommands } from "./commandExecutor.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MEMORY_FILE = path.join(__dirname, "memory.json");


const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = process.env.GEMINI_MODEL;
const BASE_URL = process.env.GEMINI_BASE_URL;


if (!API_KEY) throw new Error("Missing GEMINI_API_KEY in .env");



// ----------------------- Global System Prompt -----------------------
const systemPrompt = `
You are Conscia, a personal AI assistant for the user.
Your role is to understand the user's requests and generate a precise plan of actions for Conscia to execute.

Rules:
1. ALWAYS return ONLY JSON with these keys: 
   - "updated_memory": JSON object representing the updated state of the user, their preferences, context, and knowledge. 
   - "commands": array of bot commands that Conscia should execute.
   - "user_reply": a friendly, concise, and polite response to the user.

2. DO NOT call any APIs yourself. Only generate commands in the JSON structure.

3. Memory:
   - Track user preferences, habits, past events, interactions, and any other relevant context.
   - You may update memory with any new information learned from the user prompt.

4. Commands:
   - Refer to the Bot Commands Metadata provided. Each command has a "command" name, "params", and optional example.
   - Generate only commands that are valid according to the Bot Commands Metadata.
   - Fill in the params correctly based on the user prompt. Optional params can be omitted if not relevant.

5. Response style:
   - Make user_reply friendly, human-like, and context-aware.
   - Emojis are allowed if appropriate.
   - Keep the tone helpful and polite.

6. Output Format (JSON only):
{
  "updated_memory": { ... },
  "commands": [
    {
      "command": "calendar.add_event",
      "params": {
         "summary": "DP Practice",
         "description": "Practice session",
         "start": "2025-12-22T20:00:00+06:00",
         "end": "2025-12-22T21:00:00+06:00"
      }
    },
    ...
  ],
  "user_reply": "Hey! I scheduled your DP practice for tomorrow evening. 👍"
}

7. Examples:
   - If the user asks to schedule a new event, create a "calendar.add_event" command with proper params.
   - If the user asks about emails, create "email.send" commands with "to", "subject", and "body".

Your task:
- Read the user prompt carefully.
- Check memory to understand context.
- Use bot commands metadata to generate valid commands.
- Update memory if new information is learned.
- Generate user_reply for the user.
`;

// ----------------------- Global Bot Commands -----------------------
const botCommands = [
  {
    command: "calendar.fetch_events",
    description: "Fetches events from Google Calendar within a date range",
    params: { from: "ISO start", to: "ISO end" },
    example: { command: "calendar.fetch_events", params: { from: "2025-12-22T00:00:00+06:00", to: "2025-12-23T00:00:00+06:00" } }
  },
  {
    command: "calendar.add_event",
    description: "Adds a new event to Google Calendar",
    params: { summary: "title", description: "optional description", start: "ISO start", end: "ISO end" },
    example: { command: "calendar.add_event", params: { summary: "DP Practice", description: "Practice session", start: "2025-12-22T20:00:00+06:00", end: "2025-12-22T21:00:00+06:00" } }
  },
  {
    command: "calendar.update_event",
    description: "Updates an existing calendar event",
    params: { eventId: "id", summary: "new title", description: "new description", start: "ISO start", end: "ISO end" },
    example: { command: "calendar.update_event", params: { eventId: "xyz", summary: "Updated DP Practice", start: "2025-12-22T21:00:00+06:00", end: "2025-12-22T22:00:00+06:00" } }
  },
  {
    command: "calendar.delete_event",
    description: "Deletes a calendar event",
    params: { eventId: "id" },
    example: { command: "calendar.delete_event", params: { eventId: "xyz" } }
  },
  {
    command: "email.send",
    description: "Sends an email via Gmail",
    params: { to: "recipient", subject: "subject", body: "content" },
    example: { command: "email.send", params: { to: "friend@example.com", subject: "Hello", body: "Hi!" } }
  }
];

// ----------------------- Load Memory -----------------------
let memory = {};
if (fs.existsSync(MEMORY_FILE)) {
  memory = JSON.parse(fs.readFileSync(MEMORY_FILE, "utf-8"));
}

// ----------------------- Bot Function -----------------------
export async function runBot(userPrompt) {

  
  
  try {
    
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
                  "\n\nBot Commands Metadata:\n" +
                  JSON.stringify(botCommands, null, 2) +
                  "\n\nUser Prompt:\n" +
                  userPrompt +
                  "\n\nUser Memory:\n" +
                  JSON.stringify(memory, null, 2)
              }
            ]
          }
        ]
      })
    });



    const data = await response.json();
    if (data.error) throw new Error(data.error.message || "Gemini API error");

    // Extract Gemini output text
    let geminiText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    geminiText = geminiText.replace(/```json|```/g, "").trim();

    // Parse JSON returned by Gemini
    const parsed = JSON.parse(geminiText);
    const { updated_memory, commands, user_reply } = parsed;

    // console.log("memory:")
    // console.log(updated_memory)
    // console.log("commands:")
    // console.log(commands)
    // console.log("user reply:")
    // console.log(user_reply)

    // Save updated memory
    if (updated_memory) {
      memory = updated_memory;
      fs.writeFileSync(MEMORY_FILE, JSON.stringify(memory, null, 2), "utf-8");
    }

    // Execute bot commands
    if (commands && commands.length > 0) {
      await executeBotCommands(commands);
    }

    // Log AI reply
    console.log("AI Reply:", user_reply);

    return { updated_memory: memory, commands: commands || [], user_reply };

  } catch (err) {
    console.error("Bot Error:", err);
    return { updated_memory: memory, commands: [], user_reply: "Sorry, I couldn't process your request." };
  }
}
