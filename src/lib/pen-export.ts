import type { TypographyConfig, TypographyElement } from '@/types/typography'
import { computeScale } from './scale'
import { DISPLAY_ELEMENTS, HEADING_ELEMENTS } from '@/types/typography'
import type { ResolvedElementStyle } from '@/types/typography'

interface PenVariable {
  type: 'string' | 'number'
  value: string | number
}

interface PenNode {
  id: string
  type: string
  [key: string]: unknown
}

const SAMPLE_HEADING = 'The quick brown fox jumps over the lazy dog'
const SAMPLE_PARAGRAPH = 'Typography is the art and technique of arranging type to make written language legible, readable, and appealing when displayed. The arrangement of type involves selecting typefaces, point sizes, line lengths, line-spacing, and letter-spacing.'
const SAMPLE_EYEBROW = 'THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG'
const SAMPLE_SMALL = 'The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs.'

const META_FONT_SIZE = 11
const META_LABEL_FONT_SIZE = 13
const META_COL_WIDTH = 140

function sampleText(element: string): string {
  if (element === 'p') return SAMPLE_PARAGRAPH
  if (element === 'eyebrow') return SAMPLE_EYEBROW
  if (element === 'small') return SAMPLE_SMALL
  return SAMPLE_HEADING
}

function isHeadingLike(element: string): boolean {
  return (
    HEADING_ELEMENTS.includes(element as TypographyElement) ||
    DISPLAY_ELEMENTS.includes(element as TypographyElement)
  ) && element !== 'eyebrow'
}

function buildMetaColumn(style: ResolvedElementStyle): PenNode {
  return {
    id: `meta-${style.element}`,
    type: 'frame',
    width: META_COL_WIDTH,
    layout: 'vertical',
    gap: 2,
    justifyContent: 'center',
    children: [
      {
        id: `label-${style.element}`,
        type: 'text',
        content: style.element,
        fontSize: META_LABEL_FONT_SIZE,
        fontFamily: 'Inter',
        fontWeight: 700,
        fill: style.color,
        textGrowth: 'auto',
      },
      {
        id: `rem-${style.element}`,
        type: 'text',
        content: `${style.fontSizeRem.toFixed(3)}rem`,
        fontSize: META_FONT_SIZE,
        fontFamily: 'Inter',
        fontWeight: 400,
        fill: style.color,
        opacity: 0.55,
        textGrowth: 'auto',
      },
      {
        id: `px-${style.element}`,
        type: 'text',
        content: `${style.fontSize.toFixed(1)}px`,
        fontSize: META_FONT_SIZE,
        fontFamily: 'Inter',
        fontWeight: 400,
        fill: style.color,
        opacity: 0.55,
        textGrowth: 'auto',
      },
      {
        id: `weight-${style.element}`,
        type: 'text',
        content: `w${style.fontWeight}`,
        fontSize: META_FONT_SIZE,
        fontFamily: 'Inter',
        fontWeight: 400,
        fill: style.color,
        opacity: 0.55,
        textGrowth: 'auto',
      },
    ],
  }
}

function buildSampleColumn(
  style: ResolvedElementStyle,
  config: TypographyConfig,
): PenNode {
  const family = isHeadingLike(style.element)
    ? config.headingsGroup.fontFamily
    : config.bodyGroup.fontFamily

  return {
    id: `sample-${style.element}`,
    type: 'text',
    content: sampleText(style.element),
    fontSize: style.fontSize,
    fontFamily: family,
    fontWeight: style.fontWeight,
    lineHeight: style.lineHeight,
    letterSpacing: style.letterSpacing,
    wordSpacing: style.wordSpacing,
    fill: style.color,
    textGrowth: 'fixed-width',
    width: 'fill_container',
  }
}

function buildRow(
  style: ResolvedElementStyle,
  config: TypographyConfig,
): PenNode {
  return {
    id: `row-${style.element}`,
    type: 'frame',
    layout: 'horizontal',
    gap: 32,
    alignItems: 'start',
    width: 'fill_container',
    children: [
      buildMetaColumn(style),
      buildSampleColumn(style, config),
    ],
  }
}

function buildTypeScaleFrame(
  styles: ResolvedElementStyle[],
  config: TypographyConfig,
): PenNode {
  const headingFont = config.headingsGroup.fontFamily
  const bodyFont = config.bodyGroup.fontFamily
  const subtitle = headingFont === bodyFont
    ? headingFont
    : `${headingFont} / ${bodyFont}`

  return {
    id: 'type-scale',
    type: 'frame',
    name: 'Type Scale',
    x: 0,
    y: 0,
    width: 1200,
    layout: 'vertical',
    gap: 0,
    padding: [48, 56, 56, 56],
    fill: config.backgroundColor,
    children: [
      {
        id: 'header',
        type: 'frame',
        layout: 'vertical',
        gap: 4,
        width: 'fill_container',
        children: [
          {
            id: 'title',
            type: 'text',
            content: 'Type Scale',
            fontSize: 14,
            fontFamily: 'Inter',
            fontWeight: 600,
            fill: config.headingsGroup.color,
            textGrowth: 'auto',
          },
          {
            id: 'subtitle',
            type: 'text',
            content: `${subtitle}  ·  ${config.baseFontSize}px base  ·  ${config.scaleRatio} ratio`,
            fontSize: 12,
            fontFamily: 'Inter',
            fontWeight: 400,
            fill: config.bodyGroup.color,
            opacity: 0.6,
            textGrowth: 'auto',
          },
        ],
      },
      {
        id: 'divider',
        type: 'rectangle',
        width: 'fill_container',
        height: 1,
        fill: config.headingsGroup.color,
        opacity: 0.12,
      },
      {
        id: 'rows',
        type: 'frame',
        layout: 'vertical',
        gap: 32,
        padding: [32, 0, 0, 0],
        width: 'fill_container',
        children: styles.map((s) => buildRow(s, config)),
      },
    ],
  }
}

function buildTextComponent(
  style: ResolvedElementStyle,
  config: TypographyConfig,
  yOffset: number,
): PenNode {
  const family = isHeadingLike(style.element)
    ? config.headingsGroup.fontFamily
    : config.bodyGroup.fontFamily

  const label = style.element === 'p' ? 'Paragraph'
    : style.element === 'eyebrow' ? 'Eyebrow'
    : style.element === 'small' ? 'Small'
    : style.element.toUpperCase()

  return {
    id: `comp-${style.element}`,
    type: 'frame',
    name: label,
    reusable: true,
    x: 1400,
    y: yOffset,
    width: 600,
    layout: 'vertical',
    children: [
      {
        id: `comp-text-${style.element}`,
        type: 'text',
        name: `${label} Text`,
        content: sampleText(style.element),
        fontSize: style.fontSize,
        fontFamily: family,
        fontWeight: style.fontWeight,
        lineHeight: style.lineHeight,
        letterSpacing: style.letterSpacing,
        wordSpacing: style.wordSpacing,
        fill: style.color,
        textGrowth: 'fixed-width',
        width: 'fill_container',
      },
    ],
  }
}

export function generatePenFile(config: TypographyConfig): string {
  const styles = computeScale(config).filter(
    (s) => !DISPLAY_ELEMENTS.includes(s.element)
  )

  const variables: Record<string, PenVariable> = {}

  for (const s of styles) {
    variables[`fontSize.${s.element}`] = { type: 'number', value: parseFloat(s.fontSizeRem.toFixed(4)) }
    variables[`fontWeight.${s.element}`] = { type: 'number', value: s.fontWeight }
    variables[`lineHeight.${s.element}`] = { type: 'number', value: s.lineHeight }
    variables[`letterSpacing.${s.element}`] = { type: 'number', value: s.letterSpacing }
    variables[`wordSpacing.${s.element}`] = { type: 'number', value: s.wordSpacing }
  }

  const components = styles.map((s, i) =>
    buildTextComponent(s, config, i * 120)
  )

  return JSON.stringify({
    version: '2.8',
    variables,
    children: [
      buildTypeScaleFrame(styles, config),
      ...components,
    ],
  }, null, 2)
}
