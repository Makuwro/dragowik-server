const sqlite3 = require("better-sqlite3");
const db = sqlite3("data.db");

db.prepare(`
  create table if not exists Users (
    username text not null unique,
    email text not null,
    password text not null,
    sessionToken text unique
  )
`).run();
  
db.prepare(`
  create table if not exists Articles (
    name text not null unique,
    source text,
    lastUpdated text not null default current_timestamp
  )
`).run();

module.exports = db;