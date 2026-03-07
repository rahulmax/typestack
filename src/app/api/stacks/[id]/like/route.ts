import { db, dbReady } from "@/db";
import { stacks, stackLikes } from "@/db/schema";
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
    .from(stackLikes)
    .where(and(eq(stackLikes.stackId, id), eq(stackLikes.deviceId, deviceId)))
    .get();

  if (existing) {
    await db.delete(stackLikes)
      .where(
        and(eq(stackLikes.stackId, id), eq(stackLikes.deviceId, deviceId))
      );
    await db.update(stacks)
      .set({ likesCount: sql`${stacks.likesCount} - 1` })
      .where(eq(stacks.id, id));
    return NextResponse.json({ liked: false });
  } else {
    await db.insert(stackLikes).values({ stackId: id, deviceId });
    await db.update(stacks)
      .set({ likesCount: sql`${stacks.likesCount} + 1` })
      .where(eq(stacks.id, id));
    return NextResponse.json({ liked: true });
  }
}
