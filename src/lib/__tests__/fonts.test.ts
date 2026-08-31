import { describe, test, expect, vi } from 'vitest'

vi.mock('../adobe-fonts', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../adobe-fonts')>()),
  isAdobeFamily: (family: string) => family === 'proxima-nova',
}))

const { buildFontImports } = await import('../fonts')

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
