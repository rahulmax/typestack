'use client'

import { useMemo } from 'react'
import { ArrowRight } from 'lucide-react'
import { useComputedScale } from '@/hooks/use-computed-scale'
import { useTypographyStore } from '@/store/typography-store'
import type { ResolvedElementStyle } from '@/types/typography'

const CHARSET_UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const CHARSET_LOWER = 'abcdefghijklmnopqrstuvwxyz'
const CHARSET_NUMBERS = '0123456789'
const CHARSET_SYMBOLS = '!@#$%^&*()'

const WEIGHT_LABELS: { weight: number; label: string }[] = [
  { weight: 700, label: 'Bold' },
  { weight: 600, label: 'Semibold' },
  { weight: 400, label: 'Regular' },
  { weight: 300, label: 'Light' },
]

const HEADING_SAMPLE = 'Typography is the craft of endowing language with visual form'
const BODY_SAMPLE = 'Letters are symbols which turn matter into spirit. A text is a sequence of words. A text stays the same from one moment to another. The letters of the alphabet are a set of visible signs or characters used to represent sounds in speech.'
const TITLE_SAMPLE = 'The Outermost House'
const LEAD_SAMPLE = 'In a world older and more complete than ours they move finished and complete, gifted with extensions of the senses we have lost or never attained, living by voices we shall never hear.'
const PARAGRAPH_SAMPLE = 'They are not brethren; they are not underlings; they are other nations, caught with ourselves in the net of life and time, fellow prisoners of the splendor and travail of the earth.'
const QUOTE_SAMPLE = '\u201CWe need another and a wiser and perhaps a more mystical concept of animals.\u201D'

function findStyle(
  styles: ResolvedElementStyle[],
  element: string
): ResolvedElementStyle | undefined {
  return styles.find((s) => s.element === element)
}

function Separator({ color }: { color: string }) {
  return (
    <div
      className="w-full"
      style={{
        height: 1,
        backgroundColor: `color-mix(in srgb, ${color} 20%, transparent)`,
      }}
    />
  )
}

function WeightSpecimen({
  fontFamily,
  weight,
  label,
  color,
}: {
  fontFamily: string
  weight: number
  label: string
  color: string
}) {
  const dimColor = `color-mix(in srgb, ${color} 60%, transparent)`

  return (
    <div className="flex gap-6">
      <div className="w-20 shrink-0 pt-0.5">
        <Separator color={color} />
        <span
          className="mt-2 block text-xs"
          style={{ color: dimColor }}
        >
          {label}
        </span>
      </div>
      <div className="flex-1">
        <Separator color={color} />
        <div className="mt-2">
          <p
            className="text-sm font-medium"
            style={{
              fontFamily: `'${fontFamily}', sans-serif`,
              fontWeight: weight,
              color,
            }}
          >
            {fontFamily}
          </p>
          <p
            className="mt-1 text-xs leading-relaxed"
            style={{
              fontFamily: `'${fontFamily}', sans-serif`,
              fontWeight: weight,
              color,
            }}
          >
            {CHARSET_UPPER}
            <br />
            {CHARSET_LOWER}
            <br />
            {CHARSET_NUMBERS}
            <br />
            {CHARSET_SYMBOLS}
          </p>
        </div>
      </div>
    </div>
  )
}

function TypeRow({
  label,
  children,
  color,
}: {
  label: string
  children: React.ReactNode
  color: string
}) {
  const dimColor = `color-mix(in srgb, ${color} 50%, transparent)`

  return (
    <div className="flex items-start gap-6">
      <span
        className="w-20 shrink-0 pt-1 text-xs"
        style={{ color: dimColor }}
      >
        {label}
      </span>
      <div className="flex-1">{children}</div>
    </div>
  )
}

export function StyleCards() {
  const { desktop } = useComputedScale()
  const backgroundColor = useTypographyStore((s) => s.backgroundColor)
  const headingsGroup = useTypographyStore((s) => s.headingsGroup)
  const bodyGroup = useTypographyStore((s) => s.bodyGroup)

  const styles = useMemo(() => {
    const h1 = findStyle(desktop, 'h1')
    const h3 = findStyle(desktop, 'h3')
    const p = findStyle(desktop, 'p')
    const small = findStyle(desktop, 'small')
    return { h1, h3, p, small }
  }, [desktop])

  const headingFont = headingsGroup.fontFamily
  const bodyFont = bodyGroup.fontFamily
  const headingColor = headingsGroup.color
  const bodyColor = bodyGroup.color

  return (
    <div
      className="mx-auto w-full max-w-[1280px] overflow-hidden"
      style={{ backgroundColor }}
    >
      {/* Top section — heading + body sample */}
      <div
        className=""
      >
        <div className="mx-auto max-w-[1200px] px-10 pb-12 pt-10">
        <h1
          style={{
            fontFamily: `'${headingFont}', sans-serif`,
            fontWeight: styles.h1?.fontWeight ?? headingsGroup.fontWeight,
            fontSize: styles.h1 ? `${Math.min(styles.h1.fontSizeRem, 3.5)}rem` : '3rem',
            lineHeight: styles.h1?.lineHeight ?? headingsGroup.lineHeight,
            letterSpacing: styles.h1
              ? `${styles.h1.letterSpacing}em`
              : `${headingsGroup.letterSpacing}em`,
            color: headingColor,
          }}
        >
          {HEADING_SAMPLE}
        </h1>
        <p
          className="mt-6 line-clamp-3 overflow-hidden"
          style={{
            fontFamily: `'${bodyFont}', sans-serif`,
            fontWeight: styles.p?.fontWeight ?? bodyGroup.fontWeight,
            fontSize: styles.p
              ? `${Math.max(styles.p.fontSizeRem * 1.5, 1.25)}rem`
              : '1.25rem',
            lineHeight: styles.p?.lineHeight ?? bodyGroup.lineHeight,
            letterSpacing: styles.p
              ? `${styles.p.letterSpacing}em`
              : `${bodyGroup.letterSpacing}em`,
            color: bodyColor,
          }}
        >
          {BODY_SAMPLE}
        </p>
        </div>
      </div>

      {/* Bottom section — 3-column grid */}
      <div className="mx-auto max-w-[1200px] grid grid-cols-[0.8fr_1.1fr_1.3fr] gap-0 px-10 py-10">
        {/* Column 1 — Font Identity */}
        <div className="flex min-w-0 flex-col pr-6">
          <Separator color={headingColor} />
          <h2
            className="mt-4 text-2xl"
            style={{
              fontFamily: `'${headingFont}', sans-serif`,
              fontWeight: headingsGroup.fontWeight,
              color: headingColor,
            }}
          >
            {headingFont}
          </h2>
          {headingFont !== bodyFont && (
            <p
              className="mt-0.5 text-sm"
              style={{
                fontFamily: `'${bodyFont}', sans-serif`,
                color: `color-mix(in srgb, ${bodyColor} 60%, transparent)`,
              }}
            >
              {bodyFont}
            </p>
          )}

          <div
            className="mt-6 select-none"
            style={{
              fontFamily: `'${headingFont}', sans-serif`,
              fontWeight: headingsGroup.fontWeight,
              fontSize: '8rem',
              lineHeight: 1,
              color: headingColor,
            }}
          >
            Ag
          </div>
        </div>

        {/* Column 2 — Weight Specimens */}
        <div className="flex min-w-0 flex-col gap-5 px-6">
          {WEIGHT_LABELS.map(({ weight, label }) => (
            <WeightSpecimen
              key={weight}
              fontFamily={headingFont}
              weight={weight}
              label={label}
              color={headingColor}
            />
          ))}
        </div>

        {/* Column 3 — Type Hierarchy */}
        <div className="flex min-w-0 flex-col gap-5 px-6">
          <Separator color={headingColor} />

          {/* Title */}
          <TypeRow label="Title" color={bodyColor}>
            <p
              style={{
                fontFamily: `'${headingFont}', sans-serif`,
                fontWeight: styles.h1?.fontWeight ?? headingsGroup.fontWeight,
                fontSize: styles.h1
                  ? `${Math.min(styles.h1.fontSizeRem * 0.65, 2.5)}rem`
                  : '2rem',
                lineHeight: styles.h1?.lineHeight ?? headingsGroup.lineHeight,
                color: headingColor,
              }}
            >
              {TITLE_SAMPLE}
            </p>
          </TypeRow>

          {/* Lead */}
          <TypeRow label="Lead" color={bodyColor}>
            <p
              style={{
                fontFamily: `'${bodyFont}', sans-serif`,
                fontWeight: styles.p?.fontWeight ?? bodyGroup.fontWeight,
                fontSize: styles.h3
                  ? `${Math.min(styles.h3.fontSizeRem * 0.75, 1.125)}rem`
                  : '1rem',
                lineHeight: styles.p?.lineHeight ?? bodyGroup.lineHeight,
                color: bodyColor,
              }}
            >
              {LEAD_SAMPLE}
            </p>
          </TypeRow>

          {/* Paragraph */}
          <TypeRow label="Paragraph" color={bodyColor}>
            <p
              style={{
                fontFamily: `'${bodyFont}', sans-serif`,
                fontWeight: styles.p?.fontWeight ?? bodyGroup.fontWeight,
                fontSize: styles.p
                  ? `${styles.p.fontSizeRem}rem`
                  : '1rem',
                lineHeight: styles.p?.lineHeight ?? bodyGroup.lineHeight,
                color: bodyColor,
              }}
            >
              {PARAGRAPH_SAMPLE}
            </p>
          </TypeRow>

          {/* Quote */}
          <TypeRow label="Quote" color={bodyColor}>
            <p
              style={{
                fontFamily: `'${bodyFont}', sans-serif`,
                fontWeight: styles.p?.fontWeight ?? bodyGroup.fontWeight,
                fontSize: styles.p
                  ? `${styles.p.fontSizeRem * 1.1}rem`
                  : '1.05rem',
                lineHeight: styles.p?.lineHeight ?? bodyGroup.lineHeight,
                fontStyle: 'italic',
                color: bodyColor,
              }}
            >
              {QUOTE_SAMPLE}
            </p>
          </TypeRow>

          {/* Link */}
          <TypeRow label="Link" color={bodyColor}>
            <div className="flex items-center gap-6">
              <span
                className="inline-flex items-center gap-1.5"
                style={{
                  fontFamily: `'${bodyFont}', sans-serif`,
                  fontWeight: 500,
                  fontSize: styles.p
                    ? `${styles.p.fontSizeRem}rem`
                    : '1rem',
                  color: headingColor,
                }}
              >
                Option 1 <span aria-hidden="true">&rarr;</span>
              </span>
              <span
                className="inline-flex items-center gap-1.5"
                style={{
                  fontFamily: `'${bodyFont}', sans-serif`,
                  fontWeight: 500,
                  fontSize: styles.p
                    ? `${styles.p.fontSizeRem}rem`
                    : '1rem',
                  color: headingColor,
                }}
              >
                Option 2 <span aria-hidden="true">&rarr;</span>
              </span>
            </div>
          </TypeRow>

          {/* Button */}
          <TypeRow label="Button" color={bodyColor}>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm"
                style={{
                  fontFamily: `'${bodyFont}', sans-serif`,
                  fontWeight: 500,
                  color: headingColor,
                  borderColor: `color-mix(in srgb, ${headingColor} 30%, transparent)`,
                  background: 'transparent',
                }}
              >
                <ArrowRight className="size-3.5" />
                Call to action
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm"
                style={{
                  fontFamily: `'${bodyFont}', sans-serif`,
                  fontWeight: 500,
                  color: backgroundColor,
                  backgroundColor: headingColor,
                }}
              >
                <ArrowRight className="size-3.5" />
                Call to action
              </button>
            </div>
          </TypeRow>
        </div>
      </div>
    </div>
  )
}
