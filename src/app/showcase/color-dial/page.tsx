'use client'

import { CompassDial } from '@/components/showcase/color-dial/compass-dial'
import { DrumDial } from '@/components/showcase/color-dial/drum-dial'
import { PocketDial } from '@/components/showcase/color-dial/pocket-dial'
import { SlideRuleDial } from '@/components/showcase/color-dial/slide-rule-dial'
import { BANDS, useTuner, type Station, type Tuner } from '@/components/showcase/color-dial/tuner'

interface Variant {
  id: string
  title: string
  idea: string
  notes: string[]
  Dial: (props: { tuner: Tuner }) => React.ReactNode
  wrap?: boolean
  band: number
  start: number
}

const VARIANTS: Variant[] = [
  {
    id: 'slide-rule',
    title: 'Slide rule',
    idea: 'The reference radio. Three scales stacked under one needle that travels the glass.',
    notes: [
      'Band: piano keys, lamp over the one that is down.',
      'Tune: knob on the right. Click or drag the glass to jump.',
      'Most like the photo. Needs the most width per row, so numbers thin out where presets bunch up.',
    ],
    Dial: SlideRuleDial,
    band: 0,
    start: 0.28,
  },
  {
    id: 'drum',
    title: 'Drum',
    idea: 'The needle stays put and the tape scrolls. The bands sit on a drum that rolls.',
    notes: [
      'Band: rotary selector, or click the row peeking above or below.',
      'Tune: thumbwheel, or drag the tape itself. It loops, since hue is a circle.',
      'Each preset is a chip in its own colors, so you can see what is coming before you land on it.',
    ],
    Dial: DrumDial,
    wrap: true,
    band: 1,
    start: 0.6,
  },
  {
    id: 'compass',
    title: 'Compass',
    idea: 'Three concentric arcs. The needle pivots on the tuning knob, like the VU meters below it.',
    notes: [
      'Band: one key steps through them, a lamp per band. Clicking an arc works too.',
      'Tune: centre knob, or the step keys for exactly one preset.',
      'Ticks on the lit band take their hue. Tallest of the four.',
    ],
    Dial: CompassDial,
    band: 2,
    start: 0.42,
  },
  {
    id: 'pocket',
    title: 'Pocket',
    idea: 'A pocket transistor strip. Smallest footprint, closest to the button row it replaces.',
    notes: [
      'Band: slide switch whose thumb sits level with the row it lights.',
      'Tune: edge-on thumbwheel. Scan jumps to a random preset, which keeps the old shuffle.',
      'Each baseline is painted in the hues it runs through.',
    ],
    Dial: PocketDial,
    band: 1,
    start: 0.74,
  },
]

/** The picker keys that stay in the Colors module, showing what the dial tuned in. */
function ColorKeys({ station }: { station: Station }) {
  const keys = [
    { label: 'Head', background: station.heading },
    { label: 'Body', background: station.body },
    { label: 'BG', background: station.bg },
    { label: 'Swap', background: `linear-gradient(135deg, ${station.heading} 50%, ${station.bg} 50%)` },
  ]
  return (
    <div className="hw-btn-group pointer-events-none flex" aria-hidden>
      {keys.map(({ label, background }) => (
        <span key={label} className="hw-btn hw-selector-btn flex-1 flex-col justify-end !gap-0.5 pb-1.5" style={{ height: 52 }}>
          <span className="h-2.5 w-8 rounded-sm shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]" style={{ background }} />
          <span className="text-[10px] text-muted-foreground">{label}</span>
        </span>
      ))}
    </div>
  )
}

function VariantRow({ variant, letter }: { variant: Variant; letter: string }) {
  const tuner = useTuner({ wrap: variant.wrap, band: variant.band, start: variant.start })
  const { station } = tuner
  const band = BANDS[tuner.band]

  return (
    <section id={variant.id} className="flex flex-wrap items-start gap-x-10 gap-y-6">
      <div className="surface-noise relative w-[360px] shrink-0 rounded-lg bg-background p-4 shadow-[0_8px_30px_oklch(0_0_0/35%)]">
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold">Colors</h3>
          <ColorKeys station={station} />
          <div className="mt-2">
            <variant.Dial tuner={tuner} />
          </div>
        </div>
      </div>

      <div className="flex min-w-[280px] max-w-md flex-1 flex-col gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-stone-500">
            {letter} · {variant.title}
          </p>
          <p className="mt-2 text-sm text-stone-200">{variant.idea}</p>
          <ul className="mt-2 flex flex-col gap-1 text-xs leading-relaxed text-stone-400">
            {variant.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-md px-5 py-4 transition-colors duration-200" style={{ background: station.bg }}>
          <p className="text-xl font-semibold leading-tight" style={{ color: station.heading }}>
            {station.name}
          </p>
          <p className="mt-1.5 text-xs leading-relaxed" style={{ color: station.body }}>
            {band.label} band, hue {Math.round(station.hue)}°, preset {tuner.index + 1} of {band.stations.length}. Sphinx of
            black quartz, judge my vow.
          </p>
        </div>
      </div>
    </section>
  )
}

export default function ShowcaseColorDialPage() {
  return (
    <div className="dark" style={{ colorScheme: 'dark' }}>
      <div className="min-h-screen bg-[oklch(0.15_0.005_60)] px-6 py-16 text-foreground">
        <div className="mx-auto flex max-w-4xl flex-col gap-16">
          <header className="max-w-xl">
            <p className="text-xs uppercase tracking-widest text-stone-500">Color dial</p>
            <p className="mt-2 text-sm text-stone-200">
              Soft, Medium and Hard become three bands on one tuning glass. Presets sit along each band in hue order, and
              the numbers are the hue at that point.
            </p>
            <p className="mt-2 text-xs leading-relaxed text-stone-400">
              Drag a knob or wheel, scroll over it, or use the arrow keys. Click the glass to jump. Changing band keeps the
              needle where it is.
            </p>
          </header>
          {VARIANTS.map((variant, i) => (
            <VariantRow key={variant.id} variant={variant} letter={'ABCD'[i]} />
          ))}
        </div>
      </div>
    </div>
  )
}
