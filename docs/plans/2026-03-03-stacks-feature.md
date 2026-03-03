# Stacks Feature Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a presets/stacks system seeded with 39 Figma font pairings, with like/save/publish, backed by SQLite, surfaced via a gallery page and sidebar picker.

**Architecture:** SQLite database via Drizzle ORM stores stacks (full TypographyConfig as JSON). Next.js API routes handle CRUD + social actions. Anonymous device UUID identifies users. Gallery page at `/stacks` shows a card grid; sidebar gets a compact stack picker at the top.

**Tech Stack:** Drizzle ORM + better-sqlite3, Next.js App Router API routes, Zustand (existing), shadcn/ui components (existing)

---

### Task 1: Install Dependencies

**Files:**
- Modify: `package.json`

**Step 1: Install Drizzle + SQLite deps**

Run:
```bash
pnpm add drizzle-orm better-sqlite3
pnpm add -D drizzle-kit @types/better-sqlite3
```

**Step 2: Verify install**

Run: `pnpm tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: add drizzle-orm and better-sqlite3 deps"
```

---

### Task 2: Database Schema & Connection

**Files:**
- Create: `src/db/schema.ts`
- Create: `src/db/index.ts`
- Create: `drizzle.config.ts`
- Modify: `.gitignore`

**Step 1: Create schema**

Create `src/db/schema.ts`:

```typescript
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const stacks = sqliteTable("stacks", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  config: text("config").notNull(), // JSON-serialized TypographyConfig
  deviceId: text("device_id").notNull(),
  isPublished: integer("is_published", { mode: "boolean" }).notNull().default(false),
  isPreset: integer("is_preset", { mode: "boolean" }).notNull().default(false),
  likesCount: integer("likes_count").notNull().default(0),
  savesCount: integer("saves_count").notNull().default(0),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const stackLikes = sqliteTable("stack_likes", {
  stackId: text("stack_id")
    .notNull()
    .references(() => stacks.id, { onDelete: "cascade" }),
  deviceId: text("device_id").notNull(),
});

export const stackSaves = sqliteTable("stack_saves", {
  stackId: text("stack_id")
    .notNull()
    .references(() => stacks.id, { onDelete: "cascade" }),
  deviceId: text("device_id").notNull(),
});
```

**Step 2: Create DB connection**

Create `src/db/index.ts`:

```typescript
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";
import path from "path";

const dbPath = path.join(process.cwd(), "data", "typestack.db");

const sqlite = new Database(dbPath);
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");

export const db = drizzle(sqlite, { schema });
```

**Step 3: Create drizzle config**

Create `drizzle.config.ts`:

```typescript
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "sqlite",
  dbCredentials: {
    url: "./data/typestack.db",
  },
});
```

**Step 4: Add data dir to gitignore**

Add to `.gitignore`:
```
data/
```

**Step 5: Create data directory and generate migrations**

Run:
```bash
mkdir -p data
pnpm drizzle-kit generate
```

**Step 6: Create migration runner**

Create `src/db/migrate.ts`:

```typescript
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import path from "path";

const dbPath = path.join(process.cwd(), "data", "typestack.db");
const sqlite = new Database(dbPath);
export const db = drizzle(sqlite);

migrate(db, { migrationsFolder: path.join(process.cwd(), "drizzle") });
sqlite.close();
```

Add to `package.json` scripts:
```json
"db:generate": "drizzle-kit generate",
"db:migrate": "tsx src/db/migrate.ts",
"db:seed": "tsx src/db/seed.ts"
```

Install tsx as dev dep:
```bash
pnpm add -D tsx
```

**Step 7: Run migration**

```bash
pnpm db:migrate
```

**Step 8: Verify types**

Run: `pnpm tsc --noEmit`
Expected: No errors

**Step 9: Commit**

```bash
git add src/db/ drizzle.config.ts drizzle/ .gitignore package.json pnpm-lock.yaml
git commit -m "feat: add SQLite database schema and Drizzle config"
```

---

### Task 3: Device ID Utility

**Files:**
- Create: `src/lib/device-id.ts`

**Step 1: Create device ID utility**

Create `src/lib/device-id.ts`:

```typescript
const DEVICE_ID_KEY = "typestack-device-id";

export function getDeviceId(): string {
  if (typeof window === "undefined") return "";

  let id = localStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
}
```

**Step 2: Verify types**

Run: `pnpm tsc --noEmit`

**Step 3: Commit**

```bash
git add src/lib/device-id.ts
git commit -m "feat: add anonymous device ID utility"
```

---

### Task 4: Seed Data — 39 Figma Font Pairings

**Files:**
- Create: `src/db/seed-presets.ts` (the preset data)
- Create: `src/db/seed.ts` (the seed runner)

**Step 1: Create preset data**

Create `src/db/seed-presets.ts` with all 39 font pairings. Each entry is a partial TypographyConfig that will be merged with defaults. The key fields per preset are: name, headingsGroup.fontFamily, headingsGroup.fontWeight, bodyGroup.fontFamily, bodyGroup.fontWeight, headingsGroup.color, bodyGroup.color, backgroundColor.

```typescript
import type { TypographyConfig } from "@/types/typography";
import { DEFAULT_CONFIG } from "@/data/default-config";

interface PresetDef {
  name: string;
  headingFont: string;
  headingWeight: number;
  bodyFont: string;
  bodyWeight: number;
  fg: string; // text color for both groups
  bg: string; // background color
  category: string;
}

const PRESETS: PresetDef[] = [
  // 1
  { name: "Abril Fatface + Lato", headingFont: "Abril Fatface", headingWeight: 400, bodyFont: "Lato", bodyWeight: 400, fg: "#1a1a1a", bg: "#5cff8a", category: "editorial" },
  // 2
  { name: "Fugaz One + Work Sans", headingFont: "Fugaz One", headingWeight: 400, bodyFont: "Work Sans", bodyWeight: 400, fg: "#ffffff", bg: "#2d2d6b", category: "creative" },
  // 3
  { name: "Space Mono + Plus Jakarta Sans", headingFont: "Space Mono", headingWeight: 700, bodyFont: "Plus Jakarta Sans", bodyWeight: 400, fg: "#e8e8e8", bg: "#1a1a2e", category: "tech" },
  // 4
  { name: "Grand Hotel + Lato", headingFont: "Grand Hotel", headingWeight: 400, bodyFont: "Lato", bodyWeight: 400, fg: "#3d2c2c", bg: "#fdf0e2", category: "elegant" },
  // 5
  { name: "Raleway + Merriweather", headingFont: "Raleway", headingWeight: 700, bodyFont: "Merriweather", bodyWeight: 400, fg: "#2c3e50", bg: "#ecf0f1", category: "professional" },
  // 6
  { name: "Chonburi + Domine", headingFont: "Chonburi", headingWeight: 400, bodyFont: "Domine", bodyWeight: 400, fg: "#1b1b1b", bg: "#f5e6ca", category: "editorial" },
  // 7
  { name: "Inter + Krub", headingFont: "Inter", headingWeight: 700, bodyFont: "Krub", bodyWeight: 400, fg: "#1a1a1a", bg: "#f0f4f8", category: "modern" },
  // 8
  { name: "Oswald + Source Serif 4", headingFont: "Oswald", headingWeight: 700, bodyFont: "Source Serif 4", bodyWeight: 400, fg: "#ffffff", bg: "#0d1b2a", category: "editorial" },
  // 9
  { name: "Arima Madurai + Mulish", headingFont: "Arima Madurai", headingWeight: 700, bodyFont: "Mulish", bodyWeight: 400, fg: "#2e1a47", bg: "#f3e8ff", category: "creative" },
  // 10
  { name: "Nunito + Lora", headingFont: "Nunito", headingWeight: 700, bodyFont: "Lora", bodyWeight: 400, fg: "#1a1a1a", bg: "#faf7f2", category: "warm" },
  // 11
  { name: "Ultra + Slabo 27px", headingFont: "Ultra", headingWeight: 400, bodyFont: "Slabo 27px", bodyWeight: 400, fg: "#ffffff", bg: "#b91c1c", category: "bold" },
  // 12
  { name: "Arvo + Lato", headingFont: "Arvo", headingWeight: 700, bodyFont: "Lato", bodyWeight: 400, fg: "#1e293b", bg: "#f1f5f9", category: "professional" },
  // 13
  { name: "Unica One + Crimson Text", headingFont: "Unica One", headingWeight: 400, bodyFont: "Crimson Text", bodyWeight: 400, fg: "#d4af37", bg: "#1a1a2e", category: "luxury" },
  // 14
  { name: "Cinzel + Fauna One", headingFont: "Cinzel", headingWeight: 700, bodyFont: "Fauna One", bodyWeight: 400, fg: "#dbccb5", bg: "#b5684c", category: "heritage" },
  // 15
  { name: "Yeseva One + Josefin Sans", headingFont: "Yeseva One", headingWeight: 400, bodyFont: "Josefin Sans", bodyWeight: 400, fg: "#dba988", bg: "#162c3a", category: "elegant" },
  // 16
  { name: "Sacramento + Alice", headingFont: "Sacramento", headingWeight: 400, bodyFont: "Alice", bodyWeight: 400, fg: "#4a3728", bg: "#fff5eb", category: "romantic" },
  // 17
  { name: "Roboto + Lora", headingFont: "Roboto", headingWeight: 700, bodyFont: "Lora", bodyWeight: 400, fg: "#212121", bg: "#fafafa", category: "professional" },
  // 18
  { name: "Montserrat + Karla", headingFont: "Montserrat", headingWeight: 700, bodyFont: "Karla", bodyWeight: 400, fg: "#1a1a1a", bg: "#e8f5e9", category: "modern" },
  // 19
  { name: "Fjalla One + Cantarell", headingFont: "Fjalla One", headingWeight: 400, bodyFont: "Cantarell", bodyWeight: 400, fg: "#ffffff", bg: "#37474f", category: "bold" },
  // 20
  { name: "Source Sans Pro + Alegreya", headingFont: "Source Sans Pro", headingWeight: 700, bodyFont: "Alegreya", bodyWeight: 400, fg: "#263238", bg: "#fff8e1", category: "editorial" },
  // 21
  { name: "Stint Ultra Expanded + Pontano Sans", headingFont: "Stint Ultra Expanded", headingWeight: 400, bodyFont: "Pontano Sans", bodyWeight: 400, fg: "#1b1b1b", bg: "#e0e7ee", category: "unique" },
  // 22
  { name: "Ubuntu + Rokkitt", headingFont: "Ubuntu", headingWeight: 700, bodyFont: "Rokkitt", bodyWeight: 400, fg: "#ffffff", bg: "#e65100", category: "tech" },
  // 23
  { name: "Nunito + PT Sans", headingFont: "Nunito", headingWeight: 700, bodyFont: "PT Sans", bodyWeight: 400, fg: "#333333", bg: "#f9f9f9", category: "friendly" },
  // 24
  { name: "DotGothic16 + Space Mono", headingFont: "DotGothic16", headingWeight: 400, bodyFont: "Space Mono", bodyWeight: 400, fg: "#00ff41", bg: "#0a0a0a", category: "retro" },
  // 25
  { name: "Playfair Display + Lato", headingFont: "Playfair Display", headingWeight: 700, bodyFont: "Lato", bodyWeight: 400, fg: "#1a1a1a", bg: "#f5f0eb", category: "luxury" },
  // 26
  { name: "Quicksand Bold + Quicksand", headingFont: "Quicksand", headingWeight: 700, bodyFont: "Quicksand", bodyWeight: 400, fg: "#5b4a8a", bg: "#f0edf6", category: "playful" },
  // 27
  { name: "Syne + Inter", headingFont: "Syne", headingWeight: 700, bodyFont: "Inter", bodyWeight: 400, fg: "#ffffff", bg: "#0f172a", category: "tech" },
  // 28
  { name: "Yellowtail + Rethink Sans", headingFont: "Yellowtail", headingWeight: 400, bodyFont: "Rethink Sans", bodyWeight: 400, fg: "#7c2d12", bg: "#fef3c7", category: "retro" },
  // 29
  { name: "Rufina + Average Sans", headingFont: "Rufina", headingWeight: 700, bodyFont: "Average Sans", bodyWeight: 400, fg: "#1e293b", bg: "#f8fafc", category: "editorial" },
  // 30
  { name: "Poiret One + Montserrat", headingFont: "Poiret One", headingWeight: 400, bodyFont: "Montserrat", bodyWeight: 400, fg: "#d4af37", bg: "#1c1c1c", category: "luxury" },
  // 31
  { name: "Sintony + Poppins", headingFont: "Sintony", headingWeight: 700, bodyFont: "Poppins", bodyWeight: 400, fg: "#1a1a1a", bg: "#e3f2fd", category: "modern" },
  // 32
  { name: "Philosopher + Mulish", headingFont: "Philosopher", headingWeight: 700, bodyFont: "Mulish", bodyWeight: 400, fg: "#2c3e50", bg: "#fdf2e9", category: "literary" },
  // 33
  { name: "Cardo + Hind", headingFont: "Cardo", headingWeight: 700, bodyFont: "Hind", bodyWeight: 400, fg: "#3e2723", bg: "#efebe9", category: "heritage" },
  // 34
  { name: "Bubblegum Sans + Open Sans", headingFont: "Bubblegum Sans", headingWeight: 400, bodyFont: "Open Sans", bodyWeight: 400, fg: "#ffffff", bg: "#e91e63", category: "playful" },
  // 35
  { name: "Archivo Narrow + Tenor Sans", headingFont: "Archivo Narrow", headingWeight: 700, bodyFont: "Tenor Sans", bodyWeight: 400, fg: "#1a1a1a", bg: "#f5f5f5", category: "corporate" },
  // 36
  { name: "Rethink Sans + Spectral", headingFont: "Rethink Sans", headingWeight: 700, bodyFont: "Spectral", bodyWeight: 400, fg: "#1e293b", bg: "#f0fdf4", category: "professional" },
  // 37
  { name: "Crimson Pro + DM Sans", headingFont: "Crimson Pro", headingWeight: 700, bodyFont: "DM Sans", bodyWeight: 400, fg: "#7f1d1d", bg: "#fef2f2", category: "editorial" },
  // 38
  { name: "Young Serif + Instrument Sans", headingFont: "Young Serif", headingWeight: 400, bodyFont: "Instrument Sans", bodyWeight: 400, fg: "#1a1a1a", bg: "#fef9c3", category: "creative" },
  // 39
  { name: "Instrument Sans + Geist", headingFont: "Instrument Sans", headingWeight: 600, bodyFont: "Geist", bodyWeight: 400, fg: "#e2e8f0", bg: "#0f172a", category: "minimal" },
];

export function buildPresetConfig(preset: PresetDef): TypographyConfig {
  return {
    ...DEFAULT_CONFIG,
    headingsGroup: {
      ...DEFAULT_CONFIG.headingsGroup,
      fontFamily: preset.headingFont,
      fontWeight: preset.headingWeight,
      color: preset.fg,
    },
    bodyGroup: {
      ...DEFAULT_CONFIG.bodyGroup,
      fontFamily: preset.bodyFont,
      fontWeight: preset.bodyWeight,
      color: preset.fg,
    },
    backgroundColor: preset.bg,
  };
}

export { PRESETS };
export type { PresetDef };
```

**Step 2: Create seed runner**

Create `src/db/seed.ts`:

```typescript
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { stacks } from "./schema";
import { PRESETS, buildPresetConfig } from "./seed-presets";
import { eq } from "drizzle-orm";
import path from "path";

const dbPath = path.join(process.cwd(), "data", "typestack.db");
const sqlite = new Database(dbPath);
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");
const db = drizzle(sqlite);

// Run migrations first
migrate(db, { migrationsFolder: path.join(process.cwd(), "drizzle") });

// Seed presets
const now = new Date().toISOString();
const PRESET_DEVICE_ID = "typestack-system";

for (const preset of PRESETS) {
  const id = `preset-${preset.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  // Check if already exists
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
```

**Step 3: Run seed**

```bash
pnpm db:seed
```

Expected: 39 lines of `seed: <name>` output

**Step 4: Verify types**

Run: `pnpm tsc --noEmit`

**Step 5: Commit**

```bash
git add src/db/seed-presets.ts src/db/seed.ts package.json
git commit -m "feat: add 39 Figma font pairing presets as seed data"
```

---

### Task 5: Ensure DB is initialized on server start

**Files:**
- Create: `src/db/ensure-db.ts`
- Modify: `src/db/index.ts`

**Step 1: Create auto-init helper**

The `src/db/index.ts` should auto-create the data directory and run migrations if needed. Update `src/db/index.ts`:

```typescript
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import * as schema from "./schema";
import path from "path";
import fs from "fs";

const dbPath = path.join(process.cwd(), "data", "typestack.db");

// Ensure data directory exists
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const sqlite = new Database(dbPath);
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");

// Auto-migrate on first import
migrate(drizzle(sqlite), {
  migrationsFolder: path.join(process.cwd(), "drizzle"),
});

export const db = drizzle(sqlite, { schema });
```

**Step 2: Verify types**

Run: `pnpm tsc --noEmit`

**Step 3: Commit**

```bash
git add src/db/index.ts
git commit -m "feat: auto-migrate database on first import"
```

---

### Task 6: API Routes — List & Create Stacks

**Files:**
- Create: `src/app/api/stacks/route.ts`

**Step 1: Create list + create route**

Create `src/app/api/stacks/route.ts`:

```typescript
import { db } from "@/db";
import { stacks, stackLikes, stackSaves } from "@/db/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const deviceId = request.headers.get("x-device-id") || "";
  const filter = request.nextUrl.searchParams.get("filter") || "all";

  let rows;

  if (filter === "presets") {
    rows = db
      .select()
      .from(stacks)
      .where(eq(stacks.isPreset, true))
      .orderBy(desc(stacks.createdAt))
      .all();
  } else if (filter === "community") {
    rows = db
      .select()
      .from(stacks)
      .where(and(eq(stacks.isPublished, true), eq(stacks.isPreset, false)))
      .orderBy(desc(stacks.likesCount))
      .all();
  } else if (filter === "mine") {
    rows = db
      .select()
      .from(stacks)
      .where(eq(stacks.deviceId, deviceId))
      .orderBy(desc(stacks.updatedAt))
      .all();
  } else if (filter === "saved") {
    rows = db
      .select({ stack: stacks })
      .from(stackSaves)
      .innerJoin(stacks, eq(stackSaves.stackId, stacks.id))
      .where(eq(stackSaves.deviceId, deviceId))
      .all()
      .map((r) => r.stack);
  } else {
    // "all" — presets + published
    rows = db
      .select()
      .from(stacks)
      .where(sql`${stacks.isPreset} = 1 OR ${stacks.isPublished} = 1`)
      .orderBy(desc(stacks.isPreset), desc(stacks.likesCount))
      .all();
  }

  // Attach like/save status for current device
  const likedSet = new Set(
    db
      .select({ stackId: stackLikes.stackId })
      .from(stackLikes)
      .where(eq(stackLikes.deviceId, deviceId))
      .all()
      .map((r) => r.stackId)
  );
  const savedSet = new Set(
    db
      .select({ stackId: stackSaves.stackId })
      .from(stackSaves)
      .where(eq(stackSaves.deviceId, deviceId))
      .all()
      .map((r) => r.stackId)
  );

  const result = rows.map((s) => ({
    ...s,
    config: JSON.parse(s.config),
    isLiked: likedSet.has(s.id),
    isSaved: savedSet.has(s.id),
  }));

  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  const deviceId = request.headers.get("x-device-id");
  if (!deviceId) {
    return NextResponse.json({ error: "Missing device ID" }, { status: 400 });
  }

  const body = await request.json();
  const { name, config } = body;

  if (!name || !config) {
    return NextResponse.json(
      { error: "Name and config required" },
      { status: 400 }
    );
  }

  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  db.insert(stacks)
    .values({
      id,
      name,
      config: JSON.stringify(config),
      deviceId,
      isPublished: false,
      isPreset: false,
      likesCount: 0,
      savesCount: 0,
      createdAt: now,
      updatedAt: now,
    })
    .run();

  const created = db.select().from(stacks).where(eq(stacks.id, id)).get()!;

  return NextResponse.json(
    { ...created, config: JSON.parse(created.config) },
    { status: 201 }
  );
}
```

**Step 2: Verify types**

Run: `pnpm tsc --noEmit`

**Step 3: Test with curl**

```bash
# List presets
curl -s http://localhost:3001/api/stacks?filter=presets | head -c 500

# Create a stack
curl -s -X POST http://localhost:3001/api/stacks \
  -H "Content-Type: application/json" \
  -H "x-device-id: test-device-123" \
  -d '{"name":"Test Stack","config":{"baseFontSize":16}}' | head -c 500
```

**Step 4: Commit**

```bash
git add src/app/api/stacks/route.ts
git commit -m "feat: add GET/POST API routes for stacks"
```

---

### Task 7: API Routes — Single Stack, Update, Delete

**Files:**
- Create: `src/app/api/stacks/[id]/route.ts`

**Step 1: Create single stack routes**

Create `src/app/api/stacks/[id]/route.ts`:

```typescript
import { db } from "@/db";
import { stacks, stackLikes, stackSaves } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

type Params = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const deviceId = request.headers.get("x-device-id") || "";

  const stack = db.select().from(stacks).where(eq(stacks.id, id)).get();
  if (!stack) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const liked = db
    .select()
    .from(stackLikes)
    .where(and(eq(stackLikes.stackId, id), eq(stackLikes.deviceId, deviceId)))
    .get();

  const saved = db
    .select()
    .from(stackSaves)
    .where(and(eq(stackSaves.stackId, id), eq(stackSaves.deviceId, deviceId)))
    .get();

  return NextResponse.json({
    ...stack,
    config: JSON.parse(stack.config),
    isLiked: !!liked,
    isSaved: !!saved,
  });
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const deviceId = request.headers.get("x-device-id");
  if (!deviceId) {
    return NextResponse.json({ error: "Missing device ID" }, { status: 400 });
  }

  const stack = db.select().from(stacks).where(eq(stacks.id, id)).get();
  if (!stack) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (stack.deviceId !== deviceId) {
    return NextResponse.json({ error: "Not owner" }, { status: 403 });
  }

  const body = await request.json();
  const updates: Record<string, unknown> = {
    updatedAt: new Date().toISOString(),
  };

  if (body.name !== undefined) updates.name = body.name;
  if (body.config !== undefined)
    updates.config = JSON.stringify(body.config);
  if (body.isPublished !== undefined) updates.isPublished = body.isPublished;

  db.update(stacks).set(updates).where(eq(stacks.id, id)).run();

  const updated = db.select().from(stacks).where(eq(stacks.id, id)).get()!;
  return NextResponse.json({ ...updated, config: JSON.parse(updated.config) });
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const deviceId = request.headers.get("x-device-id");
  if (!deviceId) {
    return NextResponse.json({ error: "Missing device ID" }, { status: 400 });
  }

  const stack = db.select().from(stacks).where(eq(stacks.id, id)).get();
  if (!stack) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (stack.isPreset) {
    return NextResponse.json(
      { error: "Cannot delete presets" },
      { status: 403 }
    );
  }
  if (stack.deviceId !== deviceId) {
    return NextResponse.json({ error: "Not owner" }, { status: 403 });
  }

  db.delete(stacks).where(eq(stacks.id, id)).run();
  return NextResponse.json({ ok: true });
}
```

**Step 2: Verify types**

Run: `pnpm tsc --noEmit`

**Step 3: Commit**

```bash
git add src/app/api/stacks/\\[id\\]/route.ts
git commit -m "feat: add GET/PATCH/DELETE routes for single stack"
```

---

### Task 8: API Routes — Like & Save Toggle

**Files:**
- Create: `src/app/api/stacks/[id]/like/route.ts`
- Create: `src/app/api/stacks/[id]/save/route.ts`

**Step 1: Create like toggle**

Create `src/app/api/stacks/[id]/like/route.ts`:

```typescript
import { db } from "@/db";
import { stacks, stackLikes } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

type Params = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const deviceId = request.headers.get("x-device-id");
  if (!deviceId) {
    return NextResponse.json({ error: "Missing device ID" }, { status: 400 });
  }

  const existing = db
    .select()
    .from(stackLikes)
    .where(and(eq(stackLikes.stackId, id), eq(stackLikes.deviceId, deviceId)))
    .get();

  if (existing) {
    // Unlike
    db.delete(stackLikes)
      .where(
        and(eq(stackLikes.stackId, id), eq(stackLikes.deviceId, deviceId))
      )
      .run();
    db.update(stacks)
      .set({ likesCount: sql`${stacks.likesCount} - 1` })
      .where(eq(stacks.id, id))
      .run();
    return NextResponse.json({ liked: false });
  } else {
    // Like
    db.insert(stackLikes).values({ stackId: id, deviceId }).run();
    db.update(stacks)
      .set({ likesCount: sql`${stacks.likesCount} + 1` })
      .where(eq(stacks.id, id))
      .run();
    return NextResponse.json({ liked: true });
  }
}
```

**Step 2: Create save toggle**

Create `src/app/api/stacks/[id]/save/route.ts`:

```typescript
import { db } from "@/db";
import { stacks, stackSaves } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

type Params = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const deviceId = request.headers.get("x-device-id");
  if (!deviceId) {
    return NextResponse.json({ error: "Missing device ID" }, { status: 400 });
  }

  const existing = db
    .select()
    .from(stackSaves)
    .where(and(eq(stackSaves.stackId, id), eq(stackSaves.deviceId, deviceId)))
    .get();

  if (existing) {
    // Unsave
    db.delete(stackSaves)
      .where(
        and(eq(stackSaves.stackId, id), eq(stackSaves.deviceId, deviceId))
      )
      .run();
    db.update(stacks)
      .set({ savesCount: sql`${stacks.savesCount} - 1` })
      .where(eq(stacks.id, id))
      .run();
    return NextResponse.json({ saved: false });
  } else {
    // Save
    db.insert(stackSaves).values({ stackId: id, deviceId }).run();
    db.update(stacks)
      .set({ savesCount: sql`${stacks.savesCount} + 1` })
      .where(eq(stacks.id, id))
      .run();
    return NextResponse.json({ saved: true });
  }
}
```

**Step 3: Verify types**

Run: `pnpm tsc --noEmit`

**Step 4: Commit**

```bash
git add src/app/api/stacks/\\[id\\]/like/route.ts src/app/api/stacks/\\[id\\]/save/route.ts
git commit -m "feat: add like/save toggle API routes"
```

---

### Task 9: Client API Helper & Hooks

**Files:**
- Create: `src/lib/stacks-api.ts`

**Step 1: Create API helper**

Create `src/lib/stacks-api.ts`:

```typescript
import { getDeviceId } from "./device-id";
import type { TypographyConfig } from "@/types/typography";

export interface Stack {
  id: string;
  name: string;
  config: TypographyConfig;
  deviceId: string;
  isPublished: boolean;
  isPreset: boolean;
  likesCount: number;
  savesCount: number;
  isLiked: boolean;
  isSaved: boolean;
  createdAt: string;
  updatedAt: string;
}

function headers(): HeadersInit {
  return {
    "Content-Type": "application/json",
    "x-device-id": getDeviceId(),
  };
}

export async function fetchStacks(
  filter: "all" | "presets" | "community" | "mine" | "saved" = "all"
): Promise<Stack[]> {
  const res = await fetch(`/api/stacks?filter=${filter}`, {
    headers: headers(),
  });
  if (!res.ok) throw new Error("Failed to fetch stacks");
  return res.json();
}

export async function fetchStack(id: string): Promise<Stack> {
  const res = await fetch(`/api/stacks/${id}`, { headers: headers() });
  if (!res.ok) throw new Error("Failed to fetch stack");
  return res.json();
}

export async function createStack(
  name: string,
  config: TypographyConfig
): Promise<Stack> {
  const res = await fetch("/api/stacks", {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ name, config }),
  });
  if (!res.ok) throw new Error("Failed to create stack");
  return res.json();
}

export async function updateStack(
  id: string,
  updates: { name?: string; config?: TypographyConfig; isPublished?: boolean }
): Promise<Stack> {
  const res = await fetch(`/api/stacks/${id}`, {
    method: "PATCH",
    headers: headers(),
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("Failed to update stack");
  return res.json();
}

export async function deleteStack(id: string): Promise<void> {
  const res = await fetch(`/api/stacks/${id}`, {
    method: "DELETE",
    headers: headers(),
  });
  if (!res.ok) throw new Error("Failed to delete stack");
}

export async function toggleLike(
  id: string
): Promise<{ liked: boolean }> {
  const res = await fetch(`/api/stacks/${id}/like`, {
    method: "POST",
    headers: headers(),
  });
  if (!res.ok) throw new Error("Failed to toggle like");
  return res.json();
}

export async function toggleSave(
  id: string
): Promise<{ saved: boolean }> {
  const res = await fetch(`/api/stacks/${id}/save`, {
    method: "POST",
    headers: headers(),
  });
  if (!res.ok) throw new Error("Failed to toggle save");
  return res.json();
}
```

**Step 2: Verify types**

Run: `pnpm tsc --noEmit`

**Step 3: Commit**

```bash
git add src/lib/stacks-api.ts
git commit -m "feat: add client-side stacks API helper"
```

---

### Task 10: UI Store Updates

**Files:**
- Modify: `src/store/ui-store.ts`

**Step 1: Add stack tracking to UI store**

Add to `UIStore` interface and initial state:

```typescript
// Add to interface:
currentStackId: string | null;
currentStackName: string | null;
isDirty: boolean;

setCurrentStack: (id: string | null, name: string | null) => void;
setDirty: (dirty: boolean) => void;

// Add to create():
currentStackId: null,
currentStackName: null,
isDirty: false,

setCurrentStack: (id, name) => set({ currentStackId: id, currentStackName: name, isDirty: false }),
setDirty: (dirty) => set({ isDirty: dirty }),
```

**Step 2: Verify types**

Run: `pnpm tsc --noEmit`

**Step 3: Commit**

```bash
git add src/store/ui-store.ts
git commit -m "feat: add stack tracking to UI store"
```

---

### Task 11: Gallery Page — Stack Card Component

**Files:**
- Create: `src/components/stacks/stack-card.tsx`

**Step 1: Create stack card**

Create `src/components/stacks/stack-card.tsx`. This is the visual card that shows a font pairing preview with the stack's own colors. It should have generous padding, actual rendered font samples, and like/save buttons.

```typescript
"use client";

import { Heart, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Stack } from "@/lib/stacks-api";

interface StackCardProps {
  stack: Stack;
  onSelect: (stack: Stack) => void;
  onLike: (stack: Stack) => void;
  onSave: (stack: Stack) => void;
}

export function StackCard({ stack, onSelect, onLike, onSave }: StackCardProps) {
  const { config } = stack;
  const headingFont = config.headingsGroup.fontFamily;
  const bodyFont = config.bodyGroup.fontFamily;
  const fg = config.headingsGroup.color;
  const bg = config.backgroundColor;

  return (
    <button
      type="button"
      onClick={() => onSelect(stack)}
      className="group relative flex flex-col overflow-hidden rounded-xl border text-left shadow-sm transition-all hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {/* Preview area */}
      <div
        className="flex flex-col gap-3 px-6 pb-5 pt-6"
        style={{ backgroundColor: bg, color: fg }}
      >
        <p
          className="text-2xl leading-tight"
          style={{
            fontFamily: `"${headingFont}", sans-serif`,
            fontWeight: config.headingsGroup.fontWeight,
          }}
        >
          {headingFont}
        </p>
        <p
          className="text-sm leading-relaxed opacity-80"
          style={{
            fontFamily: `"${bodyFont}", sans-serif`,
            fontWeight: config.bodyGroup.fontWeight,
          }}
        >
          The quick brown fox jumps over the lazy dog. Pack my box with five
          dozen liquor jugs.
        </p>
      </div>

      {/* Info bar */}
      <div className="flex items-center justify-between border-t bg-card px-4 py-2.5">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-medium text-foreground truncate max-w-[180px]">
            {stack.name}
          </span>
          <span className="text-[10px] text-muted-foreground">
            {headingFont} + {bodyFont}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={(e) => {
              e.stopPropagation();
              onLike(stack);
            }}
          >
            <Heart
              className={`h-3.5 w-3.5 ${
                stack.isLiked
                  ? "fill-red-500 text-red-500"
                  : "text-muted-foreground"
              }`}
            />
          </Button>
          <span className="text-[10px] text-muted-foreground tabular-nums min-w-[1ch]">
            {stack.likesCount}
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={(e) => {
              e.stopPropagation();
              onSave(stack);
            }}
          >
            <Bookmark
              className={`h-3.5 w-3.5 ${
                stack.isSaved
                  ? "fill-blue-500 text-blue-500"
                  : "text-muted-foreground"
              }`}
            />
          </Button>
        </div>
      </div>

      {/* Preset badge */}
      {stack.isPreset && (
        <div className="absolute right-2 top-2 rounded-full bg-black/20 px-2 py-0.5 text-[9px] font-medium uppercase tracking-wider" style={{ color: fg }}>
          Preset
        </div>
      )}
    </button>
  );
}
```

**Step 2: Verify types**

Run: `pnpm tsc --noEmit`

**Step 3: Commit**

```bash
git add src/components/stacks/stack-card.tsx
git commit -m "feat: add StackCard component with font preview"
```

---

### Task 12: Gallery Page — Main Page Component

**Files:**
- Create: `src/app/stacks/page.tsx`
- Create: `src/app/stacks/layout.tsx`

**Step 1: Create gallery layout**

Create `src/app/stacks/layout.tsx`:

```typescript
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stacks — TypeStack",
  description: "Browse and discover typography presets and font pairings.",
};

export default function StacksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
```

**Step 2: Create gallery page**

Create `src/app/stacks/page.tsx`:

```typescript
"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { StackCard } from "@/components/stacks/stack-card";
import { Button } from "@/components/ui/button";
import {
  fetchStacks,
  toggleLike,
  toggleSave,
  type Stack,
} from "@/lib/stacks-api";
import { useTypographyStore } from "@/store/typography-store";
import { useUIStore } from "@/store/ui-store";
import { useFontLoader } from "@/components/stacks/use-gallery-fonts";
import { ArrowLeft, Plus } from "lucide-react";

type Filter = "all" | "presets" | "community" | "mine" | "saved";

const FILTER_LABELS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "presets", label: "Presets" },
  { value: "community", label: "Community" },
  { value: "mine", label: "My Stacks" },
  { value: "saved", label: "Saved" },
];

export default function StacksPage() {
  const [stacks, setStacks] = useState<Stack[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const loadConfig = useTypographyStore((s) => s.loadConfig);
  const setCurrentStack = useUIStore((s) => s.setCurrentStack);
  const resetConfig = useTypographyStore((s) => s.resetConfig);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchStacks(filter);
      setStacks(data);
    } catch (err) {
      console.error("Failed to load stacks", err);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    load();
  }, [load]);

  // Load Google Fonts for all visible stacks
  useFontLoader(stacks);

  const handleSelect = (stack: Stack) => {
    loadConfig(stack.config);
    setCurrentStack(stack.id, stack.name);
    router.push("/");
  };

  const handleLike = async (stack: Stack) => {
    const { liked } = await toggleLike(stack.id);
    setStacks((prev) =>
      prev.map((s) =>
        s.id === stack.id
          ? {
              ...s,
              isLiked: liked,
              likesCount: s.likesCount + (liked ? 1 : -1),
            }
          : s
      )
    );
  };

  const handleSave = async (stack: Stack) => {
    const { saved } = await toggleSave(stack.id);
    setStacks((prev) =>
      prev.map((s) =>
        s.id === stack.id
          ? {
              ...s,
              isSaved: saved,
              savesCount: s.savesCount + (saved ? 1 : -1),
            }
          : s
      )
    );
  };

  const handleNew = () => {
    resetConfig();
    setCurrentStack(null, null);
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/")}
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Editor
            </Button>
            <div>
              <h1 className="text-lg font-semibold">Stacks</h1>
              <p className="text-xs text-muted-foreground">
                Browse typography presets and community stacks
              </p>
            </div>
          </div>
          <Button size="sm" onClick={handleNew}>
            <Plus className="mr-1 h-4 w-4" />
            New Stack
          </Button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-6">
        {/* Filters */}
        <div className="mb-6 flex gap-1">
          {FILTER_LABELS.map(({ value, label }) => (
            <Button
              key={value}
              variant={filter === value ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilter(value)}
              className="text-xs"
            >
              {label}
            </Button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="py-20 text-center text-sm text-muted-foreground">
            Loading stacks...
          </div>
        ) : stacks.length === 0 ? (
          <div className="py-20 text-center text-sm text-muted-foreground">
            No stacks found.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {stacks.map((stack) => (
              <StackCard
                key={stack.id}
                stack={stack}
                onSelect={handleSelect}
                onLike={handleLike}
                onSave={handleSave}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

**Step 3: Create the font loader hook for the gallery**

Create `src/components/stacks/use-gallery-fonts.ts`:

```typescript
import { useEffect, useRef } from "react";
import type { Stack } from "@/lib/stacks-api";

export function useFontLoader(stacks: Stack[]) {
  const loadedRef = useRef(new Set<string>());

  useEffect(() => {
    const families = new Set<string>();
    for (const s of stacks) {
      families.add(s.config.headingsGroup.fontFamily);
      families.add(s.config.bodyGroup.fontFamily);
    }

    for (const family of families) {
      if (loadedRef.current.has(family)) continue;
      loadedRef.current.add(family);

      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@400;700&display=swap`;
      document.head.appendChild(link);
    }
  }, [stacks]);
}
```

**Step 4: Verify types**

Run: `pnpm tsc --noEmit`

**Step 5: Commit**

```bash
git add src/app/stacks/ src/components/stacks/
git commit -m "feat: add stacks gallery page with filter tabs"
```

---

### Task 13: Sidebar Stack Picker

**Files:**
- Create: `src/components/stacks/stack-picker.tsx`
- Modify: `src/app/page.tsx` (add StackPicker to sidebar)

**Step 1: Create stack picker component**

Create `src/components/stacks/stack-picker.tsx`:

```typescript
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import {
  fetchStacks,
  createStack,
  type Stack,
} from "@/lib/stacks-api";
import { useTypographyStore } from "@/store/typography-store";
import { useUIStore } from "@/store/ui-store";
import {
  ChevronDown,
  Library,
  Plus,
  Save,
} from "lucide-react";
import { toast } from "sonner";

export function StackPicker() {
  const [open, setOpen] = useState(false);
  const [stacks, setStacks] = useState<Stack[]>([]);
  const [saving, setSaving] = useState(false);
  const [newName, setNewName] = useState("");
  const [showNameInput, setShowNameInput] = useState(false);

  const router = useRouter();
  const currentStackId = useUIStore((s) => s.currentStackId);
  const currentStackName = useUIStore((s) => s.currentStackName);
  const isDirty = useUIStore((s) => s.isDirty);
  const setCurrentStack = useUIStore((s) => s.setCurrentStack);
  const loadConfig = useTypographyStore((s) => s.loadConfig);
  const resetConfig = useTypographyStore((s) => s.resetConfig);

  // Get current config for saving
  const getConfig = useTypographyStore((s) => () => ({
    baseFontSize: s.baseFontSize,
    scaleRatioPreset: s.scaleRatioPreset,
    scaleRatio: s.scaleRatio,
    headingsGroup: s.headingsGroup,
    bodyGroup: s.bodyGroup,
    overrides: s.overrides,
    mobile: s.mobile,
    backgroundColor: s.backgroundColor,
    sampleText: s.sampleText,
  }));

  const load = useCallback(async () => {
    try {
      const data = await fetchStacks("saved");
      setStacks(data.slice(0, 8));
    } catch {
      // Silently fail — picker is supplementary
    }
  }, []);

  useEffect(() => {
    if (open) load();
  }, [open, load]);

  const handleSaveAs = async () => {
    if (!newName.trim()) return;
    setSaving(true);
    try {
      const config = getConfig();
      const stack = await createStack(newName.trim(), config);
      setCurrentStack(stack.id, stack.name);
      setShowNameInput(false);
      setNewName("");
      setOpen(false);
      toast.success("Stack saved");
    } catch {
      toast.error("Failed to save stack");
    } finally {
      setSaving(false);
    }
  };

  const handleSelect = (stack: Stack) => {
    loadConfig(stack.config);
    setCurrentStack(stack.id, stack.name);
    setOpen(false);
  };

  const handleNew = () => {
    resetConfig();
    setCurrentStack(null, null);
    setOpen(false);
  };

  const displayName = currentStackName || "Unsaved Stack";

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        Stack
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between text-sm font-normal"
          >
            <span className="truncate">
              {displayName}
              {isDirty && " *"}
            </span>
            <ChevronDown className="ml-2 h-3.5 w-3.5 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[320px] p-2" align="start">
          <div className="flex flex-col gap-1">
            {/* Save As */}
            {showNameInput ? (
              <div className="flex gap-1 p-1">
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Stack name..."
                  className="h-8 text-xs"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveAs();
                    if (e.key === "Escape") setShowNameInput(false);
                  }}
                />
                <Button
                  size="sm"
                  className="h-8 text-xs"
                  disabled={saving || !newName.trim()}
                  onClick={handleSaveAs}
                >
                  Save
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="justify-start text-xs"
                onClick={() => setShowNameInput(true)}
              >
                <Save className="mr-2 h-3.5 w-3.5" />
                Save As...
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              className="justify-start text-xs"
              onClick={handleNew}
            >
              <Plus className="mr-2 h-3.5 w-3.5" />
              New Stack
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="justify-start text-xs"
              onClick={() => {
                setOpen(false);
                router.push("/stacks");
              }}
            >
              <Library className="mr-2 h-3.5 w-3.5" />
              Browse All Stacks
            </Button>

            {/* Recent saved stacks */}
            {stacks.length > 0 && (
              <>
                <div className="my-1 border-t" />
                <span className="px-2 py-1 text-[10px] font-medium text-muted-foreground uppercase">
                  Saved
                </span>
                {stacks.map((s) => (
                  <Button
                    key={s.id}
                    variant="ghost"
                    size="sm"
                    className={`justify-start text-xs ${
                      s.id === currentStackId ? "bg-accent" : ""
                    }`}
                    onClick={() => handleSelect(s)}
                  >
                    <span className="truncate">{s.name}</span>
                  </Button>
                ))}
              </>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
```

**Step 2: Add StackPicker to sidebar in page.tsx**

In `src/app/page.tsx`, add import and render `<StackPicker />` as the first item inside `<Sidebar>`, before the first `<BaseSettings>`:

```typescript
import { StackPicker } from "@/components/stacks/stack-picker";
```

Add before the first `<BaseSettings>`:
```tsx
<StackPicker />
<Separator />
```

**Step 3: Mark config dirty on any typography change**

In `src/app/page.tsx`, add an effect that sets `isDirty` when the typography store changes. This should use `useTypographyStore.subscribe`:

```typescript
// Add inside the Home component:
const setDirty = useUIStore((s) => s.setDirty);

useEffect(() => {
  const unsub = useTypographyStore.subscribe(() => {
    setDirty(true);
  });
  return unsub;
}, [setDirty]);
```

**Step 4: Verify types**

Run: `pnpm tsc --noEmit`

**Step 5: Commit**

```bash
git add src/components/stacks/stack-picker.tsx src/app/page.tsx
git commit -m "feat: add sidebar stack picker with save/browse"
```

---

### Task 14: Visual Polish & Final Integration

**Files:**
- Modify: `src/components/stacks/stack-card.tsx` (ensure font loading links are in head)
- Modify: `src/app/stacks/page.tsx` (polish)

**Step 1: Full type check**

Run: `pnpm tsc --noEmit`
Expected: No errors

**Step 2: Run the app and seed the database**

```bash
pnpm db:seed
```

Then restart the dev server and verify:
1. Visit `/stacks` — should show 39 preset cards with actual fonts rendered
2. Click a card — loads config into editor, navigates to `/`
3. Like/save buttons work (toggle on click)
4. Filter tabs work (presets, community, my stacks, saved)
5. Sidebar picker shows "Unsaved Stack", can "Save As...", can "Browse All"
6. "New Stack" resets to Inter defaults

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: stacks feature complete — gallery, picker, 39 presets"
```

---

## Summary of Files

### New Files
- `src/db/schema.ts` — Database schema
- `src/db/index.ts` — Database connection + auto-migrate
- `src/db/migrate.ts` — Standalone migration runner
- `src/db/seed.ts` — Seed runner
- `src/db/seed-presets.ts` — 39 font pairing preset data
- `drizzle.config.ts` — Drizzle Kit config
- `src/lib/device-id.ts` — Anonymous device UUID
- `src/lib/stacks-api.ts` — Client API helper
- `src/app/api/stacks/route.ts` — List + Create API
- `src/app/api/stacks/[id]/route.ts` — Get + Update + Delete API
- `src/app/api/stacks/[id]/like/route.ts` — Like toggle API
- `src/app/api/stacks/[id]/save/route.ts` — Save toggle API
- `src/app/stacks/page.tsx` — Gallery page
- `src/app/stacks/layout.tsx` — Gallery layout
- `src/components/stacks/stack-card.tsx` — Stack card component
- `src/components/stacks/stack-picker.tsx` — Sidebar stack picker
- `src/components/stacks/use-gallery-fonts.ts` — Font loader hook for gallery

### Modified Files
- `package.json` — New deps + db scripts
- `.gitignore` — Add `data/`
- `src/store/ui-store.ts` — Add stack tracking state
- `src/app/page.tsx` — Add StackPicker to sidebar + dirty tracking
