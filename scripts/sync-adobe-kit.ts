/**
 * sync-adobe-kit.ts
 *
 * Makes the Adobe Fonts web project match scripts/adobe-kit.ts: adds missing
 * families, sets every listed family to the configured styles, and publishes.
 * Families in the kit but not in the list are left alone unless --prune.
 *
 * Needs an API token from https://fonts.adobe.com/account/tokens in
 * .env.local as ADOBE_FONTS_API_TOKEN. It is a secret with write access to
 * the whole account, so it must never get a NEXT_PUBLIC_ prefix.
 *
 * Usage:  pnpm kit:sync [--dry-run] [--prune]
 */

import { ADOBE_KIT, type KitFamilyEntry } from "./adobe-kit";
import { PRESETS } from "../src/db/seed-presets";
import { isKitSlug } from "../src/lib/adobe-fonts";

const API = "https://typekit.com/api/v1/json";

const args = new Set(process.argv.slice(2));
const dryRun = args.has("--dry-run");
const prune = args.has("--prune");

const token = process.env.ADOBE_FONTS_API_TOKEN;
const kitId = process.env.NEXT_PUBLIC_ADOBE_FONTS_KIT_ID;

if (!token || !kitId) {
  console.error(
    "Set ADOBE_FONTS_API_TOKEN and NEXT_PUBLIC_ADOBE_FONTS_KIT_ID in .env.local.\n" +
      "Get a token at https://fonts.adobe.com/account/tokens.",
  );
  process.exit(1);
}

// ---------------------------------------------------------------------------
// API
// ---------------------------------------------------------------------------

interface ApiFamily {
  id: string;
  name: string;
  slug: string;
  variations: { fvd: string }[];
}

interface ApiKitFamily {
  id: string;
  name: string;
  slug: string;
  variations: (string | { fvd: string })[];
  subset: string;
}

class NotFoundError extends Error {}

async function api<T>(path: string, body?: URLSearchParams): Promise<T> {
  const res = await fetch(`${API}/${path}`, {
    method: body ? "POST" : "GET",
    headers: { "X-Typekit-Token": token! },
    body,
  });
  const json = await res.json().catch(() => ({}));
  if (res.status === 404) throw new NotFoundError(`${body ? "POST" : "GET"} ${path} failed: 404 not found`);
  if (!res.ok) {
    const reason = json.errors?.join("; ") ?? res.statusText;
    throw new Error(`${body ? "POST" : "GET"} ${path} failed: ${res.status} ${reason}`);
  }
  return json as T;
}

async function getKitFamilies(): Promise<ApiKitFamily[]> {
  const { kit } = await api<{ kit: { families: ApiKitFamily[] } }>(`kits/${kitId}`);
  return kit.families;
}

/** The kit endpoint has returned variations as bare fvds; tolerate objects too. */
function kitVariations(family: ApiKitFamily): string[] {
  return family.variations.map((v) => (typeof v === "string" ? v : v.fvd));
}

// ---------------------------------------------------------------------------
// Planning
// ---------------------------------------------------------------------------

/** "Sofia Pro" and "sofia-pro" both name the family whose slug is sofia-pro. */
function toSlug(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function weightOf(fvd: string): number {
  return Number(fvd.slice(1));
}

/** fvds sort upright before italic, then by weight: n1 … n9, i1 … i9. */
function byFvd(a: string, b: string): number {
  return a[0] === b[0] ? weightOf(a) - weightOf(b) : a[0] === "n" ? -1 : 1;
}

/**
 * Keeps the requested styles the family has. A requested italic it lacks falls
 * back to its nearest italic, so every family still gets one for quotes.
 */
function chooseVariations(requested: string[], available: string[]): string[] {
  const has = new Set(available);
  const chosen = new Set(requested.filter((fvd) => has.has(fvd)));

  for (const fvd of requested) {
    if (fvd[0] !== "i" || has.has(fvd)) continue;
    const nearest = available
      .filter((v) => v[0] === "i" && !chosen.has(v))
      .sort((a, b) => Math.abs(weightOf(a) - weightOf(fvd)) - Math.abs(weightOf(b) - weightOf(fvd)))[0];
    if (nearest) chosen.add(nearest);
  }

  // A family with none of the requested styles would otherwise vanish from the kit.
  if (chosen.size === 0) available.forEach((v) => chosen.add(v));
  return [...chosen].sort(byFvd);
}

interface Planned {
  id: string;
  name: string;
  slug: string;
  variations: string[];
  subset?: string;
  action: "add" | "update" | "keep" | "remove" | "untouched";
  before?: string[];
}

function sameSet(a: string[], b: string[]): boolean {
  return a.length === b.length && a.every((v) => b.includes(v));
}

async function resolve(entry: KitFamilyEntry): Promise<{ family: ApiFamily; variations: string[] } | string> {
  const name = typeof entry === "string" ? entry : entry.family;
  try {
    const { family } = await api<{ family: ApiFamily }>(`families/${toSlug(name)}`);
    const requested = typeof entry === "string" ? ADOBE_KIT.variations : entry.variations;
    return {
      family,
      variations: chooseVariations(
        requested,
        family.variations.map((v) => v.fvd),
      ),
    };
  } catch (err) {
    if (err instanceof NotFoundError) return name;
    throw err;
  }
}

async function plan(): Promise<Planned[]> {
  const [current, resolved] = await Promise.all([getKitFamilies(), Promise.all(ADOBE_KIT.families.map(resolve))]);

  const missing = resolved.filter((r): r is string => typeof r === "string");
  if (missing.length) {
    console.error(`Not found on Adobe Fonts: ${missing.join(", ")}`);
    console.error("Use the slug from the family's fonts.adobe.com URL. The kit was not changed.");
    process.exit(1);
  }

  const currentById = new Map(current.map((f) => [f.id, f]));
  const planned: Planned[] = [];
  const listed = new Set<string>();

  for (const r of resolved) {
    if (typeof r === "string") continue;
    const { family, variations } = r;
    if (listed.has(family.id)) continue;
    listed.add(family.id);

    const existing = currentById.get(family.id);
    const before = existing ? kitVariations(existing) : undefined;
    planned.push({
      id: family.id,
      name: family.name,
      slug: family.slug,
      variations,
      subset: existing?.subset,
      before,
      action: !before ? "add" : sameSet(before, variations) ? "keep" : "update",
    });
  }

  for (const f of current) {
    if (listed.has(f.id)) continue;
    planned.push({
      id: f.id,
      name: f.name,
      slug: f.slug,
      variations: kitVariations(f),
      subset: f.subset,
      action: prune ? "remove" : "untouched",
    });
  }

  return planned;
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------

const MARKS: Record<Planned["action"], string> = {
  add: "+",
  update: "~",
  keep: "=",
  remove: "-",
  untouched: "?",
};

function report(planned: Planned[]): void {
  const width = Math.max(...planned.map((p) => p.name.length));
  for (const p of planned) {
    const styles =
      p.action === "update" ? `${p.before!.sort(byFvd).join(" ")}  ->  ${p.variations.join(" ")}` : p.variations.join(" ");
    console.log(`${MARKS[p.action]} ${p.name.padEnd(width)}  ${styles}`);
  }

  const untouched = planned.filter((p) => p.action === "untouched");
  if (untouched.length) {
    console.log(`\n? = in the kit but not in scripts/adobe-kit.ts. Kept; pass --prune to remove.`);
  }

  // Preset families are kit slugs; any the kit won't carry hides its preset.
  const served = new Set(planned.filter((p) => p.action !== "remove").map((p) => p.slug));
  const presetSlugs = new Set(PRESETS.flatMap((p) => [p.headingFont, p.bodyFont]).filter(isKitSlug));
  const unserved = [...presetSlugs].filter((slug) => !served.has(slug));
  if (unserved.length) {
    console.log(`\nPresets using these families will be hidden: ${unserved.join(", ")}`);
  }
}

// ---------------------------------------------------------------------------
// Apply
// ---------------------------------------------------------------------------

async function apply(planned: Planned[]): Promise<void> {
  // Posting `families` replaces the kit's whole list, so it carries every family
  // that stays, changed or not.
  const body = new URLSearchParams();
  planned
    .filter((p) => p.action !== "remove")
    .forEach((p, i) => {
      body.set(`families[${i}][id]`, p.id);
      body.set(`families[${i}][variations]`, p.variations.join(","));
      if (p.subset) body.set(`families[${i}][subset]`, p.subset);
    });

  await api(`kits/${kitId}`, body);

  // Read the kit back rather than trusting the POST: if Adobe ignored part of
  // the request, publishing would ship a kit nobody asked for.
  const after = new Map((await getKitFamilies()).map((f) => [f.id, kitVariations(f)]));
  const wrong = planned.filter((p) =>
    p.action === "remove" ? after.has(p.id) : !sameSet(after.get(p.id) ?? [], p.variations),
  );
  if (wrong.length) {
    throw new Error(
      `The kit didn't take these changes, so it was not published: ${wrong.map((p) => p.name).join(", ")}`,
    );
  }

  await api(`kits/${kitId}/publish`, new URLSearchParams());
}

async function main(): Promise<void> {
  const planned = await plan();
  report(planned);

  const changed = planned.some((p) => p.action === "add" || p.action === "update" || p.action === "remove");
  if (!changed) {
    console.log("\nThe kit already matches. Nothing to publish.");
    return;
  }
  if (dryRun) {
    console.log("\nDry run: the kit was not changed.");
    return;
  }

  await apply(planned);
  console.log("\nPublished. Adobe's CDN can take a few minutes to serve the new kit.");
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
