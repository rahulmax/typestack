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
