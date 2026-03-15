import { describe, test, expect } from 'vitest'
import { generatePenFile } from '../pen-export'
import { DEFAULT_CONFIG } from '@/data/default-config'
import { DISPLAY_ELEMENTS } from '@/types/typography'

describe('generatePenFile', () => {
  const output = generatePenFile(DEFAULT_CONFIG)
  const parsed = JSON.parse(output)
  const vars = parsed.variables

  test('produces valid JSON with variables key', () => {
    expect(() => JSON.parse(output)).not.toThrow()
    expect(parsed).toHaveProperty('variables')
  })

  test('includes font family string variables', () => {
    expect(vars['font.heading']).toEqual({
      type: 'string',
      value: DEFAULT_CONFIG.headingsGroup.fontFamily,
    })
    expect(vars['font.body']).toEqual({
      type: 'string',
      value: DEFAULT_CONFIG.bodyGroup.fontFamily,
    })
  })

  test('includes fontSize number variables for non-display elements', () => {
    expect(vars['fontSize.h1']).toBeDefined()
    expect(vars['fontSize.h1'].type).toBe('number')
    expect(typeof vars['fontSize.h1'].value).toBe('number')
    expect(vars['fontSize.p']).toBeDefined()
    expect(vars['fontSize.small']).toBeDefined()
  })

  test('excludes display elements', () => {
    for (const el of DISPLAY_ELEMENTS) {
      expect(vars[`fontSize.${el}`]).toBeUndefined()
    }
  })

  test('includes all per-element token categories', () => {
    const categories = ['fontSize', 'fontWeight', 'lineHeight', 'letterSpacing', 'wordSpacing']
    for (const cat of categories) {
      expect(vars[`${cat}.h1`]).toBeDefined()
      expect(vars[`${cat}.h1`].type).toBe('number')
    }
  })

  test('includes textTransform as string variables', () => {
    expect(vars['textTransform.h1']).toEqual({ type: 'string', value: 'none' })
    expect(vars['textTransform.eyebrow']).toEqual({ type: 'string', value: 'uppercase' })
  })
})
