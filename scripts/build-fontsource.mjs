// Builds the curated Fontsource list the font picker offers next to Google and
// Adobe: src/data/fontsource-fonts.ts.
//
// Fontsource mirrors all of Google Fonts, so only its own families -- the ones
// Google doesn't carry -- are worth a third source. The IDs below are a hand
// pick of those, minus the CJK, pixel, music and punctuation-only fonts.
// For each one this pulls weights, styles and the npm version from the
// Fontsource API, and measures vertical metrics from the regular TTF so auto
// balance never has to fetch a font at runtime.
//
//   node scripts/build-fontsource.mjs

import { writeFileSync } from 'node:fs'
import opentype from 'opentype.js'

const API = 'https://api.fontsource.org/v1/fonts'

// id -> category override, where Fontsource's own category misleads the picker
// (Monaspace Radon is not handwriting; Iosevka Etoile is not monospace).
const CURATED = {
  'adwaita-sans': null,
  'adwaita-mono': null,
  aileron: null,
  'apfel-grotezk': null,
  'argentum-sans': null,
  bagnard: null,
  'bagnard-sans': null,
  'blackout-midnight': 'display',
  'blackout-sunrise': 'display',
  'blackout-two-am': 'display',
  'bluu-next': 'serif',
  'chunk-five': 'display',
  'clear-sans': null,
  'comic-mono': null,
  'commit-mono': null,
  'cooper-hewitt': null,
  'dejavu-sans': null,
  'dejavu-serif': null,
  'dejavu-mono': null,
  'dseg7-classic': 'display',
  'dseg14-classic': 'display',
  firago: null,
  'geist-sans': null,
  'hauora-sans': null,
  'ia-writer-duo': null,
  'ia-writer-mono': null,
  'ia-writer-quattro': null,
  iosevka: null,
  'iosevka-aile': 'sans-serif',
  'iosevka-etoile': 'serif',
  junction: null,
  karmilla: null,
  'league-mono': null,
  lextrall: null,
  'libre-caslon-condensed': null,
  'maple-mono': null,
  metropolis: null,
  'monaspace-argon': null,
  'monaspace-krypton': null,
  'monaspace-neon': null,
  'monaspace-radon': 'monospace',
  'monaspace-xenon': 'monospace',
  mononoki: null,
  'nebula-sans': null,
  norwester: 'display',
  'open-runde': null,
  'open-sauce-sans': null,
  'open-sauce-one': null,
  opendyslexic: null,
  'ostrich-sans': 'display',
  'peace-sans': 'display',
  'pitagon-sans': null,
  'pitagon-sans-text': null,
  'pitagon-serif': null,
  'pitagon-sans-mono': null,
  pretendard: null,
  redaction: null,
  'redaction-35': null,
  'redaction-70': null,
  'redaction-100': null,
  'uncut-sans': null,
}

const CATEGORIES = new Set(['sans-serif', 'serif', 'display', 'monospace', 'handwriting'])

const round = (n) => Math.round(n * 1000) / 1000

async function getJSON(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${res.status} ${url}`)
  return res.json()
}

/** Top of a glyph's outline, or undefined when the font has no such glyph. */
function glyphTop(font, char) {
  const glyph = font.charToGlyph(char)
  if (!glyph || glyph.index === 0) return undefined
  const top = glyph.getBoundingBox().y2
  return top > 0 ? top : undefined
}

/**
 * x-height and cap height come from the outlines of "x" and "H": several of
 * these fonts carry OS/2 values that are plainly wrong (Aileron claims 0.26).
 */
function metricsFrom(buffer) {
  const font = opentype.parse(buffer)
  const upm = font.unitsPerEm
  const os2 = font.tables.os2
  const xHeight = glyphTop(font, 'x') ?? (os2?.sxHeight || upm * 0.52)
  const capHeight = glyphTop(font, 'H') ?? (os2?.sCapHeight || upm * 0.72)
  return {
    unitsPerEm: upm,
    xHeight: round(xHeight / upm),
    capHeight: round(capHeight / upm),
    ascender: round((os2?.sTypoAscender ?? font.ascender) / upm),
    descender: round((os2?.sTypoDescender ?? font.descender) / upm),
  }
}

/** The face closest to regular, since metrics are read from one weight. */
function regularWeight(weights) {
  return weights.reduce((best, w) => (Math.abs(w - 400) < Math.abs(best - 400) ? w : best))
}

async function build(id, override) {
  const meta = await getJSON(`${API}/${id}`)
  if (meta.type === 'google') throw new Error(`${id} is a Google family; Google already serves it`)

  const weight = regularWeight(meta.weights)
  const style = meta.styles.includes('normal') ? 'normal' : meta.styles[0]
  const subset = meta.defSubset
  const urls = meta.variants[weight]?.[style]?.[subset]?.url
  if (!urls) throw new Error(`${id} has no ${subset} ${weight} ${style} face`)

  const category = override ?? meta.category
  if (!CATEGORIES.has(category)) throw new Error(`${id} needs a category override (got ${meta.category})`)

  return {
    id,
    family: meta.family,
    category,
    weights: meta.weights,
    italic: meta.styles.includes('italic'),
    version: meta.npmVersion,
    metrics: await measure(id, urls),
  }
}

/**
 * opentype.js reads TTF and WOFF but not WOFF2. A few Fontsource "TTF" files
 * are something else under that name, so WOFF is the fallback.
 */
async function measure(id, urls) {
  for (const url of [urls.ttf, urls.woff].filter(Boolean)) {
    const res = await fetch(url)
    if (!res.ok) continue
    try {
      return metricsFrom(await res.arrayBuffer())
    } catch {
      // try the next format
    }
  }
  throw new Error(`${id}: no parseable TTF or WOFF`)
}

const google = new Set((await getJSON(`${API}?type=google`)).map((f) => f.family))
const fonts = await Promise.all(Object.entries(CURATED).map(([id, override]) => build(id, override)))

for (const font of fonts) {
  // Family strings are the source key; a Google twin would make one ambiguous.
  if (google.has(font.family)) throw new Error(`${font.family} collides with a Google family`)
}

fonts.sort((a, b) => a.family.localeCompare(b.family))

const out = `// Generated by scripts/build-fontsource.mjs. Do not edit.
import type { FontsourceFamily } from "@/types/fonts";

export const FONTSOURCE_FONTS: FontsourceFamily[] = [
${fonts.map((f) => `  ${JSON.stringify(f)},`).join('\n')}
];
`

writeFileSync('src/data/fontsource-fonts.ts', out)
console.log(`Wrote ${fonts.length} Fontsource families to src/data/fontsource-fonts.ts`)
