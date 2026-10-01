import { describe, test, expect } from 'vitest'
import { generateFigmaVariables } from '../figma-variables'
import { computeScale, computeMobileScale } from '../scale'
import { DEFAULT_CONFIG } from '@/data/default-config'
import { ALL_ELEMENTS, DISPLAY_ELEMENTS } from '@/types/typography'

// Bulk exports omit the opt-in display elements.
const EXPORTED = ALL_ELEMENTS.filter((el) => !DISPLAY_ELEMENTS.includes(el))

interface Token {
  $type: string
  $value: unknown
  $extensions: { 'com.figma.scopes': string[] }
}

function leaves(tree: Record<string, unknown>): Token[] {
  return Object.values(tree).flatMap((v) =>
    v && typeof v === 'object' && '$type' in v ? [v as Token] : leaves(v as Record<string, unknown>)
  )
}

describe('generateFigmaVariables', () => {
  const desktop = JSON.parse(generateFigmaVariables(DEFAULT_CONFIG, 'Desktop'))
  const mobile = JSON.parse(generateFigmaVariables(DEFAULT_CONFIG, 'Mobile'))
  const px = (t: Token) => (t.$value as { value: number }).value

  test('every token uses a type Figma imports', () => {
    for (const t of leaves(desktop)) {
      expect(['dimension', 'number', 'fontFamily', 'color']).toContain(t.$type)
      expect(t.$extensions['com.figma.scopes'].length).toBe(1)
    }
  })

  test('dimensions are px, the only unit Figma imports', () => {
    const dims = leaves(desktop).filter((t) => t.$type === 'dimension')
    expect(dims.length).toBeGreaterThan(0)
    for (const t of dims) expect((t.$value as { unit: string }).unit).toBe('px')
  })

  test('has size, line height, tracking and weight for every exported element', () => {
    for (const group of ['font-size', 'line-height', 'letter-spacing', 'font-weight']) {
      expect(Object.keys(desktop[group]).sort()).toEqual([...EXPORTED].sort())
    }
  })

  test('line height and tracking are px, since Figma binds them that way', () => {
    const h1 = computeScale(DEFAULT_CONFIG).find((s) => s.element === 'h1')!
    const eyebrow = computeScale(DEFAULT_CONFIG).find((s) => s.element === 'eyebrow')!
    expect(px(desktop['line-height'].h1)).toBeCloseTo(h1.fontSize * h1.lineHeight, 1)
    expect(px(desktop['letter-spacing'].eyebrow)).toBeCloseTo(eyebrow.fontSize * eyebrow.letterSpacing, 1)
  })

  test('the Mobile file carries the mobile scale under the same names', () => {
    const h1 = computeMobileScale(DEFAULT_CONFIG).find((s) => s.element === 'h1')!
    expect(px(mobile['font-size'].h1)).toBeCloseTo(h1.fontSize, 1)
    expect(px(mobile['font-size'].h1)).not.toBe(px(desktop['font-size'].h1))
    expect(Object.keys(mobile['font-size'])).toEqual(Object.keys(desktop['font-size']))
  })

  test('names fonts as Figma lists them', () => {
    expect(desktop['font-family'].heading.$value).toBe(DEFAULT_CONFIG.headingsGroup.fontFamily)
    const kit = JSON.parse(generateFigmaVariables({
      ...DEFAULT_CONFIG,
      bodyGroup: { ...DEFAULT_CONFIG.bodyGroup, fontFamily: 'freight-text-pro' },
    }, 'Desktop'))
    expect(kit['font-family'].body.$value).toBe('Freight Text Pro')
  })

  test('colors use the DTCG color object', () => {
    const bg = desktop.color.background.$value
    expect(bg.colorSpace).toBe('srgb')
    expect(bg.components).toHaveLength(3)
    expect(bg.hex.toLowerCase()).toBe(DEFAULT_CONFIG.backgroundColor.toLowerCase())
  })

  test('display elements ship only when enabled', () => {
    expect(desktop['font-size']['display-1']).toBeUndefined()
    const withDisplay = JSON.parse(generateFigmaVariables(DEFAULT_CONFIG, 'Desktop', { 'display-1': true }))
    expect(withDisplay['font-size']['display-1']).toBeDefined()
  })
})
