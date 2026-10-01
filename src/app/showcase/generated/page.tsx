'use client'

import { useMemo, useState, useSyncExternalStore } from 'react'
import { Shuffle } from 'lucide-react'
import { HARDNESS_CUTS, type ColorwayBucket } from '@/data/soft-colors'
import { contrastRatio, generateRandomColorPair, hexToOklch, hexToRgb, isInSrgbGamut, oklchToHex } from '@/lib/color-utils'
import { cn } from '@/lib/utils'

interface Pair {
  fg: string
  bg: string
}

interface Scored extends Pair {
  contrast: number
  hardness: number
  bucket: ColorwayBucket
}

/**
 * Same score as scripts/build-soft-colors.mjs, for a pair whose heading and
 * body are one ink: contrast, boosted by saturation past a chroma of 0.1.
 */
function score({ fg, bg }: Pair): Scored {
  const contrast = contrastRatio(hexToRgb(fg), hexToRgb(bg))
  const chroma = Math.max(hexToOklch(fg).c, hexToOklch(bg).c)
  const hardness = contrast * (1 + Math.min(1, Math.max(0, (chroma - 0.1) / 0.12)))
  const bucket = hardness < HARDNESS_CUTS.softBelow ? 'soft' : hardness < HARDNESS_CUTS.hardFrom ? 'med' : 'hard'
  return { fg, bg, contrast, hardness, bucket }
}

function mulberry32(seed: number): () => number {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** The color dial's old Hard band: random AA pairs in OKLCH from a fixed seed, alternating dark and light grounds. */
function dialPairs(count: number): Pair[] {
  const random = mulberry32(1977)
  const pick = () => ({ l: random(), c: 0.04 + random() * 0.24, h: random() * 360 })
  const out: Pair[] = []
  while (out.length < count) {
    const a = pick()
    const b = pick()
    if (!isInSrgbGamut(a) || !isInSrgbGamut(b)) continue
    const [dark, light] = [a, b].sort((x, y) => x.l - y.l).map(({ l, c, h }) => oklchToHex(l, c, h))
    if (contrastRatio(hexToRgb(dark), hexToRgb(light)) < 4.5) continue
    out.push(out.length % 2 ? { fg: dark, bg: light } : { fg: light, bg: dark })
  }
  return out
}

const DIAL: Scored[] = dialPairs(120).map(score)
const DEAL_SIZE = 120

/** One press of the old Hard button, DEAL_SIZE times. `round` only forces a new deal. */
function dealPairs(darkBg: boolean, round: number): Scored[] {
  void round
  return Array.from({ length: DEAL_SIZE }, () => score(generateRandomColorPair(darkBg)))
}

const noSubscribe = () => () => {}

const BUCKET_LABEL: Record<ColorwayBucket, string> = { soft: 'Soft', med: 'Med', hard: 'Hard' }

function Tally({ pairs }: { pairs: Scored[] }) {
  return (
    <span className="flex gap-3 text-xs tabular-nums text-stone-400">
      {(['soft', 'med', 'hard'] as const).map((b) => (
        <span key={b}>
          {BUCKET_LABEL[b]} <span className="text-stone-200">{pairs.filter((p) => p.bucket === b).length}</span>
        </span>
      ))}
    </span>
  )
}

function Card({ pair }: { pair: Scored }) {
  return (
    <div
      className="flex min-h-32 flex-col rounded-md p-3 shadow-[0_6px_20px_-8px_oklch(0_0_0/60%)]"
      style={{ background: pair.bg, color: pair.fg }}
    >
      <span className="text-base font-semibold leading-tight">Aa Sphinx</span>
      <span className="mt-1 text-xs leading-relaxed">Judge my vow, black quartz.</span>
      <span className="mt-auto flex items-baseline gap-2 pt-3 text-[10px] tabular-nums opacity-80">
        <span className="text-sm font-semibold">{pair.hardness.toFixed(1)}</span>
        <span className="truncate">{pair.contrast.toFixed(1)}:1</span>
        <span className="ml-auto uppercase tracking-wider">{BUCKET_LABEL[pair.bucket]}</span>
      </span>
      <span className="mt-1 font-mono text-[9px] uppercase opacity-60">
        {pair.fg} / {pair.bg}
      </span>
    </div>
  )
}

function Grid({ pairs }: { pairs: Scored[] }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-3 md:grid-cols-[repeat(auto-fill,minmax(160px,1fr))]">
      {pairs.map((p, i) => (
        <Card key={`${i}-${p.fg}-${p.bg}`} pair={p} />
      ))}
    </div>
  )
}

export default function ShowcaseGeneratedPage() {
  const [darkBg, setDarkBg] = useState(false)
  const [round, setRound] = useState(0)
  const [byHardness, setByHardness] = useState(false)
  // A random deal can't be rendered on the server: its markup would never match the client's
  const isClient = useSyncExternalStore(noSubscribe, () => true, () => false)

  const dealt = useMemo(
    () => (isClient ? dealPairs(darkBg, round) : null),
    [isClient, darkBg, round]
  )

  const order = (pairs: Scored[]) => (byHardness ? [...pairs].sort((a, b) => a.hardness - b.hardness) : pairs)

  return (
    <div className="dark" style={{ colorScheme: 'dark' }}>
      <div className="min-h-screen bg-[oklch(0.15_0.005_60)] px-4 pb-24 pt-10 text-foreground md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-14">
          <header className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
            <div className="max-w-xl">
              <p className="text-xs uppercase tracking-widest text-stone-500">Generated colors</p>
              <p className="mt-1.5 text-sm text-stone-200">
                The two random generators Hard used before it dealt curated colorways. Neither is in play now.
              </p>
              <p className="mt-1 text-xs leading-relaxed text-stone-400">
                Each card shows the hardness the curated set is bucketed by, its contrast, and the bucket it would land in.
              </p>
            </div>
            <button
              type="button"
              aria-pressed={byHardness}
              data-active={byHardness ? 'true' : undefined}
              onClick={() => setByHardness((v) => !v)}
              className="hw-btn !h-8 gap-2 text-xs"
            >
              <span className={cn('hw-selector-led', !byHardness && '!bg-black/50 !shadow-none')} />
              Sort by hardness
            </button>
          </header>

          <section className="flex flex-col gap-5">
            <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
              <div>
                <h2 className="text-2xl font-semibold">
                  Hard button <span className="text-sm font-normal tabular-nums text-stone-400">unlimited</span>
                </h2>
                <p className="mt-1 max-w-xl text-xs leading-relaxed text-stone-400">
                  generateRandomColorPair: random HSL pairs kept at 4.5:1 or better, a new one every press, dark ground in
                  dark mode. One deal of {DEAL_SIZE} below.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                {dealt && <Tally pairs={dealt} />}
                <div className="hw-btn-group flex" role="radiogroup" aria-label="Ground">
                  {[
                    { dark: false, label: 'Light mode' },
                    { dark: true, label: 'Dark mode' },
                  ].map((o) => (
                    <button
                      key={o.label}
                      type="button"
                      role="radio"
                      aria-checked={darkBg === o.dark}
                      data-active={darkBg === o.dark ? 'true' : undefined}
                      onClick={() => setDarkBg(o.dark)}
                      className="hw-btn !h-8 text-xs"
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
                <button type="button" onClick={() => setRound((r) => r + 1)} className="hw-btn !h-8 gap-1.5 text-xs">
                  <Shuffle className="size-3.5" /> Deal again
                </button>
              </div>
            </div>
            {dealt && <Grid pairs={order(dealt)} />}
          </section>

          <section className="flex flex-col gap-5">
            <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
              <div>
                <h2 className="text-2xl font-semibold">
                  Color dial, Hard band <span className="text-sm font-normal tabular-nums text-stone-400">{DIAL.length}</span>
                </h2>
                <p className="mt-1 max-w-xl text-xs leading-relaxed text-stone-400">
                  The fixed set the dial showcase used: random OKLCH pairs at 4.5:1 or better from seed 1977, alternating
                  dark and light grounds. Always these {DIAL.length}.
                </p>
              </div>
              <Tally pairs={DIAL} />
            </div>
            <Grid pairs={order(DIAL)} />
          </section>
        </div>
      </div>
    </div>
  )
}
