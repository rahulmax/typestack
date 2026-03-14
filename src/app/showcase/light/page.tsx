'use client'

import { Slider } from '@/components/ui/slider'
import { RotaryDial } from '@/components/controls/rotary-dial'
import { RejectedKnob } from '@/components/showcase/rejected-knob'

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-stone-400">
      {children}
    </p>
  )
}

function EjectIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className={className}>
      <polygon points="8 3 14 10 2 10" />
      <rect x="2" y="12" width="12" height="1.5" rx="0.5" />
    </svg>
  )
}

export default function ShowcaseLightPage() {
  return (
    <div
      className="light min-h-screen bg-stone-200"
      data-theme="light"
      style={{ colorScheme: 'light' }}
    >
      <div className="mx-auto flex max-w-2xl flex-col gap-8 px-6 py-16">

        {/* 1. Surface Noise */}
        <section id="noise-texture" className="p-12">
          <SectionLabel>Surface Noise</SectionLabel>
          <div
            className="surface-noise relative rounded-xl p-6 bg-gradient-to-b from-[oklch(0.94_0.003_80)] to-[oklch(0.91_0.003_80)]"
            style={{ width: 400, height: 200 }}
          >
            <span className="text-sm text-stone-500">Surface Noise</span>
          </div>
        </section>

        {/* 2. Module Grooves */}
        <section id="module-grooves" className="p-12">
          <SectionLabel>Module Grooves</SectionLabel>
          <div className="flex flex-col gap-6">
            {/* Horizontal groove */}
            <div>
              <p className="mb-2 text-xs text-stone-400">Horizontal Groove</p>
              <div
                className="surface-noise relative rounded-lg bg-gradient-to-b from-[oklch(0.94_0.003_80)] to-[oklch(0.91_0.003_80)]"
                style={{ height: 100 }}
              />
              <div className="module-groove" />
              <div
                className="surface-noise relative rounded-lg bg-gradient-to-b from-[oklch(0.94_0.003_80)] to-[oklch(0.91_0.003_80)]"
                style={{ height: 100 }}
              />
            </div>
            {/* Vertical groove */}
            <div>
              <p className="mb-2 text-xs text-stone-400">Vertical Groove</p>
              <div className="flex" style={{ height: 100 }}>
                <div className="surface-noise relative flex-1 rounded-lg bg-gradient-to-b from-[oklch(0.94_0.003_80)] to-[oklch(0.91_0.003_80)]" />
                <div className="module-groove-v" />
                <div className="surface-noise relative flex-1 rounded-lg bg-gradient-to-b from-[oklch(0.94_0.003_80)] to-[oklch(0.91_0.003_80)]" />
              </div>
            </div>
          </div>
        </section>

        {/* 3. Hardware Buttons */}
        <section id="hw-buttons" className="p-12">
          <SectionLabel>Hardware Buttons</SectionLabel>
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <button className="hw-btn">Resting</button>
              <button
                className="hw-btn"
                style={{
                  background:
                    'linear-gradient(180deg, oklch(0.97 0.003 80) 0%, oklch(0.91 0.003 80) 100%)',
                  boxShadow:
                    '0 2px 4px oklch(0 0 0 / 12%), 0 5px 10px oklch(0 0 0 / 7%), 0 1px 0 oklch(0 0 0 / 5%), inset 0 1px 0 oklch(1 0 0 / 80%), inset 0 -1px 0 oklch(0 0 0 / 5%)',
                }}
              >
                Hover
              </button>
              <button
                className="hw-btn"
                style={{
                  background:
                    'linear-gradient(180deg, oklch(0.88 0.003 80) 0%, oklch(0.90 0.003 80) 100%)',
                  boxShadow:
                    'inset 0 1px 3px oklch(0 0 0 / 12%), inset 0 0 1px oklch(0 0 0 / 8%)',
                }}
              >
                Pressed
              </button>
              <button className="hw-btn" data-active="true">
                Selected
              </button>
            </div>
            <div>
              <p className="mb-2 text-xs text-stone-400">Button Group</p>
              <div className="hw-btn-group flex">
                <button className="hw-btn">One</button>
                <button className="hw-btn" data-active="true">
                  Two
                </button>
                <button className="hw-btn">Three</button>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Sliders */}
        <section id="sliders" className="p-12">
          <SectionLabel>Sliders</SectionLabel>
          <div className="flex flex-col gap-6" style={{ maxWidth: 320 }}>
            <Slider
              value={[16]}
              min={12}
              max={24}
              label="Base Size"
              formatValue={(v) => `${v}px`}
            />
            <Slider
              value={[50]}
              min={0}
              max={100}
              disabledText="AUTO"
            />
          </div>
        </section>

        {/* 5. Rotary Dial */}
        <section id="rotary-dial" className="p-12">
          <SectionLabel>Rotary Dial</SectionLabel>
          <div style={{ width: 300, overflow: 'visible' }}>
            <RotaryDial value={1.618} onChange={() => {}} />
          </div>
        </section>

        {/* 5b. Rejected Knob (before/after) */}
        <section id="rejected-knob" className="p-12">
          <SectionLabel>Rejected Knob (Before)</SectionLabel>
          <div style={{ width: 300, overflow: 'visible' }}>
            <RejectedKnob />
          </div>
        </section>

        {/* 6. Corner Bolts */}
        <section id="corner-bolts" className="p-12">
          <SectionLabel>Corner Bolts</SectionLabel>
          <div
            className="surface-noise relative flex items-center justify-center rounded-lg border border-stone-300 bg-gradient-to-b from-[oklch(0.94_0.003_80)] to-[oklch(0.91_0.003_80)]"
            style={{ width: 200, height: 120 }}
          >
            <span className="hw-bolt hw-bolt-tl" />
            <span className="hw-bolt hw-bolt-tr" />
            <span className="hw-bolt hw-bolt-bl" />
            <span className="hw-bolt hw-bolt-br" />
            <span className="text-sm text-stone-500">Panel with Bolts</span>
          </div>
        </section>

        {/* 7. Eject Icons */}
        <section id="eject-icons" className="p-12">
          <SectionLabel>Eject Icons</SectionLabel>
          <div className="flex items-end gap-6">
            <div className="flex flex-col items-center gap-2">
              <EjectIcon className="size-4 text-stone-500" />
              <span className="text-xs text-stone-400">size-4</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <EjectIcon className="size-6 text-stone-500" />
              <span className="text-xs text-stone-400">size-6</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <EjectIcon className="size-8 text-stone-500" />
              <span className="text-xs text-stone-400">size-8</span>
            </div>
          </div>
        </section>

        {/* 8. LED Indicators */}
        <section id="led-indicators" className="p-12">
          <SectionLabel>LED Indicators</SectionLabel>
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <span className="hw-selector-led" />
              <span className="text-xs text-stone-400">Amber LED</span>
            </div>
            <div>
              <p className="mb-2 text-xs text-stone-400">Selector Buttons with LED</p>
              <div className="flex gap-1">
                <button className="hw-btn hw-selector-btn">
                  <span>H1</span>
                  <span className="hw-selector-led" />
                </button>
                <button className="hw-btn hw-selector-btn">
                  <span>H2</span>
                </button>
                <button className="hw-btn hw-selector-btn" data-active="true">
                  <span>H3</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 9. Color Palette */}
        <section id="color-palette" className="p-12">
          <SectionLabel>Color Palette</SectionLabel>
          <div className="flex gap-6">
            {[
              { color: 'oklch(0.95 0.003 80)', label: 'Light Surface' },
              { color: 'oklch(0.89 0.003 80)', label: 'Light Pressed' },
              { color: 'oklch(0.80 0.005 80)', label: 'Border' },
              { color: 'oklch(0.30 0.005 60)', label: 'Dark Text' },
            ].map(({ color, label }) => (
              <div key={label} className="flex flex-col items-center gap-2">
                <div
                  className="rounded-full border border-stone-300"
                  style={{ width: 48, height: 48, backgroundColor: color }}
                />
                <span className="text-xs text-stone-400">{label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 10. Embossed Text */}
        <section id="embossed-text" className="p-12">
          <SectionLabel>Embossed Text</SectionLabel>
          <div
            className="flex items-center justify-center rounded-lg bg-stone-300"
            style={{
              width: 120,
              height: 48,
              boxShadow:
                '0 1px 2px oklch(0 0 0 / 10%), 0 2px 4px oklch(0 0 0 / 6%), inset 0 1px 0 oklch(1 0 0 / 50%), inset 0 -1px 0 oklch(0 0 0 / 8%)',
            }}
          >
            <span className="slider-embossed-text text-sm font-semibold">16px</span>
          </div>
        </section>

      </div>
    </div>
  )
}
