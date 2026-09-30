import { describe, test, expect, vi, afterEach } from 'vitest'
import {
  computeIllustrationPalette,
  computeIllustrationTones,
  ILLUSTRATION_ROLES,
  contrastRatio,
  deltaEOk,
  generateRandomColorPair,
  hexToOklch,
  hexToRgb,
  isInSrgbGamut,
  nextSoftColorway,
  oklchContrast,
  oklchToHex,
  type Oklch,
} from '../color-utils'
import { ILLUSTRATION_TONES } from '../illustration-packs'
import { SOFT_COLORWAYS } from '@/data/soft-colors'

const HARD_CASES: Record<string, [fg: string, bg: string]> = {
  'app default': ['#2e2e2e', '#f5f5f5'],
  'purple / lime': ['#c6ff3d', '#3b1466'],
  'mustard / navy': ['#14213d', '#d9a520'],
  'navy / gold': ['#e1ad01', '#14213d'],
  'grey / grey': ['#2b2b2b', '#9a9a9a'],
  'black on white': ['#000000', '#ffffff'],
  'white on black': ['#ffffff', '#000000'],
  'pink / dark teal': ['#0b4f4a', '#f7a1c4'],
  'orange / black': ['#111111', '#ff7a00'],
  'cobalt / yellow': ['#fde047', '#1d4ed8'],
  'near-black / periwinkle': ['#a5b4fc', '#0a0a14'],
}

function mulberry32(seed: number) {
  let a = seed
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** 400 pairs from the real "random colours" button, seeded so failures reproduce. */
function randomPairs(): [fg: string, bg: string][] {
  vi.spyOn(Math, 'random').mockImplementation(mulberry32(1234))
  const pairs: [string, string][] = []
  for (let i = 0; i < 400; i++) {
    const { fg, bg } = generateRandomColorPair(i % 2 === 1)
    pairs.push([fg, bg])
  }
  vi.restoreAllMocks()
  return pairs
}

const ALL_PAIRS = [...Object.values(HARD_CASES), ...randomPairs()]

/** A dark yellow/lime/orange: the olive and khaki the palette should avoid. */
function isMud({ l, c, h }: Oklch): boolean {
  return c > 0.04 && h >= 65 && h <= 120 && l < 0.7
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('computeIllustrationTones', () => {
  const colours = ILLUSTRATION_TONES.filter((t) => t.kind === 'colour')
  const surfaces = ILLUSTRATION_TONES.filter((t) => t.kind === 'surface')
  const isDark = (fg: string, bg: string) => hexToOklch(fg).l > hexToOklch(bg).l

  test('is deterministic for a given pair', () => {
    for (const [fg, bg] of ALL_PAIRS.slice(0, 40)) {
      expect(computeIllustrationTones(bg, fg)).toEqual(computeIllustrationTones(bg, fg))
    }
  })

  test('has a tone for every shared role and every source colour', () => {
    const tones = computeIllustrationTones('#f5f5f5', '#2e2e2e')
    for (const key of [...ILLUSTRATION_ROLES, ...ILLUSTRATION_TONES.map((t) => t.id)]) {
      expect(tones[key], key).toBeDefined()
    }
  })

  test('every tone is inside the sRGB gamut', () => {
    for (const [fg, bg] of ALL_PAIRS) {
      for (const [key, t] of Object.entries(computeIllustrationTones(bg, fg))) {
        expect(isInSrgbGamut(t), `${key} for ${fg} on ${bg}`).toBe(true)
      }
    }
  })

  test('line is the text colour when it already reads at 4.5:1', () => {
    for (const [fg, bg] of ALL_PAIRS) {
      const { line } = computeIllustrationTones(bg, fg)
      expect(oklchToHex(line.l, line.c, line.h)).toBe(fg)
    }
  })

  test('line is pushed to 4.5:1 when the text colour is too weak', () => {
    const bg = '#fde2e4'
    const fg = '#8fa8e0'
    expect(contrastRatio(hexToRgb(fg), hexToRgb(bg))).toBeLessThan(2)
    const { line } = computeIllustrationTones(bg, fg)
    expect(oklchContrast(line, hexToOklch(bg))).toBeGreaterThanOrEqual(4.5)
  })

  test('line defaults to the foreground but can come from the body colour', () => {
    const tones = computeIllustrationTones('#f5f5f5', '#2e2e2e', '#3a3a3a')
    expect(oklchToHex(tones.line.l, tones.line.c, tones.line.h)).toBe('#3a3a3a')
  })

  test('paper is the page, so figure bodies match it', () => {
    for (const [fg, bg] of ALL_PAIRS.slice(0, 40)) {
      const { paper } = computeIllustrationTones(bg, fg)
      expect(oklchToHex(paper.l, paper.c, paper.h)).toBe(bg)
    }
  })

  test('on light pages solid ink and stipple stay the line colour, as drawn', () => {
    for (const [fg, bg] of ALL_PAIRS.filter(([fg, bg]) => !isDark(fg, bg))) {
      const { line, mass, dot } = computeIllustrationTones(bg, fg)
      expect(mass).toEqual(line)
      expect(dot).toEqual(line)
    }
  })

  // The drawing must never turn into its own negative when the page goes dark
  test('on dark pages solid ink stays the darkest tone in the figure', () => {
    for (const [fg, bg] of ALL_PAIRS.filter(([fg, bg]) => isDark(fg, bg))) {
      const tones = computeIllustrationTones(bg, fg)
      const page = hexToOklch(bg)
      const where = `${fg} on ${bg}`
      expect(tones.mass.l, where).toBeLessThan(tones.line.l)
      expect(tones.dot.l, where).toBeLessThanOrEqual(tones.mass.l + 0.001)
      for (const c of colours) expect(tones.mass.l, `${c.id} ${where}`).toBeLessThan(tones[c.id].l + 0.001)
      // ...but still clear of the page, so hair and shoes don't vanish
      expect(oklchContrast(tones.mass, page), where).toBeGreaterThanOrEqual(1.6)
      expect(oklchContrast(tones.dot, page), where).toBeGreaterThanOrEqual(1.6)
    }
  })

  test('glints stay lighter than the colours they sit on', () => {
    for (const [fg, bg] of ALL_PAIRS) {
      const tones = computeIllustrationTones(bg, fg)
      for (const c of colours) {
        expect(tones.glint.l, `${c.id} for ${fg} on ${bg}`).toBeGreaterThan(tones[c.id].l - 0.001)
      }
    }
  })

  test('surfaces keep their source lightness order on every page', () => {
    for (const [fg, bg] of ALL_PAIRS) {
      const tones = computeIllustrationTones(bg, fg)
      const byPack = Object.groupBy(surfaces, (t) => t.pack)
      for (const own of Object.values(byPack)) {
        const sorted = [...own!].sort((a, b) => a.l - b.l)
        for (let i = 1; i < sorted.length; i++) {
          expect(tones[sorted[i].id].l, `${sorted[i].id} for ${fg} on ${bg}`).toBeGreaterThanOrEqual(tones[sorted[i - 1].id].l - 0.001)
        }
      }
    }
  })

  test('colours keep their source lightness order within a pack', () => {
    // Lift and contrast nudges may pull two close colours level, never flip them far
    for (const [fg, bg] of ALL_PAIRS) {
      const tones = computeIllustrationTones(bg, fg)
      const byPack = Object.groupBy(colours, (t) => t.pack)
      for (const own of Object.values(byPack)) {
        const sorted = [...own!].sort((a, b) => a.l - b.l)
        for (let i = 1; i < sorted.length; i++) {
          if (sorted[i].l - sorted[i - 1].l < 0.1) continue
          expect(tones[sorted[i].id].l, `${sorted[i].id} for ${fg} on ${bg}`).toBeGreaterThanOrEqual(tones[sorted[i - 1].id].l - 0.05)
        }
      }
    }
  })

  test('colour fills lift off the page and let lines read on top', () => {
    for (const [fg, bg] of ALL_PAIRS) {
      const tones = computeIllustrationTones(bg, fg)
      const page = hexToOklch(bg)
      for (const c of colours) {
        const fill = tones[c.id]
        const offPage = oklchContrast(fill, page) >= 1.25 || deltaEOk(fill, page) >= 0.12
        const lineReads = oklchContrast(fill, tones.line) >= 2 || deltaEOk(fill, tones.line) >= 0.15
        expect(offPage, `${c.id} vs page for ${fg} on ${bg}`).toBe(true)
        expect(lineReads, `${c.id} vs line for ${fg} on ${bg}`).toBe(true)
      }
    }
  })

  test('colour fills never turn to olive or khaki', () => {
    for (const [fg, bg] of ALL_PAIRS) {
      const tones = computeIllustrationTones(bg, fg)
      for (const c of colours) expect(isMud(tones[c.id]), `${c.id} for ${fg} on ${bg}`).toBe(false)
    }
  })

  test('neutral pages get monochrome colours', () => {
    for (const name of ['app default', 'grey / grey', 'black on white', 'white on black']) {
      const [fg, bg] = HARD_CASES[name]
      const tones = computeIllustrationTones(bg, fg)
      for (const c of colours) expect(tones[c.id].c, `${c.id} on ${name}`).toBeLessThan(0.03)
    }
  })

  test("each pack's most used colour lands on the page hue", () => {
    const { noodle } = Object.groupBy(colours, (t) => t.pack)
    const lead = noodle!.reduce((a, b) => (b.uses > a.uses ? b : a))
    const tones = computeIllustrationTones('#ffffff', '#1d3a8a')
    const d = Math.abs(tones[lead.id].h - hexToOklch('#1d3a8a').h) % 360
    expect(Math.min(d, 360 - d)).toBeLessThan(10)
  })

  test('surface stays a quiet tint of the page', () => {
    for (const [fg, bg] of ALL_PAIRS) {
      const { surface } = computeIllustrationTones(bg, fg)
      expect(oklchContrast(surface, hexToOklch(bg)), `${fg} on ${bg}`).toBeLessThan(1.35)
    }
  })
})

describe('computeIllustrationPalette', () => {
  test('returns an oklch() string for every tone', () => {
    const palette = computeIllustrationPalette('#f5f5f5', '#2e2e2e')
    for (const key of [...ILLUSTRATION_ROLES, ...ILLUSTRATION_TONES.map((t) => t.id)]) {
      expect(palette[key], key).toMatch(/^oklch\(\d\.\d{4} \d\.\d{4} \d+\.\d{2}\)$/)
    }
  })
})

describe('nextSoftColorway', () => {
  test('every soft colorway reads at 3:1 or better', () => {
    for (const { bg, heading, body } of SOFT_COLORWAYS) {
      expect(contrastRatio(hexToRgb(heading), hexToRgb(bg))).toBeGreaterThanOrEqual(3)
      expect(contrastRatio(hexToRgb(body), hexToRgb(bg))).toBeGreaterThanOrEqual(3)
    }
  })

  test('deals every colorway once before repeating', () => {
    const seen = new Set(Array.from(SOFT_COLORWAYS, () => nextSoftColorway()))
    expect(seen.size).toBe(SOFT_COLORWAYS.length)
  })
})
