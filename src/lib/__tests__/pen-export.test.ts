import { describe, test, expect } from 'vitest'
import { generatePenFile } from '../pen-export'
import { DEFAULT_CONFIG } from '@/data/default-config'
import { DISPLAY_ELEMENTS } from '@/types/typography'

describe('generatePenFile', () => {
  const output = generatePenFile(DEFAULT_CONFIG)
  const parsed = JSON.parse(output)
  const vars = parsed.variables

  test('produces valid .pen document structure', () => {
    expect(() => JSON.parse(output)).not.toThrow()
    expect(parsed.version).toBe('2.8')
    expect(parsed).toHaveProperty('variables')
    expect(parsed.children[0].id).toBe('type-scale')
    expect(parsed.children[0].type).toBe('frame')
  })

  test('type scale frame contains rows for each non-display element', () => {
    const rowsFrame = parsed.children[0].children.find((c: { id: string }) => c.id === 'rows')
    expect(rowsFrame).toBeDefined()
    expect(rowsFrame.children).toHaveLength(9) // h1-h6 + p + eyebrow + small
  })

  test('includes reusable text components for each element', () => {
    const components = parsed.children.filter((c: { reusable?: boolean }) => c.reusable)
    expect(components).toHaveLength(9)
    expect(components[0].name).toBe('H1')
    expect(components[0].children[0].type).toBe('text')
    expect(components[0].children[0].fontSize).toBeGreaterThan(16)
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
