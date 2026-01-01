import Database from "better-sqlite3";
import path from "path";

// DB file path (server/memory.db)
const DB_FILE = path.join(process.cwd(), "memory.db");
const db = new Database(DB_FILE);

// Create memory table and initial row if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS memory (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    data TEXT NOT NULL
  );
`);

const row = db.prepare("SELECT data FROM memory WHERE id = 1").get();
if (!row) {
  db.prepare("INSERT INTO memory (id, data) VALUES (1, ?)").run("{}");
}

// helper functions
export function loadMemory() {
  const row = db.prepare("SELECT data FROM memory WHERE id = 1").get();
  return JSON.parse(row.data);
}

export function saveMemory(memory) {
  db.prepare("UPDATE memory SET data = ? WHERE id = 1").run(JSON.stringify(memory));
}

export default db;
