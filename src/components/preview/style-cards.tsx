'use client'

import { useEffect, useMemo, useState } from 'react'
import { useComputedScale } from '@/hooks/use-computed-scale'
import { useTypographyStore } from '@/store/typography-store'
import { useUIStore } from '@/store/ui-store'
import { COPY_SETS } from '@/data/copy-sets'
import { fetchFontOptions, getFontLabel, getFontStack } from '@/lib/fonts'
import { BODY_ELEMENTS } from '@/types/typography'
import type { ResolvedElementStyle, TypographyElement } from '@/types/typography'

const CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789 !?&@#$%*()“”'

const MAX_SCALE_ROW_REM = 3.75

type Sample = 'short' | 'long' | 'body' | 'eyebrow'

const SCALE_ROWS: { element: TypographyElement; label: string; sample: Sample }[] = [
  { element: 'display-1', label: 'Display 1', sample: 'short' },
  { element: 'display-2', label: 'Display 2', sample: 'short' },
  { element: 'display-3', label: 'Display 3', sample: 'short' },
  { element: 'h1', label: 'Heading 1', sample: 'short' },
  { element: 'h2', label: 'Heading 2', sample: 'short' },
  { element: 'h3', label: 'Heading 3', sample: 'long' },
  { element: 'h4', label: 'Heading 4', sample: 'long' },
  { element: 'h5', label: 'Heading 5', sample: 'long' },
  { element: 'h6', label: 'Heading 6', sample: 'long' },
  { element: 'p', label: 'Paragraph', sample: 'body' },
  { element: 'small', label: 'Small', sample: 'body' },
  { element: 'eyebrow', label: 'Eyebrow', sample: 'eyebrow' },
]

const PAIRING_LEVELS = [
  { element: 'h2', label: 'H2 + paragraph', max: 2.5 },
  { element: 'h3', label: 'H3 + paragraph', max: 1.875 },
  { element: 'h4', label: 'H4 + paragraph', max: 1.375 },
] as const

const GLYPHS = [
  ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  ...'abcdefghijklmnopqrstuvwxyz',
  ...'0123456789',
  ...'&@?!%$€£#*()[]{}‘’“”«»–—',
  ...'ÁÇÉÑÖØÜßàçéñöøüœ',
]

const WEIGHT_NAMES: Record<number, string> = {
  100: 'Thin',
  200: 'Extralight',
  300: 'Light',
  400: 'Regular',
  500: 'Medium',
  600: 'Semibold',
  700: 'Bold',
  800: 'Extrabold',
  900: 'Black',
}

// Used until the catalog answers, and for families it has no weights for.
const FALLBACK_WEIGHTS = [300, 400, 600, 700]

const MONO = 'var(--font-geist-mono), ui-monospace, monospace'

function findStyle(
  styles: ResolvedElementStyle[],
  element: string
): ResolvedElementStyle | undefined {
  return styles.find((s) => s.element === element)
}

/** Picks up to `max` weights, always keeping the lightest and heaviest. */
function pickWeights(weights: number[], max: number): number[] {
  const sorted = [...new Set(weights)].sort((a, b) => a - b)
  if (sorted.length <= max) return sorted
  const step = (sorted.length - 1) / (max - 1)
  return Array.from({ length: max }, (_, i) => sorted[Math.round(i * step)])
}

function dim(color: string, pct: number) {
  return `color-mix(in srgb, ${color} ${pct}%, transparent)`
}

function Label({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <span
      className="text-[10px] font-medium uppercase tracking-[0.14em]"
      style={{ color: dim(color, 55), fontFamily: MONO }}
    >
      {children}
    </span>
  )
}

function SectionHeader({
  index,
  title,
  note,
  color,
}: {
  index: string
  title: string
  note?: string
  color: string
}) {
  return (
    <div
      className="flex items-baseline justify-between gap-4 pt-3"
      style={{ borderTop: `1px solid ${dim(color, 22)}` }}
    >
      <div className="flex items-baseline gap-3">
        <Label color={color}>{index}</Label>
        <span className="text-[10px] font-medium uppercase tracking-[0.14em]" style={{ color, fontFamily: MONO }}>
          {title}
        </span>
      </div>
      {note && <Label color={color}>{note}</Label>}
    </div>
  )
}

/** A family's weights, each setting the same word, lightest first. */
function WeightStack({
  fontFamily,
  weights,
  word,
  color,
  columns,
}: {
  fontFamily: string
  weights: number[]
  word: string
  color: string
  columns?: boolean
}) {
  return (
    <div className={columns ? 'grid gap-x-8 @3xl:grid-cols-3' : 'flex flex-col'}>
      {weights.map((weight) => (
        <div
          key={weight}
          className="flex items-baseline justify-between gap-4 py-1.5"
          style={{ borderBottom: `1px solid ${dim(color, 8)}` }}
        >
          <span
            className="min-w-0 truncate text-[1.75rem] leading-tight"
            style={{ fontFamily: getFontStack(fontFamily), fontWeight: weight, color }}
          >
            {word}
          </span>
          <Label color={color}>
            {weight} {WEIGHT_NAMES[weight] ?? ''}
          </Label>
        </div>
      ))}
    </div>
  )
}

function Family({
  role,
  fontFamily,
  weight,
  weights,
  word,
  color,
  solo,
}: {
  role: string
  fontFamily: string
  weight: number
  weights: number[]
  word: string
  color: string
  solo?: boolean
}) {
  const stack = getFontStack(fontFamily)

  return (
    <div className={`flex min-w-0 flex-col gap-6 ${solo ? '@3xl:col-span-2' : ''}`}>
      <div className={`grid items-end gap-x-8 gap-y-2 ${solo ? '@3xl:grid-cols-[auto_1fr]' : 'grid-cols-[auto_1fr]'}`}>
        <div
          className="select-none"
          style={{ fontFamily: stack, fontWeight: weight, fontSize: solo ? '10rem' : '7.5rem', lineHeight: 0.8, color }}
        >
          Aa
        </div>
        <div className="flex min-w-0 flex-col gap-1 pb-1">
          <Label color={color}>{role}</Label>
          <span className="truncate text-2xl leading-tight" style={{ fontFamily: stack, fontWeight: weight, color }}>
            {getFontLabel(fontFamily)}
          </span>
          <Label color={color}>
            {weights.length} {weights.length === 1 ? 'weight' : 'weights'} shown / set in {weight}
          </Label>
        </div>
      </div>
      <WeightStack fontFamily={fontFamily} weights={weights} word={word} color={color} columns={solo} />
      <p
        className="text-[0.9375rem] leading-relaxed break-words"
        style={{ fontFamily: stack, fontWeight: weight, color: dim(color, 80) }}
      >
        {CHARSET}
      </p>
    </div>
  )
}

function GlyphGrid({
  role,
  fontFamily,
  weight,
  color,
}: {
  role: string
  fontFamily: string
  weight: number
  color: string
}) {
  const stack = getFontStack(fontFamily)
  return (
    <div className="grid gap-6 @3xl:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
      <div
        className="flex min-h-64 flex-col justify-between rounded-sm p-5"
        style={{ backgroundColor: dim(color, 5) }}
      >
        <div className="flex items-baseline justify-between gap-4">
          <Label color={color}>{role}</Label>
          <Label color={color}>U+0026</Label>
        </div>
        <div
          className="select-none text-center"
          style={{ fontFamily: stack, fontWeight: weight, fontSize: '11rem', lineHeight: 1, color }}
        >
          &amp;
        </div>
        <span className="text-sm" style={{ fontFamily: stack, color }}>
          {getFontLabel(fontFamily)}
        </span>
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(2.75rem,1fr))] gap-px self-start">
        {GLYPHS.map((glyph, i) => (
          <div
            key={`${glyph}-${i}`}
            className="flex aspect-square items-center justify-center text-[1.375rem]"
            style={{ fontFamily: stack, fontWeight: weight, color, backgroundColor: dim(color, 5) }}
          >
            {glyph}
          </div>
        ))}
      </div>
    </div>
  )
}

/** `mobile` draws it at the mobile scale, for the phone preview. */
export function StyleCards({ mobile = false }: { mobile?: boolean }) {
  const computed = useComputedScale()
  const desktop = mobile ? computed.mobile : computed.desktop
  const backgroundColor = useTypographyStore((s) => s.backgroundColor)
  const headingsGroup = useTypographyStore((s) => s.headingsGroup)
  const bodyGroup = useTypographyStore((s) => s.bodyGroup)
  const copyIndex = useUIStore((s) => s.copyIndex)
  const copySet = COPY_SETS[copyIndex] ?? COPY_SETS[0]
  const copy = copySet.specimen
  const [catalogWeights, setCatalogWeights] = useState<Map<string, number[]>>(new Map())

  const styles = useMemo(() => {
    return {
      h1: findStyle(desktop, 'h1'),
      h2: findStyle(desktop, 'h2'),
      h3: findStyle(desktop, 'h3'),
      h4: findStyle(desktop, 'h4'),
      p: findStyle(desktop, 'p'),
      small: findStyle(desktop, 'small'),
      eyebrow: findStyle(desktop, 'eyebrow'),
      display1: findStyle(desktop, 'display-1'),
    }
  }, [desktop])

  // Every row of the waterfall is shrunk by one factor, so the ramp keeps its proportions.
  const { scaleRows, scaleK } = useMemo(() => {
    const rows = SCALE_ROWS.flatMap((row) => {
      const style = findStyle(desktop, row.element)
      return style ? [{ row, style, isHeading: !BODY_ELEMENTS.includes(row.element) }] : []
    })
    const largest = Math.max(...rows.map((r) => r.style.fontSizeRem), 1)
    return { scaleRows: rows, scaleK: Math.min(1, MAX_SCALE_ROW_REM / largest) }
  }, [desktop])

  const headingFont = headingsGroup.fontFamily
  const bodyFont = bodyGroup.fontFamily
  const headingColor = headingsGroup.color
  const bodyColor = bodyGroup.color
  const same = headingFont === bodyFont

  useEffect(() => {
    let cancelled = false
    fetchFontOptions()
      .then((options) => {
        if (cancelled) return
        setCatalogWeights(new Map(options.map((o) => [o.family, o.weights])))
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  const weightsFor = (family: string, max: number) => {
    const known = catalogWeights.get(family)
    return pickWeights(known?.length ? known : FALLBACK_WEIGHTS, max)
  }

  const samples: Record<Sample, string> = {
    short: copy.scaleShort,
    long: copy.scaleLong,
    body: copy.scaleBody,
    eyebrow: copy.scaleEyebrow,
  }
  const heroStyle = styles.display1 ?? styles.h1
  const pSize = Math.min(styles.p?.fontSizeRem ?? 1, 1.0625)
  const bodyStyle = {
    fontFamily: getFontStack(bodyFont),
    fontWeight: styles.p?.fontWeight ?? bodyGroup.fontWeight,
    lineHeight: styles.p?.lineHeight ?? bodyGroup.lineHeight,
    letterSpacing: `${styles.p?.letterSpacing ?? bodyGroup.letterSpacing}em`,
    wordSpacing: `${styles.p?.wordSpacing ?? bodyGroup.wordSpacing}em`,
    color: bodyColor,
  }
  const headingStyle = (style: ResolvedElementStyle | undefined, maxRem: number, fallbackRem: number) => ({
    fontFamily: getFontStack(headingFont),
    fontWeight: style?.fontWeight ?? headingsGroup.fontWeight,
    fontSize: `${Math.min(style?.fontSizeRem ?? fallbackRem, maxRem)}rem`,
    lineHeight: style?.lineHeight ?? headingsGroup.lineHeight,
    letterSpacing: `${style?.letterSpacing ?? headingsGroup.letterSpacing}em`,
    wordSpacing: `${style?.wordSpacing ?? headingsGroup.wordSpacing}em`,
    color: headingColor,
  })

  return (
    <div className="@container w-full overflow-hidden" style={{ backgroundColor }}>
      <div className="mx-auto flex max-w-[1200px] flex-col gap-20 px-6 pt-6 pb-16 @3xl:px-10">
        {/* Cover */}
        <header className="flex flex-col gap-10">
          <div className="flex items-baseline justify-between gap-4">
            <Label color={headingColor}>Type specimen</Label>
            <Label color={headingColor}>{copySet.name}</Label>
          </div>
          <h1
            className="[text-wrap:balance]"
            style={{
              fontFamily: getFontStack(headingFont),
              fontWeight: heroStyle?.fontWeight ?? headingsGroup.fontWeight,
              fontSize: 'clamp(3.5rem, 13cqi, 11rem)',
              lineHeight: 0.92,
              letterSpacing: `${Math.min(heroStyle?.letterSpacing ?? 0, 0) - 0.02}em`,
              color: headingColor,
            }}
          >
            {copy.hero}
          </h1>
          <div className="grid gap-x-10 gap-y-6 @3xl:grid-cols-[1fr_1fr_2fr]">
            <div className="flex flex-col gap-1">
              <Label color={headingColor}>Headings</Label>
              <span className="text-lg" style={{ fontFamily: getFontStack(headingFont), color: headingColor }}>
                {getFontLabel(headingFont)}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <Label color={bodyColor}>Body</Label>
              <span className="text-lg" style={{ fontFamily: getFontStack(bodyFont), color: bodyColor }}>
                {getFontLabel(bodyFont)}
              </span>
            </div>
            <p style={{ ...bodyStyle, fontSize: `${Math.min((styles.h3?.fontSizeRem ?? 1.5) * 0.75, 1.25)}rem` }}>
              {copy.lead}
            </p>
          </div>
        </header>

        {/* 01 Families */}
        <section className="flex flex-col gap-8">
          <SectionHeader index="01" title="Families" color={headingColor} />
          <div className="grid gap-x-14 gap-y-14 @3xl:grid-cols-2">
            {same ? (
              <Family
                role="Headings and body"
                fontFamily={headingFont}
                weight={headingsGroup.fontWeight}
                weights={weightsFor(headingFont, 9)}
                word={copy.rampWord}
                color={headingColor}
                solo
              />
            ) : (
              <>
                <Family
                  role="Headings"
                  fontFamily={headingFont}
                  weight={headingsGroup.fontWeight}
                  weights={weightsFor(headingFont, 5)}
                  word={copy.rampWord}
                  color={headingColor}
                />
                <Family
                  role="Body"
                  fontFamily={bodyFont}
                  weight={bodyGroup.fontWeight}
                  weights={weightsFor(bodyFont, 5)}
                  word={copy.rampWord}
                  color={bodyColor}
                />
              </>
            )}
          </div>
        </section>

        {/* 02 Type scale */}
        <section className="flex flex-col gap-4">
          <SectionHeader
            index="02"
            title="Type scale"
            note={scaleK < 1 ? `Shown at ${Math.round(scaleK * 100)}%` : undefined}
            color={headingColor}
          />
          <div className="flex flex-col">
            {scaleRows.map(({ row, style, isHeading }) => {
              const font = isHeading ? headingFont : bodyFont
              const color = isHeading ? headingColor : bodyColor
              return (
                <div
                  key={row.element}
                  className="grid items-baseline gap-x-8 gap-y-1 py-4 @3xl:grid-cols-[1fr_9rem]"
                  style={{ borderBottom: `1px solid ${dim(headingColor, 8)}` }}
                >
                  <p
                    className="min-w-0"
                    style={{
                      fontFamily: getFontStack(font),
                      fontWeight: style.fontWeight,
                      fontSize: `${style.fontSizeRem * scaleK}rem`,
                      lineHeight: style.lineHeight,
                      letterSpacing: `${style.letterSpacing}em`,
                      wordSpacing: `${style.wordSpacing}em`,
                      textTransform: style.textTransform as React.CSSProperties['textTransform'],
                      color,
                    }}
                  >
                    {samples[row.sample]}
                  </p>
                  <div className="flex gap-3 @3xl:flex-col @3xl:items-end @3xl:gap-0.5">
                    <Label color={color}>{row.label}</Label>
                    <Label color={color}>
                      {Math.round(style.fontSize)} / {style.lineHeight} / {style.fontWeight}
                    </Label>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* 03 Text setting */}
        <section className="flex flex-col gap-10">
          <SectionHeader index="03" title="Text setting" color={headingColor} />
          <div className="grid gap-x-14 gap-y-8 @3xl:grid-cols-[5fr_7fr]">
            <div className="flex min-w-0 flex-col gap-5">
              <span
                style={{
                  fontFamily: getFontStack(bodyFont),
                  fontWeight: styles.eyebrow?.fontWeight ?? 600,
                  fontSize: `${styles.eyebrow?.fontSizeRem ?? 0.75}rem`,
                  letterSpacing: `${styles.eyebrow?.letterSpacing ?? 0.12}em`,
                  textTransform: 'uppercase',
                  color: dim(bodyColor, 70),
                }}
              >
                {copy.article.eyebrow}
              </span>
              <h2 style={headingStyle(styles.h2, 2.75, 2)}>{copy.article.title}</h2>
              <p
                style={{
                  ...bodyStyle,
                  fontSize: `${Math.min((styles.h3?.fontSizeRem ?? 1.5) * 0.8, 1.25)}rem`,
                  color: dim(bodyColor, 80),
                }}
              >
                {copy.article.standfirst}
              </p>
            </div>
            <div className="min-w-0 gap-x-8 @2xl:columns-2">
              {copy.article.paragraphs.map((text, i) => (
                <p
                  key={i}
                  className={`${i > 0 ? 'mt-3' : ''} break-inside-avoid-column hyphens-auto`}
                  style={{ ...bodyStyle, fontSize: `${pSize}rem` }}
                >
                  {text}
                </p>
              ))}
            </div>
          </div>
          <blockquote
            className="mx-auto max-w-[22em] text-center [text-wrap:balance]"
            style={headingStyle(styles.h2, 2.75, 2)}
          >
            {copy.article.pullQuote}
          </blockquote>
          <div className="gap-x-8 @2xl:columns-2 @4xl:columns-3">
            {copy.article.notes.map((text, i) => (
              <p
                key={i}
                className={`${i > 0 ? 'mt-3' : ''} break-inside-avoid-column hyphens-auto`}
                style={{
                  ...bodyStyle,
                  fontSize: `${styles.small?.fontSizeRem ?? 0.875}rem`,
                  lineHeight: styles.small?.lineHeight ?? bodyGroup.lineHeight,
                  color: dim(bodyColor, 80),
                }}
              >
                {text}
              </p>
            ))}
          </div>
        </section>

        {/* 04 Glyphs */}
        <section className="flex flex-col gap-8">
          <SectionHeader index="04" title="Glyphs" color={headingColor} />
          <GlyphGrid
            role={same ? 'Headings and body' : 'Headings'}
            fontFamily={headingFont}
            weight={headingsGroup.fontWeight}
            color={headingColor}
          />
          {!same && (
            <GlyphGrid role="Body" fontFamily={bodyFont} weight={bodyGroup.fontWeight} color={bodyColor} />
          )}
        </section>

        {/* 05 Pairing */}
        <section className="flex flex-col gap-8">
          <SectionHeader index="05" title="Pairing" color={headingColor} />
          <div className="grid gap-x-10 gap-y-10 @3xl:grid-cols-3">
            {PAIRING_LEVELS.map(({ element, label, max }, i) => (
              <div key={element} className="flex min-w-0 flex-col gap-3">
                <Label color={bodyColor}>{label}</Label>
                <h3 style={headingStyle(styles[element], max, 1.5)}>{copy.pairingTitles[i]}</h3>
                <p style={{ ...bodyStyle, fontSize: `${pSize}rem` }}>{copy.pairingBody}</p>
              </div>
            ))}
          </div>
          <div className="grid gap-x-10 gap-y-6 pt-6 @3xl:grid-cols-2">
            <p style={{ ...bodyStyle, fontSize: `${pSize}rem` }}>{copy.paragraph}</p>
            <p className="italic" style={{ ...bodyStyle, fontSize: `${pSize * 1.15}rem` }}>
              {copy.quote}
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
