'use client'

import { Slider } from '@/components/ui/slider'
import { RotaryDial } from '@/components/controls/rotary-dial'
import { RejectedKnob } from '@/components/showcase/rejected-knob'

const EjectIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 16 16" fill="currentColor" className={className}>
    <polygon points="8 3 14 10 2 10" />
    <rect x="2" y="12" width="12" height="1.5" rx="0.5" />
  </svg>
)

export default function ShowcaseDarkPage() {
  return (
    <div className="dark" style={{ colorScheme: 'dark' }}>
      <div className="min-h-screen bg-[oklch(0.15_0.005_60)] flex flex-col items-center py-16 px-4">
        <div className="max-w-2xl w-full flex flex-col gap-8">

          {/* 1. Surface Noise */}
          <section id="noise-texture" className="p-12">
            <p className="text-xs uppercase tracking-widest text-stone-500 mb-4">Surface Noise</p>
            <div
              className="surface-noise relative bg-gradient-to-b from-[oklch(0.22_0.005_60)] to-[oklch(0.19_0.005_60)] rounded-lg p-6"
              style={{ width: 400, height: 200 }}
            >
              <span className="text-xs text-stone-400">Surface Noise</span>
            </div>
          </section>

          {/* 2. Module Grooves */}
          <section id="module-grooves" className="p-12">
            <p className="text-xs uppercase tracking-widest text-stone-500 mb-4">Module Grooves</p>
            <div className="flex flex-col gap-0">
              <div className="bg-[oklch(0.20_0.005_60)] rounded-t-lg p-6">
                <span className="text-xs text-stone-400">Block A</span>
              </div>
              <div className="module-groove" />
              <div className="bg-[oklch(0.20_0.005_60)] rounded-b-lg p-6">
                <span className="text-xs text-stone-400">Block B</span>
              </div>
            </div>
            <div className="flex gap-0 mt-6">
              <div className="bg-[oklch(0.20_0.005_60)] rounded-l-lg p-6 flex-1">
                <span className="text-xs text-stone-400">Left</span>
              </div>
              <div className="module-groove-v" />
              <div className="bg-[oklch(0.20_0.005_60)] rounded-r-lg p-6 flex-1">
                <span className="text-xs text-stone-400">Right</span>
              </div>
            </div>
          </section>

          {/* 3. Hardware Buttons */}
          <section id="hw-buttons" className="p-12">
            <p className="text-xs uppercase tracking-widest text-stone-500 mb-4">Hardware Buttons</p>
            <div className="flex flex-wrap gap-4 items-center">
              <button className="hw-btn">Resting</button>
              <button
                className="hw-btn"
                style={{
                  background: 'linear-gradient(180deg, oklch(0.31 0.005 60) 0%, oklch(0.24 0.005 60) 100%)',
                  color: 'oklch(0.88 0.003 80)',
                  boxShadow: '0 2px 4px oklch(0 0 0 / 55%), 0 5px 10px oklch(0 0 0 / 30%), 0 1px 0 oklch(0 0 0 / 35%), inset 0 1px 0 oklch(1 0 0 / 10%), inset 0 -1px 0 oklch(0 0 0 / 20%)',
                }}
              >
                Hover
              </button>
              <button
                className="hw-btn"
                style={{
                  background: 'linear-gradient(180deg, oklch(0.18 0.005 60) 0%, oklch(0.20 0.005 60) 100%)',
                  boxShadow: 'inset 0 1px 4px oklch(0 0 0 / 50%), inset 0 0 2px oklch(0 0 0 / 30%)',
                }}
              >
                Pressed
              </button>
              <button className="hw-btn" data-active="true">Selected</button>
            </div>
            <div className="mt-6">
              <div className="hw-btn-group">
                <button className="hw-btn" data-active="true">Option A</button>
                <button className="hw-btn">Option B</button>
                <button className="hw-btn">Option C</button>
              </div>
            </div>
          </section>

          {/* 4. Sliders */}
          <section id="sliders" className="p-12">
            <p className="text-xs uppercase tracking-widest text-stone-500 mb-4">Sliders</p>
            <div className="flex flex-col gap-6 max-w-sm">
              <Slider
                value={[16]}
                min={12}
                max={24}
                label="Base Size"
                formatValue={(v) => `${v}px`}
              />
              <Slider
                value={[16]}
                min={12}
                max={24}
                disabled
                disabledText="AUTO"
              />
            </div>
          </section>

          {/* 5. Rotary Dial */}
          <section id="rotary-dial" className="p-12">
            <p className="text-xs uppercase tracking-widest text-stone-500 mb-4">Rotary Dial</p>
            <div style={{ width: 300 }}>
              <RotaryDial value={1.618} onChange={() => {}} />
            </div>
          </section>

          {/* 5b. Rejected Knob */}
          <section id="rejected-knob" className="p-12">
            <p className="text-xs uppercase tracking-widest text-stone-500 mb-4">Rejected Knob (Before)</p>
            <div style={{ width: 300, overflow: 'visible' }}>
              <RejectedKnob />
            </div>
          </section>

          {/* 6. Corner Bolts */}
          <section id="corner-bolts" className="p-12">
            <p className="text-xs uppercase tracking-widest text-stone-500 mb-4">Corner Bolts</p>
            <div
              className="relative surface-noise bg-gradient-to-b from-[oklch(0.22_0.005_60)] to-[oklch(0.19_0.005_60)] rounded-lg flex items-center justify-center"
              style={{ width: 200, height: 120 }}
            >
              <span className="hw-bolt absolute top-2 left-2" />
              <span className="hw-bolt absolute top-2 right-2" />
              <span className="hw-bolt absolute bottom-2 left-2" />
              <span className="hw-bolt absolute bottom-2 right-2" />
              <span className="text-xs text-stone-400">Panel</span>
            </div>
          </section>

          {/* 7. Eject Icons */}
          <section id="eject-icons" className="p-12">
            <p className="text-xs uppercase tracking-widest text-stone-500 mb-4">Eject Icons</p>
            <div className="flex items-end gap-6">
              <EjectIcon className="size-4 text-stone-400" />
              <EjectIcon className="size-6 text-stone-400" />
              <EjectIcon className="size-8 text-stone-400" />
            </div>
          </section>

          {/* 8. LED Indicators */}
          <section id="led-indicators" className="p-12">
            <p className="text-xs uppercase tracking-widest text-stone-500 mb-4">LED Indicators</p>
            <div className="flex items-center gap-6">
              <span className="hw-selector-led" />
              <span className="hw-selector-led" data-active="true" />
              <button className="hw-btn relative">
                <span className="hw-selector-led absolute -top-1 -right-1" data-active="true" />
                With LED
              </button>
            </div>
          </section>

          {/* 9. Color Palette */}
          <section id="color-palette" className="p-12">
            <p className="text-xs uppercase tracking-widest text-stone-500 mb-4">Color Palette</p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { color: 'oklch(0.28 0.005 60)', label: 'Dark Surface' },
                { color: 'oklch(0.21 0.005 60)', label: 'Dark Pressed' },
                { color: 'oklch(0.14 0.005 60)', label: 'Dark Border' },
                { color: 'oklch(0.75 0.003 80)', label: 'Light Text' },
              ].map(({ color, label }) => (
                <div key={label} className="flex items-center gap-3">
                  <div
                    className="size-12 rounded-lg border border-stone-700"
                    style={{ background: color }}
                  />
                  <div>
                    <p className="text-xs text-stone-300 font-mono">{color}</p>
                    <p className="text-xs text-stone-500">{label}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 10. Embossed Text */}
          <section id="embossed-text" className="p-12">
            <p className="text-xs uppercase tracking-widest text-stone-500 mb-4">Embossed Text</p>
            <div
              className="bg-stone-900 rounded-md flex items-center justify-center"
              style={{ width: 120, height: 48 }}
            >
              <span className="slider-embossed-text text-white text-sm font-mono">16px</span>
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}
