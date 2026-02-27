import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, "db.json");

const DEFAULT_DB = {
  users: [],
  scores: [],
  achievements: [],
  tournaments: [],
  activities: [],
};

const readDb = () => {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(DEFAULT_DB, null, 2), "utf-8");
    return structuredClone(DEFAULT_DB);
  }

  const content = fs.readFileSync(DB_PATH, "utf-8");
  const sanitized = content.replace(/^\uFEFF/, "");
  return JSON.parse(sanitized);
};

const writeDb = (nextDb) => {
  fs.writeFileSync(DB_PATH, JSON.stringify(nextDb, null, 2), "utf-8");
};

const ensureSeedData = () => {
  const db = readDb();
  let changed = false;

  if (!Array.isArray(db.activities)) {
    db.activities = [];
    changed = true;
  }

  const hasDefaultAdmin = db.users.some(
    (user) => user.username.toLowerCase() === "admin"
  );

  if (!hasDefaultAdmin) {
    db.users.push({
      id: randomUUID(),
      username: "admin",
      email: "admin@gamecloud.local",
      password: "admin123",
      role: "manager",
      status: "Active",
      createdAt: new Date().toISOString(),
    });
    changed = true;
  }

  if (changed) writeDb(db);
};

export { readDb, writeDb, ensureSeedData };
