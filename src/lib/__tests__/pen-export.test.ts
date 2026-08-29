import { describe, test, expect } from 'vitest'
import { generatePenFile } from '../pen-export'
import { DEFAULT_CONFIG } from '@/data/default-config'

interface PenNode {
  id: string
  type: string
  [key: string]: unknown
}

function walk(nodes: PenNode[]): PenNode[] {
  return nodes.flatMap((n) => [
    n,
    ...walk((n.children as PenNode[] | undefined) ?? []),
  ])
}

describe('generatePenFile', () => {
  const output = generatePenFile(DEFAULT_CONFIG)
  const parsed = JSON.parse(output)
  const vars = parsed.variables
  const nodes = walk(parsed.children)
  const texts = nodes.filter((n) => n.type === 'text')
  const refs = nodes.filter((n) => n.type === 'ref')

  test('produces valid .pen document structure', () => {
    expect(() => JSON.parse(output)).not.toThrow()
    expect(parsed.version).toBe('2.17')
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

  // ── Schema conformance ─────────────────────────────────────────

  test('every fontWeight is a string', () => {
    // pen.dev types fontWeight as StringOrVariable; the file loader silently
    // discards a numeric weight and falls back to `normal`.
    const weighted = [
      ...texts,
      ...refs.flatMap((r) => Object.values(r.descendants as Record<string, PenNode>)),
    ].filter((n) => n.fontWeight !== undefined)

    expect(weighted.length).toBeGreaterThan(0)
    for (const node of weighted) {
      expect(typeof node.fontWeight).toBe('string')
    }
  })

  test('heading components carry the configured weight', () => {
    const h1 = parsed.children.find((c: PenNode) => c.id === 'comp-h1')
    expect(h1.children[0].fontWeight).toBe(String(DEFAULT_CONFIG.headingsGroup.fontWeight))
  })

  test('letter spacing is converted from em to pixels', () => {
    const h1 = parsed.children.find((c: PenNode) => c.id === 'comp-h1')
    const text = h1.children[0]
    expect(text.letterSpacing).toBeCloseTo(
      DEFAULT_CONFIG.headingsGroup.letterSpacing * text.fontSize,
      6
    )
  })

  test('zero letter spacing is omitted rather than emitted as a default', () => {
    const p = parsed.children.find((c: PenNode) => c.id === 'comp-p')
    expect(DEFAULT_CONFIG.bodyGroup.letterSpacing).toBe(0)
    expect(p.children[0]).not.toHaveProperty('letterSpacing')
  })

  test('overriding fontSize rescales the em-based tracking', () => {
    const brand = nodes.find((n) => n.id === 'desk-nav-brand')!
    const override = (brand.descendants as Record<string, PenNode>)['comp-text-h4']
    expect(override.letterSpacing).toBeCloseTo(
      DEFAULT_CONFIG.headingsGroup.letterSpacing * (override.fontSize as number),
      6
    )
  })

  test('text nodes bind their family to a font variable', () => {
    const h1 = parsed.children.find((c: PenNode) => c.id === 'comp-h1')
    const p = parsed.children.find((c: PenNode) => c.id === 'comp-p')
    expect(h1.children[0].fontFamily).toBe('$--font-primary')
    expect(p.children[0].fontFamily).toBe('$--font-secondary')
  })

  test('every fill is a hex colour or a variable reference', () => {
    // Color is #RGB / #RRGGBB / #RRGGBBAA; `transparent` is not a valid value.
    const filled = nodes.filter((n) => typeof n.fill === 'string')
    expect(filled.length).toBeGreaterThan(0)
    for (const node of filled) {
      expect(node.fill as string).toMatch(/^(#[0-9a-fA-F]{3,8}|\$[\w-]+)$/)
    }
  })

  test('spacer rectangles carry no fill at all', () => {
    const spacer = nodes.find((n) => n.id === 'blog-desk-blog-spacer-1')!
    expect(spacer.type).toBe('rectangle')
    expect(spacer).not.toHaveProperty('fill')
  })

  test('blockquote uses the current stroke properties', () => {
    const quote = nodes.find((n) => n.id === 'blog-desk-blog-quote')!
    expect(quote.stroke).toBe(DEFAULT_CONFIG.headingsGroup.color)
    expect(quote.strokeWidth).toEqual({ left: 3 })
    expect(quote.strokeAlignment).toBe('inner')
  })

  // ── Layout invariants ──────────────────────────────────────────

  test('component text grows automatically and sets no width', () => {
    // A fit_content instance collapses to zero against a fill_container child.
    for (const component of parsed.children.filter((c: { reusable?: boolean }) => c.reusable)) {
      const text = component.children[0]
      expect(text.textGrowth).toBe('auto')
      expect(text).not.toHaveProperty('width')
      expect(component.width).toBe('fit_content')
    }
  })

  test('fill_container instances make their text wrap', () => {
    const filling = refs.filter((r) => r.width === 'fill_container')
    expect(filling.length).toBeGreaterThan(0)
    for (const ref of filling) {
      const override = Object.values(ref.descendants as Record<string, PenNode>)[0]
      expect(override.textGrowth).toBe('fixed-width')
      expect(override.width).toBe('fill_container')
    }
  })

  test('self-sized instances leave the component text untouched', () => {
    const fitting = refs.filter((r) => r.width === 'fit_content')
    expect(fitting.length).toBeGreaterThan(0)
    for (const ref of fitting) {
      const override = Object.values(ref.descendants as Record<string, PenNode>)[0]
      expect(override).not.toHaveProperty('width')
      expect(override).not.toHaveProperty('textGrowth')
    }
  })

  test('no node uses the unsupported width value "auto"', () => {
    for (const node of nodes) {
      expect(node.width).not.toBe('auto')
    }
  })
})
