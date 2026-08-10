import { describe, test, expect } from 'vitest'
import { DEFAULT_CONFIG, normalizeConfig } from '../default-config'
import { ALL_ELEMENTS } from '@/types/typography'

describe('DEFAULT_CONFIG', () => {
  test('has all required top-level fields', () => {
    expect(DEFAULT_CONFIG.baseFontSize).toBeDefined()
    expect(DEFAULT_CONFIG.scaleRatio).toBeDefined()
    expect(DEFAULT_CONFIG.headingsGroup).toBeDefined()
    expect(DEFAULT_CONFIG.bodyGroup).toBeDefined()
    expect(DEFAULT_CONFIG.overrides).toBeDefined()
    expect(DEFAULT_CONFIG.mobile).toBeDefined()
    expect(DEFAULT_CONFIG.backgroundColor).toBeDefined()
    expect(DEFAULT_CONFIG.sampleText).toBeDefined()
  })

  test('has overrides for every element', () => {
    for (const el of ALL_ELEMENTS) {
      expect(DEFAULT_CONFIG.overrides[el]).toBeDefined()
      expect(DEFAULT_CONFIG.overrides[el].isOverridden).toBe(false)
    }
  })
})

describe('normalizeConfig', () => {
  test('returns defaults for empty input', () => {
    const config = normalizeConfig({})
    expect(config.baseFontSize).toBe(DEFAULT_CONFIG.baseFontSize)
    expect(config.scaleRatio).toBe(DEFAULT_CONFIG.scaleRatio)
    expect(config.headingsGroup.fontFamily).toBe(DEFAULT_CONFIG.headingsGroup.fontFamily)
  })

  test('preserves provided values', () => {
    const config = normalizeConfig({ baseFontSize: 20, scaleRatio: 1.5 })
    expect(config.baseFontSize).toBe(20)
    expect(config.scaleRatio).toBe(1.5)
  })

  test('merges nested group properties with defaults', () => {
    const config = normalizeConfig({
      headingsGroup: { fontFamily: 'Roboto' },
    })
    expect(config.headingsGroup.fontFamily).toBe('Roboto')
    expect(config.headingsGroup.fontWeight).toBe(DEFAULT_CONFIG.headingsGroup.fontWeight)
  })

  test('merges mobile config with defaults', () => {
    const config = normalizeConfig({
      mobile: { baseFontSize: 14 },
    })
    expect(config.mobile.baseFontSize).toBe(14)
    expect(config.mobile.breakpointWidth).toBe(DEFAULT_CONFIG.mobile.breakpointWidth)
  })

  test('clamps a stored base font size into the slider range', () => {
    expect(normalizeConfig({ baseFontSize: 30 }).baseFontSize).toBe(24)
    expect(normalizeConfig({ baseFontSize: 4 }).baseFontSize).toBe(8)
    expect(normalizeConfig({ mobile: { baseFontSize: 26 } }).mobile.baseFontSize).toBe(20)
  })

  test('clamps group letter-spacing into the per-group ranges', () => {
    const config = normalizeConfig({
      headingsGroup: { letterSpacing: -0.2 },
      bodyGroup: { letterSpacing: 0.2 },
    })
    expect(config.headingsGroup.letterSpacing).toBe(-0.08)
    expect(config.bodyGroup.letterSpacing).toBe(0.1)
  })

  test('clamps element override letter-spacing and leaves untouched overrides alone', () => {
    const config = normalizeConfig({
      overrides: {
        ...DEFAULT_CONFIG.overrides,
        h1: { isOverridden: true, letterSpacing: 0.2 },
        h2: { isOverridden: true, fontWeight: 900 },
      },
    })
    expect(config.overrides.h1.letterSpacing).toBe(0.15)
    expect(config.overrides.h2.letterSpacing).toBeUndefined()
    expect(config.overrides.h2.fontWeight).toBe(900)
    expect(config.overrides.p.isOverridden).toBe(false)
  })

  test('falls back to the default when a bounded field is not a number', () => {
    const config = normalizeConfig({ baseFontSize: 'huge' as unknown as number })
    expect(config.baseFontSize).toBe(DEFAULT_CONFIG.baseFontSize)
  })

  test('handles stale config with missing fields', () => {
    const stale = {
      baseFontSize: 18,
      headingsGroup: { fontFamily: 'Georgia', fontWeight: 600 },
    }
    const config = normalizeConfig(stale)
    expect(config.baseFontSize).toBe(18)
    expect(config.headingsGroup.fontFamily).toBe('Georgia')
    expect(config.headingsGroup.lineHeight).toBe(DEFAULT_CONFIG.headingsGroup.lineHeight)
    expect(config.bodyGroup.fontFamily).toBe(DEFAULT_CONFIG.bodyGroup.fontFamily)
  })
})
