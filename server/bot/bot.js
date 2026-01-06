import 'dotenv/config';

import { executeBotCommands } from "./commandExecutor.js";
import { callAgent } from "../agent/agent.js";
import { loadMemory, saveMemory } from "../utils/db.js"; // <- use the new DB module

let memory = loadMemory();

/* ----------------------- Bot Function ----------------------- */

export async function runBot(userPrompt) {
  try {

    let agentReply = await callAgent({ userPrompt, memory });
    let additionalData = {};

    // AI returns JSON
    let parsed;
    try {
      parsed = JSON.parse(agentReply);
    } catch (e) {
      console.error("JSON Parse Error:", e.message);
      console.error("Agent Reply (first 1000 chars):", agentReply.substring(0, 1000));
      console.error("Agent Reply (chars 15200-15400):", agentReply.substring(15200, 15400));
      throw e;
    }
    let { updated_memory, commands, user_reply } = parsed;

    console.log(parsed);

    // Loop to handle fetch commands
    while (commands && commands.length > 0 && commands.some(cmd => cmd.command && cmd.command.includes('fetch'))) {
      // Filter to keep only fetch commands
      const fetchCommands = commands.filter(cmd => cmd.command && cmd.command.includes('fetch'));
      
      // Execute fetch commands
      const { fetchedData } = await executeBotCommands(fetchCommands);
      
      // Set additionalData with fetched results
      if (fetchedData) {
        additionalData = { fetchedData };
      }

      // Call agent again with additionalData containing the fetched data
      agentReply = await callAgent({ userPrompt, memory, additionalData });
      parsed = JSON.parse(agentReply);
      
      // Update response variables
      const { updated_memory: newMemory, commands: newCommands, user_reply: newUserReply } = parsed;
      if (newMemory) {
        updated_memory = newMemory;
      }
      commands = newCommands;
      user_reply = newUserReply;
      
      console.log("Agent reply after fetch:", parsed);
    }

    // persist memory
    if (updated_memory) {
      memory = updated_memory;
      saveMemory(memory);
    }

    // execute commands (non-fetch commands)
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
