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
  isThreeColor,
  COLORWAYS,
  CYCLE_CONTRAST_FLOOR,
  colorwaysIn,
  nextHardColorway,
  nextMedColorway,
  nextSoftColorway,
  oklchContrast,
  oklchToHex,
  cycleColors,
  cyclePalette,
  type ColorRoles,
  type CycleMemory,
  type Oklch,
} from '../color-utils'
import { ILLUSTRATION_TONES } from '../illustration-packs'
import { SPECIMEN_COLORWAYS } from '@/data/soft-colors'
import { ALEX_CRISTACHE_COLORWAYS } from '@/data/alex-cristache-colors'

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

describe('colorways', () => {
  test('every colorway reads at 3:1 or better', () => {
    for (const { bg, heading, body } of COLORWAYS) {
      expect(contrastRatio(hexToRgb(heading), hexToRgb(bg))).toBeGreaterThanOrEqual(3)
      expect(contrastRatio(hexToRgb(body), hexToRgb(bg))).toBeGreaterThanOrEqual(3)
    }
  })

  test('remember where they came from', () => {
    expect(SPECIMEN_COLORWAYS.every((c) => c.source === 'specimen')).toBe(true)
    expect(ALEX_CRISTACHE_COLORWAYS.every((c) => c.source === 'alex-cristache')).toBe(true)
  })

  test('each sit in exactly one bucket', () => {
    const sizes = (['soft', 'med', 'hard'] as const).map((b) => colorwaysIn(b).length)
    expect(sizes.every((n) => n > 50)).toBe(true)
    expect(sizes.reduce((a, b) => a + b)).toBe(COLORWAYS.length)
  })

  test('get harder from bucket to bucket', () => {
    const median = (b: 'soft' | 'med' | 'hard') => {
      const r = colorwaysIn(b).map(({ bg, body }) => contrastRatio(hexToRgb(body), hexToRgb(bg))).sort((x, y) => x - y)
      return r[Math.floor(r.length / 2)]
    }
    expect(median('soft')).toBeLessThan(median('med'))
    expect(median('med')).toBeLessThan(median('hard'))
  })
})

describe.each([
  ['nextSoftColorway', 'soft', nextSoftColorway],
  ['nextMedColorway', 'med', nextMedColorway],
  ['nextHardColorway', 'hard', nextHardColorway],
] as const)('%s', (_, bucket, next) => {
  const colorways = colorwaysIn(bucket)

  test('deals every colorway once before repeating', () => {
    const seen = new Set(Array.from(colorways, () => next()))
    expect(seen.size).toBe(colorways.length)
  })
})

describe('cycleColors', () => {
  const ratio = (fg: string, bg: string) => contrastRatio(hexToRgb(fg), hexToRgb(bg))

  /** Presses the button `times` times, carrying the memory along as the app does. */
  function press(start: ColorRoles, times: number): ColorRoles[] {
    const seen: ColorRoles[] = []
    let roles = start
    let memory: CycleMemory | null = null
    for (let i = 0; i < times; i++) {
      ;({ roles, memory } = cycleColors(roles, memory))
      seen.push(roles)
    }
    return seen
  }

  test('two colors swap foreground and background', () => {
    expect(cycleColors({ heading: '#111111', body: '#111111', bg: '#eeeeee' }, null).roles)
      .toEqual({ heading: '#eeeeee', body: '#eeeeee', bg: '#111111' })
  })

  test('three colors rotate, giving each a turn as the background', () => {
    const start = { heading: '#000000', body: '#ffffff', bg: '#c00000' }
    const turns = press(start, 3)
    expect(turns.map((t) => t.bg)).toEqual(['#ffffff', '#000000', '#c00000'])
    expect(turns[2]).toEqual(start)
  })

  test('two strong hues short of an accessibility grade still take their turns', () => {
    // Forest & Terracotta on Paper 2: orange on green is 2.3:1, under AA but plainly readable
    const start = { heading: '#ee6612', body: '#17633c', bg: '#f7f8f2' }
    expect(ratio('#ee6612', '#17633c')).toBeLessThan(3)
    expect(press(start, 3)).toEqual([
      { heading: '#f7f8f2', body: '#ee6612', bg: '#17633c' },
      { heading: '#17633c', body: '#f7f8f2', bg: '#ee6612' },
      start,
    ])
  })

  test('a near-twin of the page is held back, and the page still turns', () => {
    // Off-white cannot be read on white, nor white on off-white, but each still gets to be the page
    const start = { heading: '#e8e0dc', body: '#ffffff', bg: '#6b4433' }
    expect(press(start, 3)).toEqual([
      { heading: '#6b4433', body: '#6b4433', bg: '#ffffff' },
      { heading: '#6b4433', body: '#6b4433', bg: '#e8e0dc' },
      start,
    ])
  })

  test('a held ink is still shown as part of the cycle', () => {
    const start = { heading: '#e8e0dc', body: '#ffffff', bg: '#6b4433' }
    const { roles, memory } = cycleColors(start, null)
    expect(isThreeColor(roles.heading, roles.body)).toBe(false)
    const palette = cyclePalette(roles, memory)
    expect([palette.heading, palette.body, palette.bg].sort()).toEqual(['#6b4433', '#e8e0dc', '#ffffff'])
  })

  test('changing a color by hand drops the held ink', () => {
    const { memory } = cycleColors({ heading: '#e8e0dc', body: '#ffffff', bg: '#6b4433' }, null)
    const edited = { heading: '#102030', body: '#102030', bg: '#ffffff' }
    expect(cyclePalette(edited, memory)).toEqual(edited)
    expect(cycleColors(edited, memory).roles).toEqual({ heading: '#ffffff', body: '#ffffff', bg: '#102030' })
  })

  test('every curated colorway gives each color the page and comes back whole', () => {
    for (const colorway of COLORWAYS) {
      const start = { heading: colorway.heading, body: colorway.body, bg: colorway.bg }
      const three = isThreeColor(start.heading, start.body)
      const turns = press(start, three ? 3 : 2)
      expect(turns[turns.length - 1], colorway.name).toEqual(start)
      expect(new Set(turns.map((t) => t.bg.toLowerCase())).size, colorway.name).toBe(
        new Set([start.heading, start.body, start.bg].map((c) => c.toLowerCase())).size
      )
    }
  })

  test('no ink is left on a page it cannot be read on while a better one is at hand', () => {
    for (const colorway of COLORWAYS) {
      let roles: ColorRoles = { heading: colorway.heading, body: colorway.body, bg: colorway.bg }
      let memory: CycleMemory | null = null
      // The curated arrangement itself is left alone; only the turns the cycle deals are checked
      for (let i = 0; i < 2; i++) {
        ;({ roles, memory } = cycleColors(roles, memory))
        const { heading, body, bg } = cyclePalette(roles, memory)
        const best = Math.max(ratio(heading, bg), ratio(body, bg))
        for (const ink of [roles.heading, roles.body]) {
          const r = ratio(ink, roles.bg)
          expect(r >= CYCLE_CONTRAST_FLOOR || r === best, `${colorway.name}: ${ink} on ${roles.bg}`).toBe(true)
        }
      }
    }
  })

  test('heading and body that differ only in case count as one color', () => {
    expect(isThreeColor('#ABCDEF', '#abcdef')).toBe(false)
  })
})
