import { describe, test, expect } from 'vitest'
import { FOUNDRY_FONTS } from '@/data/foundry-fonts'
import { FONTSOURCE_FONTS } from '@/data/fontsource-fonts'
import { POPULAR_FONTS } from '@/data/popular-fonts'
import { DEFAULT_CONFIG } from '@/data/default-config'
import { buildFoundryFontFaces, getFoundryCssUrl } from '../foundry-fonts'
import {
  buildFontFaces,
  buildFontImports,
  getFontCategory,
  getFontLinkUrls,
  getFontPageUrl,
  getFontSource,
  getFontSourceName,
} from '../fonts'
import { resolveFontMetrics } from '../font-metrics'
import { isKitSlug } from '../adobe-fonts'
import { generateCSS } from '../css-generator'
import { generateTailwindCSS, generateTailwindConfig } from '../tailwind-export'
import type { TypographyConfig } from '@/types/typography'

const withFonts = (heading: string, body: string): TypographyConfig => ({
  ...DEFAULT_CONFIG,
  headingsGroup: { ...DEFAULT_CONFIG.headingsGroup, fontFamily: heading },
  bodyGroup: { ...DEFAULT_CONFIG.bodyGroup, fontFamily: body },
})

describe('curated list', () => {
  test('never shares a name with a Google or Fontsource family', () => {
    const taken = new Set([...POPULAR_FONTS, ...FONTSOURCE_FONTS].map((f) => f.family))
    expect(FOUNDRY_FONTS.filter((f) => taken.has(f.family))).toEqual([])
  })

  test('never looks like an Adobe kit slug', () => {
    expect(FOUNDRY_FONTS.filter((f) => isKitSlug(f.family))).toEqual([])
  })

  test('has no duplicate families', () => {
    expect(new Set(FOUNDRY_FONTS.map((f) => f.family)).size).toBe(FOUNDRY_FONTS.length)
  })

  test('pins every package, so an export never changes under a finished design', () => {
    for (const { family, pkg } of FOUNDRY_FONTS) {
      expect(pkg, family).toMatch(/^(gh\/[^/]+\/[^/@]+@[0-9a-f]{40}|npm\/[^@]+@\d+\.\d+\.\d+)$/)
    }
  })

  test('serves woff2 only, with at least one upright face per family', () => {
    for (const { family, faces } of FOUNDRY_FONTS) {
      expect(faces.some((f) => f.style === 'normal'), family).toBe(true)
      for (const face of faces) expect(face.path, family).toMatch(/\.woff2$/)
    }
  })

  test('never lists a weight and style twice', () => {
    for (const { family, faces } of FOUNDRY_FONTS) {
      const keys = faces.map((f) => `${f.weight} ${f.style}`)
      expect(new Set(keys).size, family).toBe(keys.length)
    }
  })

  test('carries plausible metrics for every family, and the app reads them', async () => {
    for (const { family, metrics } of FOUNDRY_FONTS) {
      expect(metrics.xHeight, family).toBeGreaterThan(0.35)
      expect(metrics.capHeight, family).toBeGreaterThanOrEqual(metrics.xHeight)
      expect(await resolveFontMetrics(family), family).toEqual(metrics)
    }
  })
})

describe('buildFoundryFontFaces', () => {
  test('writes one rule per face, pointing at the pinned file', () => {
    const font = FOUNDRY_FONTS.find((f) => f.family === 'Ronzino')!
    const rules = buildFoundryFontFaces('Ronzino')
    expect(rules).toHaveLength(font.faces.length)
    expect(rules[0]).toContain("font-family: 'Ronzino';")
    expect(rules[0]).toContain(`url('https://cdn.jsdelivr.net/${font.pkg}/${font.faces[0].path}') format('woff2')`)
  })

  test('narrows to the faces the weights call for, italics included', () => {
    const font = FOUNDRY_FONTS.find((f) => f.faces.some((face) => face.style === 'italic'))!
    const upright = font.faces.filter((f) => f.style === 'normal')
    const rules = buildFoundryFontFaces(font.family, [upright[0].weight])
    expect(rules.length).toBeLessThan(font.faces.length)
    expect(rules.some((r) => r.includes('font-style: italic'))).toBe(true)
    expect(rules.some((r) => r.includes(`font-weight: ${upright[0].weight};`))).toBe(true)
  })

  test('serves the face a browser would render for a weight the family lacks', () => {
    const single = FOUNDRY_FONTS.find((f) => f.faces.length === 1)!
    const rules = buildFoundryFontFaces(single.family, [700])
    expect(rules).toHaveLength(1)
    expect(rules[0]).toContain(`font-weight: ${single.faces[0].weight};`)
  })

  test('has nothing to say about other sources', () => {
    expect(buildFoundryFontFaces('Inter')).toEqual([])
    expect(getFoundryCssUrl('Inter')).toBeUndefined()
  })
})

describe('source routing', () => {
  test('resolves a foundry family from its name alone', () => {
    expect(getFontSource('Departure Mono')).toBe('foundry')
    expect(getFontCategory('Departure Mono')).toBe('monospace')
  })

  test('credits the foundry, not a service', () => {
    expect(getFontSourceName('Departure Mono')).toBe('Helena Zhang')
    expect(getFontSourceName('Inter')).toBe('Google Fonts')
  })

  test('links to the family page at its foundry', () => {
    const font = FOUNDRY_FONTS.find((f) => f.family === 'Ronzino')!
    expect(getFontPageUrl('Ronzino')).toBe(font.page)
  })

  test('hands the preview iframe a stylesheet it can link', () => {
    const [url] = getFontLinkUrls(['Ronzino'], [400])
    expect(url.startsWith('data:text/css;charset=utf-8,')).toBe(true)
    expect(decodeURIComponent(url)).toContain("font-family: 'Ronzino';")
  })
})

describe('exports', () => {
  const families = new Map([
    ['Ronzino', new Set([400])],
    ['Inter', new Set([400])],
  ])

  test('keeps foundry families out of the @import lines', () => {
    const imports = buildFontImports(families)
    expect(imports).toHaveLength(1)
    expect(imports[0]).toContain('family=Inter')
  })

  test('credits the foundry and its licence above the faces', () => {
    const [credit, ...faces] = buildFontFaces(families)
    expect(credit).toContain('Ronzino by Collletttivo (OFL-1.1)')
    expect(faces.length).toBeGreaterThan(0)
    expect(faces.every((f) => f.startsWith('@font-face {'))).toBe(true)
  })

  test('puts every @import ahead of the first @font-face', () => {
    for (const css of [
      generateCSS(withFonts('Ronzino', 'Inter')),
      generateTailwindCSS(withFonts('Ronzino', 'Inter')),
    ]) {
      expect(css).toContain('@font-face')
      expect(css.lastIndexOf('@import')).toBeLessThan(css.indexOf('@font-face'))
    }
  })

  test('keeps the faces above the tokens that name them', () => {
    const css = generateTailwindCSS(withFonts('Ronzino', 'Ronzino'))
    expect(css.indexOf('@font-face')).toBeLessThan(css.indexOf('@theme {'))
  })

  test('the v3 config stays valid JavaScript around its font notes', () => {
    // Fontsource and foundry lines carry block comments, which a block comment cannot hold.
    const out = generateTailwindConfig(withFonts('Ronzino', 'Geist Sans'))
    const prologue = out.slice(0, out.indexOf('\n\n'))
    expect(prologue).toContain('@font-face')
    expect(prologue).toContain('@fontsource/geist-sans')
    for (const line of prologue.split('\n')) expect(line.startsWith('//')).toBe(true)
  })
})
