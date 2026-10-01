import { describe, test, expect } from 'vitest'
import { FONTSOURCE_FONTS } from '@/data/fontsource-fonts'
import { POPULAR_FONTS } from '@/data/popular-fonts'
import { buildFontsourceImports, getFontsourceCssUrls, matchWeight } from '../fontsource'
import {
  buildFontImports,
  getFontCategory,
  getFontLinkUrls,
  getFontPageUrl,
  getFontSource,
  getFontStack,
} from '../fonts'
import { isKitSlug } from '../adobe-fonts'

describe('curated list', () => {
  test('never shares a name with a Google family', () => {
    const google = new Set(POPULAR_FONTS.map((f) => f.family))
    expect(FONTSOURCE_FONTS.filter((f) => google.has(f.family))).toEqual([])
  })

  test('never looks like an Adobe kit slug', () => {
    expect(FONTSOURCE_FONTS.filter((f) => isKitSlug(f.family))).toEqual([])
  })

  test('carries plausible metrics for every family', () => {
    for (const { family, metrics } of FONTSOURCE_FONTS) {
      expect(metrics.xHeight, family).toBeGreaterThan(0.35)
      expect(metrics.capHeight, family).toBeGreaterThanOrEqual(metrics.xHeight)
    }
  })
})

describe('matchWeight', () => {
  test('keeps weights the family has', () => {
    expect(matchWeight([400, 700], 700)).toBe(700)
  })

  test('rounds heavy weights up, as the browser does', () => {
    expect(matchWeight([400, 700], 600)).toBe(700)
  })

  test('rounds light weights down', () => {
    expect(matchWeight([100, 400], 300)).toBe(100)
  })

  test('falls back to whatever exists', () => {
    expect(matchWeight([700], 400)).toBe(700)
    expect(matchWeight([400], 900)).toBe(400)
  })
})

describe('stylesheets', () => {
  test('pins the package version and adds italics where they exist', () => {
    expect(getFontsourceCssUrls('Redaction', [400])).toEqual([
      'https://cdn.jsdelivr.net/npm/@fontsource/redaction@5.3.0/400.css',
      'https://cdn.jsdelivr.net/npm/@fontsource/redaction@5.3.0/400-italic.css',
    ])
  })

  test('fetches only faces the family has', () => {
    const urls = getFontsourceCssUrls('Geist Sans', [100, 200, 300, 400, 500, 600, 700, 800, 900])
    expect(urls).toHaveLength(9)
    expect(getFontsourceCssUrls('Bluu Next', [400, 700]).every((u) => u.includes('/700'))).toBe(true)
  })

  test('goes into the preview iframe next to Google', () => {
    const urls = getFontLinkUrls(['Geist Sans', 'Inter'], [400])
    expect(urls.some((u) => u.includes('@fontsource/geist-sans'))).toBe(true)
    expect(urls.some((u) => u.includes('fonts.googleapis.com') && u.includes('Inter'))).toBe(true)
    expect(urls.some((u) => u.includes('Geist%20Sans'))).toBe(false)
  })
})

describe('exports', () => {
  test('imports the faces the design renders', () => {
    const lines = buildFontsourceImports('Apfel Grotezk', [400, 600])
    expect(lines.filter((l) => l.startsWith('@import'))).toEqual([
      "@import url('https://cdn.jsdelivr.net/npm/@fontsource/apfel-grotezk@5.3.0/400.css');",
      "@import url('https://cdn.jsdelivr.net/npm/@fontsource/apfel-grotezk@5.3.0/700.css');",
    ])
  })

  test('never asks Google for a Fontsource family', () => {
    const css = buildFontImports(new Map([['Geist Sans', new Set([400])]])).join('\n')
    expect(css).toContain('@fontsource/geist-sans')
    expect(css).not.toContain('googleapis')
  })

  test('names the package for self-hosting', () => {
    expect(buildFontsourceImports('Geist Sans', [400])[0]).toContain('@fontsource/geist-sans@5.3.0')
  })
})

describe('source routing', () => {
  test('tells the three sources apart by family string', () => {
    expect(getFontSource('Geist Sans')).toBe('fontsource')
    expect(getFontSource('Inter')).toBe('google')
    expect(getFontSource('proxima-nova')).toBe('adobe')
  })

  test('uses the curated category, overrides included', () => {
    expect(getFontCategory('Monaspace Radon')).toBe('monospace')
    expect(getFontStack('Iosevka Etoile')).toBe("'Iosevka Etoile', serif")
  })
})

describe('getFontPageUrl', () => {
  test('sends each family to its page at its own source', () => {
    expect(getFontPageUrl('Redaction 35')).toBe('https://fontsource.org/fonts/redaction-35')
    expect(getFontPageUrl('Open Sans')).toBe('https://fonts.google.com/specimen/Open+Sans')
    expect(getFontPageUrl('proxima-nova')).toBe('https://fonts.adobe.com/fonts/proxima-nova')
  })

  test('corrects the kit slugs Adobe does not redirect', () => {
    expect(getFontPageUrl('lemonde-journal')).toBe('https://fonts.adobe.com/fonts/le-monde-journal')
  })
})

describe('presets', () => {
  test('use only weights their Fontsource families ship', async () => {
    const { PRESETS } = await import('@/db/seed-presets')
    const byFamily = new Map(FONTSOURCE_FONTS.map((f) => [f.family, f]))
    const fontsource = PRESETS.flatMap((p) => [
      [p.headingFont, p.headingWeight] as const,
      [p.bodyFont, p.bodyWeight] as const,
    ]).filter(([family]) => byFamily.has(family))
    expect(fontsource.length).toBeGreaterThan(0)
    for (const [family, weight] of fontsource) {
      expect(byFamily.get(family)!.weights, family).toContain(weight)
    }
  })
})
