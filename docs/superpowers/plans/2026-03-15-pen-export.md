# Pencil (.pen) Export Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "Pencil" export tab that generates a downloadable `.pen` file containing the current typography stack as Pencil design variables.

**Architecture:** New generator function `generatePenFile()` produces a JSON object with a `variables` map. A new `PenExport` component wires it into the existing export dialog as an additional tab.

**Tech Stack:** TypeScript, React, Vitest, Zustand

**Spec:** `docs/superpowers/specs/2026-03-15-pen-export-design.md`

---

## Chunk 1: Generator + Tests + UI

### Task 1: Generator — write tests

**Files:**
- Create: `src/lib/__tests__/pen-export.test.ts`

- [ ] **Step 1: Write the test file**

```ts
import { describe, test, expect } from 'vitest'
import { generatePenFile } from '../pen-export'
import { DEFAULT_CONFIG } from '@/data/default-config'
import { DISPLAY_ELEMENTS } from '@/types/typography'

describe('generatePenFile', () => {
  const output = generatePenFile(DEFAULT_CONFIG)
  const parsed = JSON.parse(output)
  const vars = parsed.variables

  test('produces valid JSON with variables key', () => {
    expect(() => JSON.parse(output)).not.toThrow()
    expect(parsed).toHaveProperty('variables')
  })

  test('includes font family string variables', () => {
    expect(vars['font.heading']).toEqual({
      type: 'string',
      value: DEFAULT_CONFIG.headingsGroup.fontFamily,
    })
    expect(vars['font.body']).toEqual({
      type: 'string',
      value: DEFAULT_CONFIG.bodyGroup.fontFamily,
    })
  })

  test('includes fontSize number variables for non-display elements', () => {
    expect(vars['fontSize.h1']).toBeDefined()
    expect(vars['fontSize.h1'].type).toBe('number')
    expect(typeof vars['fontSize.h1'].value).toBe('number')
    expect(vars['fontSize.p']).toBeDefined()
    expect(vars['fontSize.small']).toBeDefined()
  })

  test('excludes display elements', () => {
    for (const el of DISPLAY_ELEMENTS) {
      expect(vars[`fontSize.${el}`]).toBeUndefined()
    }
  })

  test('includes all per-element token categories', () => {
    const categories = ['fontSize', 'fontWeight', 'lineHeight', 'letterSpacing', 'wordSpacing']
    for (const cat of categories) {
      expect(vars[`${cat}.h1`]).toBeDefined()
      expect(vars[`${cat}.h1`].type).toBe('number')
    }
  })

  test('includes textTransform as string variables', () => {
    expect(vars['textTransform.h1']).toEqual({ type: 'string', value: 'none' })
    expect(vars['textTransform.eyebrow']).toEqual({ type: 'string', value: 'uppercase' })
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm vitest run src/lib/__tests__/pen-export.test.ts`
Expected: FAIL — `generatePenFile` does not exist yet.

---

### Task 2: Generator — implement

**Files:**
- Create: `src/lib/pen-export.ts`

- [ ] **Step 3: Write the generator**

```ts
import type { TypographyConfig } from '@/types/typography'
import { computeScale } from './scale'
import { DISPLAY_ELEMENTS, type TypographyElement } from '@/types/typography'

interface PenVariable {
  type: 'string' | 'number'
  value: string | number
}

export function generatePenFile(config: TypographyConfig): string {
  const styles = computeScale(config).filter(
    (s) => !DISPLAY_ELEMENTS.includes(s.element as TypographyElement)
  )

  const variables: Record<string, PenVariable> = {
    'font.heading': { type: 'string', value: config.headingsGroup.fontFamily },
    'font.body': { type: 'string', value: config.bodyGroup.fontFamily },
  }

  for (const s of styles) {
    variables[`fontSize.${s.element}`] = { type: 'number', value: parseFloat(s.fontSizeRem.toFixed(4)) }
    variables[`fontWeight.${s.element}`] = { type: 'number', value: s.fontWeight }
    variables[`lineHeight.${s.element}`] = { type: 'number', value: s.lineHeight }
    variables[`letterSpacing.${s.element}`] = { type: 'number', value: s.letterSpacing }
    variables[`wordSpacing.${s.element}`] = { type: 'number', value: s.wordSpacing }
    variables[`textTransform.${s.element}`] = { type: 'string', value: s.textTransform }
  }

  return JSON.stringify({ variables }, null, 2)
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm vitest run src/lib/__tests__/pen-export.test.ts`
Expected: All 6 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/pen-export.ts src/lib/__tests__/pen-export.test.ts
git commit -m "feat: add Pencil (.pen) file generator with tests"
```

---

### Task 3: Export component

**Files:**
- Create: `src/components/export/pen-export.tsx`

- [ ] **Step 6: Write the component**

Follow the `FigmaJSONExport` pattern exactly. Key details:
- Import `generatePenFile` from `@/lib/pen-export`
- Build config object from store (same pattern as `figma-json-export.tsx` lines 11-22)
- Download filename: `typestax-typography.pen`
- Toast messages: "Pencil file copied to clipboard" / "Pencil file downloaded"

```tsx
'use client'

import { useMemo } from 'react'
import { useTypographyStore } from '@/store/typography-store'
import { generatePenFile } from '@/lib/pen-export'
import { toast } from 'sonner'

export function PenExport() {
  const store = useTypographyStore()
  const pen = useMemo(
    () =>
      generatePenFile({
        baseFontSize: store.baseFontSize,
        scaleRatioPreset: store.scaleRatioPreset,
        scaleRatio: store.scaleRatio,
        headingsGroup: store.headingsGroup,
        bodyGroup: store.bodyGroup,
        overrides: store.overrides,
        mobile: store.mobile,
        backgroundColor: store.backgroundColor,
        sampleText: store.sampleText,
      }),
    [store.baseFontSize, store.scaleRatio, store.scaleRatioPreset, store.headingsGroup, store.bodyGroup, store.overrides, store.mobile, store.backgroundColor, store.sampleText]
  )

  const handleCopy = () => {
    navigator.clipboard.writeText(pen)
    toast.success('Pencil file copied to clipboard')
  }

  const handleDownload = () => {
    const blob = new Blob([pen], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'typestax-typography.pen'
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Pencil file downloaded')
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Pencil Variables</span>
        <div className="flex gap-2">
          <button type="button" className="hw-btn" onClick={handleCopy}>
            Copy
          </button>
          <button type="button" className="hw-btn" onClick={handleDownload}>
            Download
          </button>
        </div>
      </div>
      <pre className="max-h-[400px] overflow-auto rounded-md border bg-muted p-4 text-xs">
        <code>{pen}</code>
      </pre>
    </div>
  )
}
```

- [ ] **Step 7: Commit**

```bash
git add src/components/export/pen-export.tsx
git commit -m "feat: add PenExport component"
```

---

### Task 4: Wire into export dialog

**Files:**
- Modify: `src/components/export/export-dialog.tsx`

- [ ] **Step 8: Add import and tab entry**

In `export-dialog.tsx`:

1. Add import: `import { PenExport } from './pen-export'`
2. Add to `TABS` array: `{ value: "pen", label: "Pencil" }` (after `figma-api`)
3. Add render case inside the `<div className="pt-2">` block:
   ```tsx
   {tab === "pen" && <PenExport />}
   ```
4. Update `DialogDescription` to: `"Copy CSS, download Figma tokens, push variables to Figma, or export to Pencil."`

- [ ] **Step 9: Run lint**

Run: `pnpm lint`
Expected: No errors.

- [ ] **Step 10: Commit**

```bash
git add src/components/export/export-dialog.tsx
git commit -m "feat: add Pencil tab to export dialog"
```
