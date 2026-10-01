import { describe, test, expect } from 'vitest'
import { generateCSS, generatePreviewCSS } from '../css-generator'
import { ILLUSTRATION_ROLES } from '../color-utils'
import { ILLUSTRATION_TONES } from '../illustration-packs'
import { DEFAULT_CONFIG } from '@/data/default-config'
import { ALL_ELEMENTS, DISPLAY_ELEMENTS } from '@/types/typography'
import type { TypographyConfig } from '@/types/typography'

describe('generateCSS', () => {
  const css = generateCSS(DEFAULT_CONFIG)
  // Display elements are opt-in per user and live in the store, not the config,
  // so bulk exports deliberately omit them (see elementSelector for the per-element path).
  const EXPORTED = ALL_ELEMENTS.filter((el) => !DISPLAY_ELEMENTS.includes(el))

  test('includes :root block with custom properties', () => {
    expect(css).toContain(':root {')
    expect(css).toContain('--ts-base-size:')
    expect(css).toContain('--ts-scale-ratio:')
    expect(css).toContain('--ts-font-heading:')
    expect(css).toContain('--ts-font-body:')
  })

  test('includes CSS variable for every exported element', () => {
    for (const el of EXPORTED) {
      expect(css).toContain(`--ts-${el}:`)
    }
  })

  test('includes element rules with font properties', () => {
    expect(css).toContain('font-size: var(--ts-h1)')
    expect(css).toContain('font-weight:')
    expect(css).toContain('line-height:')
    expect(css).toContain('letter-spacing:')
  })

  test('includes mobile media query', () => {
    expect(css).toContain(`@media (max-width: ${DEFAULT_CONFIG.mobile.breakpointWidth - 1}px)`)
  })

  test('mobile block overrides base size and ratio', () => {
    expect(css).toContain(`--ts-base-size: ${DEFAULT_CONFIG.mobile.baseFontSize}px`)
    expect(css).toContain(`--ts-scale-ratio: ${DEFAULT_CONFIG.mobile.scaleRatio}`)
  })

  test('display elements are omitted from bulk export', () => {
    for (const el of DISPLAY_ELEMENTS) {
      expect(css).not.toContain(`--ts-${el}:`)
      expect(css).not.toContain(`.${el} {`)
    }
  })

  test('display elements ship when the user has enabled them', () => {
    const withDisplay = generateCSS(DEFAULT_CONFIG, { 'display-2': true })
    expect(withDisplay).toContain('--ts-display-2:')
    expect(withDisplay).toContain('.display-2 {')
    expect(withDisplay).not.toContain('--ts-display-1:')
  })

  test('class-selector elements use a class', () => {
    expect(css).toContain('.eyebrow {')
  })

  test('heading elements use tag selector', () => {
    expect(css).toContain('h1 {')
    expect(css).toContain('h6 {')
  })

  test('includes font family references', () => {
    expect(css).toContain(`'${DEFAULT_CONFIG.headingsGroup.fontFamily}'`)
    expect(css).toContain(`'${DEFAULT_CONFIG.bodyGroup.fontFamily}'`)
  })
})

describe('generatePreviewCSS', () => {
  test('includes reset and body styles', () => {
    const css = generatePreviewCSS(DEFAULT_CONFIG)
    expect(css).toContain('* { margin: 0; padding: 0; box-sizing: border-box; }')
    expect(css).toContain('body {')
  })

  test('includes hero illustration glow', () => {
    const css = generatePreviewCSS(DEFAULT_CONFIG)
    expect(css).toContain('#ill-hero::before')
    expect(css).toContain('radial-gradient')
    expect(css).toContain('filter: blur(30px)')
  })

  test('includes the page colour variables', () => {
    const css = generatePreviewCSS(DEFAULT_CONFIG)
    expect(css).toContain('--bg-color:')
    expect(css).toContain('--fg-color:')
    expect(css).toContain('--tone-base:')
  })

  test('includes a variable for every illustration role and source colour', () => {
    const css = generatePreviewCSS(DEFAULT_CONFIG)
    for (const key of [...ILLUSTRATION_ROLES, ...ILLUSTRATION_TONES.map((t) => t.id)]) {
      expect(css).toMatch(new RegExp(`--ill-${key}: oklch\\(`))
    }
  })

  test('drops the old role and alias variables', () => {
    const css = generatePreviewCSS(DEFAULT_CONFIG)
    for (const old of ['--ill-ink', '--ill-primary', '--ill-secondary', '--tone-1', '--scene-tone-1']) {
      expect(css).not.toContain(old)
    }
  })

  test('hero glow is tinted from the illustration palette', () => {
    const css = generatePreviewCSS(DEFAULT_CONFIG)
    expect(css).toContain('color-mix(in oklab, var(--ill-glow)')
  })

  test('hero glow fades out on mid-lightness pages', () => {
    const withBg = (backgroundColor: string) => generatePreviewCSS({ ...DEFAULT_CONFIG, backgroundColor })
    // #666 is OKLCH L ~0.51, squarely mid-grey
    expect(withBg('#666666')).not.toContain('#ill-hero::before')
    expect(withBg('#666666')).toContain('#ill-hero > *')
    expect(withBg('#111111')).toContain('var(--ill-glow) 26%')
    expect(withBg('#fafafa')).toContain('var(--ill-glow) 26%')
    // #3a3a3a is L ~0.34: inside the ramp, so the glow is present but weaker
    const peak = Number(withBg('#3a3a3a').match(/var\(--ill-glow\) ([\d.]+)%/)?.[1])
    expect(peak).toBeGreaterThan(0)
    expect(peak).toBeLessThan(26)
  })

  test('no hero layout override at default scale (1.2)', () => {
    const css = generatePreviewCSS(DEFAULT_CONFIG)
    expect(css).not.toContain('#hero { display: flex')
    expect(css).not.toContain('grid-template-columns: 1.4fr')
  })

  test('scales illustration at M2 range (1.125 < ratio <= 1.2)', () => {
    const config: TypographyConfig = { ...DEFAULT_CONFIG, scaleRatio: 1.15 }
    const css = generatePreviewCSS(config)
    expect(css).toContain('transform: scale(0.85)')
  })

  test('widens text column above M3 (ratio > 1.2)', () => {
    const config: TypographyConfig = { ...DEFAULT_CONFIG, scaleRatio: 1.333 }
    const css = generatePreviewCSS(config)
    expect(css).toContain('grid-template-columns: 1.4fr 0.6fr')
  })

  test('centers hero and hides illustration at A4+ (ratio >= 1.414)', () => {
    const config: TypographyConfig = { ...DEFAULT_CONFIG, scaleRatio: 1.5 }
    const css = generatePreviewCSS(config)
    expect(css).toContain('flex-direction: column')
    expect(css).toContain('#ill-hero { display: none')
    expect(css).toContain('text-align: center')
    expect(css).toContain('margin-left: auto !important')
  })

  test('includes mobile media query', () => {
    const css = generatePreviewCSS(DEFAULT_CONFIG)
    expect(css).toContain(`@media (max-width: ${DEFAULT_CONFIG.mobile.breakpointWidth - 1}px)`)
  })
})
