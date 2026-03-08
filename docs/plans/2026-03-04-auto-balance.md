# Auto-Balance Typography Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add an auto-balance toggle that optimizes line-height, letter-spacing, word-spacing, and font-weight for every element based on real font metrics parsed from Google Fonts .woff2 files.

**Architecture:** Hybrid font metrics engine (bundled lookup table + runtime opentype.js parsing + category fallback). Formula-based balance computation applied as element overrides. Toggle button in header toolbar with reactive hook that recomputes on font/scale changes.

**Tech Stack:** opentype.js (font parsing), Zustand (state), React hooks (reactivity)

---

### Task 1: Install opentype.js

**Files:**
- Modify: `package.json`

**Step 1: Install dependency**

Run: `pnpm add opentype.js`

**Step 2: Install types**

Run: `pnpm add -D @types/opentype.js`

**Step 3: Verify build**

Run: `pnpm build`
Expected: Clean build, no errors

**Step 4: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: add opentype.js for font metrics parsing"
```

---

### Task 2: Font Metrics Types and Category Fallbacks

**Files:**
- Create: `src/lib/font-metrics.ts`

**Step 1: Create the font metrics module with types, fallbacks, and cache**

```typescript
import type { Font } from "opentype.js";

export interface FontMetrics {
  unitsPerEm: number;
  xHeight: number;     // normalized 0-1 (xHeight / unitsPerEm)
  capHeight: number;    // normalized 0-1
  ascender: number;     // normalized 0-1
  descender: number;    // normalized 0-1 (negative value)
}

// Fallback metrics by Google Fonts category
const CATEGORY_FALLBACKS: Record<string, FontMetrics> = {
  "sans-serif": { unitsPerEm: 1000, xHeight: 0.52, capHeight: 0.72, ascender: 0.93, descender: -0.24 },
  serif:        { unitsPerEm: 1000, xHeight: 0.46, capHeight: 0.68, ascender: 0.90, descender: -0.22 },
  display:      { unitsPerEm: 1000, xHeight: 0.50, capHeight: 0.70, ascender: 0.92, descender: -0.23 },
  monospace:    { unitsPerEm: 1000, xHeight: 0.54, capHeight: 0.73, ascender: 0.93, descender: -0.25 },
  handwriting:  { unitsPerEm: 1000, xHeight: 0.44, capHeight: 0.66, ascender: 0.88, descender: -0.26 },
};

const DEFAULT_FALLBACK = CATEGORY_FALLBACKS["sans-serif"];

// Session cache
const metricsCache = new Map<string, FontMetrics>();

export function extractMetricsFromFont(font: Font): FontMetrics {
  const upm = font.unitsPerEm;
  const os2 = font.tables.os2;
  const xH = os2?.sxHeight ?? upm * 0.52;
  const capH = os2?.sCapHeight ?? upm * 0.72;
  const asc = os2?.sTypoAscender ?? font.ascender;
  const desc = os2?.sTypoDescender ?? font.descender;

  return {
    unitsPerEm: upm,
    xHeight: xH / upm,
    capHeight: capH / upm,
    ascender: asc / upm,
    descender: desc / upm,
  };
}

export function getCachedMetrics(fontFamily: string): FontMetrics | undefined {
  return metricsCache.get(fontFamily);
}

export function setCachedMetrics(fontFamily: string, metrics: FontMetrics): void {
  metricsCache.set(fontFamily, metrics);
}

export function getFallbackMetrics(category?: string): FontMetrics {
  return CATEGORY_FALLBACKS[category || "sans-serif"] || DEFAULT_FALLBACK;
}
```

**Step 2: Verify build**

Run: `pnpm build`
Expected: Clean build

**Step 3: Commit**

```bash
git add src/lib/font-metrics.ts
git commit -m "feat: add font metrics types, cache, and category fallbacks"
```

---

### Task 3: Bundled Font Metrics Table

**Files:**
- Create: `scripts/generate-font-metrics.ts`
- Create: `src/data/font-metrics-table.ts`

**Step 1: Create the generation script**

Create `scripts/generate-font-metrics.ts` that:
1. Imports the font list from `src/db/seed-presets.ts` (extract unique heading + body fonts)
2. Adds top popular Google Fonts not already covered
3. For each font: fetches the CSS2 URL, extracts the .woff2 URL from the CSS response, fetches the .woff2 binary, parses with opentype.js, extracts metrics via `extractMetricsFromFont()`
4. Writes the result to `src/data/font-metrics-table.ts` as a typed `Record<string, FontMetrics>`

The script should handle errors gracefully (skip fonts that fail) and log progress.

**Step 2: Run the script to generate the table**

Run: `npx tsx scripts/generate-font-metrics.ts`
Expected: Console output showing each font processed, file written to `src/data/font-metrics-table.ts`

**Step 3: Verify the generated file has ~100 entries**

Open `src/data/font-metrics-table.ts` and verify it exports a `Record<string, FontMetrics>` with entries for all preset fonts (Abril Fatface, Inter, Playfair Display, Lato, etc.)

**Step 4: Verify build**

Run: `pnpm build`
Expected: Clean build

**Step 5: Commit**

```bash
git add scripts/generate-font-metrics.ts src/data/font-metrics-table.ts
git commit -m "feat: add bundled font metrics table for ~100 fonts"
```

---

### Task 4: Font Metrics Resolver (async, with bundled table + runtime parsing)

**Files:**
- Modify: `src/lib/font-metrics.ts`

**Step 1: Add the resolver function**

Add to `src/lib/font-metrics.ts`:

```typescript
import { FONT_METRICS_TABLE } from "@/data/font-metrics-table";
import { parse as parseFont } from "opentype.js";

export async function resolveFontMetrics(
  fontFamily: string,
  category?: string,
): Promise<FontMetrics> {
  // 1. Session cache
  const cached = getCachedMetrics(fontFamily);
  if (cached) return cached;

  // 2. Bundled table
  const bundled = FONT_METRICS_TABLE[fontFamily];
  if (bundled) {
    setCachedMetrics(fontFamily, bundled);
    return bundled;
  }

  // 3. Runtime parse from Google Fonts
  try {
    const metrics = await fetchAndParseFont(fontFamily);
    setCachedMetrics(fontFamily, metrics);
    return metrics;
  } catch {
    // 4. Category fallback
    const fallback = getFallbackMetrics(category);
    setCachedMetrics(fontFamily, fallback);
    return fallback;
  }
}

async function fetchAndParseFont(fontFamily: string): Promise<FontMetrics> {
  // Fetch CSS to get the .woff2 URL
  const cssUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontFamily)}:wght@400&display=swap`;
  const cssRes = await fetch(cssUrl, {
    headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" },
  });
  const cssText = await cssRes.text();

  // Extract first .woff2 URL from CSS
  const woff2Match = cssText.match(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+\.woff2)\)/);
  if (!woff2Match) throw new Error(`No woff2 URL found for ${fontFamily}`);

  // Fetch and parse the font
  const fontRes = await fetch(woff2Match[1]);
  const buffer = await fontRes.arrayBuffer();
  const font = parseFont(buffer);

  return extractMetricsFromFont(font);
}
```

**Step 2: Verify build**

Run: `pnpm build`
Expected: Clean build

**Step 3: Commit**

```bash
git add src/lib/font-metrics.ts
git commit -m "feat: add async font metrics resolver with bundled table and runtime parsing"
```

---

### Task 5: Auto-Balance Computation

**Files:**
- Create: `src/lib/auto-balance.ts`

**Step 1: Create the auto-balance computation module**

```typescript
import type { FontMetrics } from "./font-metrics";

export interface BalancedValues {
  lineHeight: number;
  letterSpacing: number;  // em
  wordSpacing: number;    // em
  suggestedWeight: number;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function computeAutoBalance(
  metrics: FontMetrics,
  fontSize: number,
  baseFontSize: number,
  scaleRatio: number,
  isDarkMode: boolean,
  isUppercase: boolean,
  baseWeight: number,
  isBody: boolean,
): BalancedValues {
  const sizeRatio = fontSize / baseFontSize;

  // --- Line-height ---
  // Inversely proportional to size, adjusted by x-height
  const rawLH = 1 + (0.6 / Math.max(sizeRatio, 0.5));
  const xHeightAdjust = metrics.xHeight * 0.15;
  const lineHeight = isBody
    ? clamp(rawLH + xHeightAdjust, 1.4, 1.8)
    : clamp(rawLH + xHeightAdjust, 1.0, 1.3);

  // --- Letter-spacing ---
  // Negative for large text, loosened for small text
  // Cap-height ratio adjusts: wider caps need more tracking
  const capRatio = metrics.capHeight / 0.7;
  let letterSpacing = -0.02 * Math.log2(Math.max(sizeRatio, 0.25)) * capRatio;

  // Extra tightening for wide scale ratios
  if (scaleRatio > 1.333 && sizeRatio > 2) {
    letterSpacing -= 0.005;
  }

  // Uppercase compensation
  if (isUppercase) {
    letterSpacing += 0.04 * metrics.capHeight;
  }

  letterSpacing = clamp(letterSpacing, -0.05, 0.05);

  // --- Word-spacing ---
  const wordSpacing = clamp(
    -0.01 * Math.max(0, Math.log2(sizeRatio) - 1),
    -0.03,
    0,
  );

  // --- Font-weight optical adjustment ---
  const weightDelta = isDarkMode ? -100 : 0;
  const suggestedWeight = clamp(baseWeight + weightDelta, 100, 900);

  return {
    lineHeight: Math.round(lineHeight * 100) / 100,
    letterSpacing: Math.round(letterSpacing * 1000) / 1000,
    wordSpacing: Math.round(wordSpacing * 1000) / 1000,
    suggestedWeight,
  };
}
```

**Step 2: Verify build**

Run: `pnpm build`
Expected: Clean build

**Step 3: Commit**

```bash
git add src/lib/auto-balance.ts
git commit -m "feat: add auto-balance typography computation formulas"
```

---

### Task 6: Store Integration

**Files:**
- Modify: `src/store/typography-store.ts` (add `autoBalance` state + action)

**Step 1: Add autoBalance to the store interface**

In the `TypographyStore` interface, add:

```typescript
autoBalance: boolean;
setAutoBalance: (enabled: boolean) => void;
```

**Step 2: Add to the store implementation**

In the `create` call, add to initial state:

```typescript
autoBalance: false,
```

And add the action:

```typescript
setAutoBalance: (enabled) => set({ autoBalance: enabled }),
```

Note: `autoBalance` should NOT be persisted (it's a session toggle). Either exclude it from the persist `partialize` option, or since the store currently persists everything, add a `partialize` option that excludes it:

In the `persist` config object, add:

```typescript
{
  name: "typestack-typography",
  partialize: (state) => {
    const { autoBalance, ...rest } = state;
    return rest;
  },
}
```

Also exclude `autoBalance` from the temporal middleware tracking (it shouldn't be undo-able). Add an `equality` option to temporal that ignores it, or handle via the `partialize` option on temporal:

```typescript
temporal(
  persist(...),
  {
    limit: 50,
    equality: (pastState, currentState) => {
      const { autoBalance: _a, ...past } = pastState as any;
      const { autoBalance: _b, ...curr } = currentState as any;
      return JSON.stringify(past) === JSON.stringify(curr);
    },
  },
)
```

**Step 3: Verify build**

Run: `pnpm build`
Expected: Clean build

**Step 4: Commit**

```bash
git add src/store/typography-store.ts
git commit -m "feat: add autoBalance toggle to typography store"
```

---

### Task 7: Auto-Balance React Hook

**Files:**
- Create: `src/hooks/use-auto-balance.ts`

**Step 1: Create the hook**

```typescript
"use client";

import { useEffect, useRef } from "react";
import { useTypographyStore } from "@/store/typography-store";
import { resolveFontMetrics } from "@/lib/font-metrics";
import { computeAutoBalance } from "@/lib/auto-balance";
import { hexToOklch } from "@/lib/color-utils";
import { ALL_ELEMENTS, HEADING_ELEMENTS, DISPLAY_ELEMENTS, BODY_ELEMENTS, SCALE_POSITIONS } from "@/types/typography";
import type { TypographyElement } from "@/types/typography";

function isHeadingLike(el: TypographyElement): boolean {
  return HEADING_ELEMENTS.includes(el) || DISPLAY_ELEMENTS.includes(el);
}

export function useAutoBalance() {
  const autoBalance = useTypographyStore((s) => s.autoBalance);
  const headingFont = useTypographyStore((s) => s.headingsGroup.fontFamily);
  const bodyFont = useTypographyStore((s) => s.bodyGroup.fontFamily);
  const headingWeight = useTypographyStore((s) => s.headingsGroup.fontWeight);
  const bodyWeight = useTypographyStore((s) => s.bodyGroup.fontWeight);
  const baseFontSize = useTypographyStore((s) => s.baseFontSize);
  const scaleRatio = useTypographyStore((s) => s.scaleRatio);
  const backgroundColor = useTypographyStore((s) => s.backgroundColor);
  const overrides = useTypographyStore((s) => s.overrides);
  const setElementOverride = useTypographyStore((s) => s.setElementOverride);
  const clearElementOverride = useTypographyStore((s) => s.clearElementOverride);

  // Track which elements we auto-balanced (vs manually overridden)
  const autoBalancedRef = useRef<Set<TypographyElement>>(new Set());

  useEffect(() => {
    if (!autoBalance) {
      // Clear only elements we auto-balanced (not manual overrides)
      for (const el of autoBalancedRef.current) {
        clearElementOverride(el);
      }
      autoBalancedRef.current.clear();
      return;
    }

    let cancelled = false;

    async function apply() {
      const [headingMetrics, bodyMetrics] = await Promise.all([
        resolveFontMetrics(headingFont),
        resolveFontMetrics(bodyFont),
      ]);

      if (cancelled) return;

      const isDarkMode = hexToOklch(backgroundColor).l <= 0.4;
      const newAutoBalanced = new Set<TypographyElement>();

      for (const element of ALL_ELEMENTS) {
        // Skip elements with manual overrides (user set before auto-balance)
        const existing = overrides[element];
        if (existing?.isOverridden && !autoBalancedRef.current.has(element)) {
          continue;
        }

        const isBody = BODY_ELEMENTS.includes(element);
        const metrics = isHeadingLike(element) ? headingMetrics : bodyMetrics;
        const baseWeight = isHeadingLike(element) ? headingWeight : bodyWeight;
        const fontSize = baseFontSize * Math.pow(scaleRatio, SCALE_POSITIONS[element]);
        const isUppercase = existing?.textTransform === "uppercase";

        const balanced = computeAutoBalance(
          metrics,
          fontSize,
          baseFontSize,
          scaleRatio,
          isDarkMode,
          isUppercase,
          baseWeight,
          isBody,
        );

        setElementOverride(element, {
          lineHeight: balanced.lineHeight,
          letterSpacing: balanced.letterSpacing,
          wordSpacing: balanced.wordSpacing,
          fontWeight: balanced.suggestedWeight,
        });

        newAutoBalanced.add(element);
      }

      autoBalancedRef.current = newAutoBalanced;
    }

    apply();

    return () => { cancelled = true; };
  }, [
    autoBalance,
    headingFont,
    bodyFont,
    headingWeight,
    bodyWeight,
    baseFontSize,
    scaleRatio,
    backgroundColor,
    // Note: do NOT include overrides or setElementOverride to avoid infinite loops
  ]);
}
```

**Step 2: Verify build**

Run: `pnpm build`
Expected: Clean build

**Step 3: Commit**

```bash
git add src/hooks/use-auto-balance.ts
git commit -m "feat: add useAutoBalance hook for reactive auto-balance"
```

---

### Task 8: Wire Hook into App

**Files:**
- Modify: `src/app/page.tsx`

**Step 1: Add the hook call**

Import and call `useAutoBalance()` near the top of the `Home` component, after `useActiveFontLoader()`:

```typescript
import { useAutoBalance } from "@/hooks/use-auto-balance";

// Inside Home():
useAutoBalance();
```

**Step 2: Verify build**

Run: `pnpm build`
Expected: Clean build

**Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: wire useAutoBalance hook into main page"
```

---

### Task 9: Header Toggle Button

**Files:**
- Modify: `src/components/layout/header.tsx`

**Step 1: Add Wand2 import**

Add `Wand2` to the lucide-react import.

**Step 2: Add store binding**

Inside the `Header` component, add:

```typescript
const autoBalance = useTypographyStore((s) => s.autoBalance);
const setAutoBalance = useTypographyStore((s) => s.setAutoBalance);
```

**Step 3: Add toggle button**

Place between the swap/random group separator and the undo/redo separator. After the `<Tooltip>` for "Swap foreground / background" and its following `<Separator>`, add:

```tsx
<Tooltip>
  <TooltipTrigger asChild>
    <Button
      type="button"
      variant={autoBalance ? "secondary" : "ghost"}
      size="sm"
      onClick={() => setAutoBalance(!autoBalance)}
      className="h-8 w-8 p-0"
    >
      <Wand2 className="size-3.5" />
    </Button>
  </TooltipTrigger>
  <TooltipContent>Auto Balance</TooltipContent>
</Tooltip>
```

**Step 4: Verify build**

Run: `pnpm build`
Expected: Clean build

**Step 5: Commit**

```bash
git add src/components/layout/header.tsx
git commit -m "feat: add Auto Balance toggle button to header toolbar"
```

---

### Task 10: Manual Testing & Polish

**Step 1: Run dev server**

Run: `pnpm dev`

**Step 2: Test the feature**

1. Open http://localhost:3000
2. Click the Wand2 "Auto Balance" button — verify it highlights
3. Observe the type scale view: line-heights and letter-spacings should update
4. Switch to website/dashboard/blog templates — verify text looks optically balanced
5. Change heading font — verify auto-balance recomputes
6. Change scale ratio — verify auto-balance recomputes
7. Toggle auto-balance OFF — verify values revert
8. Toggle ON, manually override one element's line-height — verify it's preserved on next recompute
9. Test with a dark background — verify weight adjustment
10. Load a preset stack from Browse Stacks — verify auto-balance works with it

**Step 3: Fix any issues found during testing**

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: auto-balance typography complete"
```
