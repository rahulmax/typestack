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
