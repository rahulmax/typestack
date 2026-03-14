import { describe, test, expect } from 'vitest'
import { generateCSS, generatePreviewCSS } from '../css-generator'
import { DEFAULT_CONFIG } from '@/data/default-config'
import { ALL_ELEMENTS } from '@/types/typography'
import type { TypographyConfig } from '@/types/typography'

describe('generateCSS', () => {
  const css = generateCSS(DEFAULT_CONFIG)

  test('includes :root block with custom properties', () => {
    expect(css).toContain(':root {')
    expect(css).toContain('--ts-base-size:')
    expect(css).toContain('--ts-scale-ratio:')
    expect(css).toContain('--ts-font-heading:')
    expect(css).toContain('--ts-font-body:')
  })

  test('includes CSS variable for every element', () => {
    for (const el of ALL_ELEMENTS) {
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

  test('display elements use class selector', () => {
    expect(css).toContain('.display-1 {')
    expect(css).toContain('.display-2 {')
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

  test('includes scene tone CSS variables', () => {
    const css = generatePreviewCSS(DEFAULT_CONFIG)
    expect(css).toContain('--bg-color:')
    expect(css).toContain('--tone-base:')
    expect(css).toContain('--scene-tone-1:')
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
