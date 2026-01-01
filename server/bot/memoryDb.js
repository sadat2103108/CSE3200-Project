// server/bot/memoryDb.js
import Database from "better-sqlite3";

const db = new Database("memory.db"); // auto-creates file

db.exec(`
  CREATE TABLE IF NOT EXISTS memory (
    key TEXT PRIMARY KEY,
    value TEXT
  );
`);

export default db;
