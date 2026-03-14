import { describe, test, expect } from 'vitest'
import { encodeConfig, decodeConfig } from '../url-codec'
import { DEFAULT_CONFIG } from '@/data/default-config'
import type { TypographyConfig } from '@/types/typography'

describe('url-codec', () => {
  test('roundtrip preserves config', () => {
    const encoded = encodeConfig(DEFAULT_CONFIG)
    const decoded = decodeConfig(encoded)
    expect(decoded).not.toBeNull()
    expect(decoded!.baseFontSize).toBe(DEFAULT_CONFIG.baseFontSize)
    expect(decoded!.scaleRatio).toBe(DEFAULT_CONFIG.scaleRatio)
    expect(decoded!.headingsGroup.fontFamily).toBe(DEFAULT_CONFIG.headingsGroup.fontFamily)
    expect(decoded!.bodyGroup.fontWeight).toBe(DEFAULT_CONFIG.bodyGroup.fontWeight)
    expect(decoded!.mobile.breakpointWidth).toBe(DEFAULT_CONFIG.mobile.breakpointWidth)
  })

  test('encodeConfig returns a non-empty string', () => {
    const encoded = encodeConfig(DEFAULT_CONFIG)
    expect(typeof encoded).toBe('string')
    expect(encoded.length).toBeGreaterThan(0)
  })

  test('decodeConfig returns null for garbage input', () => {
    expect(decodeConfig('not-valid-compressed-data')).toBeNull()
  })

  test('decodeConfig returns null for empty string', () => {
    expect(decodeConfig('')).toBeNull()
  })

  test('roundtrip preserves overrides', () => {
    const config: TypographyConfig = {
      ...DEFAULT_CONFIG,
      overrides: {
        ...DEFAULT_CONFIG.overrides,
        h1: { isOverridden: true, fontWeight: 900 },
      },
    }
    const decoded = decodeConfig(encodeConfig(config))
    expect(decoded!.overrides.h1.isOverridden).toBe(true)
    expect(decoded!.overrides.h1.fontWeight).toBe(900)
  })

  test('roundtrip preserves custom fonts', () => {
    const config: TypographyConfig = {
      ...DEFAULT_CONFIG,
      headingsGroup: { ...DEFAULT_CONFIG.headingsGroup, fontFamily: 'Playfair Display' },
      bodyGroup: { ...DEFAULT_CONFIG.bodyGroup, fontFamily: 'Source Sans Pro' },
    }
    const decoded = decodeConfig(encodeConfig(config))
    expect(decoded!.headingsGroup.fontFamily).toBe('Playfair Display')
    expect(decoded!.bodyGroup.fontFamily).toBe('Source Sans Pro')
  })
})
