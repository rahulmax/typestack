'use client'

import { useEffect, useMemo, useState } from 'react'
import { useComputedScale } from '@/hooks/use-computed-scale'
import { useTypographyStore } from '@/store/typography-store'
import { fetchFontOptions, getFontLabel, getFontStack } from '@/lib/fonts'
import { BODY_ELEMENTS } from '@/types/typography'
import type { ResolvedElementStyle, TypographyElement } from '@/types/typography'

const CHARSET_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz'
const CHARSET_FIGURES = '0123456789 !?&@#$%*()“”'

const HEADING_SAMPLE = 'Veyl, remembered in advance'
const TITLE_SAMPLE = 'The Inverse Almanac'
const LEAD_SAMPLE = 'Adept Varrow entered the tide before it rose, and was paid in arrears.'
const PARAGRAPH_SAMPLE = 'The Concordance holds that every street of Veyl was first a rumour of the sea, and the sea a ledger no one has yet balanced.'
const QUOTE_SAMPLE = '\u201CWhat the Provost of Unlit Rooms forgot, the almanac had already remembered twice.\u201D'

const MAX_SCALE_ROW_REM = 3.75

const SCALE_ROWS: { element: TypographyElement; label: string; sample: string }[] = [
  { element: 'display-1', label: 'Display 1', sample: 'The missing ledger' },
  { element: 'display-2', label: 'Display 2', sample: 'The missing ledger' },
  { element: 'display-3', label: 'Display 3', sample: 'The missing ledger' },
  { element: 'h1', label: 'Heading 1', sample: 'The missing ledger' },
  { element: 'h2', label: 'Heading 2', sample: 'The missing ledger' },
  { element: 'h3', label: 'Heading 3', sample: 'Tidal grammarians catalogue what has not yet occurred' },
  { element: 'h4', label: 'Heading 4', sample: 'Tidal grammarians catalogue what has not yet occurred' },
  { element: 'h5', label: 'Heading 5', sample: 'Tidal grammarians catalogue what has not yet occurred' },
  { element: 'h6', label: 'Heading 6', sample: 'Tidal grammarians catalogue what has not yet occurred' },
  { element: 'p', label: 'Paragraph', sample: 'The Seventh Cartography maps only the places a map has already erased.' },
  { element: 'small', label: 'Small', sample: 'The Seventh Cartography maps only the places a map has already erased.' },
  { element: 'eyebrow', label: 'Eyebrow', sample: 'Veyl / Fragment IV' },
]

const PAIRING_LEVELS = [
  { element: 'h2', label: 'Heading 2 over paragraph', max: 2.5 },
  { element: 'h3', label: 'Heading 3 over paragraph', max: 1.875 },
  { element: 'h4', label: 'Heading 4 over paragraph', max: 1.375 },
] as const
const PAIRING_TITLES = {
  h2: 'The city that filed its flood',
  h3: 'Debts owed to tomorrow',
  h4: 'The Provost of Unlit Rooms',
} as const
const PAIRING_BODY = 'What the Concordance has not yet recorded, the Almanac records twice; between the two entries lies Veyl, and whatever the tide has agreed to forget.'

const ARTICLE_EYEBROW = 'Fragment'
const ARTICLE_TITLE = 'On the ledger of Oriel Taskane'
const ARTICLE_STANDFIRST = 'No one has seen the ledger, yet every debt in Veyl is settled against it, in a currency not yet minted.'
const ARTICLE_PARAGRAPHS = [
  'The tidal grammarians of the Hollow Concordance do not record what has occurred; they record what will have been said of it. Each morning Adept Ilse Varrow descends to the flooded stacks and files, under the rubric of tomorrow, a tide that already recedes.',
  'Oriel Taskane, they insist, never lost the ledger. The ledger lost Taskane, a leaf at a time, until only the edges remained and the edges began to keep accounts of their own, in a hand nobody in Veyl could claim.',
  'Ask the Provost of Unlit Rooms where the ledger is kept and you will be shown a door, and behind the door a second door, and behind that the first, which by then the Seventh Cartography has redrawn as an island.',
]
const ARTICLE_SMALL = [
  'The Inverse Almanac lists eclipses that have been cancelled, harvests that fed no one and a single feast day, unobserved, whose date is revised each time it is remembered.',
  'Cartographers of the Seventh school draw the coast last, and only from the water, since the shore, they maintain, is the sea’s opinion of itself.',
  'Every ledger in Veyl closes with the same entry: a sum carried forward into a year that the Concordance has, with some reluctance, declined to name.',
]
const PULL_QUOTE = '\u201CAn absence, properly indexed, is the most exact of archives.\u201D'

const GLYPH_SETS: { label: string; glyphs: string }[] = [
  { label: 'Capitals', glyphs: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' },
  { label: 'Lowercase', glyphs: 'abcdefghijklmnopqrstuvwxyz' },
  { label: 'Figures', glyphs: '0123456789 $\u00A3\u20AC%+\u2212\u00D7\u00F7=' },
  { label: 'Punctuation', glyphs: '.,:;!?&@#*()[]{}/\\|\u2013\u2014\u2018\u2019\u201C\u201D\u00AB\u00BB' },
  { label: 'Accents', glyphs: '\u00C0\u00C1\u00C2\u00C3\u00C4\u00C5\u00C6\u00C7\u00C8\u00C9\u00CA\u00CB\u00D1\u00D6\u00D8\u0152\u00DC\u00DF \u00E0\u00E1\u00E2\u00E3\u00E4\u00E5\u00E6\u00E7\u00E8\u00E9\u00EA\u00EB\u00F1\u00F6\u00F8\u0153\u00FC' },
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

function Rule({ color }: { color: string }) {
  return <div className="h-px w-full" style={{ backgroundColor: dim(color, 25) }} />
}

function Label({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <span
      className="text-[10px] font-medium uppercase tracking-[0.14em]"
      style={{ color: dim(color, 55), fontFamily: 'var(--font-geist-mono), ui-monospace, monospace' }}
    >
      {children}
    </span>
  )
}

function WeightRamp({
  fontFamily,
  weights,
  color,
}: {
  fontFamily: string
  weights: number[]
  color: string
}) {
  return (
    <div className="flex gap-x-5 gap-y-2">
      {weights.map((weight) => (
        <div key={weight} className="flex min-w-0 flex-col gap-1">
          <span
            className="text-[1.75rem] leading-none"
            style={{ fontFamily: getFontStack(fontFamily), fontWeight: weight, color }}
          >
            Ag
          </span>
          <Label color={color}>{WEIGHT_NAMES[weight] ?? weight}</Label>
        </div>
      ))}
    </div>
  )
}

function Specimen({
  role,
  fontFamily,
  weight,
  weights,
  color,
  glyphSize,
}: {
  role: string
  fontFamily: string
  weight: number
  weights: number[]
  color: string
  glyphSize: string
}) {
  const stack = getFontStack(fontFamily)

  return (
    <div className="flex min-w-0 flex-col gap-3">
      <Rule color={color} />
      <div className="flex items-baseline justify-between gap-4">
        <Label color={color}>{role}</Label>
        <span className="overflow-hidden whitespace-nowrap text-sm" style={{ fontFamily: stack, color }}>
          {getFontLabel(fontFamily)}
        </span>
      </div>
      <div
        className="select-none"
        style={{
          fontFamily: stack,
          fontWeight: weight,
          fontSize: glyphSize,
          lineHeight: 0.95,
          color,
        }}
      >
        Aa
      </div>
      <WeightRamp fontFamily={fontFamily} weights={weights} color={color} />
      <div
        className="space-y-0.5 text-[0.8125rem] leading-snug"
        style={{ fontFamily: stack, fontWeight: weight, color: dim(color, 85) }}
      >
        <p className="overflow-hidden whitespace-nowrap [mask-image:linear-gradient(to_right,#000_90%,transparent)]">{CHARSET_LETTERS}</p>
        <p className="overflow-hidden whitespace-nowrap [mask-image:linear-gradient(to_right,#000_90%,transparent)]">{CHARSET_FIGURES}</p>
      </div>
    </div>
  )
}

/** One family used for both roles: a single specimen with a longer ramp. */
function SoloSpecimen({
  fontFamily,
  weight,
  weights,
  color,
  glyphSize,
}: {
  fontFamily: string
  weight: number
  weights: number[]
  color: string
  glyphSize: string
}) {
  const stack = getFontStack(fontFamily)

  return (
    <div className="flex min-w-0 flex-col gap-3 @3xl:col-span-2">
      <Rule color={color} />
      <div className="flex items-baseline justify-between gap-4">
        <Label color={color}>Headings and body</Label>
        <span className="overflow-hidden whitespace-nowrap text-sm" style={{ fontFamily: stack, color }}>
          {getFontLabel(fontFamily)}
        </span>
      </div>
      <div className="grid gap-x-10 gap-y-3 @3xl:grid-cols-[auto_1fr] @3xl:items-end">
        <div
          className="select-none"
          style={{
            fontFamily: stack,
            fontWeight: weight,
            fontSize: glyphSize,
            lineHeight: 0.95,
            color,
          }}
        >
          Aa
        </div>
        <div className="flex min-w-0 flex-col gap-3">
          <WeightRamp fontFamily={fontFamily} weights={weights} color={color} />
          <div
            className="space-y-0.5 text-[0.8125rem] leading-snug"
            style={{ fontFamily: stack, fontWeight: weight, color: dim(color, 85) }}
          >
            <p className="overflow-hidden whitespace-nowrap [mask-image:linear-gradient(to_right,#000_90%,transparent)]">{CHARSET_LETTERS}</p>
            <p className="overflow-hidden whitespace-nowrap [mask-image:linear-gradient(to_right,#000_90%,transparent)]">{CHARSET_FIGURES}</p>
          </div>
        </div>
      </div>
    </div>
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
    <div className="flex flex-col gap-3">
      <Rule color={color} />
      <div className="flex items-baseline justify-between gap-4">
        <Label color={color}>
          {index} / {title}
        </Label>
        {note && <Label color={color}>{note}</Label>}
      </div>
    </div>
  )
}

function GlyphBlock({
  role,
  fontFamily,
  weight,
  color,
  wide,
}: {
  role: string
  fontFamily: string
  weight: number
  color: string
  wide?: boolean
}) {
  return (
    <div className={`flex min-w-0 flex-col gap-4 ${wide ? '@3xl:col-span-2' : ''}`}>
      <div className="flex items-baseline justify-between gap-4">
        <Label color={color}>{role}</Label>
        <span className="text-sm" style={{ fontFamily: getFontStack(fontFamily), color }}>
          {getFontLabel(fontFamily)}
        </span>
      </div>
      <div className={`grid gap-x-10 gap-y-4 ${wide ? '@3xl:grid-cols-2' : ''}`}>
        {GLYPH_SETS.map(({ label, glyphs }) => (
          <div key={label} className="flex min-w-0 flex-col gap-1.5">
            <Rule color={color} />
            <Label color={color}>{label}</Label>
            <p
              className="break-words text-[1.375rem] leading-[1.35] tracking-[0.06em]"
              style={{ fontFamily: getFontStack(fontFamily), fontWeight: weight, color }}
            >
              {glyphs}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export function StyleCards() {
  const { desktop } = useComputedScale()
  const backgroundColor = useTypographyStore((s) => s.backgroundColor)
  const headingsGroup = useTypographyStore((s) => s.headingsGroup)
  const bodyGroup = useTypographyStore((s) => s.bodyGroup)
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

  const glyphSize = `${Math.min(Math.max((styles.h1?.fontSizeRem ?? 3) * 1.5, 3.5), 6)}rem`
  const pSize = Math.min(styles.p?.fontSizeRem ?? 1, 1.0625)
  const bodyStyle = {
    fontFamily: getFontStack(bodyFont),
    fontWeight: styles.p?.fontWeight ?? bodyGroup.fontWeight,
    lineHeight: styles.p?.lineHeight ?? bodyGroup.lineHeight,
    color: bodyColor,
  }

  return (
    <div
      className="@container w-full overflow-hidden"
      style={{ backgroundColor }}
    >
      <div className="mx-auto flex max-w-[1200px] flex-col gap-10 px-6 py-7 @3xl:px-10">
        {/* Masthead */}
        <h1
          style={{
            fontFamily: getFontStack(headingFont),
            fontWeight: styles.h1?.fontWeight ?? headingsGroup.fontWeight,
            fontSize: `${Math.min(styles.h1?.fontSizeRem ?? 2.5, 2.75)}rem`,
            lineHeight: styles.h1?.lineHeight ?? headingsGroup.lineHeight,
            letterSpacing: `${styles.h1?.letterSpacing ?? headingsGroup.letterSpacing}em`,
            color: headingColor,
          }}
        >
          {HEADING_SAMPLE}
        </h1>

        {/* Specimens */}
        <div className="grid gap-x-10 gap-y-6 @3xl:grid-cols-2">
          {same ? (
            <SoloSpecimen
              fontFamily={headingFont}
              weight={headingsGroup.fontWeight}
              weights={weightsFor(headingFont, 9)}
              color={headingColor}
              glyphSize={glyphSize}
            />
          ) : (
            <>
              <Specimen
                role="Headings"
                fontFamily={headingFont}
                weight={headingsGroup.fontWeight}
                weights={weightsFor(headingFont, 5)}
                color={headingColor}
                glyphSize={glyphSize}
              />
              <Specimen
                role="Body"
                fontFamily={bodyFont}
                weight={bodyGroup.fontWeight}
                weights={weightsFor(bodyFont, 5)}
                color={bodyColor}
                glyphSize={glyphSize}
              />
            </>
          )}
        </div>

        {/* In use */}
        <div className="grid gap-x-10 gap-y-6 @3xl:grid-cols-2">
          <div className="flex min-w-0 flex-col gap-3">
            <Rule color={headingColor} />
            <Label color={bodyColor}>In use</Label>
            <p
              style={{
                fontFamily: getFontStack(headingFont),
                fontWeight: styles.h1?.fontWeight ?? headingsGroup.fontWeight,
                fontSize: `${Math.min((styles.h1?.fontSizeRem ?? 3) * 0.65, 2.25)}rem`,
                lineHeight: styles.h1?.lineHeight ?? headingsGroup.lineHeight,
                color: headingColor,
              }}
            >
              {TITLE_SAMPLE}
            </p>
            <p
              style={{
                ...bodyStyle,
                fontSize: `${Math.min((styles.h3?.fontSizeRem ?? 1.5) * 0.75, 1.25)}rem`,
              }}
            >
              {LEAD_SAMPLE}
            </p>
          </div>
          <div className="flex min-w-0 flex-col gap-3">
            <Rule color={headingColor} />
            <Label color={bodyColor}>Text and quote</Label>
            <p style={{ ...bodyStyle, fontSize: `${pSize}rem` }}>{PARAGRAPH_SAMPLE}</p>
            <p className="italic" style={{ ...bodyStyle, fontSize: `${pSize * 1.1}rem` }}>
              {QUOTE_SAMPLE}
            </p>
          </div>
        </div>

        {/* 02 Type scale */}
        <section className="flex flex-col gap-1">
          <SectionHeader
            index="02"
            title="Type scale"
            note={scaleK < 1 ? `Shown at ${Math.round(scaleK * 100)}%` : undefined}
            color={headingColor}
          />
          {scaleRows.map(({ row, style, isHeading }) => {
            const font = isHeading ? headingFont : bodyFont
            const color = isHeading ? headingColor : bodyColor
            return (
              <div
                key={row.element}
                className="grid items-baseline gap-x-6 gap-y-1 py-3 @3xl:grid-cols-[10rem_1fr]"
                style={{ borderBottom: `1px solid ${dim(headingColor, 15)}` }}
              >
                <div className="flex flex-col gap-0.5">
                  <Label color={color}>{row.label}</Label>
                  <Label color={color}>
                    {Math.round(style.fontSize)}px / {style.lineHeight} / {style.fontWeight}
                  </Label>
                </div>
                <p
                  className="min-w-0"
                  style={{
                    fontFamily: getFontStack(font),
                    fontWeight: style.fontWeight,
                    fontSize: `${style.fontSizeRem * scaleK}rem`,
                    lineHeight: style.lineHeight,
                    letterSpacing: `${style.letterSpacing}em`,
                    textTransform: style.textTransform as React.CSSProperties['textTransform'],
                    color,
                  }}
                >
                  {row.sample}
                </p>
              </div>
            )
          })}
        </section>

        {/* 03 Text setting */}
        <section className="flex flex-col gap-6">
          <SectionHeader index="03" title="Text setting" color={headingColor} />
          <div className="grid gap-x-10 gap-y-6 @3xl:grid-cols-[1fr_2fr]">
            <div className="flex min-w-0 flex-col gap-4">
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
                {ARTICLE_EYEBROW}
              </span>
              <h2
                style={{
                  fontFamily: getFontStack(headingFont),
                  fontWeight: styles.h2?.fontWeight ?? headingsGroup.fontWeight,
                  fontSize: `${Math.min(styles.h2?.fontSizeRem ?? 2, 2.5)}rem`,
                  lineHeight: styles.h2?.lineHeight ?? headingsGroup.lineHeight,
                  letterSpacing: `${styles.h2?.letterSpacing ?? headingsGroup.letterSpacing}em`,
                  color: headingColor,
                }}
              >
                {ARTICLE_TITLE}
              </h2>
              <p
                style={{
                  ...bodyStyle,
                  fontSize: `${Math.min((styles.h3?.fontSizeRem ?? 1.5) * 0.8, 1.25)}rem`,
                  color: dim(bodyColor, 80),
                }}
              >
                {ARTICLE_STANDFIRST}
              </p>
              <blockquote
                className="mt-2 border-l-2 pl-4"
                style={{
                  borderColor: headingColor,
                  fontFamily: getFontStack(headingFont),
                  fontWeight: styles.h4?.fontWeight ?? headingsGroup.fontWeight,
                  fontSize: `${Math.min(styles.h4?.fontSizeRem ?? 1.5, 1.75)}rem`,
                  lineHeight: styles.h4?.lineHeight ?? headingsGroup.lineHeight,
                  color: headingColor,
                }}
              >
                {PULL_QUOTE}
              </blockquote>
            </div>
            <div className="min-w-0 gap-x-8 @2xl:columns-2">
              {ARTICLE_PARAGRAPHS.map((text, i) => (
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
          <Rule color={headingColor} />
          <div className="gap-x-8 @2xl:columns-2 @4xl:columns-3">
            {ARTICLE_SMALL.map((text, i) => (
              <p
                key={i}
                className={`${i > 0 ? 'mt-3' : ''} break-inside-avoid-column hyphens-auto`}
                style={{
                  ...bodyStyle,
                  fontSize: `${styles.small?.fontSizeRem ?? 0.875}rem`,
                  lineHeight: styles.small?.lineHeight ?? bodyGroup.lineHeight,
                }}
              >
                {text}
              </p>
            ))}
          </div>
        </section>

        {/* 04 Glyphs */}
        <section className="flex flex-col gap-6">
          <SectionHeader index="04" title="Glyphs" color={headingColor} />
          <div className="grid gap-x-10 gap-y-8 @3xl:grid-cols-2">
            {same ? (
              <GlyphBlock
                role="Headings and body"
                fontFamily={headingFont}
                weight={bodyGroup.fontWeight}
                color={headingColor}
                wide
              />
            ) : (
              <>
                <GlyphBlock
                  role="Headings"
                  fontFamily={headingFont}
                  weight={headingsGroup.fontWeight}
                  color={headingColor}
                />
                <GlyphBlock
                  role="Body"
                  fontFamily={bodyFont}
                  weight={bodyGroup.fontWeight}
                  color={bodyColor}
                />
              </>
            )}
          </div>
        </section>

        {/* 05 Pairing */}
        <section className="flex flex-col gap-6 pb-4">
          <SectionHeader index="05" title="Pairing" color={headingColor} />
          <div className="grid gap-x-10 gap-y-8 @3xl:grid-cols-3">
            {PAIRING_LEVELS.map(({ element, label, max }) => {
              const style = styles[element]
              return (
                <div key={element} className="flex min-w-0 flex-col gap-3">
                  <Rule color={headingColor} />
                  <Label color={bodyColor}>{label}</Label>
                  <h3
                    style={{
                      fontFamily: getFontStack(headingFont),
                      fontWeight: style?.fontWeight ?? headingsGroup.fontWeight,
                      fontSize: `${Math.min(style?.fontSizeRem ?? 1.5, max)}rem`,
                      lineHeight: style?.lineHeight ?? headingsGroup.lineHeight,
                      letterSpacing: `${style?.letterSpacing ?? headingsGroup.letterSpacing}em`,
                      color: headingColor,
                    }}
                  >
                    {PAIRING_TITLES[element]}
                  </h3>
                  <p style={{ ...bodyStyle, fontSize: `${pSize}rem` }}>{PAIRING_BODY}</p>
                </div>
              )
            })}
          </div>
        </section>
      </div>
    </div>
  )
}
