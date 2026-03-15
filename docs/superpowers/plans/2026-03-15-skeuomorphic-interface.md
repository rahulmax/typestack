# Skeuomorphic Interface Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extend the existing dark-mode skeuomorphic/industrial material language from the sidebar controls to the entire TypeStax interface — header, preview chrome, dialogs, pickers, and mobile drawer.

**Architecture:** Create 6 thin component primitives (`HWInsetWell`, `HWDisplay`, `HWPanel`, `HWToggleSwitch`, `HWRackViewport`, `HWCodeBlock`) that encapsulate material treatments (inset shadows, surface noise, corner bolts, glass glare, knurled textures). Then apply these primitives to 7 target areas across the interface. Each primitive is a stateless styling wrapper (except `HWToggleSwitch` which is controlled).

**Tech Stack:** React 19, TypeScript, TailwindCSS v4, Next.js 16, oklch colors

**Spec:** `docs/superpowers/specs/2026-03-15-skeuomorphic-interface-design.md`

---

## Chunk 1: Component Primitives

### Task 1: Create HWInsetWell and HWDisplay

**Files:**
- Create: `src/components/ui/hw-primitives.tsx`

- [ ] **Step 1: Create hw-primitives.tsx with HWInsetWell**

```tsx
import { type ReactNode } from 'react'

interface HWInsetWellProps {
  children: ReactNode
  className?: string
  compact?: boolean
}

export function HWInsetWell({ children, className = '', compact = false }: HWInsetWellProps) {
  return (
    <div
      className={`relative rounded-[6px] ${className}`}
      style={{
        background: 'oklch(0.10 0.005 60)',
        boxShadow: compact
          ? 'inset 0 1px 3px rgba(0,0,0,0.4), inset 0 0.5px 1px rgba(0,0,0,0.3), 0 1px 0 rgba(255,255,255,0.04)'
          : 'inset 0 2px 6px rgba(0,0,0,0.6), inset 0 1px 1px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.04)',
      }}
    >
      {children}
    </div>
  )
}
```

- [ ] **Step 2: Add HWDisplay to the same file**

`HWDisplay` provides a backlit amber-glow display with a glass glare overlay. The `::after` pseudo-element is handled via inline styles on a child div.

```tsx
interface HWDisplayProps {
  children: ReactNode
  className?: string
  glowColor?: 'amber' | 'green'
}

export function HWDisplay({ children, className = '', glowColor = 'amber' }: HWDisplayProps) {
  const glow = glowColor === 'green'
    ? 'radial-gradient(ellipse at center, oklch(0.35 0.12 145) 0%, oklch(0.10 0.005 60) 70%)'
    : 'radial-gradient(ellipse at center, oklch(0.35 0.10 65) 0%, oklch(0.10 0.005 60) 70%)'

  return (
    <div
      className={`relative overflow-hidden rounded-[6px] ${className}`}
      style={{
        background: glow,
        border: '1px solid rgba(255,255,255,0.06)',
        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.5)',
      }}
    >
      {children}
      {/* Glass glare overlay */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[6px]"
        style={{
          background: 'linear-gradient(30deg, transparent 0%, transparent 40%, rgba(255,255,255,0.07) 45%, rgba(255,255,255,0.03) 55%, transparent 60%, transparent 100%)',
        }}
      />
    </div>
  )
}
```

- [ ] **Step 3: Verify the file builds**

Run: `cd /Users/rahul/Projects/typestax && pnpm lint`
Expected: No errors related to hw-primitives.tsx

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/hw-primitives.tsx
git commit -m "feat: add HWInsetWell and HWDisplay primitives"
```

---

### Task 2: Add HWPanel primitive

**Files:**
- Modify: `src/components/ui/hw-primitives.tsx`

- [ ] **Step 1: Add HWPanel component**

`HWPanel` is a lifted module panel with surface noise, corner bolts, heavy drop shadow, and optional perspective. Append to `hw-primitives.tsx`:

```tsx
interface HWPanelProps {
  children: ReactNode
  className?: string
  perspective?: boolean
}

export function HWPanel({ children, className = '', perspective = false }: HWPanelProps) {
  return (
    <div
      className={`relative surface-noise rounded-lg ${className}`}
      style={{
        background: 'linear-gradient(180deg, oklch(0.19 0.005 60) 0%, oklch(0.17 0.005 60) 100%)',
        boxShadow: '0 12px 40px rgba(0,0,0,0.6), 0 4px 12px rgba(0,0,0,0.4)',
        transform: perspective ? 'perspective(800px) rotateX(0.5deg)' : undefined,
      }}
    >
      <span className="hw-bolt hw-bolt-tl" />
      <span className="hw-bolt hw-bolt-tr" />
      <span className="hw-bolt hw-bolt-bl" />
      <span className="hw-bolt hw-bolt-br" />
      {children}
    </div>
  )
}
```

- [ ] **Step 2: Verify build**

Run: `cd /Users/rahul/Projects/typestax && pnpm lint`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/hw-primitives.tsx
git commit -m "feat: add HWPanel primitive"
```

---

### Task 3: Add HWToggleSwitch primitive

**Files:**
- Modify: `src/components/ui/hw-primitives.tsx`

- [ ] **Step 1: Add HWToggleSwitch component**

Fully controlled component that renders options as buttons inside an inset track. The active button gets the `hw-btn` gradient and a knurled texture. LED indicator appears below active segment.

```tsx
interface HWToggleSwitchOption {
  value: string
  label: ReactNode
}

interface HWToggleSwitchProps {
  value: string
  onChange: (value: string) => void
  options: HWToggleSwitchOption[]
  className?: string
}

export function HWToggleSwitch({ value, onChange, options, className = '' }: HWToggleSwitchProps) {
  return (
    <div
      className={`relative inline-flex rounded-[4px] ${className}`}
      style={{
        background: 'oklch(0.10 0.005 60)',
        boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.6), inset 0 1px 1px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.04)',
        padding: '2px',
      }}
    >
      {options.map((opt) => {
        const isActive = opt.value === value
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className="relative flex flex-col items-center justify-center gap-0.5 px-2.5 py-1.5 text-xs cursor-pointer transition-colors"
            style={{
              borderRadius: '3px',
              ...(isActive
                ? {
                    background: 'linear-gradient(180deg, oklch(0.28 0.005 60) 0%, oklch(0.21 0.005 60) 100%)',
                    color: 'oklch(0.88 0.003 80)',
                    boxShadow: '0 2px 3px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)',
                    backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(255,255,255,0.04) 1px, rgba(255,255,255,0.04) 2px)',
                  }
                : {
                    background: 'transparent',
                    color: 'oklch(0.50 0.005 60)',
                  }),
            }}
          >
            <span className="relative z-[1]">{opt.label}</span>
            {isActive && <span className="hw-selector-led" style={{ width: 12 }} />}
          </button>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 2: Verify build**

Run: `cd /Users/rahul/Projects/typestax && pnpm lint`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/hw-primitives.tsx
git commit -m "feat: add HWToggleSwitch primitive"
```

---

### Task 4: Add HWRackViewport and HWCodeBlock primitives

**Files:**
- Modify: `src/components/ui/hw-primitives.tsx`

- [ ] **Step 1: Add HWRackViewport component**

Recessed display panel with a machined bezel. Used for the preview area.

```tsx
interface HWRackViewportProps {
  children: ReactNode
  className?: string
}

export function HWRackViewport({ children, className = '' }: HWRackViewportProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-[6px] ${className}`}
      style={{
        padding: '2px',
        background: 'linear-gradient(180deg, oklch(0.22 0.005 60), oklch(0.18 0.005 60))',
      }}
    >
      {/* Inner panel */}
      <div
        className="relative overflow-hidden rounded-[4px] h-full"
        style={{
          boxShadow: 'inset 0 3px 8px rgba(0,0,0,0.6), inset 0 1px 2px rgba(0,0,0,0.4)',
        }}
      >
        {/* Inner highlight rim */}
        <div
          className="pointer-events-none absolute inset-0 rounded-[4px]"
          style={{
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03)',
          }}
        />
        {children}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Add HWCodeBlock component**

Wraps `HWInsetWell` with monospace `<pre>` styling and an optional actions slot (for copy buttons).

```tsx
interface HWCodeBlockProps {
  children: ReactNode
  actions?: ReactNode
  className?: string
}

export function HWCodeBlock({ children, actions, className = '' }: HWCodeBlockProps) {
  return (
    <HWInsetWell className={`relative ${className}`}>
      {actions && (
        <div className="absolute top-2 right-2 z-10">
          {actions}
        </div>
      )}
      <pre className="max-h-[400px] overflow-auto p-4 text-xs font-mono whitespace-pre-wrap break-all text-stone-300">
        <code>{children}</code>
      </pre>
    </HWInsetWell>
  )
}
```

- [ ] **Step 3: Verify build**

Run: `cd /Users/rahul/Projects/typestax && pnpm lint`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/hw-primitives.tsx
git commit -m "feat: add HWRackViewport and HWCodeBlock primitives"
```

---

### Task 5: Formalize hw-module-panel CSS class

**Files:**
- Modify: `src/app/globals.css`

The class `hw-module-panel` is used in `font-picker.tsx` but not defined in `globals.css`. Add it so the pattern is formalized.

- [ ] **Step 1: Add hw-module-panel class to globals.css**

Add after the existing `hw-bolt` classes (after line 498 in globals.css):

```css
/* Module panel — raised equipment panel background */
.hw-module-panel {
  background: linear-gradient(180deg, oklch(0.95 0.003 80) 0%, oklch(0.91 0.003 80) 100%);
}
.dark .hw-module-panel {
  background: linear-gradient(180deg, oklch(0.19 0.005 60) 0%, oklch(0.17 0.005 60) 100%);
}
```

- [ ] **Step 2: Verify build**

Run: `cd /Users/rahul/Projects/typestax && pnpm lint`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "feat: formalize hw-module-panel CSS class"
```

---

## Chunk 2: Header & Preview Area

### Task 6: Header bar — module groove, embossed logo, theme toggle

**Files:**
- Modify: `src/components/layout/header.tsx`

- [ ] **Step 1: Import HWToggleSwitch**

Add to imports at top of `src/components/layout/header.tsx`:
```tsx
import { HWToggleSwitch } from '@/components/ui/hw-primitives'
```

- [ ] **Step 2: Replace bottom border with module-groove**

In the `<header>` element (line 40), replace:
```
className="relative flex h-14 items-center justify-between border-b bg-background px-2 md:px-4 surface-noise"
```
With:
```
className="relative flex h-14 items-center justify-between bg-background px-2 md:px-4 surface-noise"
```

Then add a module groove after the closing `</header>` tag. Since the header is wrapped in `AppShell`, the groove needs to be inside the header component. Add it as the last child inside `<header>`, absolutely positioned at the bottom:

Actually — looking at `app-shell.tsx`, the header is rendered as a direct child above the sidebar/preview row. The cleanest approach is to add the groove as the last element inside the `<header>`:

Replace the closing `</header>` with:
```tsx
      <div className="module-groove absolute bottom-0 left-0 right-0" />
    </header>
```

- [ ] **Step 3: Add embossed text-shadow to logo**

On line 43, the logo `<span>` has class `text-lg font-bold tracking-tight`. Add an inline style for the embossed effect. Replace:
```tsx
<span className="text-lg font-bold tracking-tight">TypeStax</span>
```
With:
```tsx
<span
  className="text-lg font-bold tracking-tight"
  style={{ textShadow: '0 -1px 0 rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.1)' }}
>
  TypeStax
</span>
```

- [ ] **Step 4: Replace theme toggle with HWToggleSwitch**

Replace the theme toggle button (lines 60-80) with an `HWToggleSwitch`. Replace the entire `<Tooltip>` wrapping the theme button (from `<Tooltip>` on line 60 to the closing `</Tooltip>` on line 80) with:

```tsx
{mounted && (
  <HWToggleSwitch
    value={resolvedTheme ?? 'light'}
    onChange={(v) => setTheme(v)}
    options={[
      { value: 'light', label: <Sun className="size-3" /> },
      { value: 'dark', label: <Moon className="size-3" /> },
    ]}
  />
)}
```

- [ ] **Step 5: Verify build and visual**

Run: `cd /Users/rahul/Projects/typestax && pnpm lint`
Expected: PASS. Then visually check the header in dark mode — embossed logo, module groove at bottom, hardware toggle for theme.

- [ ] **Step 6: Commit**

```bash
git add src/components/layout/header.tsx
git commit -m "feat: skeuomorphic header — module groove, embossed logo, toggle switch"
```

---

### Task 7: Preview area — rack viewport with toggle switches

**Files:**
- Modify: `src/components/preview/browser-chrome.tsx`
- Modify: `src/components/preview/mobile-chrome.tsx`
- Modify: `src/components/preview/preview-container.tsx`
- Delete: `src/components/preview/viewport-toggle.tsx`

- [ ] **Step 1: Rewrite BrowserChrome as rack viewport**

Replace the entire content of `src/components/preview/browser-chrome.tsx` with:

```tsx
"use client"

import { ALargeSmall, Laptop, Tablet, Smartphone, Globe, AlignLeft } from 'lucide-react'
import { useUIStore, type ViewportSize, type PreviewTab } from '@/store/ui-store'
import { HWToggleSwitch, HWRackViewport } from '@/components/ui/hw-primitives'

const VIEWPORTS: { value: ViewportSize; label: React.ReactNode }[] = [
  { value: 'scale', label: <ALargeSmall className="size-3.5" /> },
  { value: 'laptop', label: <Laptop className="size-3.5" /> },
  { value: 'tablet', label: <Tablet className="size-3.5" /> },
  { value: 'mobile', label: <Smartphone className="size-3.5" /> },
]

const TEMPLATES: { value: PreviewTab; label: React.ReactNode }[] = [
  { value: 'website', label: <><Globe className="size-3" /><span className="hidden sm:inline text-[11px] ml-1">Website</span></> },
  { value: 'blog', label: <><AlignLeft className="size-3" /><span className="hidden sm:inline text-[11px] ml-1">Blog</span></> },
]

interface RackChromeProps {
  children: React.ReactNode
  contentStyle?: React.CSSProperties
}

export function RackChrome({ children, contentStyle }: RackChromeProps) {
  const viewport = useUIStore((s) => s.viewport)
  const setViewport = useUIStore((s) => s.setViewport)
  const activeTab = useUIStore((s) => s.activeTab)
  const setActiveTab = useUIStore((s) => s.setActiveTab)
  const isScale = viewport === 'scale'

  return (
    <div className="flex h-full flex-col">
      {/* Toolbar strip */}
      <div className="relative flex items-center justify-center gap-3 px-4 py-2 surface-noise shrink-0" style={{ background: 'linear-gradient(180deg, oklch(0.19 0.005 60), oklch(0.17 0.005 60))' }}>
        <HWToggleSwitch
          value={viewport}
          onChange={(v) => setViewport(v as ViewportSize)}
          options={VIEWPORTS}
        />
        <div style={{ opacity: isScale ? 0.35 : 1, pointerEvents: isScale ? 'none' : undefined, transition: 'opacity 0.15s' }}>
          <HWToggleSwitch
            value={activeTab}
            onChange={(v) => setActiveTab(v as PreviewTab)}
            options={TEMPLATES}
          />
        </div>
        <div className="module-groove absolute bottom-0 left-0 right-0" />
      </div>
      {/* Rack viewport */}
      <div className="flex-1 min-h-0 overflow-auto p-4 bg-muted">
        <HWRackViewport className="h-full">
          <div style={contentStyle}>
            {children}
          </div>
        </HWRackViewport>
      </div>
    </div>
  )
}

// Keep the named export for backwards compat during migration
export { RackChrome as BrowserChrome }
```

- [ ] **Step 2: Rewrite MobileChrome to use rack viewport**

Replace the entire content of `src/components/preview/mobile-chrome.tsx` with:

```tsx
"use client"

import { RackChrome } from './browser-chrome'

interface MobileChromeProps {
  children: React.ReactNode
}

export function MobileChrome({ children }: MobileChromeProps) {
  return (
    <RackChrome contentStyle={{ maxWidth: 375, margin: '0 auto' }}>
      {children}
    </RackChrome>
  )
}
```

- [ ] **Step 3: Simplify PreviewContainer**

Update `src/components/preview/preview-container.tsx` to use the unified `RackChrome` for all viewports. Replace entire file with:

```tsx
"use client"

import { PreviewIframe } from './preview-iframe'
import { RackChrome } from './browser-chrome'
import { TypeScaleView } from './type-scale-view'
import { useUIStore } from '@/store/ui-store'
import { getTemplateHTML } from './templates/template-registry'

export function PreviewContainer() {
  const activeTab = useUIStore((s) => s.activeTab)
  const viewport = useUIStore((s) => s.viewport)

  const contentStyle = viewport === 'tablet'
    ? { maxWidth: 768, margin: '0 auto' }
    : viewport === 'mobile'
      ? { maxWidth: 375, margin: '0 auto' }
      : undefined

  return (
    <RackChrome contentStyle={contentStyle}>
      {viewport === 'scale' ? (
        <TypeScaleView />
      ) : (
        <PreviewIframe bodyHTML={getTemplateHTML(activeTab)} mobile={viewport === 'mobile'} />
      )}
    </RackChrome>
  )
}
```

- [ ] **Step 4: Delete viewport-toggle.tsx**

```bash
git rm src/components/preview/viewport-toggle.tsx
```

Check that nothing imports it:
```bash
grep -r "viewport-toggle" src/ --include="*.tsx" --include="*.ts"
```
Expected: no results (it's not imported anywhere in the main app — only in browser-chrome which we rewrote).

- [ ] **Step 5: Verify build**

Run: `cd /Users/rahul/Projects/typestax && pnpm lint`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add -A src/components/preview/
git commit -m "feat: replace browser chrome with equipment-rack viewport"
```

---

## Chunk 3: Export & Color Dialogs

### Task 8: Export dialog — HWPanel wrapper and HWCodeBlock

**Files:**
- Modify: `src/components/export/export-dialog.tsx`
- Modify: `src/components/export/css-export.tsx`
- Modify: `src/components/export/tailwind-export.tsx`
- Modify: `src/components/export/figma-json-export.tsx`
- Modify: `src/components/export/pen-export.tsx`

- [ ] **Step 1: Wrap export dialog in HWPanel**

In `src/components/export/export-dialog.tsx`, add import:
```tsx
import { HWPanel } from '@/components/ui/hw-primitives'
```

Replace the `<DialogContent>` className (line 38):
```
className="max-w-2xl max-h-[85vh] overflow-y-auto"
```
With:
```
className="max-w-2xl max-h-[85vh] overflow-y-auto !bg-transparent !border-0 !shadow-none !p-0"
```

Then wrap the inner content in `<HWPanel>`. Replace lines 38-70 with:
```tsx
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto !bg-transparent !border-0 !shadow-none !p-0">
        <HWPanel className="p-6">
          <DialogHeader>
            <DialogTitle>Export Typography</DialogTitle>
            <DialogDescription>Copy CSS, download Figma tokens, push variables to Figma, or export to Pencil.</DialogDescription>
          </DialogHeader>
          <div className="hw-btn-group flex mt-4">
            {TABS.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setTab(t.value)}
                className="hw-btn hw-selector-btn flex-1"
                data-active={tab === t.value}
                style={{ height: 34, padding: '0 16px', fontSize: 13 }}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="pt-2">
            {tab === "css" && (
              <div className="flex flex-col gap-4">
                <CSSExport />
                <CopyElementCSS />
              </div>
            )}
            {tab === "tailwind" && <TailwindExport />}
            {tab === "figma-json" && <FigmaJSONExport />}
            {tab === "figma-api" && <FigmaAPIExport />}
            {tab === "pen" && <PenExport />}
          </div>
        </HWPanel>
      </DialogContent>
```

- [ ] **Step 2: Update CSSExport to use HWCodeBlock**

In `src/components/export/css-export.tsx`, add import:
```tsx
import { HWCodeBlock } from '@/components/ui/hw-primitives'
```

Replace the `<pre>` block (line 39-41):
```tsx
      <pre className="max-h-[400px] overflow-auto rounded-md border bg-muted p-4 text-xs whitespace-pre-wrap break-all">
        <code>{css}</code>
      </pre>
```
With:
```tsx
      <HWCodeBlock actions={
        <button type="button" className="hw-btn text-xs" onClick={handleCopy}>Copy</button>
      }>
        {css}
      </HWCodeBlock>
```

And remove the separate Copy button from the header (lines 33-38), replacing the header div with just the label:
```tsx
      <span className="text-sm font-medium">CSS Custom Properties</span>
```

- [ ] **Step 3: Update TailwindExport to use HWCodeBlock**

In `src/components/export/tailwind-export.tsx`, add import:
```tsx
import { HWCodeBlock } from '@/components/ui/hw-primitives'
```

Replace the `<pre>` block (lines 67-69):
```tsx
      <pre className="max-h-[400px] overflow-auto rounded-md border bg-muted p-4 text-xs whitespace-pre-wrap break-all">
        <code>{output}</code>
      </pre>
```
With:
```tsx
      <HWCodeBlock actions={
        <button type="button" className="hw-btn text-xs" onClick={handleCopy}>Copy</button>
      }>
        {output}
      </HWCodeBlock>
```

And remove the separate Copy button from the header (line 63-65), keeping only the format toggle:
```tsx
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-medium">Tailwind</span>
          {/* ... format toggle stays ... */}
        </div>
      </div>
```

- [ ] **Step 4: Update FigmaJSONExport to use HWCodeBlock**

In `src/components/export/figma-json-export.tsx`, add import:
```tsx
import { HWCodeBlock } from '@/components/ui/hw-primitives'
```

Replace the `<pre>` block (lines 55-57):
```tsx
      <pre className="max-h-[400px] overflow-auto rounded-md border bg-muted p-4 text-xs whitespace-pre-wrap break-all">
        <code>{json}</code>
      </pre>
```
With:
```tsx
      <HWCodeBlock actions={
        <div className="flex gap-1">
          <button type="button" className="hw-btn text-xs" onClick={handleCopy}>Copy</button>
          <button type="button" className="hw-btn text-xs" onClick={handleDownload}>Download</button>
        </div>
      }>
        {json}
      </HWCodeBlock>
```

And remove the separate buttons from the header (lines 46-53), keeping only the label:
```tsx
      <span className="text-sm font-medium">Tokens Studio Format</span>
```

- [ ] **Step 5: Update PenExport to use HWCodeBlock**

In `src/components/export/pen-export.tsx`, add import:
```tsx
import { HWCodeBlock } from '@/components/ui/hw-primitives'
```

Replace the `<pre>` block (lines 59-61):
```tsx
      <pre className="max-h-[400px] overflow-auto rounded-md border bg-muted p-4 text-xs whitespace-pre-wrap break-all">
        <code>{pen}</code>
      </pre>
```
With:
```tsx
      <HWCodeBlock actions={
        <div className="flex gap-1">
          <button type="button" className="hw-btn text-xs" onClick={handleCopy}>Copy</button>
          <button type="button" className="hw-btn text-xs" onClick={handleDownload}>Download</button>
        </div>
      }>
        {pen}
      </HWCodeBlock>
```

And remove the separate buttons from the header (lines 50-56), keeping only the label:
```tsx
      <span className="text-sm font-medium">Pencil Variables</span>
```

- [ ] **Step 6: Verify build**

Run: `cd /Users/rahul/Projects/typestax && pnpm lint`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add src/components/export/ src/components/ui/hw-primitives.tsx
git commit -m "feat: skeuomorphic export dialog — HWPanel, HWCodeBlock"
```

---

### Task 9: Color picker — HWPanel and inset wells

**Files:**
- Modify: `src/components/controls/color-picker/color-picker.tsx`
- Modify: `src/components/controls/color-picker/hex-rgb-input.tsx`

- [ ] **Step 1: Wrap color picker dialog in HWPanel**

In `src/components/controls/color-picker/color-picker.tsx`, add import:
```tsx
import { HWPanel, HWInsetWell } from '@/components/ui/hw-primitives'
```

Replace `<DialogContent className="max-w-sm">` (line 31) with:
```tsx
      <DialogContent className="max-w-sm !bg-transparent !border-0 !shadow-none !p-0">
        <HWPanel className="p-6">
```

Wrap `<HexColorPicker>` in `<HWInsetWell>`:
```tsx
          <HWInsetWell className="p-1">
            <HexColorPicker
              color={color}
              onChange={onChange}
              style={{ width: "100%", height: 160 }}
            />
          </HWInsetWell>
```

Add the closing `</HWPanel>` before `</DialogContent>`.

- [ ] **Step 2: Add inset well to hex input**

In `src/components/controls/color-picker/hex-rgb-input.tsx`, add import:
```tsx
import { HWInsetWell } from '@/components/ui/hw-primitives'
```

Wrap the hex `<Input>` (line 59-64) in `<HWInsetWell compact>`:
```tsx
        <HWInsetWell compact className="flex-1">
          <Input
            value={hex}
            onChange={(e) => handleHexChange(e.target.value)}
            className="h-6 w-full font-mono text-[9px] tracking-tight px-1 !bg-transparent !border-0 !shadow-none !ring-0"
            maxLength={7}
          />
        </HWInsetWell>
```

- [ ] **Step 3: Verify build**

Run: `cd /Users/rahul/Projects/typestax && pnpm lint`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add src/components/controls/color-picker/
git commit -m "feat: skeuomorphic color picker — HWPanel, inset wells"
```

---

## Chunk 4: Browse Stacks, Font Picker, Mobile Drawer

### Task 10: Browse stacks dialog — surface noise and module groove

**Files:**
- Modify: `src/components/stacks/browse-stacks-dialog.tsx`

- [ ] **Step 1: Add surface-noise to full-screen container**

On line 156, the `<DialogContent>` has className ending with `!bg-muted`. This is a full-screen dialog so we do NOT use HWPanel. Instead, add `surface-noise` to the className:

Replace:
```
!overflow-hidden !bg-muted"
```
With:
```
!overflow-hidden !bg-muted surface-noise"
```

- [ ] **Step 2: Replace header border-b with module-groove**

On line 158, the `<DialogHeader>` has `border-b` in its className. Replace `border-b` with nothing, and add a module groove after the `</DialogHeader>` closing tag (line 228):

After `</DialogHeader>` add:
```tsx
          <div className="module-groove" />
```

Remove `border-b` from the `<DialogHeader>` className.

- [ ] **Step 3: Verify build**

Run: `cd /Users/rahul/Projects/typestax && pnpm lint`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add src/components/stacks/browse-stacks-dialog.tsx
git commit -m "feat: skeuomorphic browse stacks — surface noise, module groove"
```

---

### Task 11: Font picker — inset search well and LED indicator

**Files:**
- Modify: `src/components/controls/font-picker/font-picker.tsx`
- Modify: `src/components/controls/font-picker/font-picker-item.tsx`

- [ ] **Step 1: Wrap CommandInput in HWInsetWell**

In `src/components/controls/font-picker/font-picker.tsx`, add import:
```tsx
import { HWInsetWell } from '@/components/ui/hw-primitives'
```

The `<CommandInput>` (lines 103-107) needs to be wrapped. Replace:
```tsx
            <CommandInput
              placeholder="Search fonts..."
              value={search}
              onValueChange={setSearch}
            />
```
With:
```tsx
            <HWInsetWell compact className="mb-2">
              <CommandInput
                placeholder="Search fonts..."
                value={search}
                onValueChange={setSearch}
                className="!bg-transparent !border-0 !shadow-none !ring-0"
              />
            </HWInsetWell>
```

- [ ] **Step 2: Add amber LED to selected font item**

In `src/components/controls/font-picker/font-picker-item.tsx`, add the LED indicator for selected items. Replace the `<CommandItem>` content (lines 25-41):

Replace:
```tsx
    <CommandItem
      ref={observeRef}
      data-font-family={font.family}
      value={font.family}
      onSelect={handleSelect}
      className={`flex items-center justify-between py-2.5 hw-groove-separator ${
        isSelected ? "!bg-stone-200 dark:!bg-stone-700 font-semibold" : ""
      }`}
    >
      <span style={{ fontFamily: `'${font.family}', ${font.category}` }}>
        {font.family}
      </span>
      {showCategory && (
        <span className="text-[10px] text-muted-foreground/60">{font.category}</span>
      )}
    </CommandItem>
```
With:
```tsx
    <CommandItem
      ref={observeRef}
      data-font-family={font.family}
      value={font.family}
      onSelect={handleSelect}
      className={`flex items-center justify-between py-2.5 hw-groove-separator ${
        isSelected ? "!bg-stone-200 dark:!bg-stone-700 font-semibold" : ""
      }`}
    >
      <span className="flex items-center gap-2">
        {isSelected && <span className="hw-selector-led" style={{ width: 8, height: 2 }} />}
        <span style={{ fontFamily: `'${font.family}', ${font.category}` }}>
          {font.family}
        </span>
      </span>
      {showCategory && (
        <span className="text-[10px] text-muted-foreground/60">{font.category}</span>
      )}
    </CommandItem>
```

- [ ] **Step 3: Verify build**

Run: `cd /Users/rahul/Projects/typestax && pnpm lint`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add src/components/controls/font-picker/
git commit -m "feat: skeuomorphic font picker — inset search, LED indicator"
```

---

### Task 12: Mobile drawer — surface noise and module groove

**Files:**
- Modify: `src/components/layout/sidebar.tsx`

- [ ] **Step 1: Add surface-noise and module groove to mobile drawer**

In `src/components/layout/sidebar.tsx`, update the mobile drawer `<aside>` (line 60). Add `surface-noise` to its className:

Replace:
```
className="absolute inset-y-0 left-0 w-[85vw] max-w-[400px] overflow-y-auto bg-background surface-noise shadow-xl"
```
Good — it already has `surface-noise`. Now replace the header border. On line 61, the header div has `border-b`:
```
className="flex items-center justify-between border-b px-4 py-3"
```

Replace `border-b` with nothing. Then add a module groove after that header div. After line 69 (`</div>` closing the header), add:
```tsx
            <div className="module-groove" />
```

Also update the close button from ShadCN `<Button>` to `hw-btn`. Replace lines 64-69:
```tsx
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => setMobileOpen(false)}
              >
                <X className="size-4" />
              </Button>
```
With:
```tsx
              <button
                type="button"
                className="hw-btn !h-7 !w-7 !p-0"
                onClick={() => setMobileOpen(false)}
              >
                <X className="size-4" />
              </button>
```

If `Button` is no longer used elsewhere in sidebar.tsx, remove the `Button` import.

- [ ] **Step 2: Verify build**

Run: `cd /Users/rahul/Projects/typestax && pnpm lint`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/sidebar.tsx
git commit -m "feat: skeuomorphic mobile drawer — module groove, hw-btn close"
```

---

### Task 12b: Browse stacks — inset search and raised stack cards

**Files:**
- Modify: `src/components/stacks/browse-stacks-dialog.tsx`
- Modify: `src/components/stacks/stack-card.tsx`

Note: `copy-element-css.tsx` is listed in the spec's "Files to Modify" but does NOT use a `<pre>` code block — it renders per-element copy buttons. No HWCodeBlock treatment needed; the `hw-btn` styling on its buttons is already correct.

- [ ] **Step 1: Add inset search well to browse stacks**

In `src/components/stacks/browse-stacks-dialog.tsx`, add import:
```tsx
import { HWInsetWell } from '@/components/ui/hw-primitives'
```

The browse stacks dialog doesn't have a search input currently — it uses filter button groups (`hw-btn-group`). The spec says "Search input -> `<HWInsetWell compact>`" but there's no search input to wrap. Skip this — the filter groups are already styled with `hw-btn-group`.

- [ ] **Step 2: Style stack cards as raised modules**

In `src/components/stacks/stack-card.tsx`, update the card's outer container to use the `hw-btn` gradient/bevel treatment. Replace the outer `<div>` styling (line 43-44):

Replace:
```tsx
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-lg text-left transition-shadow duration-300 ease-out hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      style={{ boxShadow: "0 0 0 1px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.05)" }}
```
With:
```tsx
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-lg text-left transition-shadow duration-300 ease-out hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      style={{
        background: 'linear-gradient(180deg, oklch(0.22 0.005 60) 0%, oklch(0.18 0.005 60) 100%)',
        boxShadow: '0 2px 4px rgba(0,0,0,0.4), 0 4px 8px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05)',
        border: '1px solid oklch(0.14 0.005 60)',
      }}
```

Also update the info bar (line 106) to use a darker backdrop that matches:
Replace:
```tsx
        style={{ backgroundColor: `color-mix(in srgb, ${bg} 88%, transparent)` }}
```
With:
```tsx
        style={{ backgroundColor: `color-mix(in srgb, ${bg} 88%, transparent)`, borderTop: '1px solid rgba(255,255,255,0.05)' }}
```

Replace the ShadCN `<Button>` components for like/save (lines 116-154) with `hw-btn` styled buttons. Replace the `Button` import with nothing (remove it) and replace each `<Button variant="ghost" size="sm" className="h-7 w-7 p-0"` with `<button type="button" className="hw-btn !h-7 !w-7 !p-0"`. Replace `</Button>` with `</button>`.

- [ ] **Step 3: Verify build**

Run: `cd /Users/rahul/Projects/typestax && pnpm lint`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add src/components/stacks/stack-card.tsx src/components/stacks/browse-stacks-dialog.tsx
git commit -m "feat: skeuomorphic stack cards — raised module styling"
```

---

## Chunk 5: Figma API Export & Final Verification

### Task 13: Figma API export — inset well inputs

**Files:**
- Modify: `src/components/export/figma-api-export.tsx`

- [ ] **Step 1: Wrap inputs in HWInsetWell compact**

In `src/components/export/figma-api-export.tsx`, add import:
```tsx
import { HWInsetWell } from '@/components/ui/hw-primitives'
```

Wrap each `<Input>` in `<HWInsetWell compact>`. Replace the token input (lines 55-60):
```tsx
        <HWInsetWell compact>
          <Input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="figd_..."
            className="!bg-transparent !border-0 !shadow-none !ring-0"
          />
        </HWInsetWell>
```

And the file URL input (lines 66-70):
```tsx
        <HWInsetWell compact>
          <Input
            value={fileUrl}
            onChange={(e) => setFileUrl(e.target.value)}
            placeholder="https://figma.com/design/..."
            className="!bg-transparent !border-0 !shadow-none !ring-0"
          />
        </HWInsetWell>
```

- [ ] **Step 2: Verify build**

Run: `cd /Users/rahul/Projects/typestax && pnpm lint`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/components/export/figma-api-export.tsx
git commit -m "feat: skeuomorphic Figma API inputs — inset wells"
```

---

### Task 14: Final lint, visual QA, and branch commit

- [ ] **Step 1: Run full lint**

Run: `cd /Users/rahul/Projects/typestax && pnpm lint`
Expected: PASS with no errors

- [ ] **Step 2: Run build**

Run: `cd /Users/rahul/Projects/typestax && pnpm build`
Expected: Build succeeds

- [ ] **Step 3: Visual QA checklist**

Start dev server and check each area in dark mode:
- Header: module groove at bottom, embossed logo, toggle switch for theme
- Preview: rack viewport with toggle switches, no browser chrome
- Export dialog: HWPanel wrapper, code blocks in inset wells
- Color picker: HWPanel wrapper, saturation in inset well, hex input in compact inset well
- Browse stacks: surface noise on container, module groove below header
- Font picker: inset search well, LED indicator on selected font
- Mobile drawer: module groove below header, hw-btn close button

Run: `cd /Users/rahul/Projects/typestax && pnpm dev`
Then open http://localhost:3000 in dark mode and verify each area.
