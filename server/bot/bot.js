import 'dotenv/config';
import Database from "better-sqlite3";
import { executeBotCommands } from "./commandExecutor.js";
import { callAgent } from "../agent/agent.js";

/* ----------------------- Light DB Setup ----------------------- */

// creates memory.db in current working directory (server/)
const db = new Database("memory.db");

// single-table, schema-less memory store
db.exec(`
  CREATE TABLE IF NOT EXISTS memory (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    data TEXT NOT NULL
  );
`);

// ensure one row always exists
const row = db.prepare("SELECT data FROM memory WHERE id = 1").get();
if (!row) {
  db.prepare("INSERT INTO memory (id, data) VALUES (1, ?)").run("{}");
}

// load memory into JS object
function loadMemory() {
  const row = db.prepare("SELECT data FROM memory WHERE id = 1").get();
  return JSON.parse(row.data);
}

// save memory atomically
function saveMemory(memory) {
  db.prepare(
    "UPDATE memory SET data = ? WHERE id = 1"
  ).run(JSON.stringify(memory));
}

/* ----------------------- Runtime Memory ----------------------- */

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
