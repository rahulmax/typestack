# Skeuomorphic Interface — Full Dark Mode Treatment

**Date:** 2026-03-15
**Status:** Approved

## Overview

Extend the existing skeuomorphic/industrial material language from the sidebar controls to the entire TypeStax interface. The sidebar already has rotary dials, vertical sliders with knurled grips, backlit displays, LED indicators, surface noise, module grooves, and corner bolts. The rest of the interface (header, preview, dialogs, pickers) currently uses flat/standard styling.

## Design Signatures

Extracted from the existing sidebar controls — these define the material vocabulary:

1. **Backlit display** — warm amber glow behind text, glass overlay with diagonal glare stripe
2. **Knurled grips** — textured cylindrical ends on slider thumbs (repeating 1px line pattern)
3. **Luminous knob** — diffuse green glow behind the rotary dial, heavy 3D knob with rim lighting
4. **Heavy insets** — deep recessed wells for tracks, panels, display areas
5. **Surface noise** — fractal noise overlay on all panel surfaces
6. **Module grooves** — recessed seam separators between sections
7. **Corner bolts** — small radial-gradient circles at panel corners
8. **Amber LED indicators** — glowing amber dots/bars for active states

## Approach: Component Primitives (Approach B)

Create thin, stateless wrapper components that encapsulate material treatments. Each renders a styled `<div>`, accepts `children` and `className`, and handles its own shadows/gradients/pseudo-elements.

### New file: `src/components/ui/hw-primitives.tsx`

| Component | Purpose | Key Effects |
|-----------|---------|-------------|
| `<HWInsetWell>` | Deep recessed container (slider tracks, display wells, search fields) | Heavy inset shadow, dark gradient fill, 1px highlight rim |
| `<HWDisplay>` | Backlit text display (font selector, value readouts) | Amber/green glow behind text, glass overlay with diagonal glare, rounded corners |
| `<HWPanel>` | Lifted module panel (dialogs, popovers) | Surface noise, corner bolts, heavy drop shadow, subtle perspective lift |
| `<HWToggleSwitch>` | Hardware toggle for binary/multi-state (viewport, theme) | Knurled texture on active segment, recessed track, LED indicator |
| `<HWRackViewport>` | Recessed display panel (preview area) | Deep inset well, machined bezel, no browser chrome |
| `<HWCodeBlock>` | Reusable code display (export panels) | HWInsetWell + monospace styling + optional copy button slot |

### Material Tokens

**HWDisplay:**
- Background: radial gradient of warm amber (`oklch(0.45 0.12 65)`) → near-black
- Text: `oklch(0.85 0.08 65)` warm cream
- Glass: `::after` pseudo — diagonal gradient (transparent → `rgba(255,255,255,0.07)` → transparent) at ~30deg
- Border: 1px `rgba(255,255,255,0.06)`, border-radius 6px
- Inner shadow: `inset 0 1px 3px rgba(0,0,0,0.5)`

**HWInsetWell:**
- Background: `oklch(0.10 0.005 60)`
- Shadow: `inset 0 2px 6px rgba(0,0,0,0.6), inset 0 1px 1px rgba(0,0,0,0.4)`
- Outer rim: `0 1px 0 rgba(255,255,255,0.04)`
- Border-radius: 6px
- **Compact variant** (`compact` prop): lighter shadows (`inset 0 1px 3px rgba(0,0,0,0.4), inset 0 0.5px 1px rgba(0,0,0,0.3)`) for input-sized wells (search fields, hex inputs)

**HWPanel:**
- Background: surface gradient `oklch(0.19 → 0.17)`
- Surface noise overlay (reuses `surface-noise` class)
- Corner bolts (reuses `hw-bolt` / `hw-bolt-tl` etc. classes)
- Shadow: `0 12px 40px rgba(0,0,0,0.6), 0 4px 12px rgba(0,0,0,0.4)`
- Transform: `perspective(800px) rotateX(0.5deg)`
- **Note:** The perspective transform creates a new stacking context. For panels that contain tooltips or nested popovers (export dialog, browse stacks), omit the perspective transform and use only the heavy drop shadow for the lift effect. Accept an optional `perspective` prop (default `false`) to opt in.

**HWToggleSwitch:**
- Fully controlled component: `value: string`, `onChange: (value: string) => void`, `options: { value: string; label: ReactNode }[]`
- Track: HWInsetWell with tight border-radius (`border-radius: 4px`)
- Each option renders as an inline `<button>` within the track
- Active segment: hw-btn gradient, knurled texture (`repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(255,255,255,0.06) 1px, rgba(255,255,255,0.06) 2px)`)
- LED: `hw-selector-led` bar below the active segment
- No animation between positions — instant state change (matches hardware feel)

**HWRackViewport:**
- Bezel: 2px solid gradient (`oklch(0.22 → 0.18)`)
- Inner: deep HWInsetWell with extra shadow depth
- 1px inner highlight rim at top

**HWCodeBlock:**
- Wraps `<HWInsetWell>` with `<pre>` inside
- Monospace font, `text-sm`, horizontal scroll
- Optional `actions` slot (ReactNode) for copy button positioned top-right
- Replaces the repetitive `<pre>` + copy pattern across all 6 export files

## Target Areas

### 1. Header Bar
- Bottom border → `module-groove`
- Theme toggle → `<HWToggleSwitch>` with Sun/Moon positions
- Logo → embossed text-shadow treatment
- All buttons remain `hw-btn` (already done)

### 2. Preview Area
- Drop browser chrome metaphor entirely
- Replace `<BrowserChrome>` and `<MobileChrome>` internals with `<HWRackViewport>` — recessed display panel
- `viewport-toggle.tsx` is removed — its functionality moves into the rack toolbar
- Viewport controls (scale/laptop/tablet/mobile) → `<HWToggleSwitch>` in a narrow `surface-noise` toolbar strip above the viewport
- Template tabs (Website/Blog) → second `<HWToggleSwitch>` group in the same toolbar
- Mobile preview: content still renders at 375px width within the recessed viewport, but the phone frame/dynamic island chrome is replaced by the same rack bezel

### 3. Export Dialog
- `DialogContent` → `<HWPanel>` (bolts, noise, lift shadow — no perspective, since dialog contains tooltips)
- Tab strip keeps `hw-btn-group`
- Code output areas → `<HWCodeBlock>` (wraps HWInsetWell + monospace + copy slot)
- Copy buttons remain `hw-btn`

### 4. Browse Stacks Dialog
- This is a **full-screen** dialog (`!w-screen !h-screen !rounded-none`) — does NOT get the lifted `<HWPanel>` treatment
- Instead: apply `surface-noise` to the full-screen container, `module-groove` below the header
- Stack cards → raised modules with `hw-btn` gradient/bevel
- Search input → `<HWInsetWell compact>`
- Cards separated by `hw-groove-separator`

### 5. Font Picker
- **Already has** `surface-noise`, `hw-module-panel`, and corner bolts on the popover — keep existing treatment
- Delta only:
  - Search field (`CommandInput`) → wrap in `<HWInsetWell compact>`
  - Font list items → `hw-groove-separator` between them
  - Selected/active font → amber LED indicator

### 6. Mobile Drawer
- Panel → `surface-noise` (matching desktop sidebar)
- Header section → `module-groove` bottom border
- Close button → `hw-btn`
- Controls inherit sidebar styling

### 7. Color Picker
- This is a **Dialog**, not a Popover
- `DialogContent` → `<HWPanel>` (bolts, noise, lift shadow — no perspective)
- Saturation area → `<HWInsetWell>`
- Hue/alpha slider tracks → recessed treatment
- Hex input → `<HWInsetWell compact>`

## Files to Create

- `src/components/ui/hw-primitives.tsx` — the 6 component primitives (HWInsetWell, HWDisplay, HWPanel, HWToggleSwitch, HWRackViewport, HWCodeBlock)

## Files to Modify

- `src/components/layout/header.tsx` — module groove, embossed logo, toggle switch for theme
- `src/components/preview/browser-chrome.tsx` — replace internals with HWRackViewport + HWToggleSwitch toolbar
- `src/components/preview/mobile-chrome.tsx` — replace phone frame with rack viewport treatment
- `src/components/preview/viewport-toggle.tsx` — remove (functionality absorbed into rack toolbar)
- `src/components/export/export-dialog.tsx` — HWPanel wrapper
- `src/components/export/css-export.tsx` — HWCodeBlock for code output
- `src/components/export/tailwind-export.tsx` — HWCodeBlock for code output
- `src/components/export/figma-json-export.tsx` — HWCodeBlock for code output
- `src/components/export/figma-api-export.tsx` — HWCodeBlock for code output
- `src/components/export/pen-export.tsx` — HWCodeBlock for code output
- `src/components/export/copy-element-css.tsx` — HWCodeBlock for code output
- `src/components/stacks/browse-stacks-dialog.tsx` — surface-noise, module-groove header, styled cards (NOT HWPanel — full-screen dialog)
- `src/components/stacks/stack-card.tsx` — raised module styling
- `src/components/controls/font-picker/font-picker.tsx` — inset search well, groove separators, LED on selected item (popover already has bolts/noise)
- `src/components/controls/color-picker/color-picker.tsx` — HWPanel on DialogContent, HWInsetWell on saturation/hex
- `src/components/layout/sidebar.tsx` — mobile drawer noise + grooves
- `src/app/globals.css` — formalize `hw-module-panel` class (currently used but undefined), add any new utility classes

## Light Mode

Light mode is **out of scope** for this spec. The existing `hw-btn`, `module-groove`, `surface-noise`, and `hw-bolt` classes already have light mode variants in `globals.css`. Light mode variants for the new primitives will be a follow-up task after the dark mode treatment is validated.

## Constraints

- Dark mode is the priority (light mode follow-up)
- Warm amber as primary accent, green for dial glow only
- All values use existing oklch color system from globals.css
- No new dependencies — pure CSS + React components
- Primitives are stateless, styling-only wrappers (except HWToggleSwitch which is controlled)
- Perspective transform only on panels without nested overlays (opt-in via prop)
