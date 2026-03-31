/**
 * Fetch font metrics for all preset fonts missing from the bundled table.
 * Outputs TypeScript entries ready to paste into font-metrics-table.ts
 */

import { parse as parseFont } from 'opentype.js'

const MISSING_FONTS = [
  'Albert Sans', 'Alegreya Sans', 'Alfa Slab One', 'Anybody', 'Assistant',
  'Baloo 2', 'Balsamiq Sans', 'Be Vietnam Pro', 'Bellota Text',
  'Big Shoulders Display', 'Bodoni Moda', 'Bricolage Grotesque',
  'Calistoga', 'Cherry Bomb One', 'Comfortaa', 'Corben',
  'Cormorant Infant', 'DM Serif Display', 'Darker Grotesque',
  'Eczar', 'Epilogue', 'Fanwood Text', 'Figtree', 'Fraunces',
  'Fredoka', 'Funnel Display', 'Gabarito', 'Gentium Book Plus',
  'Goudy Bookletter 1911', 'Gruppo', 'Halant', 'Instrument Serif',
  'Italiana', 'JetBrains Mono', 'Lalezar', 'Lancelot',
  'Libre Caslon Text', 'Literata', 'Luckiest Guy', 'Lustria',
  'Merriweather Sans', 'Neuton', 'Newsreader', 'Noto Serif Display',
  'Nunito Sans', 'Open Sans Condensed', 'Parkinsans', 'Passion One',
  'Protest Strike', 'Proza Libre', 'Quattrocento', 'Quattrocento Sans',
  'Roboto Serif', 'Roboto Slab', 'Rosario', 'Rozha One',
  'Seaweed Script', 'Shrikhand', 'Sora', 'Source Sans 3',
  'Source Serif Pro', 'Space Grotesk', 'Squada One', 'Tilt Warp',
  'Unbounded', 'Varela Round', 'Zilla Slab',
]

async function fetchMetrics(fontFamily) {
  const cssUrl = `https://fonts.googleapis.com/css?family=${encodeURIComponent(fontFamily)}:400`
  const cssRes = await fetch(cssUrl)
  const cssText = await cssRes.text()

  const urlMatch = cssText.match(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+\.ttf)\)/)
  if (!urlMatch) throw new Error(`No TTF URL for ${fontFamily}`)

  const fontRes = await fetch(urlMatch[1])
  const buffer = await fontRes.arrayBuffer()
  const font = parseFont(buffer)

  const upm = font.unitsPerEm
  const os2 = font.tables.os2
  const xH = os2?.sxHeight ?? upm * 0.52
  const capH = os2?.sCapHeight ?? upm * 0.72
  const asc = os2?.sTypoAscender ?? font.ascender
  const desc = os2?.sTypoDescender ?? font.descender

  return {
    unitsPerEm: upm,
    xHeight: +(xH / upm).toFixed(3),
    capHeight: +(capH / upm).toFixed(3),
    ascender: +(asc / upm).toFixed(3),
    descender: +(desc / upm).toFixed(3),
  }
}

const results = []
const failures = []

for (const font of MISSING_FONTS) {
  try {
    const m = await fetchMetrics(font)
    results.push({ name: font, ...m })
    console.error(`OK: ${font}`)
  } catch (e) {
    failures.push(font)
    console.error(`FAIL: ${font} — ${e.message}`)
  }
}

// Output TS entries
for (const r of results) {
  console.log(`  "${r.name}": { unitsPerEm: ${r.unitsPerEm}, xHeight: ${r.xHeight}, capHeight: ${r.capHeight}, ascender: ${r.ascender}, descender: ${r.descender} },`)
}

if (failures.length > 0) {
  console.error(`\n=== ${failures.length} failures ===`)
  failures.forEach(f => console.error(`  - ${f}`))
}
