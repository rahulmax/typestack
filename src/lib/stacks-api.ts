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
