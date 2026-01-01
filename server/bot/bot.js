import 'dotenv/config';

import { executeBotCommands } from "./commandExecutor.js";
import { callAgent } from "../agent/agent.js";
import { loadMemory, saveMemory } from "../utils/db.js"; // <- use the new DB module

let memory = loadMemory();

/* ----------------------- Bot Function ----------------------- */

export async function runBot(userPrompt) {
  try {

    const agentReply = await callAgent({ userPrompt, memory });

    // AI returns JSON
    const parsed = JSON.parse(agentReply);
    const { updated_memory, commands, user_reply } = parsed;

    // persist memory
    if (updated_memory) {
      memory = updated_memory;
      saveMemory(memory);
    }

    // execute commands
    if (commands && commands.length > 0) {
      await executeBotCommands(commands);
    }

    return {
      updated_memory: memory,
      commands: commands || [],
      user_reply
    };

  } catch (err) {
    console.error("Bot Error:", err);
    return {
      updated_memory: memory,
      commands: [],
      user_reply: "Sorry, I couldn't process your request."
    };
  }
}
