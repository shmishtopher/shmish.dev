"use server";

import sqlite3 from "sqlite3";
import { open } from "sqlite";

// Initilize a new database connection, creating a file if
// the database does not exist.
const db = await open({
  filename: "portfolio.sqlite",
  driver: sqlite3.Database,
});

// Setup a table for managing guestbook entries
await db.exec(`
  CREATE TABLE IF NOT EXISTS guestbook (
    id INTEGER NOT NULL,
    timestamp TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    message TEXT NOT NULL
  );    
`);

export default db;
