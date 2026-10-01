'use client'

import { useMemo, useState } from 'react'
import { Check } from 'lucide-react'
import { HARDNESS_CUTS, type Colorway, type ColorwayBucket, type ColorwaySource } from '@/data/soft-colors'
import { COLORWAYS, contrastRatio, hexToOklch, hexToRgb } from '@/lib/color-utils'
import { cn } from '@/lib/utils'

const BUCKETS: { id: ColorwayBucket; label: string; range: string }[] = [
  { id: 'soft', label: 'Soft', range: `hardness under ${HARDNESS_CUTS.softBelow}` },
  { id: 'med', label: 'Medium', range: `${HARDNESS_CUTS.softBelow} to ${HARDNESS_CUTS.hardFrom}` },
  { id: 'hard', label: 'Hard', range: `${HARDNESS_CUTS.hardFrom} and up` },
]

const SOURCES: { id: ColorwaySource | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'specimen', label: 'Specimens' },
  { id: 'alex-cristache', label: 'Alex Cristache' },
]

const SORTS = [
  { id: 'hardness', label: 'Hardness' },
  { id: 'hue', label: 'Hue' },
] as const

type Sort = (typeof SORTS)[number]['id']

/** Within this share of a cut line, a colorway could reasonably sit on either side. */
const NEAR = 0.12

interface Row extends Colorway {
  bodyContrast: number
  headContrast: number
  hue: number
  /** The cut line this colorway sits close to, if any. */
  nearCut: number | null
}

const ROWS: Row[] = COLORWAYS.map((c) => {
  const vivid = [c.bg, c.heading, c.body].map(hexToOklch).reduce((a, b) => (b.c > a.c ? b : a))
  const nearCut =
    [HARDNESS_CUTS.softBelow, HARDNESS_CUTS.hardFrom].find((cut) => Math.abs(c.hardness - cut) / cut <= NEAR) ?? null
  return {
    ...c,
    bodyContrast: contrastRatio(hexToRgb(c.body), hexToRgb(c.bg)),
    headContrast: contrastRatio(hexToRgb(c.heading), hexToRgb(c.bg)),
    hue: vivid.h,
    nearCut,
  }
})

function Selector<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: readonly { id: T; label: string }[]
  value: T
  onChange: (id: T) => void
  label: string
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] uppercase tracking-widest text-stone-500">{label}</span>
      <div className="hw-btn-group flex" role="radiogroup" aria-label={label}>
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={value === o.id}
            data-active={value === o.id ? 'true' : undefined}
            onClick={() => onChange(o.id)}
            className="hw-btn !h-8 text-xs"
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function Swatch({ row, copied, onCopy }: { row: Row; copied: boolean; onCopy: () => void }) {
  return (
    <button
      type="button"
      onClick={onCopy}
      title="Copy name"
      className="group relative flex min-h-40 flex-col rounded-md p-3 md:p-4 text-left shadow-[0_6px_20px_-8px_oklch(0_0_0/60%)] outline-offset-2 transition-transform hover:-translate-y-0.5"
      style={{ background: row.bg }}
    >
      <span className="text-base font-semibold leading-tight md:text-lg" style={{ color: row.heading }}>
        {row.name}
      </span>
      <span className="mt-1.5 text-xs leading-relaxed" style={{ color: row.body }}>
        Sphinx of black quartz, judge my vow. Pack my box with five dozen liquor jugs.
      </span>
      <span
        className="mt-auto flex items-baseline gap-2 pt-3 text-[10px] tabular-nums opacity-80"
        style={{ color: row.body }}
      >
        <span className="text-sm font-semibold">{row.hardness.toFixed(1)}</span>
        <span className="truncate">
          body {row.bodyContrast.toFixed(1)} · head {row.headContrast.toFixed(1)}
        </span>
        <span className="ml-auto uppercase tracking-wider">{row.source === 'specimen' ? 'Spec' : 'Alex'}</span>
      </span>
      {row.nearCut !== null && (
        <span
          className="mt-2 flex w-fit items-center gap-1 rounded-full bg-black/55 px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-amber-200"
          title={`Within ${NEAR * 100}% of the ${row.nearCut} cut line`}
        >
          <span className="hw-selector-led !size-1.5" />
          near {row.nearCut}
        </span>
      )}
      {copied && (
        <span className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1 rounded-b-md bg-black/70 py-1 text-[10px] text-white">
          <Check className="size-3" /> Copied
        </span>
      )}
    </button>
  )
}

export default function ShowcasePalettesPage() {
  const [source, setSource] = useState<ColorwaySource | 'all'>('all')
  const [sort, setSort] = useState<Sort>('hardness')
  const [nearOnly, setNearOnly] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  const buckets = useMemo(() => {
    const rows = ROWS.filter((r) => (source === 'all' || r.source === source) && (!nearOnly || r.nearCut !== null))
    const by = sort === 'hue' ? (a: Row, b: Row) => a.hue - b.hue : (a: Row, b: Row) => a.hardness - b.hardness
    return BUCKETS.map((b) => ({ ...b, rows: rows.filter((r) => r.bucket === b.id).sort(by) }))
  }, [source, sort, nearOnly])

  const copy = (name: string) => {
    navigator.clipboard?.writeText(name).catch(() => {})
    setCopied(name)
    window.setTimeout(() => setCopied((c) => (c === name ? null : c)), 1200)
  }

  return (
    <div className="dark" style={{ colorScheme: 'dark' }}>
      <div className="min-h-screen bg-[oklch(0.15_0.005_60)] pb-24 text-foreground">
        <header className="surface-noise top-0 z-10 md:sticky border-b border-white/5 bg-[oklch(0.18_0.005_60/92%)] px-4 py-4 backdrop-blur md:px-8">
          <div className="mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-x-8 gap-y-4">
            <div className="max-w-xl">
              <p className="text-xs uppercase tracking-widest text-stone-500">Palettes</p>
              <p className="mt-1.5 text-sm text-stone-200">
                Every curated colorway, in the bucket its hardness puts it in.
              </p>
              <p className="mt-1 text-xs leading-relaxed text-stone-400">
                Hardness is ink contrast (body over heading) boosted by saturation, in contrast-ratio units. Cards show
                it large, then the raw contrasts. Click a card to copy its name.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <Selector label="Source" options={SOURCES} value={source} onChange={setSource} />
              <Selector label="Sort" options={SORTS} value={sort} onChange={setSort} />
              <button
                type="button"
                aria-pressed={nearOnly}
                data-active={nearOnly ? 'true' : undefined}
                onClick={() => setNearOnly((v) => !v)}
                className="hw-btn !h-8 gap-2 text-xs"
              >
                <span className={cn('hw-selector-led', !nearOnly && '!bg-black/50 !shadow-none')} />
                Near a cut line
              </button>
            </div>
          </div>
          <nav className="mx-auto mt-3 flex max-w-7xl gap-4 text-xs text-stone-400">
            {buckets.map((b) => (
              <a key={b.id} href={`#${b.id}`} className="hover:text-stone-100">
                {b.label} <span className="tabular-nums text-stone-500">{b.rows.length}</span>
              </a>
            ))}
          </nav>
        </header>

        <main className="mx-auto flex max-w-7xl flex-col gap-16 px-4 pt-10 md:px-8">
          {buckets.map((b) => (
            <section key={b.id} id={b.id} className="scroll-mt-40">
              <div className="mb-5 flex items-baseline gap-3">
                <h2 className="text-2xl font-semibold">{b.label}</h2>
                <span className="text-sm tabular-nums text-stone-400">{b.rows.length}</span>
                <span className="text-xs text-stone-500">{b.range}</span>
              </div>
              {b.rows.length === 0 ? (
                <p className="text-sm text-stone-500">Nothing here with these filters.</p>
              ) : (
                <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-3 md:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] md:gap-4">
                  {b.rows.map((row) => (
                    <Swatch
                      key={`${row.source}-${row.name}-${row.bg}`}
                      row={row}
                      copied={copied === row.name}
                      onCopy={() => copy(row.name)}
                    />
                  ))}
                </div>
              )}
            </section>
          ))}
        </main>
      </div>
    </div>
  )
}
