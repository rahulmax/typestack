# Pencil (.pen) Export

## Summary

Add a "Pencil" tab to the export dialog that generates a `.pen` file containing the current typography stack as Pencil variables. Users download the file and import it into their Pencil documents, where the variables become available as `$font.heading`, `$fontSize.h1`, etc.

## Scope

- Desktop type stack only (no mobile/responsive values)
- Typography tokens only (no colors, no theming)
- Display elements filtered out (matches existing export behavior)

## Variable Schema

The `.pen` file is a JSON document with a top-level `variables` object. Each variable has a `type` and `value`.

### Font families (string)
- `font.heading` — heading font family name
- `font.body` — body font family name

### Per-element tokens (h1-h6, p, eyebrow, small)
- `fontSize.<element>` — number, rem value (e.g. 2.986)
- `fontWeight.<element>` — number (e.g. 700)
- `lineHeight.<element>` — number, unitless ratio (e.g. 1.2)
- `letterSpacing.<element>` — number, em value (e.g. 0.02)
- `wordSpacing.<element>` — number, em value (e.g. 0)
- `textTransform.<element>` — string, "none" or "uppercase"

### Example output

```json
{
  "variables": {
    "font.heading": { "type": "string", "value": "Playfair Display" },
    "font.body": { "type": "string", "value": "Inter" },
    "fontSize.h1": { "type": "number", "value": 2.986 },
    "fontSize.h2": { "type": "number", "value": 2.488 },
    "fontSize.p": { "type": "number", "value": 1 },
    "fontWeight.h1": { "type": "number", "value": 700 },
    "lineHeight.h1": { "type": "number", "value": 1.2 },
    "letterSpacing.h1": { "type": "number", "value": 0 },
    "wordSpacing.h1": { "type": "number", "value": 0 },
    "textTransform.eyebrow": { "type": "string", "value": "uppercase" }
  }
}
```

## Files

### New files
- `src/lib/pen-export.ts` — `generatePenFile(config: TypographyConfig): string`
- `src/components/export/pen-export.tsx` — `PenExport` component

### Modified files
- `src/components/export/export-dialog.tsx` — add "Pencil" tab

## Generator: `generatePenFile()`

Location: `src/lib/pen-export.ts`

1. Compute desktop scale via `computeScale(config)`
2. Filter out display elements
3. Build variables object:
   - Two string variables for font families
   - Six variables per element (fontSize, fontWeight, lineHeight, letterSpacing, wordSpacing as number; textTransform as string)
4. Return `JSON.stringify({ variables }, null, 2)`

## Component: `PenExport`

Location: `src/components/export/pen-export.tsx`

Follows the `FigmaJSONExport` pattern exactly:
- Reads store via `useTypographyStore()`
- Memoizes `generatePenFile()` call
- Renders JSON preview in `<pre>` block
- Copy button (copies JSON to clipboard)
- Download button (downloads as `typestax-typography.pen`)

## Export Dialog Change

Add `{ value: "pen", label: "Pencil" }` to the `TABS` array and render `<PenExport />` when the tab is active. Update `DialogDescription` to mention Pencil.

## Testing

Unit test for `generatePenFile()` in vitest covering:
- Correct variable names and types
- Display element filtering
- Font family string variables present
- All per-element token categories present
