import { describe, test, expect } from 'vitest'
import { generatePenFile } from '../pen-export'
import { DEFAULT_CONFIG } from '@/data/default-config'

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

  test('exports font family variables using Pencil convention', () => {
    expect(vars['--font-primary']).toEqual({
      type: 'string',
      value: DEFAULT_CONFIG.headingsGroup.fontFamily,
    })
    expect(vars['--font-secondary']).toEqual({
      type: 'string',
      value: DEFAULT_CONFIG.bodyGroup.fontFamily,
    })
    expect(Object.keys(vars)).toHaveLength(2)
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
})
