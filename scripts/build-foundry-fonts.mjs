// Builds the list of families served straight from their foundries' own
// repositories: src/data/foundry-fonts.ts.
//
// These are open-licensed families that neither Google nor Fontsource carries.
// jsDelivr serves any public GitHub repo or npm package at a pinned commit or
// version, so the foundry's own woff2 files are the webfonts -- nothing is
// converted, subset or re-hosted, which keeps clear of the OFL's rules on
// modified versions and Reserved Font Names.
//
// For each family this checks that the licence file still says what it said
// when the family was picked, that every face is where the list says it is,
// and measures vertical metrics from the regular OTF/TTF beside the woff2
// (opentype.js cannot read woff2).
//
//   node scripts/build-foundry-fonts.mjs
//
// To add a family: pin its repo to a full commit SHA, list its static woff2
// files with the weight each one should answer to (OS/2 weight classes in
// these fonts are often wrong, so the list is the authority), and name an
// OTF or TTF of the regular face to measure.

import { writeFileSync } from 'node:fs'
import opentype from 'opentype.js'

const CDN = 'https://cdn.jsdelivr.net'

const LICENSES = {
  'OFL-1.1': /SIL Open Font License, Version 1\.1/,
  MIT: /MIT License/,
}

const collletttivo = (repo, sha) => ({
  foundry: 'Collletttivo',
  pkg: `gh/collletttivo/${repo}@${sha}`,
  page: `https://www.collletttivo.it/typefaces/${repo}`,
  license: 'OFL-1.1',
  licenseFile: 'LICENSE.txt',
})

const SPRAT = collletttivo('sprat', 'bdf9c50243d647290ecb21555b03a1aafba447ac')
const HALIBUT = collletttivo('halibut', '13df8fd7ea926f9a47049ec1426fcce186909ee8')
const ORTICA = collletttivo('ortica', '27bf44d3ea5057b7abcd09a8922d43d0b37a4f06')

/** Six weights of one Sprat width. `regular` covers the upstream "Condesed" typo. */
const spratFaces = (width, regular = `${width}Regular`) => [
  [100, `fonts/Sprat-${width}Thin`],
  [300, `fonts/Sprat-${width}Light`],
  [400, `fonts/Sprat-${regular}`],
  [500, `fonts/Sprat-${width}Medium`],
  [700, `fonts/Sprat-${width}Bold`],
  [900, `fonts/Sprat-${width}Black`],
]

const OVERUSED_WEIGHTS = { 300: 'Light', 500: 'Medium', 600: 'SemiBold', 700: 'Bold', 800: 'ExtraBold', 900: 'Black' }

// Each face is [weight, path without ".woff2", style?]. `metrics` is the OTF or
// TTF to measure, without which it is the first face's path with ".otf".
const FAMILIES = [
  {
    family: 'Ronzino',
    category: 'sans-serif',
    ...collletttivo('ronzino', '24df8cdde479fef13948de629c3b10849e1dffb5'),
    faces: [
      [400, 'fonts/Ronzino-Regular'],
      [400, 'fonts/Ronzino-Oblique', 'italic'],
      [500, 'fonts/Ronzino-Medium'],
      [500, 'fonts/Ronzino-MediumOblique', 'italic'],
      [700, 'fonts/Ronzino-Bold'],
      [700, 'fonts/Ronzino-BoldOblique', 'italic'],
    ],
  },
  { family: 'Sprat', category: 'serif', ...SPRAT, faces: spratFaces(''), metrics: 'fonts/Sprat-Regular.otf' },
  {
    family: 'Sprat Condensed',
    category: 'serif',
    ...SPRAT,
    faces: spratFaces('Condensed', 'CondesedRegular'),
    metrics: 'fonts/Sprat-CondesedRegular.otf',
  },
  {
    family: 'Sprat Extended',
    category: 'serif',
    ...SPRAT,
    faces: spratFaces('Extended'),
    metrics: 'fonts/Sprat-ExtendedRegular.otf',
  },
  {
    family: 'Coconat',
    category: 'serif',
    ...collletttivo('coconat', '75f0bf21470de362ebee2f173e99505b7a7e977b'),
    faces: [
      [400, 'fonts/Coconat-Regular'],
      [600, 'fonts/Coconat-Demi'],
      [700, 'fonts/Coconat-Bold'],
    ],
  },
  {
    family: 'Mattone',
    category: 'sans-serif',
    ...collletttivo('mattone', 'b1dc55dc6a432708ab00329d452d8f6907c6e570'),
    faces: [
      [400, 'fonts/Mattone-Regular'],
      [700, 'fonts/Mattone-Bold'],
      [900, 'fonts/Mattone-Black'],
    ],
  },
  {
    family: 'Sinistre',
    category: 'sans-serif',
    ...collletttivo('sinistre', 'fbf85f1130670ff2e1b944a17ec13872996b4305'),
    faces: [
      [400, 'fonts/Sinistre-Regular'],
      [700, 'fonts/Sinistre-Bold'],
      [900, 'fonts/Sinistre-Dark'],
    ],
  },
  {
    family: 'Aujournuit',
    category: 'display',
    ...collletttivo('aujournuit', '8b8aed12b67454ea6ae37009ad719bf33617b80d'),
    faces: [[400, 'fonts/Aujournuit-Regular']],
  },
  {
    family: 'Halibut',
    category: 'serif',
    ...HALIBUT,
    faces: [
      [100, 'fonts/Halibut-Thin'],
      [400, 'fonts/Halibut-Regular'],
    ],
    metrics: 'fonts/Halibut-Regular.otf',
  },
  {
    family: 'Halibut Condensed',
    category: 'serif',
    ...HALIBUT,
    faces: [
      [100, 'fonts/Halibut-CondensedThin'],
      [400, 'fonts/Halibut-CondensedRegular'],
    ],
    metrics: 'fonts/Halibut-CondensedRegular.otf',
  },
  {
    family: 'Halibut Expanded',
    category: 'serif',
    ...HALIBUT,
    faces: [
      [100, 'fonts/Halibut-ExpandedThin'],
      [400, 'fonts/Halibut-ExpandedRegular'],
    ],
    metrics: 'fonts/Halibut-ExpandedRegular.otf',
  },
  {
    family: 'Necto Mono',
    category: 'monospace',
    ...collletttivo('necto-mono', 'db9edb73bace38d64f36f29e698d9c7547045ce6'),
    faces: [[400, 'fonts/NectoMono-Regular']],
  },
  {
    family: 'Ortica Linear',
    category: 'serif',
    ...ORTICA,
    faces: [
      [300, 'fonts/OrticaLinear-Light'],
      [400, 'fonts/OrticaLinear-Regular'],
      [700, 'fonts/OrticaLinear-Bold'],
    ],
    metrics: 'fonts/OrticaLinear-Regular.otf',
  },
  { family: 'Ortica Angular', category: 'display', ...ORTICA, faces: [[700, 'fonts/OrticaAngular-Bold']] },
  {
    family: 'Ribes',
    category: 'display',
    ...collletttivo('ribes', 'e5f58f6ef719ff69b599a3155c66f4cecaed0a0f'),
    faces: [
      [300, 'fonts/Ribes-Light'],
      [400, 'fonts/Ribes-Regular'],
      [900, 'fonts/Ribes-Black'],
    ],
    metrics: 'fonts/Ribes-Regular.otf',
  },
  {
    family: 'Mazius Display',
    category: 'serif',
    ...collletttivo('mazius-display', '5798d69b14f0b7c1691f031f2ecb98ebdb709b54'),
    faces: [
      [400, 'fonts/MaziusDisplay-Regular'],
      [400, 'fonts/MaziusDisplay-Extraitalic', 'italic'],
      [700, 'fonts/MaziusDisplay-Bold'],
      [700, 'fonts/MaziusDisplay-ExtraItalicBold', 'italic'],
    ],
  },
  {
    family: 'Messapia',
    category: 'display',
    ...collletttivo('messapia', 'c7fbc664055d3f16f5d7431271f738ab5cdc6373'),
    faces: [
      [400, 'fonts/Messapia-Regular'],
      [700, 'fonts/Messapia-Bold'],
    ],
  },
  {
    family: 'Absans',
    category: 'sans-serif',
    ...collletttivo('absans', 'e1ba5d9a2359934df024b4ebef4c1be76e0db263'),
    faces: [[400, 'fonts/Absans-Regular']],
  },
  {
    family: 'Sneaky Times',
    category: 'serif',
    ...collletttivo('sneaky-times', '7094a621508090d479ccb95ce6a6b8827b3f9d4e'),
    faces: [[400, 'fonts/Sneaky-Times']],
  },
  {
    family: 'Borges',
    category: 'display',
    ...collletttivo('borges', 'f0c85182388603998ab55f84f9bc8cd8e8719383'),
    faces: [[400, 'fonts/Borges-SquarePixelRegular']],
  },
  {
    family: 'Overused Grotesk',
    category: 'sans-serif',
    foundry: 'RandomMaerks',
    pkg: 'gh/RandomMaerks/Overused-Grotesk@73d02b98d4d9c3cb0532fb0c72f5e1597a46f106',
    page: 'https://randommaerks.github.io/typefaces/overused-grotesk',
    license: 'OFL-1.1',
    licenseFile: 'LICENSE.txt',
    faces: [
      [400, 'fonts/woff2/OverusedGrotesk-Roman'],
      [400, 'fonts/woff2/OverusedGrotesk-Italic', 'italic'],
      ...Object.entries(OVERUSED_WEIGHTS).flatMap(([weight, name]) => [
        [Number(weight), `fonts/woff2/OverusedGrotesk-${name}`],
        [Number(weight), `fonts/woff2/OverusedGrotesk-${name}Italic`, 'italic'],
      ]),
    ],
    metrics: 'fonts/otf/OverusedGrotesk-Roman.otf',
  },
  {
    // Reserved Font Name "Aspekta": these must stay the foundry's own files.
    family: 'Aspekta',
    category: 'sans-serif',
    foundry: 'Ivo Dolenc',
    pkg: 'gh/ivodolenc/aspekta@cd08efde1a0484c3626818ac59a6933e59f71531',
    page: 'https://github.com/ivodolenc/aspekta',
    license: 'OFL-1.1',
    licenseFile: 'LICENSE.txt',
    faces: [100, 200, 300, 400, 500, 600, 700, 800, 900].map((w) => [w, `packages/fonts/webfonts/Aspekta-${w}`]),
    metrics: 'packages/fonts/otf/Aspekta-400.otf',
  },
  {
    family: 'Lil Grotesk',
    category: 'sans-serif',
    foundry: 'Noir Blanc Rouge',
    pkg: 'gh/noirblancrouge/LilGrotesk@150b9c8405ee95185c32023c09a430972309cfde',
    page: 'https://noirblancrouge.com/fonts/lil-grotesk/',
    license: 'OFL-1.1',
    licenseFile: 'OFL.txt',
    faces: [
      [100, 'fonts/webfonts/LilGrotesk-Thin'],
      [200, 'fonts/webfonts/LilGrotesk-ExtraLight'],
      [300, 'fonts/webfonts/LilGrotesk-Light'],
      [400, 'fonts/webfonts/LilGrotesk-Regular'],
      [500, 'fonts/webfonts/LilGrotesk-Medium'],
      [700, 'fonts/webfonts/LilGrotesk-Bold'],
      [800, 'fonts/webfonts/LilGrotesk-Heavy'],
      [900, 'fonts/webfonts/LilGrotesk-Black'],
    ],
    metrics: 'fonts/otf/LilGrotesk-Regular.otf',
  },
  {
    family: '0xProto',
    category: 'monospace',
    foundry: '0xType',
    pkg: 'gh/0xType/0xProto@5e8498b4b4a456cfe523a0567b0c084df5e084ba',
    page: 'https://github.com/0xType/0xProto',
    license: 'OFL-1.1',
    licenseFile: 'LICENSE',
    faces: [
      [400, 'fonts/0xProto-Regular'],
      [400, 'fonts/0xProto-Italic', 'italic'],
      [700, 'fonts/0xProto-Bold'],
    ],
  },
  {
    // The repo's root licence is MIT for the site; the font's own is beside it.
    family: 'Departure Mono',
    category: 'monospace',
    foundry: 'Helena Zhang',
    pkg: 'gh/rektdeckard/departure-mono@75152a3f1e6dacdd248a6c397c97dbf27e33eea0',
    page: 'https://departuremono.com',
    license: 'OFL-1.1',
    licenseFile: 'public/assets/LICENSE',
    faces: [[400, 'public/assets/DepartureMono-Regular']],
  },
  {
    family: 'Hack',
    category: 'monospace',
    foundry: 'Source Foundry',
    pkg: 'npm/hack-font@3.3.0',
    page: 'https://sourcefoundry.org/hack/',
    license: 'MIT',
    licenseFile: 'LICENSE.md',
    faces: [
      [400, 'build/web/fonts/hack-regular'],
      [400, 'build/web/fonts/hack-italic', 'italic'],
      [700, 'build/web/fonts/hack-bold'],
      [700, 'build/web/fonts/hack-bolditalic', 'italic'],
    ],
    metrics: 'build/ttf/Hack-Regular.ttf',
  },
]

const CATEGORIES = new Set(['sans-serif', 'serif', 'display', 'monospace', 'handwriting'])

const round = (n) => Math.round(n * 1000) / 1000

/** Top of a glyph's outline, or undefined when the font has no such glyph. */
function glyphTop(font, char) {
  const glyph = font.charToGlyph(char)
  if (!glyph || glyph.index === 0) return undefined
  const top = glyph.getBoundingBox().y2
  return top > 0 ? top : undefined
}

/** x-height and cap height from the outlines of "x" and "H", as build-fontsource.mjs does. */
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

async function get(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${res.status} ${url}`)
  return res
}

async function build(def) {
  const root = `${CDN}/${def.pkg}`
  if (!CATEGORIES.has(def.category)) throw new Error(`${def.family}: unknown category ${def.category}`)
  if (def.pkg.startsWith('gh/') && !/@[0-9a-f]{40}$/.test(def.pkg)) {
    throw new Error(`${def.family}: pin the repo to a full commit SHA, not a branch or tag`)
  }

  const license = await (await get(`${root}/${def.licenseFile}`)).text()
  if (!LICENSES[def.license].test(license)) {
    throw new Error(`${def.family}: ${def.licenseFile} no longer reads as ${def.license}`)
  }

  const faces = def.faces.map(([weight, path, style = 'normal']) => ({ weight, style, path: `${path}.woff2` }))
  await Promise.all(
    faces.map(async (face) => {
      const res = await fetch(`${root}/${face.path}`, { method: 'HEAD' })
      const type = res.headers.get('content-type') ?? ''
      if (!res.ok || !type.includes('woff2')) throw new Error(`${def.family}: ${face.path} is ${res.status} ${type}`)
    }),
  )
  faces.sort((a, b) => a.weight - b.weight || (a.style === 'italic') - (b.style === 'italic'))

  const metricsFile = def.metrics ?? `${def.faces[0][1]}.otf`
  const metrics = metricsFrom(await (await get(`${root}/${metricsFile}`)).arrayBuffer())

  return {
    family: def.family,
    foundry: def.foundry,
    category: def.category,
    pkg: def.pkg,
    faces,
    page: def.page,
    license: def.license,
    metrics,
  }
}

const google = new Set((await (await get('https://api.fontsource.org/v1/fonts?type=google')).json()).map((f) => f.family))
const fonts = await Promise.all(FAMILIES.map(build))

const seen = new Set()
for (const font of fonts) {
  // Family strings are the source key; a twin anywhere would make one ambiguous.
  if (google.has(font.family)) throw new Error(`${font.family} collides with a Google family`)
  if (seen.has(font.family)) throw new Error(`${font.family} is listed twice`)
  seen.add(font.family)
}

fonts.sort((a, b) => a.family.localeCompare(b.family))

const out = `// Generated by scripts/build-foundry-fonts.mjs. Do not edit.
import type { FoundryFamily } from "@/types/fonts";

export const FOUNDRY_FONTS: FoundryFamily[] = [
${fonts.map((f) => `  ${JSON.stringify(f)},`).join('\n')}
];
`

writeFileSync('src/data/foundry-fonts.ts', out)
console.log(`Wrote ${fonts.length} foundry families to src/data/foundry-fonts.ts`)
