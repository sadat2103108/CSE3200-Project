// scripts/dbInterface.js


/**
 * ===========================================
 * Memory DB Utility Script
 * Export current DB memory:
 *      node scripts/dbInterface.js export
 *
 * Seed DB memory from a JSON file:
 *      node scripts/dbInterface.js seed seedInput.json
 *
 * ===========================================
 */




import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const DB_FILE = path.join(process.cwd(), "memory.db");
const db = new Database(DB_FILE);

// Ensure table exists
db.exec(`
  CREATE TABLE IF NOT EXISTS memory (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    data TEXT NOT NULL
  );
`);

// Ensure row exists
const row = db.prepare("SELECT data FROM memory WHERE id = 1").get();
if (!row) {
  db.prepare("INSERT INTO memory (id, data) VALUES (1, ?)").run("{}");
}

/* ----------------------- Functions ----------------------- */

/**
 * Export current DB memory to a JSON file
 * @param {string} outputFile - path to temp JSON file
 */
export function exportMemoryToJSON(outputFile = "memory_temp.json") {
  const row = db.prepare("SELECT data FROM memory WHERE id = 1").get();
  const memory = row ? JSON.parse(row.data) : {};
  fs.writeFileSync(outputFile, JSON.stringify(memory, null, 2), "utf-8");
  console.log(`✅ Memory exported to ${outputFile}`);
}

/**
 * Seed the DB memory from an input JSON file
 * @param {string} inputFile - path to input JSON file
 */
export function seedMemoryFromJSON(inputFile) {
  if (!fs.existsSync(inputFile)) {
    console.error(`❌ Input file "${inputFile}" does not exist.`);
    return;
  }
  const data = JSON.parse(fs.readFileSync(inputFile, "utf-8"));
  db.prepare("UPDATE memory SET data = ? WHERE id = 1")
    .run(JSON.stringify(data));
  console.log(`✅ Memory seeded from ${inputFile}`);
}

/* ----------------------- Example Usage ----------------------- */
if (fileURLToPath(import.meta.url) === process.argv[1]) {
  // CLI: node dbInterface.js export   -> exports DB to memory_temp.json
  // CLI: node dbInterface.js seed <file.json>  -> seeds DB from input file
  const [,, cmd, file] = process.argv;

  if (cmd === "export") {
    exportMemoryToJSON();
  } else if (cmd === "seed") {
    if (!file) {
      console.error("❌ Please provide an input JSON file to seed from.");
    } else {
      seedMemoryFromJSON(file);
    }
  } else {
    console.log("Usage:");
    console.log("  node dbInterface.js export          -> export DB memory to JSON");
    console.log("  node dbInterface.js seed <file.json> -> seed DB from JSON file");
  }
}
