/**
 * Fetch the magazine photo library from Pexels.
 * Pulls a pool of landscape photos, measures their colours, keeps 100 balanced
 * across hue and lightness, saves them as WebP in public/photos, and writes public/photos/manifest.json with each
 * photo's colour profile (OKLab) so the magazine template can match the page colours.
 *
 * Usage: node --env-file=.env.local scripts/fetch-photos.mjs
 */

import { mkdir, writeFile, readdir, unlink } from 'node:fs/promises'
import { join } from 'node:path'
import sharp from 'sharp'

const KEY = process.env.PEXELS_API_KEY
if (!KEY) throw new Error('PEXELS_API_KEY missing (run with --env-file=.env.local)')

const OUT = join(process.cwd(), 'public/photos')
const WIDTH = 1600

// Pexels' colour filter is loose, so it only seeds the candidate pool.
// The final pick is balanced on the colours measured from each photo.
const FILTERS = ['red', 'orange', 'yellow', 'green', 'turquoise', 'blue', 'violet', 'pink', 'brown', 'black', 'gray', 'white']

// Subjects that sit with the magazine's copy: sea walls, lamps, coasts, quiet rooms
const QUERIES = ['coast', 'lighthouse', 'lamp', 'still life', 'architecture', 'sea', 'interior', 'landscape', 'dusk', 'flowers', 'harbour', 'lantern']

// Measured-colour bins and how many photos each keeps. Sums to 100.
const HUES = ['red', 'orange', 'yellow', 'green', 'teal', 'blue', 'violet', 'magenta']
const QUOTA = { red: 10, orange: 10, yellow: 10, green: 10, teal: 10, blue: 10, violet: 10, magenta: 10, dark: 7, mid: 6, light: 7 }

// Portraits, signage and loud abstracts read oddly as magazine plates
const SKIP = /\b(woman|man|girl|boy|person|people|child|couple|portrait|model|text|sign|mural|graffiti|logo|bokeh|abstract|pattern|festival|statue|buddha|stadium|neon|texture|wallpaper)\b/i

// Within a hue bin, prefer photos near this mean chroma: clearly coloured, not garish
const IDEAL_CHROMA = 0.075

function binOf({ L, a, b, c }) {
  if (c < 0.03) return L < 0.35 ? 'dark' : L > 0.7 ? 'light' : 'mid'
  const h = (Math.atan2(b, a) * 180 / Math.PI + 360) % 360
  return HUES[Math.floor(((h + 15) % 360) / 45)]
}

async function search(query, color, page = 1) {
  const url = new URL('https://api.pexels.com/v1/search')
  url.search = new URLSearchParams({ query, color, orientation: 'landscape', per_page: '40', page: String(page) })
  const res = await fetch(url, { headers: { Authorization: KEY } })
  if (!res.ok) throw new Error(`Pexels ${res.status} for ${query}/${color}`)
  return (await res.json()).photos
}

// sRGB 0–255 → OKLab
function toOklab(r, g, b) {
  const lin = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4 }
  const [R, G, B] = [lin(r), lin(g), lin(b)]
  const l = Math.cbrt(0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B)
  const m = Math.cbrt(0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B)
  const s = Math.cbrt(0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B)
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ]
}

// Run fn over items, `limit` at a time, keeping order
async function mapLimit(items, limit, fn) {
  const out = new Array(items.length)
  let next = 0
  const worker = async () => { while (next < items.length) { const i = next++; out[i] = await fn(items[i], i) } }
  await Promise.all(Array.from({ length: limit }, worker))
  return out
}

// Mean lightness, chroma-weighted tint (a, b), mean chroma, and a 12-bin hue histogram
// (30° bins from 0°; each bin is the chroma mass of its pixels divided by the pixel count)
async function profile(buf) {
  const { data } = await sharp(buf).resize(48, 48, { fit: 'cover' }).removeAlpha().raw().toBuffer({ resolveWithObject: true })
  let sumL = 0, sumA = 0, sumB = 0, sumW = 0, sumC = 0
  const hues = new Array(12).fill(0)
  const n = data.length / 3
  for (let i = 0; i < data.length; i += 3) {
    const [L, a, b] = toOklab(data[i], data[i + 1], data[i + 2])
    const c = Math.hypot(a, b)
    sumL += L; sumC += c
    sumA += a * c; sumB += b * c; sumW += c
    if (c > 0.02) hues[Math.floor(((Math.atan2(b, a) * 180 / Math.PI + 360) % 360) / 30) % 12] += c
  }
  const round = (v, p = 1000) => Math.round(v * p) / p
  return {
    L: round(sumL / n),
    a: round(sumW ? sumA / sumW : 0),
    b: round(sumW ? sumB / sumW : 0),
    c: round(sumC / n),
    hues: hues.map((v) => round(v / n, 10000)),
  }
}

async function main() {
  await mkdir(OUT, { recursive: true })

  // 1. Candidate pool, profiled from small thumbnails
  const pool = new Map()
  let q = 0
  for (const color of FILTERS) {
    for (let i = 0; i < 3; i++) {
      const query = QUERIES[q++ % QUERIES.length]
      for (const p of await search(query, color)) {
        if (pool.has(p.id) || p.width / p.height < 1.3 || SKIP.test(p.alt || '')) continue
        pool.set(p.id, { ...p, query })
      }
    }
    process.stdout.write(`${color} `)
  }
  console.log(`\n${pool.size} candidates`)

  const profiled = await mapLimit([...pool.values()], 16, async (p) => {
    const thumb = Buffer.from(await (await fetch(p.src.small)).arrayBuffer())
    const prof = await profile(thumb)
    return { ...p, prof, bin: binOf(prof) }
  })

  // 2. Balanced pick: per bin, take the most characterful candidates, spread across lightness
  const picked = []
  const spare = []
  for (const [bin, want] of Object.entries(QUOTA)) {
    const inBin = profiled.filter((p) => p.bin === bin)
    const ranked = HUES.includes(bin) ? inBin.sort((x, y) => Math.abs(x.prof.c - IDEAL_CHROMA) - Math.abs(y.prof.c - IDEAL_CHROMA)) : inBin
    const short = ranked.slice(0, want * 3).sort((x, y) => x.prof.L - y.prof.L)
    const take = []
    for (let i = 0; i < Math.min(want, short.length); i++) {
      take.push(short[Math.floor((i + 0.5) * short.length / Math.min(want, short.length))])
    }
    picked.push(...take)
    spare.push(...inBin.filter((p) => !take.includes(p)))
    console.log(`${bin}: ${take.length}/${want} (of ${inBin.length})`)
  }
  // Fill any shortfall from the most colourful leftovers
  spare.sort((x, y) => y.prof.c - x.prof.c)
  while (picked.length < 100 && spare.length) picked.push(spare.shift())

  // 3. Download full size
  for (const f of await readdir(OUT)) if (f.endsWith('.webp')) await unlink(join(OUT, f))
  const manifest = await mapLimit(picked, 8, async (p) => {
    const res = await fetch(`${p.src.original}?auto=compress&cs=tinysrgb&w=${WIDTH}`)
    const raw = Buffer.from(await res.arrayBuffer())
    const webp = await sharp(raw).resize({ width: WIDTH, withoutEnlargement: true }).webp({ quality: 74 }).toBuffer()
    const file = `p-${p.id}.webp`
    await writeFile(join(OUT, file), webp)
    const meta = await sharp(webp).metadata()
    const prof = await profile(webp)
    process.stdout.write('.')
    return {
      file,
      w: meta.width,
      h: meta.height,
      ...prof,
      bin: binOf(prof),
      alt: p.alt || '',
      photographer: p.photographer,
      photographerUrl: p.photographer_url,
      url: p.url,
    }
  })

  await writeFile(join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n')
  console.log(`\nSaved ${manifest.length} photos to public/photos`)
}

main().catch((e) => { console.error(e); process.exit(1) })
