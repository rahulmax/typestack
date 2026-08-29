import { describe, test, expect } from 'vitest'
import { generateTailwindCSS, generateTailwindConfig } from '../tailwind-export'
import { DEFAULT_CONFIG } from '@/data/default-config'
import { ALL_ELEMENTS, DISPLAY_ELEMENTS } from '@/types/typography'

// Bulk exports omit the opt-in display elements.
const EXPORTED = ALL_ELEMENTS.filter((el) => !DISPLAY_ELEMENTS.includes(el))

// The v3 output is a `/* ... */` font-import prologue, then a `//` header line,
// then the JSON body starting on its own line.
const configJSON = (out: string) => JSON.parse(out.slice(out.indexOf('\n{') + 1))

describe('generateTailwindCSS (v4)', () => {
  const css = generateTailwindCSS(DEFAULT_CONFIG)

  test('wraps tokens in @theme block', () => {
    expect(css).toContain('@theme {')
    expect(css).toContain('}')
  })

  test('includes font family tokens', () => {
    expect(css).toContain('--font-heading:')
    expect(css).toContain('--font-body:')
  })

  test('includes text size token for every exported element', () => {
    for (const el of EXPORTED) {
      expect(css).toContain(`--text-${el}:`)
    }
  })

  test('includes line-height and letter-spacing tokens', () => {
    expect(css).toContain('--text-h1--line-height:')
    expect(css).toContain('--text-h1--letter-spacing:')
  })

  test('generates utility classes', () => {
    expect(css).toContain('.text-h1 {')
    expect(css).toContain('.text-p {')
    expect(css).toContain('font-family: var(--font-heading)')
    expect(css).toContain('font-family: var(--font-body)')
  })
})

describe('generateTailwindConfig (v3)', () => {
  const output = generateTailwindConfig(DEFAULT_CONFIG)

  test('starts with comment', () => {
    expect(output).toContain('// tailwind.config.js')
  })

  test('includes valid JSON after comment', () => {
    const parsed = configJSON(output)
    expect(parsed).toBeDefined()
  })

  test('includes font families', () => {
    const parsed = configJSON(output)
    expect(parsed.fontFamily.heading[0]).toContain(DEFAULT_CONFIG.headingsGroup.fontFamily)
    expect(parsed.fontFamily.body[0]).toContain(DEFAULT_CONFIG.bodyGroup.fontFamily)
  })

  test('includes font size entries for all exported elements', () => {
    const parsed = configJSON(output)
    for (const el of EXPORTED) {
      expect(parsed.fontSize[el]).toBeDefined()
      expect(parsed.fontSize[el][0]).toContain('rem')
    }
  })

  test('font size entries include line-height and letter-spacing', () => {
    const parsed = configJSON(output)
    const h1 = parsed.fontSize.h1
    expect(h1[1].lineHeight).toBeDefined()
    expect(h1[1].letterSpacing).toBeDefined()
    expect(h1[1].fontWeight).toBeDefined()
  })
})
