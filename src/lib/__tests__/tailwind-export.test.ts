import { describe, test, expect } from 'vitest'
import { generateTailwindCSS, generateTailwindConfig } from '../tailwind-export'
import { DEFAULT_CONFIG } from '@/data/default-config'
import { ALL_ELEMENTS } from '@/types/typography'

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

  test('includes text size token for every element', () => {
    for (const el of ALL_ELEMENTS) {
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
    const json = output.replace(/^\/\/.*\n/, '')
    const parsed = JSON.parse(json)
    expect(parsed).toBeDefined()
  })

  test('includes font families', () => {
    const json = output.replace(/^\/\/.*\n/, '')
    const parsed = JSON.parse(json)
    expect(parsed.fontFamily.heading[0]).toContain(DEFAULT_CONFIG.headingsGroup.fontFamily)
    expect(parsed.fontFamily.body[0]).toContain(DEFAULT_CONFIG.bodyGroup.fontFamily)
  })

  test('includes font size entries for all elements', () => {
    const json = output.replace(/^\/\/.*\n/, '')
    const parsed = JSON.parse(json)
    for (const el of ALL_ELEMENTS) {
      expect(parsed.fontSize[el]).toBeDefined()
      expect(parsed.fontSize[el][0]).toContain('rem')
    }
  })

  test('font size entries include line-height and letter-spacing', () => {
    const json = output.replace(/^\/\/.*\n/, '')
    const parsed = JSON.parse(json)
    const h1 = parsed.fontSize.h1
    expect(h1[1].lineHeight).toBeDefined()
    expect(h1[1].letterSpacing).toBeDefined()
    expect(h1[1].fontWeight).toBeDefined()
  })
})
