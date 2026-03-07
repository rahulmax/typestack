import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";
import { eq } from "drizzle-orm";
import { PRESETS, buildPresetConfig } from "./seed-presets";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export const db = drizzle(client, { schema });

// Auto-create tables (idempotent)
async function ensureSchema() {
  await client.executeMultiple(`
    CREATE TABLE IF NOT EXISTS stacks (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      config TEXT NOT NULL,
      category TEXT,
      device_id TEXT NOT NULL,
      is_published INTEGER NOT NULL DEFAULT 0,
      is_preset INTEGER NOT NULL DEFAULT 0,
      likes_count INTEGER NOT NULL DEFAULT 0,
      saves_count INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS stack_likes (
      stack_id TEXT NOT NULL REFERENCES stacks(id) ON DELETE CASCADE,
      device_id TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS stack_saves (
      stack_id TEXT NOT NULL REFERENCES stacks(id) ON DELETE CASCADE,
      device_id TEXT NOT NULL
    );
  `);
}

async function seedPresets() {
  const hasPresets = await db.select().from(schema.stacks).where(eq(schema.stacks.isPreset, true)).get();
  if (hasPresets) return;

  const now = new Date().toISOString();
  for (const preset of PRESETS) {
    const id = `preset-${preset.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
    await db.insert(schema.stacks).values({
      id,
      name: preset.name,
      config: JSON.stringify(buildPresetConfig(preset)),
      category: preset.category,
      deviceId: "typestack-system",
      isPublished: true,
      isPreset: true,
      likesCount: 0,
      savesCount: 0,
      createdAt: now,
      updatedAt: now,
    });
  }
}

const _ready = ensureSchema().then(seedPresets);
export const dbReady = _ready;
