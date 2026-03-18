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
    
        fill: style.color,
        textGrowth: 'fixed-width',
        width: 'fill_container',
      },
    ],
  }
}

// ── Helper: resolve a style by element name ─────────────────────

function getStyle(styles: ResolvedElementStyle[], el: string): ResolvedElementStyle {
  return styles.find((s) => s.element === el) ?? styles[0]
}

// Properties that belong on the ref (frame-level), not on the text descendant
const REF_LEVEL_PROPS = new Set(['width', 'opacity'])

function textNode(
  id: string,
  content: string,
  style: ResolvedElementStyle,
  _config: TypographyConfig,
  overrides?: Record<string, unknown>,
): PenNode {
  const compId = `comp-${style.element}`
  const textId = `comp-text-${style.element}`

  const refProps: Record<string, unknown> = {}
  const textProps: Record<string, unknown> = { content }

  if (overrides) {
    for (const [k, v] of Object.entries(overrides)) {
      if (REF_LEVEL_PROPS.has(k)) {
        refProps[k] = v
      } else {
        textProps[k] = v
      }
    }
  }

  // When width is 'auto', also set textGrowth to 'auto' on the text node
  // and use fit_content on the ref frame
  if (refProps.width === 'auto') {
    refProps.width = 'fit_content'
    textProps.textGrowth = textProps.textGrowth ?? 'auto'
  }

  return {
    id,
    type: 'ref',
    ref: compId,
    width: refProps.width ?? 'fill_container',
    ...(refProps.opacity !== undefined ? { opacity: refProps.opacity } : {}),
    descendants: {
      [textId]: textProps,
    },
  }
}

function divider(id: string, color: string): PenNode {
  return {
    id,
    type: 'rectangle',
    width: 'fill_container',
    height: 1,
    fill: color,
    opacity: 0.12,
  }
}

// ── Website preview frame ───────────────────────────────────────

function buildWebsitePreview(
  styles: ResolvedElementStyle[],
  config: TypographyConfig,
  width: number,
  idPrefix: string,
  label: string,
  xOffset: number,
): PenNode {
  const h1 = getStyle(styles, 'h1')
  const h2 = getStyle(styles, 'h2')
  const h4 = getStyle(styles, 'h4')
  const p = getStyle(styles, 'p')
  const eyebrow = getStyle(styles, 'eyebrow')
  const small = getStyle(styles, 'small')
  const isMobile = width < 600
  const pad = isMobile ? 20 : 48

  return {
    id: `${idPrefix}-website`,
    type: 'frame',
    name: label,
    x: xOffset,
    y: 0,
    width,
    layout: 'vertical',
    gap: 0,
    fill: config.backgroundColor,
    children: [
      // Nav
      {
        id: `${idPrefix}-nav`,
        type: 'frame',
        layout: 'horizontal',
        width: 'fill_container',
        padding: [16, pad, 16, pad],
        justifyContent: 'space_between',
        alignItems: 'center',
        children: [
          textNode(`${idPrefix}-nav-brand`, 'TypeStax', h4, config, { width: 'auto', textGrowth: 'auto', fontWeight: 700, fontSize: h4.fontSize * 0.8 }),
          {
            id: `${idPrefix}-nav-links`,
            type: 'frame',
            layout: 'horizontal',
            gap: 16,
            children: ['Features', 'Pricing', 'Docs'].map((t, i) =>
              textNode(`${idPrefix}-nav-${i}`, t, small, config, { width: 'auto', textGrowth: 'auto' })
            ),
          },
        ],
      },
      divider(`${idPrefix}-nav-div`, config.headingsGroup.color),
      // Hero
      {
        id: `${idPrefix}-hero`,
        type: 'frame',
        layout: 'vertical',
        width: 'fill_container',
        gap: 16,
        padding: [isMobile ? 40 : 64, pad, isMobile ? 40 : 64, pad],
        children: [
          textNode(`${idPrefix}-hero-eyebrow`, 'DESIGN SYSTEMS', eyebrow, config, { fontSize: eyebrow.fontSize, opacity: 0.7 }),
          textNode(`${idPrefix}-hero-h1`, 'Build beautiful type scales for every project', h1, config, {}),
          textNode(`${idPrefix}-hero-p`, 'A hands-on creative tool for designers building type systems. Explore ratios, preview in context, and export production-ready code.', p, config, { opacity: 0.8 }),
        ],
      },
      divider(`${idPrefix}-hero-div`, config.headingsGroup.color),
      // Features
      {
        id: `${idPrefix}-features`,
        type: 'frame',
        layout: 'vertical',
        width: 'fill_container',
        gap: 24,
        padding: [isMobile ? 32 : 48, pad, isMobile ? 32 : 48, pad],
        children: [
          textNode(`${idPrefix}-feat-h2`, 'Features', h2, config, {}),
          {
            id: `${idPrefix}-feat-grid`,
            type: 'frame',
            layout: isMobile ? 'vertical' : 'horizontal',
            width: 'fill_container',
            gap: 24,
            children: [
              { id: `${idPrefix}-feat-1`, type: 'frame', layout: 'vertical', gap: 8, width: 'fill_container', children: [
                textNode(`${idPrefix}-feat-1-h`, 'Live Preview', h4, config, {}),
                textNode(`${idPrefix}-feat-1-p`, 'See your type scale applied to real website and blog templates instantly.', p, config, { opacity: 0.7 }),
              ]},
              { id: `${idPrefix}-feat-2`, type: 'frame', layout: 'vertical', gap: 8, width: 'fill_container', children: [
                textNode(`${idPrefix}-feat-2-h`, 'Export Ready', h4, config, {}),
                textNode(`${idPrefix}-feat-2-p`, 'Generate CSS, Tailwind config, or Figma-ready JSON with a single click.', p, config, { opacity: 0.7 }),
              ]},
              ...(!isMobile ? [{ id: `${idPrefix}-feat-3`, type: 'frame', layout: 'vertical', gap: 8, width: 'fill_container', children: [
                textNode(`${idPrefix}-feat-3-h`, 'Mobile Scales', h4, config, {}),
                textNode(`${idPrefix}-feat-3-p`, 'Design separate scales for mobile with independent ratio and base size.', p, config, { opacity: 0.7 }),
              ]}] : []),
            ],
          },
        ],
      },
      divider(`${idPrefix}-feat-div`, config.headingsGroup.color),
      // Stats
      {
        id: `${idPrefix}-stats`,
        type: 'frame',
        layout: isMobile ? 'vertical' : 'horizontal',
        width: 'fill_container',
        gap: isMobile ? 24 : 0,
        padding: [isMobile ? 32 : 48, pad, isMobile ? 32 : 48, pad],
        justifyContent: 'space_around',
        children: [
          { id: `${idPrefix}-stat-1`, type: 'frame', layout: 'vertical', gap: 4, alignItems: isMobile ? 'start' : 'center', children: [
            textNode(`${idPrefix}-stat-1-n`, '12', h2, config, { width: 'auto', textGrowth: 'auto' }),
            textNode(`${idPrefix}-stat-1-l`, 'Scale Ratios', small, config, { width: 'auto', textGrowth: 'auto', opacity: 0.6 }),
          ]},
          { id: `${idPrefix}-stat-2`, type: 'frame', layout: 'vertical', gap: 4, alignItems: isMobile ? 'start' : 'center', children: [
            textNode(`${idPrefix}-stat-2-n`, '9', h2, config, { width: 'auto', textGrowth: 'auto' }),
            textNode(`${idPrefix}-stat-2-l`, 'Type Elements', small, config, { width: 'auto', textGrowth: 'auto', opacity: 0.6 }),
          ]},
          { id: `${idPrefix}-stat-3`, type: 'frame', layout: 'vertical', gap: 4, alignItems: isMobile ? 'start' : 'center', children: [
            textNode(`${idPrefix}-stat-3-n`, '5', h2, config, { width: 'auto', textGrowth: 'auto' }),
            textNode(`${idPrefix}-stat-3-l`, 'Export Formats', small, config, { width: 'auto', textGrowth: 'auto', opacity: 0.6 }),
          ]},
        ],
      },
      divider(`${idPrefix}-stats-div`, config.headingsGroup.color),
      // CTA
      {
        id: `${idPrefix}-cta`,
        type: 'frame',
        layout: 'vertical',
        width: 'fill_container',
        gap: 16,
        padding: [isMobile ? 40 : 64, pad, isMobile ? 40 : 64, pad],
        alignItems: 'center',
        children: [
          textNode(`${idPrefix}-cta-h2`, 'Start building your type scale', h2, config, { width: 'auto', textGrowth: 'auto' }),
          textNode(`${idPrefix}-cta-p`, 'Free to use. No account required.', p, config, { width: 'auto', textGrowth: 'auto', opacity: 0.7 }),
        ],
      },
      // Footer
      {
        id: `${idPrefix}-footer`,
        type: 'frame',
        layout: 'horizontal',
        width: 'fill_container',
        padding: [16, pad, 16, pad],
        justifyContent: 'space_between',
        children: [
          textNode(`${idPrefix}-footer-l`, '© 2026 TypeStax', small, config, { width: 'auto', textGrowth: 'auto', opacity: 0.5 }),
          textNode(`${idPrefix}-footer-r`, 'Made with TypeStax', small, config, { width: 'auto', textGrowth: 'auto', opacity: 0.5 }),
        ],
      },
    ],
  }
}

// ── Blog preview frame ──────────────────────────────────────────

function buildBlogPreview(
  styles: ResolvedElementStyle[],
  config: TypographyConfig,
  width: number,
  idPrefix: string,
  label: string,
  xOffset: number,
): PenNode {
  const h1 = getStyle(styles, 'h1')
  const h2 = getStyle(styles, 'h2')
  const h3 = getStyle(styles, 'h3')
  const h4 = getStyle(styles, 'h4')
  const h5 = getStyle(styles, 'h5')
  const p = getStyle(styles, 'p')
  const eyebrow = getStyle(styles, 'eyebrow')
  const small = getStyle(styles, 'small')
  const isMobile = width < 600
  const contentWidth = Math.min(680, width - (isMobile ? 32 : 96))
  const pad = isMobile ? 16 : 48

  return {
    id: `${idPrefix}-blog`,
    type: 'frame',
    name: label,
    x: xOffset,
    y: 0,
    width,
    layout: 'vertical',
    gap: 0,
    padding: [pad, pad, pad, pad],
    fill: config.backgroundColor,
    alignItems: 'center',
    children: [
      // Article container
      {
        id: `${idPrefix}-article`,
        type: 'frame',
        layout: 'vertical',
        width: contentWidth,
        gap: 0,
        children: [
          // Header
          textNode(`${idPrefix}-blog-eyebrow`, 'DESIGN SYSTEMS', eyebrow, config, { opacity: 0.8, fontSize: eyebrow.fontSize }),
          { id: `${idPrefix}-blog-spacer-1`, type: 'rectangle', width: 'fill_container', height: 12, fill: 'transparent' },
          textNode(`${idPrefix}-blog-h1`, 'The Art of Typographic Hierarchy', h1, config, {}),
          { id: `${idPrefix}-blog-spacer-2`, type: 'rectangle', width: 'fill_container', height: 8, fill: 'transparent' },
          textNode(`${idPrefix}-blog-intro`, 'How a well-crafted type scale can transform the readability and aesthetics of your digital products.', p, config, { opacity: 0.85 }),
          { id: `${idPrefix}-blog-spacer-3`, type: 'rectangle', width: 'fill_container', height: 8, fill: 'transparent' },
          textNode(`${idPrefix}-blog-meta`, 'By Sarah Chen  ·  March 3, 2026  ·  8 min read', small, config, { opacity: 0.6 }),
          { id: `${idPrefix}-blog-spacer-4`, type: 'rectangle', width: 'fill_container', height: 32, fill: 'transparent' },
          divider(`${idPrefix}-blog-div-1`, config.headingsGroup.color),
          { id: `${idPrefix}-blog-spacer-5`, type: 'rectangle', width: 'fill_container', height: 32, fill: 'transparent' },
          // Body
          textNode(`${idPrefix}-blog-p1`, 'Typography is the foundation of good design. When we talk about typographic hierarchy, we\'re referring to the system of organizing text to establish an order of importance, helping readers navigate content efficiently and intuitively.', p, config, {}),
          { id: `${idPrefix}-blog-spacer-6`, type: 'rectangle', width: 'fill_container', height: 24, fill: 'transparent' },
          textNode(`${idPrefix}-blog-h2`, 'Understanding Scale Ratios', h2, config, {}),
          { id: `${idPrefix}-blog-spacer-7`, type: 'rectangle', width: 'fill_container', height: 12, fill: 'transparent' },
          textNode(`${idPrefix}-blog-p2`, 'A type scale is a sequence of font sizes that relate to each other through a consistent mathematical ratio. The most common ratios are drawn from music — like the Minor Third (1.200) or the Perfect Fourth (1.333).', p, config, {}),
          { id: `${idPrefix}-blog-spacer-8`, type: 'rectangle', width: 'fill_container', height: 16, fill: 'transparent' },
          textNode(`${idPrefix}-blog-p3`, 'These ratios create natural harmony between sizes, much like musical intervals create harmony between notes. The key is choosing a ratio that provides enough contrast between levels without being too dramatic.', p, config, {}),
          { id: `${idPrefix}-blog-spacer-9`, type: 'rectangle', width: 'fill_container', height: 24, fill: 'transparent' },
          textNode(`${idPrefix}-blog-h3`, 'Choosing the Right Ratio', h3, config, {}),
          { id: `${idPrefix}-blog-spacer-10`, type: 'rectangle', width: 'fill_container', height: 12, fill: 'transparent' },
          textNode(`${idPrefix}-blog-p4`, 'For body-heavy content like articles and documentation, a tighter ratio like Minor Third (1.200) or Major Second (1.125) works well. For marketing pages where you need dramatic headings, a wider ratio like Perfect Fourth (1.333) or higher creates more visual impact.', p, config, {}),
          { id: `${idPrefix}-blog-spacer-11`, type: 'rectangle', width: 'fill_container', height: 24, fill: 'transparent' },
          // Blockquote
          {
            id: `${idPrefix}-blog-quote`,
            type: 'frame',
            layout: 'vertical',
            width: 'fill_container',
            gap: 8,
            padding: [0, 0, 0, 24],
            stroke: { align: 'inside', thickness: { top: 0, right: 0, bottom: 0, left: 3 }, fill: config.headingsGroup.color },
            children: [
              textNode(`${idPrefix}-blog-quote-t`, '"The type scale is to typography what the color palette is to visual design — it\'s the foundational system that everything else builds upon."', p, config, { fontStyle: 'italic' }),
              textNode(`${idPrefix}-blog-quote-a`, '— Tim Brown, Head of Typography at Adobe', small, config, { opacity: 0.6 }),
            ],
          },
          { id: `${idPrefix}-blog-spacer-12`, type: 'rectangle', width: 'fill_container', height: 24, fill: 'transparent' },
          textNode(`${idPrefix}-blog-h2b`, 'Mobile Considerations', h2, config, {}),
          { id: `${idPrefix}-blog-spacer-13`, type: 'rectangle', width: 'fill_container', height: 12, fill: 'transparent' },
          textNode(`${idPrefix}-blog-p5`, 'Mobile screens demand a different approach. Headings that look grand on desktop can overwhelm a small screen. Use a tighter ratio for mobile and adjust your base font size to maintain readability.', p, config, {}),
          { id: `${idPrefix}-blog-spacer-14`, type: 'rectangle', width: 'fill_container', height: 24, fill: 'transparent' },
          textNode(`${idPrefix}-blog-h4`, 'Key Takeaways', h4, config, {}),
          { id: `${idPrefix}-blog-spacer-15`, type: 'rectangle', width: 'fill_container', height: 8, fill: 'transparent' },
          textNode(`${idPrefix}-blog-take1`, '1. Start with a clear base font size (typically 16px for web).', p, config, {}),
          textNode(`${idPrefix}-blog-take2`, '2. Choose a ratio that matches your content type.', p, config, {}),
          textNode(`${idPrefix}-blog-take3`, '3. Test with real content, not just lorem ipsum.', p, config, {}),
          textNode(`${idPrefix}-blog-take4`, '4. Always design for mobile separately.', p, config, {}),
          { id: `${idPrefix}-blog-spacer-16`, type: 'rectangle', width: 'fill_container', height: 24, fill: 'transparent' },
          textNode(`${idPrefix}-blog-h5`, 'Further Reading', h5, config, {}),
          { id: `${idPrefix}-blog-spacer-17`, type: 'rectangle', width: 'fill_container', height: 8, fill: 'transparent' },
          textNode(`${idPrefix}-blog-further`, 'Explore more about type scales at typescale.com and learn about fluid typography techniques for responsive design.', small, config, {}),
        ],
      },
    ],
  }
}

// ── Main export ─────────────────────────────────────────────────

export function generatePenFile(config: TypographyConfig): string {
  const styles = computeScale(config).filter(
    (s) => !DISPLAY_ELEMENTS.includes(s.element)
  )

  const variables: Record<string, PenVariable> = {
    '--font-primary': { type: 'string', value: config.headingsGroup.fontFamily },
    '--font-secondary': { type: 'string', value: config.bodyGroup.fontFamily },
  }

  const components = styles.map((s, i) =>
    buildTextComponent(s, config, i * 120)
  )

  // Preview frames positioned to the right of the type scale
  const typeScaleWidth = 1200
  const gap = 100
  const desktopW = 1440
  const mobileW = 375

  const previewFrames = [
    buildWebsitePreview(styles, config, desktopW, 'desk', 'Website — Desktop', typeScaleWidth + gap),
    buildWebsitePreview(styles, config, mobileW, 'mob', 'Website — Mobile', typeScaleWidth + gap + desktopW + gap),
    buildBlogPreview(styles, config, desktopW, 'blog-desk', 'Blog — Desktop', typeScaleWidth + gap + desktopW + gap + mobileW + gap),
    buildBlogPreview(styles, config, mobileW, 'blog-mob', 'Blog — Mobile', typeScaleWidth + gap + desktopW + gap + mobileW + gap + desktopW + gap),
  ]

  return JSON.stringify({
    version: '2.8',
    variables,
    children: [
      buildTypeScaleFrame(styles, config),
      ...previewFrames,
      ...components,
    ],
  }, null, 2)
}
