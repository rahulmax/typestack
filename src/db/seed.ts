import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { stacks } from "./schema";
import { PRESETS, buildPresetConfig } from "./seed-presets";
import { eq } from "drizzle-orm";
import path from "path";
import fs from "fs";

const dbPath = path.join(process.cwd(), "data", "typestack.db");
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const sqlite = new Database(dbPath);
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");
const db = drizzle(sqlite);

migrate(db, { migrationsFolder: path.join(process.cwd(), "drizzle") });

const now = new Date().toISOString();
const PRESET_DEVICE_ID = "typestack-system";

for (const preset of PRESETS) {
  const id = `preset-${preset.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  const existing = db.select().from(stacks).where(eq(stacks.id, id)).get();
  if (existing) {
    console.log(`  skip: ${preset.name} (exists)`);
    continue;
  }

  const config = buildPresetConfig(preset);

  db.insert(stacks).values({
    id,
    name: preset.name,
    config: JSON.stringify(config),
    deviceId: PRESET_DEVICE_ID,
    isPublished: true,
    isPreset: true,
    likesCount: 0,
    savesCount: 0,
    createdAt: now,
    updatedAt: now,
  }).run();

  console.log(`  seed: ${preset.name}`);
}

console.log("Done seeding.");
sqlite.close();
