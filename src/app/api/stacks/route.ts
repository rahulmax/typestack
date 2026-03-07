import { db, dbReady } from "@/db";
import { stacks, stackLikes, stackSaves } from "@/db/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  await dbReady;
  const deviceId = request.headers.get("x-device-id") || "";
  const filter = request.nextUrl.searchParams.get("filter") || "all";

  let rows;

  if (filter === "presets") {
    rows = await db
      .select()
      .from(stacks)
      .where(eq(stacks.isPreset, true))
      .orderBy(desc(stacks.createdAt));
  } else if (filter === "community") {
    rows = await db
      .select()
      .from(stacks)
      .where(and(eq(stacks.isPublished, true), eq(stacks.isPreset, false)))
      .orderBy(desc(stacks.likesCount));
  } else if (filter === "mine") {
    rows = await db
      .select()
      .from(stacks)
      .where(eq(stacks.deviceId, deviceId))
      .orderBy(desc(stacks.updatedAt));
  } else if (filter === "saved") {
    const joined = await db
      .select({ stack: stacks })
      .from(stackSaves)
      .innerJoin(stacks, eq(stackSaves.stackId, stacks.id))
      .where(eq(stackSaves.deviceId, deviceId));
    rows = joined.map((r) => r.stack);
  } else {
    rows = await db
      .select()
      .from(stacks)
      .where(sql`${stacks.isPreset} = 1 OR ${stacks.isPublished} = 1`)
      .orderBy(desc(stacks.isPreset), desc(stacks.likesCount));
  }

  const likedRows = await db
    .select({ stackId: stackLikes.stackId })
    .from(stackLikes)
    .where(eq(stackLikes.deviceId, deviceId));
  const likedSet = new Set(likedRows.map((r) => r.stackId));

  const savedRows = await db
    .select({ stackId: stackSaves.stackId })
    .from(stackSaves)
    .where(eq(stackSaves.deviceId, deviceId));
  const savedSet = new Set(savedRows.map((r) => r.stackId));

  const result = rows.map((s) => ({
    ...s,
    config: JSON.parse(s.config),
    isLiked: likedSet.has(s.id),
    isSaved: savedSet.has(s.id),
  }));

  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  await dbReady;
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

  await db.insert(stacks).values({
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
  });

  const created = await db.select().from(stacks).where(eq(stacks.id, id)).get();

  return NextResponse.json(
    { ...created!, config: JSON.parse(created!.config) },
    { status: 201 }
  );
}
