import 'dotenv/config';
import fs from "fs";
import { fileURLToPath } from 'url';
import path from 'path';
import { executeBotCommands } from "./commandExecutor.js";
import { callAgent } from "../agent/agent.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MEMORY_FILE = path.join(__dirname, "memory.json");

let memory = {};
if (fs.existsSync(MEMORY_FILE)) {
  memory = JSON.parse(fs.readFileSync(MEMORY_FILE, "utf-8"));
}

// ----------------------- Bot Function -----------------------
export async function runBot(userPrompt) {

  try {


    const agentReply = await callAgent({userPrompt,memory});


    // Parse JSON returned by Gemini
    const parsed = JSON.parse(agentReply);
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


    return { updated_memory: memory, commands: commands || [], user_reply };

  } catch (err) {
    console.error("Bot Error:", err);
    return { updated_memory: memory, commands: [], user_reply: "Sorry, I couldn't process your request." };
  }
}
