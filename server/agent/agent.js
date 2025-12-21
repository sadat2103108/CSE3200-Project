import fs from "fs";
import fetch from "node-fetch";
import 'dotenv/config';

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = process.env.GEMINI_MODEL;
const BASE_URL = process.env.GEMINI_BASE_URL;
const MEMORY_FILE = "./memory.json";

if (!API_KEY) throw new Error("Missing GEMINI_API_KEY in .env");

const botCommandsMetadata = {
  "calendar.create_event": {
    params: ["title", "start", "end"],
    description: "Create a new calendar event",
    auto_loop_allowed: false
  }
};

const systemPrompt = `
You are a personal assistant agent.
Generate ONLY JSON with keys: updated_memory, commands, user_reply.
Do NOT call any APIs, just generate the command as JSON.
`;

export async function runAgent(prompt) {
  try {
    // Load memory.json
    let userMemory = {};
    if (fs.existsSync(MEMORY_FILE)) {
      const memData = fs.readFileSync(MEMORY_FILE, "utf-8");
      userMemory = JSON.parse(memData);
    }

    // Call Gemini
    const url = `${BASE_URL}/${MODEL}:generateContent?key=${API_KEY}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: systemPrompt + "\n\n" +
                      "User prompt: " + prompt + "\n" +
                      "User memory: " + JSON.stringify(userMemory) + "\n" +
                      "Bot commands metadata: " + JSON.stringify(botCommandsMetadata)
              }
            ]
          }
        ]
      })
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message || "Gemini API error");

    // Extract output
    let output = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    output = output.replace(/```json|```/g, "").trim();

    let parsedOutput = JSON.parse(output);

    // Save updated memory
    if (parsedOutput.updated_memory) {
      fs.writeFileSync(MEMORY_FILE, JSON.stringify(parsedOutput.updated_memory, null, 2), "utf-8");
    }

    // Return only commands + user_reply
    return {
      commands: parsedOutput.commands || [],
      user_reply: parsedOutput.user_reply || ""
    };

  } catch (err) {
    console.error("Agent Error:", err);
    return {
      commands: [],
      user_reply: "Sorry, I couldn't process your request."
    };
  }
}
