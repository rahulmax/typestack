import { describe, test, expect } from 'vitest'
import { generateTokensStudioJSON } from '../figma-tokens'
import { DEFAULT_CONFIG } from '@/data/default-config'
import { ALL_ELEMENTS } from '@/types/typography'

describe('generateTokensStudioJSON', () => {
  const output = generateTokensStudioJSON(DEFAULT_CONFIG)

  test('produces valid JSON', () => {
    expect(() => JSON.parse(output)).not.toThrow()
  })

  test('includes font families', () => {
    const tokens = JSON.parse(output)
    expect(tokens.fontFamilies.heading.value).toBe(DEFAULT_CONFIG.headingsGroup.fontFamily)
    expect(tokens.fontFamilies.body.value).toBe(DEFAULT_CONFIG.bodyGroup.fontFamily)
  })

  test('includes font sizes for all elements', () => {
    const tokens = JSON.parse(output)
    for (const el of ALL_ELEMENTS) {
      expect(tokens.fontSizes[el]).toBeDefined()
      expect(tokens.fontSizes[el].value).toContain('rem')
      expect(tokens.fontSizes[el].type).toBe('fontSizes')
    }
  })

  test('includes font weights for all elements', () => {
    const tokens = JSON.parse(output)
    for (const el of ALL_ELEMENTS) {
      expect(tokens.fontWeights[el]).toBeDefined()
      expect(tokens.fontWeights[el].type).toBe('fontWeights')
    }
  })

  test('includes typography composites with references', () => {
    const tokens = JSON.parse(output)
    const h1 = tokens.typography.h1
    expect(h1.type).toBe('typography')
    expect(h1.value.fontFamily).toContain('{fontFamilies.')
    expect(h1.value.fontSize).toContain('{fontSizes.h1}')
    expect(h1.value.fontWeight).toContain('{fontWeights.h1}')
  })

  test('line heights are percentages', () => {
    const tokens = JSON.parse(output)
    expect(tokens.lineHeights.h1.value).toMatch(/%$/)
  })
})
