# Stacks Feature Design

## Overview

Add a "Stacks" system to TypeStack: curated and user-created typography presets that store full `TypographyConfig` snapshots. Users can browse, like, save, and publish stacks. Seeded with all 39 font pairings from Figma's resource library.

## Decisions

- **Stack scope**: Full `TypographyConfig` (fonts, weights, line-heights, letter-spacing, scale ratio, overrides, mobile settings, colors)
- **Database**: SQLite + Drizzle ORM (local `.db` file, zero infrastructure)
- **Identity**: Anonymous device UUID in localStorage (migrates to real auth later)
- **UI**: Gallery page (`/stacks`) + compact sidebar picker in the editor

## Data Model

### `stacks` table

| Column | Type | Notes |
|--------|------|-------|
| id | text (UUID) | Primary key |
| name | text | e.g. "Abril Fatface + Lato" |
| config | text (JSON) | Full TypographyConfig serialized |
| device_id | text | Creator's anonymous device UUID |
| is_published | integer (0/1) | Visible in public gallery |
| is_preset | integer (0/1) | Figma-sourced seed data, non-deletable |
| likes_count | integer | Denormalized count, default 0 |
| saves_count | integer | Denormalized count, default 0 |
| created_at | text | ISO timestamp |
| updated_at | text | ISO timestamp |

### `stack_likes` table

| Column | Type |
|--------|------|
| stack_id | text (FK → stacks.id) |
| device_id | text |
| Composite PK on (stack_id, device_id) |

### `stack_saves` table

| Column | Type |
|--------|------|
| stack_id | text (FK → stacks.id) |
| device_id | text |
| Composite PK on (stack_id, device_id) |

## API Routes

```
POST   /api/stacks           — Create a new stack
GET    /api/stacks            — List stacks (query: filter=all|presets|community|mine|saved)
GET    /api/stacks/:id        — Get single stack
PATCH  /api/stacks/:id        — Update (name, config, publish/unpublish)
DELETE /api/stacks/:id        — Delete (owner only, not presets)
POST   /api/stacks/:id/like   — Toggle like
POST   /api/stacks/:id/save   — Toggle save
```

Device ID sent via `x-device-id` header.

## Seed Presets (39 Figma Font Pairings)

Each preset stores a full TypographyConfig with heading font, body font, foreground/background colors, and sensible defaults for weights/line-heights/letter-spacing.

1. Abril Fatface + Lato
2. Fugaz One + Work Sans
3. Space Mono + Plus Jakarta Sans
4. Grand Hotel + Lato
5. Raleway + Merriweather
6. Chonburi + Domine
7. Inter + Krub
8. Oswald + Source Serif 4
9. Arima Madurai + Mulish
10. Nunito + Lora
11. Ultra + Slabo
12. Arvo + Lato
13. Unica One + Crimson Text
14. Cinzel + Fauna One
15. Yeseva One + Josefin Sans
16. Sacramento + Alice
17. Roboto + Lora
18. Montserrat + Karla
19. Fjalla One + Cantarell
20. Source Sans Pro + Alegreya
21. Stint Ultra Expanded + Pontano Sans
22. Ubuntu + Rokkitt
23. Nunito + PT Sans
24. DotGothic16 + Space Mono
25. Playfair Display + Lato
26. Quicksand Bold + Quicksand Regular (same family, different weights)
27. Syne + Inter
28. Yellowtail + Rethink Sans
29. Rufina + Average Sans
30. Poiret One + Montserrat
31. Sintony + Poppins
32. Philosopher + Mulish
33. Cardo + Hind
34. Bubblegum Sans + Open Sans
35. Archivo Narrow + Tenor Sans
36. Rethink Sans + Spectral
37. Crimson Serif + DM Sans
38. Young Serif + Instrument Sans
39. Instrument Sans + Geist

Each preset gets a curated background/foreground color scheme matching its described mood (luxury = dark elegant, tech = cool neutrals, playful = warm bright, editorial = cream/charcoal, etc.).

## UI: Gallery Page (`/stacks`)

- Grid of stack cards with generous padding and spacing
- Each card displays:
  - The font pairing as actual rendered text (heading font for title, body font for sample text)
  - Card background/foreground uses the stack's own colors
  - Like count + heart button
  - Save/bookmark button
- Filter tabs: **All** | **Presets** | **Community** | **My Stacks** | **Saved**
- "New Stack" button → resets to default Inter config, navigates to editor
- Clicking a card → loads config into editor (navigates to `/`)

## UI: Sidebar Picker

- Compact "Stacks" section at the top of sidebar
- Shows current stack name (or "Unsaved" if modified)
- Dropdown/popover with:
  - Recent/saved stacks (quick access)
  - "Save" button (saves current config)
  - "Save As..." (new stack from current)
  - "Browse All" → navigates to `/stacks`
  - "New Stack" → resets to Inter defaults

## Client State Changes

- `ui-store` additions:
  - `currentStackId: string | null`
  - `currentStackName: string | null`
  - `isDirty: boolean` (config changed since last save)
- New utility: `getDeviceId()` — reads/creates UUID in localStorage
- API calls via plain `fetch` with a small custom hook (no new deps for data fetching)

## New Dependencies

- `drizzle-orm` + `@libsql/client` (or `better-sqlite3`) — database
- `drizzle-kit` — migrations (dev dep)
- `uuid` — generating stack/device IDs
