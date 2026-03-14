import { describe, test, expect } from 'vitest'
import { computeFontSize, computeScale, computeMobileScale, resolveElementStyles } from '../scale'
import { DEFAULT_CONFIG } from '@/data/default-config'
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
  test('eyebrow defaults to uppercase with 0.2 letter-spacing', () => {
    const style = resolveElementStyles('eyebrow', DEFAULT_CONFIG)
    expect(style.textTransform).toBe('uppercase')
    expect(style.letterSpacing).toBe(0.2)
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
