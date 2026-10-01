'use client'

import { useEffect, useRef, useState } from 'react'
import {
  GroupStack,
  HalfMoonDeck,
  SilkscreenDeck,
  StripDeck,
  TrimDeck,
  useRig,
  type Lamp,
  type Rig,
} from '@/components/showcase/compact-controls'

/** Heights of the same sections in the app today, auto balance off. */
const NOW = { deck: 246, groups: 427 }

interface Variant {
  id: string
  title: string
  idea: string
  notes: string[]
  Deck: (props: { rig: Rig }) => React.ReactNode
  lamp: Lamp
  merged?: boolean
  base: number
  ratio: number
}

const VARIANTS: Variant[] = [
  {
    id: 'trim',
    title: 'Trim',
    idea: 'The same parts at about three quarters the size. Nothing moves.',
    notes: [
      'Dial: 104px knob, same arc, same labels. Fader drops from 184 to 124px.',
      'Lamp: steady, at the randomizer’s full bloom.',
      'Headings and Body stay as two modules.',
    ],
    Deck: TrimDeck,
    lamp: 'steady',
    base: 16,
    ratio: 2,
  },
  {
    id: 'silkscreen',
    title: 'Silkscreen',
    idea: 'The caption row goes. Labels are printed on the panel beside the hardware.',
    notes: [
      'Dial: 96px knob. The arc is centred on the knob, so the pointer aims straight at its label.',
      'Lamp: breathes. The randomizer’s pulse, slowed to a resting pace.',
      'Headings and Body stay as two modules.',
    ],
    Deck: SilkscreenDeck,
    lamp: 'breathe',
    base: 18,
    ratio: 3,
  },
  {
    id: 'half-moon',
    title: 'Half moon',
    idea: 'A bigger knob sunk into the seam, with the ratios fanned over its crown. The fader lies down.',
    notes: [
      'Dial: drag sideways, scroll, or click a label. Labels get more room here than on the arc.',
      'Lamp: steady, tight halo. Less spill onto the font display next to it. This is the lamp the app uses.',
      'Headings and Body share one module, font displays lined up.',
    ],
    Deck: HalfMoonDeck,
    lamp: 'tight',
    merged: true,
    base: 16,
    ratio: 4,
  },
  {
    id: 'strip',
    title: 'Strip',
    idea: 'No arc. A small knob with a readout beside it. Shortest of the four.',
    notes: [
      'Dial: turn, scroll or use the arrow keys. You lose click-a-label-to-jump.',
      'Lamp: catches with a flicker when switched on, then holds steady.',
      'Headings and Body share one module.',
    ],
    Deck: StripDeck,
    lamp: 'strike',
    merged: true,
    base: 14,
    ratio: 5,
  },
]

function useHeight() {
  const ref = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState<number | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new ResizeObserver(() => setHeight(Math.round(el.getBoundingClientRect().height)))
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return [ref, height] as const
}

function Measure({ label, height, now }: { label: string; height: number | null; now: number }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-stone-800 py-1.5 text-xs">
      <span className="text-stone-400">{label}</span>
      <span className="tabular-nums text-stone-200">
        {height ?? '–'}px <span className="text-stone-500">· now {now}px</span>
      </span>
    </div>
  )
}

function VariantRow({ variant, letter }: { variant: Variant; letter: string }) {
  const rig = useRig({ base: variant.base, ratio: variant.ratio })
  const [deckRef, deckHeight] = useHeight()
  const [groupsRef, groupsHeight] = useHeight()

  return (
    <section id={variant.id} className="flex flex-wrap items-start gap-x-10 gap-y-6">
      {/* clip, not hidden: folded dials still overflow, and a hidden box would scroll to them on focus */}
      <div className="surface-noise relative w-[360px] shrink-0 overflow-clip rounded-lg bg-background shadow-[0_8px_30px_oklch(0_0_0/35%)]">
        <div className="relative z-[2]">
          <div ref={deckRef} className="px-4">
            <variant.Deck rig={rig} />
          </div>
          <div className="module-groove" />
          <div ref={groupsRef}>
            <GroupStack rig={rig} lamp={variant.lamp} merged={variant.merged} />
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
        <div>
          <Measure label="Base Size + Scale" height={deckHeight} now={NOW.deck} />
          <Measure label="Headings + Body" height={groupsHeight} now={NOW.groups} />
        </div>
      </div>
    </section>
  )
}

export default function ShowcaseCompactControlsPage() {
  return (
    <div className="dark" style={{ colorScheme: 'dark' }}>
      <div className="min-h-screen bg-[oklch(0.15_0.005_60)] px-6 py-16 text-foreground">
        <div className="mx-auto flex max-w-4xl flex-col gap-16">
          <header className="max-w-xl">
            <p className="text-xs uppercase tracking-widest text-stone-500">Compact controls</p>
            <p className="mt-2 text-sm text-stone-200">
              Auto balance starts on, and the four dials stay folded away while it is. The lit key says it is on. Press
              it to switch auto off and the dials come back.
            </p>
            <p className="mt-2 text-xs leading-relaxed text-stone-400">
              Base Size and Scale get shorter in four steps. The dial, the lamp and the one-or-two-module layout are
              independent, so you can take each from a different option. Heights on the right are measured live.
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
