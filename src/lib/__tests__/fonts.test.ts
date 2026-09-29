import { describe, test, expect, vi } from 'vitest'

vi.mock('../adobe-fonts', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../adobe-fonts')>()),
  isAdobeFamily: (family: string) => family === 'proxima-nova',
}))

const { buildFontImports, canRenderFamily, getFontLabel, getFontStack } = await import('../fonts')

describe('buildFontImports', () => {
  test('imports Google families directly', () => {
    const lines = buildFontImports(new Map([['Inter', new Set([400, 700])]]))
    expect(lines).toEqual([
      "@import url('https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,400;1,400;0,700;1,700&display=swap');",
    ])
  })

  test('never leaks the kit that TypeStax previews with', () => {
    const lines = buildFontImports(new Map([['proxima-nova', new Set([400])]])).join('\n')
    expect(lines).toContain('YOUR_KIT_ID')
    expect(lines).not.toMatch(/use\.typekit\.net\/(?!YOUR_KIT_ID)/)
  })

  test('explains why a kit ID cannot be shared', () => {
    const lines = buildFontImports(new Map([['proxima-nova', new Set([400])]])).join('\n')
    expect(lines).toContain('proxima-nova')
    expect(lines).toContain('allowlist')
  })

  test('emits one kit import however many kit families are used', () => {
    const lines = buildFontImports(
      new Map([
        ['proxima-nova', new Set([400])],
        ['Inter', new Set([400])],
      ]),
    )
    expect(lines.filter((l) => l.includes('use.typekit.net'))).toHaveLength(1)
    expect(lines.some((l) => l.includes('fonts.googleapis.com'))).toBe(true)
  })
})

describe('getFontLabel', () => {
  test('names kit families the way a designer reads them', () => {
    expect(getFontLabel('proxima-nova')).toBe('Proxima Nova')
  })

  test('leaves Google families untouched', () => {
    expect(getFontLabel('Source Serif 4')).toBe('Source Serif 4')
  })
})

describe('getFontStack', () => {
  test('falls back to a real CSS generic family', () => {
    expect(getFontStack('Playfair Display')).toBe("'Playfair Display', serif")
    // "display" is our category, not a CSS keyword
    expect(getFontStack('Gabarito')).toBe("'Gabarito', sans-serif")
  })
})

describe('canRenderFamily', () => {
  test('renders Google families and families in the served kit', () => {
    expect(canRenderFamily('Inter')).toBe(true)
    expect(canRenderFamily('proxima-nova')).toBe(true)
  })

  test('refuses kit families this deployment does not serve', () => {
    expect(canRenderFamily('freight-text-pro')).toBe(false)
  })
})
