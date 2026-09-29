import { describe, test, expect, vi, afterEach } from 'vitest'
import {
  computeIllustrationPalette,
  computeIllustrationTones,
  contrastRatio,
  deltaEOk,
  generateRandomColorPair,
  hexToOklch,
  hexToRgb,
  isInSrgbGamut,
  oklchContrast,
  oklchToHex,
  type IllustrationRole,
  type Oklch,
} from '../color-utils'

const ROLES: IllustrationRole[] = ['ink', 'primary', 'secondary', 'accent', 'highlight', 'surface']
const FILLS: IllustrationRole[] = ['primary', 'secondary', 'accent', 'highlight']

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
  test('is deterministic for a given pair', () => {
    for (const [fg, bg] of ALL_PAIRS.slice(0, 40)) {
      expect(computeIllustrationTones(bg, fg)).toEqual(computeIllustrationTones(bg, fg))
    }
  })

  test('every role is inside the sRGB gamut', () => {
    for (const [fg, bg] of ALL_PAIRS) {
      const tones = computeIllustrationTones(bg, fg)
      for (const role of ROLES) {
        expect(isInSrgbGamut(tones[role]), `${role} for ${fg} on ${bg}`).toBe(true)
      }
    }
  })

  test('fills never go neon', () => {
    for (const [fg, bg] of ALL_PAIRS) {
      const tones = computeIllustrationTones(bg, fg)
      for (const role of FILLS) {
        expect(tones[role].c, `${role} for ${fg} on ${bg}`).toBeLessThanOrEqual(0.175)
      }
    }
  })

  test('ink is the text colour when it already reads at 4.5:1', () => {
    for (const [fg, bg] of ALL_PAIRS) {
      const { ink } = computeIllustrationTones(bg, fg)
      expect(oklchToHex(ink.l, ink.c, ink.h)).toBe(fg)
    }
  })

  test('ink is pushed to 4.5:1 when the text colour is too weak', () => {
    const bg = '#fde2e4'
    const fg = '#8fa8e0'
    expect(contrastRatio(hexToRgb(fg), hexToRgb(bg))).toBeLessThan(2)
    const { ink } = computeIllustrationTones(bg, fg)
    expect(oklchContrast(ink, hexToOklch(bg))).toBeGreaterThanOrEqual(4.5)
  })

  test('the two large fills stay visibly apart', () => {
    for (const [fg, bg] of ALL_PAIRS) {
      const { primary, secondary } = computeIllustrationTones(bg, fg)
      expect(deltaEOk(primary, secondary), `${fg} on ${bg}`).toBeGreaterThanOrEqual(0.099)
    }
  })

  test('large fills lift off the page and let ink lines read on top', () => {
    for (const [fg, bg] of ALL_PAIRS) {
      const tones = computeIllustrationTones(bg, fg)
      const page = hexToOklch(bg)
      for (const role of ['primary', 'secondary'] as const) {
        const fill = tones[role]
        const offPage = oklchContrast(fill, page) >= 1.25 || deltaEOk(fill, page) >= 0.12
        const inkReads = oklchContrast(fill, tones.ink) >= 2 || deltaEOk(fill, tones.ink) >= 0.15
        expect(offPage, `${role} vs page for ${fg} on ${bg}`).toBe(true)
        expect(inkReads, `${role} vs ink for ${fg} on ${bg}`).toBe(true)
      }
    }
  })

  test('small marks clear 3:1 against the page', () => {
    for (const [fg, bg] of ALL_PAIRS) {
      const { accent } = computeIllustrationTones(bg, fg)
      expect(oklchContrast(accent, hexToOklch(bg)), `${fg} on ${bg}`).toBeGreaterThanOrEqual(3)
    }
  })

  test('highlights read against the ink they sit on', () => {
    for (const [fg, bg] of ALL_PAIRS) {
      const { highlight, ink } = computeIllustrationTones(bg, fg)
      expect(oklchContrast(highlight, ink), `${fg} on ${bg}`).toBeGreaterThanOrEqual(3)
    }
  })

  test('surface stays a quiet tint of the page', () => {
    for (const [fg, bg] of ALL_PAIRS) {
      const { surface } = computeIllustrationTones(bg, fg)
      expect(oklchContrast(surface, hexToOklch(bg)), `${fg} on ${bg}`).toBeLessThan(1.35)
    }
  })

  test('large fills never turn to olive or khaki', () => {
    for (const [fg, bg] of ALL_PAIRS) {
      const { primary, secondary } = computeIllustrationTones(bg, fg)
      expect(isMud(primary), `primary for ${fg} on ${bg}`).toBe(false)
      expect(isMud(secondary), `secondary for ${fg} on ${bg}`).toBe(false)
    }
  })

  test('neutral pages get monochrome fills', () => {
    for (const name of ['app default', 'grey / grey', 'black on white', 'white on black']) {
      const [fg, bg] = HARD_CASES[name]
      const tones = computeIllustrationTones(bg, fg)
      for (const role of FILLS) {
        expect(tones[role].c, `${role} on ${name}`).toBeLessThan(0.03)
      }
    }
  })

  test('neutral fills spread across lightness so two tones read', () => {
    const [fg, bg] = HARD_CASES['black on white']
    const { primary, secondary } = computeIllustrationTones(bg, fg)
    expect(Math.abs(primary.l - secondary.l)).toBeGreaterThanOrEqual(0.1)
  })

  test('on a light page the primary fill echoes the text hue', () => {
    const { primary } = computeIllustrationTones('#ffffff', '#d62828')
    const red = hexToOklch('#d62828')
    expect(Math.abs(primary.h - red.h)).toBeLessThan(10)
    expect(primary.l).toBeGreaterThan(red.l)
  })

  test('on a dark page with lime text the fills come from the page, not the lime', () => {
    const [fg, bg] = HARD_CASES['purple / lime']
    const { primary } = computeIllustrationTones(bg, fg)
    expect(Math.abs(primary.h - hexToOklch(bg).h)).toBeLessThan(10)
    expect(primary.l).toBeGreaterThan(0.6)
  })

  test('a muddy page hue moves above a light page instead of darkening', () => {
    const [fg, bg] = HARD_CASES['orange / black']
    const { primary } = computeIllustrationTones(bg, fg)
    expect(primary.l).toBeGreaterThan(hexToOklch(bg).l)
  })

  test('secondary stays away from a coloured ink hue', () => {
    const { secondary, ink } = computeIllustrationTones('#1b1d5b', '#e26811')
    const d = Math.abs(secondary.h - ink.h) % 360
    expect(Math.min(d, 360 - d)).toBeGreaterThanOrEqual(40)
  })

  test('ink defaults to the foreground but can come from the body colour', () => {
    const tones = computeIllustrationTones('#f5f5f5', '#2e2e2e', '#3a3a3a')
    expect(oklchToHex(tones.ink.l, tones.ink.c, tones.ink.h)).toBe('#3a3a3a')
  })
})

describe('computeIllustrationPalette', () => {
  test('returns an oklch() string for every role', () => {
    const palette = computeIllustrationPalette('#f5f5f5', '#2e2e2e')
    for (const role of ROLES) {
      expect(palette[role]).toMatch(/^oklch\(\d\.\d{4} \d\.\d{4} \d+\.\d{2}\)$/)
    }
  })
})
