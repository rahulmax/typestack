'use client'

import { useEffect, useMemo, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { useComputedScale } from '@/hooks/use-computed-scale'
import { useTypographyStore } from '@/store/typography-store'
import { fetchFontOptions, getFontLabel, getFontStack } from '@/lib/fonts'
import type { ResolvedElementStyle } from '@/types/typography'

const CHARSET_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz'
const CHARSET_FIGURES = '0123456789 !?&@#$%*()“”'

const HEADING_SAMPLE = 'The craft of visual language'
const TITLE_SAMPLE = 'The Outermost House'
const LEAD_SAMPLE = 'They move finished and complete, gifted with senses we have lost.'
const PARAGRAPH_SAMPLE = 'They are not brethren; they are not underlings; they are other nations, caught with ourselves in the net of life and time.'
const QUOTE_SAMPLE = '“We need another and a wiser and perhaps a more mystical concept of animals.”'

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

export function StyleCards() {
  const { desktop } = useComputedScale()
  const backgroundColor = useTypographyStore((s) => s.backgroundColor)
  const headingsGroup = useTypographyStore((s) => s.headingsGroup)
  const bodyGroup = useTypographyStore((s) => s.bodyGroup)
  const [catalogWeights, setCatalogWeights] = useState<Map<string, number[]>>(new Map())

  const styles = useMemo(() => {
    const h1 = findStyle(desktop, 'h1')
    const h3 = findStyle(desktop, 'h3')
    const p = findStyle(desktop, 'p')
    return { h1, h3, p }
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
      className="@container mx-auto w-full max-w-[1280px] overflow-hidden"
      style={{ backgroundColor }}
    >
      <div className="mx-auto flex max-w-[1200px] flex-col gap-7 px-6 py-7 @3xl:px-10">
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
            <Label color={bodyColor}>Text, quote and actions</Label>
            <p style={{ ...bodyStyle, fontSize: `${pSize}rem` }}>
              {PARAGRAPH_SAMPLE}
            </p>
            <p
              className="italic"
              style={{ ...bodyStyle, fontSize: `${pSize * 1.1}rem` }}
            >
              {QUOTE_SAMPLE}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm"
                style={{
                  fontFamily: getFontStack(bodyFont),
                  fontWeight: 500,
                  color: backgroundColor,
                  backgroundColor: headingColor,
                }}
              >
                Call to action
                <ArrowRight className="size-3.5" />
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm"
                style={{
                  fontFamily: getFontStack(bodyFont),
                  fontWeight: 500,
                  color: headingColor,
                  borderColor: dim(headingColor, 30),
                  background: 'transparent',
                }}
              >
                Secondary
              </button>
              <span
                className="inline-flex items-center gap-1.5 text-sm underline underline-offset-4"
                style={{
                  fontFamily: getFontStack(bodyFont),
                  fontWeight: 500,
                  color: headingColor,
                }}
              >
                Link <span aria-hidden="true">&rarr;</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
