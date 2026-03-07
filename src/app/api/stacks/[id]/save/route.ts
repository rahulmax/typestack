import { db, dbReady } from "@/db";
import { stacks, stackSaves } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

type Params = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, { params }: Params) {
  await dbReady;
  const { id } = await params;
  const deviceId = request.headers.get("x-device-id");
  if (!deviceId) {
    return NextResponse.json({ error: "Missing device ID" }, { status: 400 });
  }

  const existing = await db
    .select()
    .from(stackSaves)
    .where(and(eq(stackSaves.stackId, id), eq(stackSaves.deviceId, deviceId)))
    .get();

  if (existing) {
    await db.delete(stackSaves)
      .where(
        and(eq(stackSaves.stackId, id), eq(stackSaves.deviceId, deviceId))
      );
    await db.update(stacks)
      .set({ savesCount: sql`${stacks.savesCount} - 1` })
      .where(eq(stacks.id, id));
    return NextResponse.json({ saved: false });
  } else {
    await db.insert(stackSaves).values({ stackId: id, deviceId });
    await db.update(stacks)
      .set({ savesCount: sql`${stacks.savesCount} + 1` })
      .where(eq(stacks.id, id));
    return NextResponse.json({ saved: true });
  }
}
