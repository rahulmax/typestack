import { describe, test, expect } from 'vitest'
import { computeFontSize, computeScale, computeMobileScale, resolveElementStyles, resolveElementStylesMobile } from '../scale'
import { DEFAULT_CONFIG, normalizeConfig } from '@/data/default-config'
import { ALL_ELEMENTS, SCALE_POSITIONS } from '@/types/typography'
import type { TypographyConfig } from '@/types/typography'

describe('computeFontSize', () => {
  test('base element (p, position 0) returns base font size', () => {
    expect(computeFontSize(16, 1.2, 'p')).toBe(16)
  })

  test('h1 (position 6) scales correctly', () => {
    const expected = 16 * Math.pow(1.2, 6)
    expect(computeFontSize(16, 1.2, 'h1')).toBeCloseTo(expected)
  })

  test('small (position -1) is smaller than base', () => {
    const result = computeFontSize(16, 1.2, 'small')
    expect(result).toBeLessThan(16)
    expect(result).toBeCloseTo(16 / 1.2)
  })

  test('display-1 (position 9) is largest', () => {
    const result = computeFontSize(16, 1.2, 'display-1')
    const h1 = computeFontSize(16, 1.2, 'h1')
    expect(result).toBeGreaterThan(h1)
  })

  test('higher scale ratio produces larger sizes', () => {
    const small = computeFontSize(16, 1.1, 'h1')
    const large = computeFontSize(16, 1.5, 'h1')
    expect(large).toBeGreaterThan(small)
  })
})

describe('computeScale', () => {
  test('returns all elements', () => {
    const scale = computeScale(DEFAULT_CONFIG)
    expect(scale).toHaveLength(ALL_ELEMENTS.length)
    for (const el of ALL_ELEMENTS) {
      expect(scale.find((s) => s.element === el)).toBeDefined()
    }
  })

  test('elements are ordered by ALL_ELEMENTS', () => {
    const scale = computeScale(DEFAULT_CONFIG)
    expect(scale.map((s) => s.element)).toEqual(ALL_ELEMENTS)
  })

  test('font sizes decrease with scale position', () => {
    const scale = computeScale(DEFAULT_CONFIG)
    const h1 = scale.find((s) => s.element === 'h1')!
    const h2 = scale.find((s) => s.element === 'h2')!
    const p = scale.find((s) => s.element === 'p')!
    expect(h1.fontSize).toBeGreaterThan(h2.fontSize)
    expect(h2.fontSize).toBeGreaterThan(p.fontSize)
  })

  test('headings use heading group properties', () => {
    const scale = computeScale(DEFAULT_CONFIG)
    const h1 = scale.find((s) => s.element === 'h1')!
    expect(h1.fontFamily).toBe(DEFAULT_CONFIG.headingsGroup.fontFamily)
    expect(h1.fontWeight).toBe(DEFAULT_CONFIG.headingsGroup.fontWeight)
  })

  test('body uses body group properties', () => {
    const scale = computeScale(DEFAULT_CONFIG)
    const p = scale.find((s) => s.element === 'p')!
    expect(p.fontFamily).toBe(DEFAULT_CONFIG.bodyGroup.fontFamily)
    expect(p.fontWeight).toBe(DEFAULT_CONFIG.bodyGroup.fontWeight)
  })

  test('fontSizeRem is fontSize / 16', () => {
    const scale = computeScale(DEFAULT_CONFIG)
    for (const style of scale) {
      expect(style.fontSizeRem).toBeCloseTo(style.fontSize / 16)
    }
  })
})

describe('resolveElementStyles', () => {
  test('eyebrow defaults to uppercase with 0.08 letter-spacing', () => {
    const style = resolveElementStyles('eyebrow', DEFAULT_CONFIG)
    expect(style.textTransform).toBe('uppercase')
    expect(style.letterSpacing).toBe(0.08)
  })

  test('mobile eyebrow resolves to the same tracking as desktop', () => {
    const desktop = resolveElementStyles('eyebrow', DEFAULT_CONFIG)
    const mobile = resolveElementStylesMobile('eyebrow', DEFAULT_CONFIG)
    expect(mobile.letterSpacing).toBe(desktop.letterSpacing)
    expect(mobile.textTransform).toBe(desktop.textTransform)
  })

  test('an explicit eyebrow override beats the element default', () => {
    const config: TypographyConfig = {
      ...DEFAULT_CONFIG,
      overrides: {
        ...DEFAULT_CONFIG.overrides,
        eyebrow: { isOverridden: true, letterSpacing: 0.15 },
      },
    }
    expect(resolveElementStyles('eyebrow', config).letterSpacing).toBe(0.15)
    expect(resolveElementStylesMobile('eyebrow', config).letterSpacing).toBe(0.15)
  })

  test('element defaults do not leak to other body elements', () => {
    for (const element of ['p', 'small'] as const) {
      const style = resolveElementStyles(element, DEFAULT_CONFIG)
      expect(style.letterSpacing).toBe(DEFAULT_CONFIG.bodyGroup.letterSpacing)
      expect(style.textTransform).toBe('none')
    }
  })

  test('a stored config with a full overrides map still resolves eyebrow to 0.08', () => {
    const config = normalizeConfig(
      JSON.parse(JSON.stringify({ ...DEFAULT_CONFIG, baseFontSize: 18 }))
    )
    expect(resolveElementStyles('eyebrow', config).letterSpacing).toBe(0.08)
  })

  test('overrides are applied when isOverridden is true', () => {
    const config: TypographyConfig = {
      ...DEFAULT_CONFIG,
      overrides: {
        ...DEFAULT_CONFIG.overrides,
        h1: { isOverridden: true, fontWeight: 900, lineHeight: 0.9 },
      },
    }
    const style = resolveElementStyles('h1', config)
    expect(style.fontWeight).toBe(900)
    expect(style.lineHeight).toBe(0.9)
  })

  test('overrides do not apply when isOverridden is false', () => {
    const config: TypographyConfig = {
      ...DEFAULT_CONFIG,
      overrides: {
        ...DEFAULT_CONFIG.overrides,
        h1: { isOverridden: false, fontWeight: 900 },
      },
    }
    const style = resolveElementStyles('h1', config)
    expect(style.fontWeight).toBe(DEFAULT_CONFIG.headingsGroup.fontWeight)
  })
})

describe('computeMobileScale', () => {
  test('uses mobile config values', () => {
    const scale = computeMobileScale(DEFAULT_CONFIG)
    const p = scale.find((s) => s.element === 'p')!
    expect(p.fontSize).toBe(DEFAULT_CONFIG.mobile.baseFontSize)
  })

  test('mobile sizes are smaller than desktop at same ratio', () => {
    const desktop = computeScale(DEFAULT_CONFIG)
    const mobile = computeMobileScale(DEFAULT_CONFIG)
    const dH1 = desktop.find((s) => s.element === 'h1')!
    const mH1 = mobile.find((s) => s.element === 'h1')!
    expect(mH1.fontSize).toBeLessThan(dH1.fontSize)
  })
})
