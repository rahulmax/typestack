/**
 * Import the illustration packs into public/ill and describe their source colours in src/lib/illustration-packs.ts.
 *
 * Each pack is dark ink on light paper with a few flat colours. Rather than keep those colours,
 * every element is given a tonal role from what it is in the drawing, so the preview can
 * generate a palette from the page and still keep the drawing's own light/dark order:
 *
 *   line    thin ink: outlines, strokes, eyes
 *   mass    solid ink: hair, shoes, bushes (thick enough to survive a 4px erosion)
 *   dot     ink texture: tiny dots in clusters (stipple shading, window grids)
 *   paper   white inside ink outlines, i.e. the body of a figure. It stands for the page.
 *   glint   white laid over colour or ink: shines, screen content
 *   surface every other light neutral, keyed by its source lightness
 *   colour  every chromatic fill, keyed by its source OKLCH
 *
 * Roles are measured from rendered geometry in headless Chromium, not guessed from colour.
 *
 * Usage: node scripts/build-illustrations.mjs noodle=<zip|dir> ghost=<zip|dir> outline=<zip|dir>
 * Only each pack's Scenes folder is imported.
 */

import { chromium } from '@playwright/test'
import { execFileSync } from 'node:child_process'
import { mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync, mkdirSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const OUT = join(process.cwd(), 'public/ill')
const DATA = join(process.cwd(), 'src/lib/illustration-packs.ts')
const S = 600 // raster size for measuring

const packs = process.argv.slice(2).map((arg) => {
  const [id, src] = arg.split('=')
  if (!id || !src) throw new Error(`Expected id=path, got "${arg}"`)
  return { id, src }
})
if (!packs.length) throw new Error('Usage: node scripts/build-illustrations.mjs noodle=<zip> ghost=<zip> outline=<zip>')

// ---- colour maths (sRGB -> OKLCH) ----

const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
function rgbToOklch([r, g, b]) {
  const [R, G, B] = [r, g, b].map((v) => lin(v / 255))
  const l = Math.cbrt(0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B)
  const m = Math.cbrt(0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B)
  const s = Math.cbrt(0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B)
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s
  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s
  const bb = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s
  return { l: L, c: Math.hypot(a, bb), h: ((Math.atan2(bb, a) * 180) / Math.PI + 360) % 360 }
}
const parseRgb = (s) => s.match(/[\d.]+/g).slice(0, 3).map(Number)
const hex = (rgb) => '#' + rgb.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')

/** Source paint -> 'ink' | 'neutral' | 'colour'. Dark colours (the navy pack) count as ink. */
function kindOf(lch) {
  if (lch.l < 0.45) return 'ink'
  return lch.c < 0.04 ? 'neutral' : 'colour'
}

// ---- sources ----

function scenesDir(src) {
  let dir = src
  if (statSync(src).isFile()) {
    dir = mkdtempSync(join(tmpdir(), 'ill-'))
    execFileSync('unzip', ['-q', src, '-d', dir])
  }
  const find = (d) => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      if (!e.isDirectory() || e.name === '__MACOSX') continue
      if (e.name === 'Scenes') return join(d, e.name)
      const hit = find(join(d, e.name))
      if (hit) return hit
    }
  }
  const scenes = find(dir)
  if (!scenes) throw new Error(`No Scenes folder in ${src}`)
  return scenes
}

// ---- measuring, in the page ----

// Runs in Chromium. Loads one SVG, reads every leaf's computed paint and returns the rasters
// the roles are decided from.
async function measure({ svg, S }) {
  const host = document.getElementById('host')
  host.innerHTML = svg
  const root = host.querySelector('svg')
  root.setAttribute('width', S)
  root.setAttribute('height', S)
  const leaves = [...root.querySelectorAll('path,circle,rect,polygon,polyline,ellipse,line')]
  const box = root.getBoundingClientRect()

  const info = leaves.map((el) => {
    const cs = getComputedStyle(el)
    const r = el.getBoundingClientRect()
    return {
      fill: cs.fill === 'none' || cs.fillOpacity === '0' ? null : cs.fill,
      stroke: cs.stroke === 'none' || cs.strokeOpacity === '0' ? null : cs.stroke,
      cx: r.x - box.x + r.width / 2,
      cy: r.y - box.y + r.height / 2,
      w: r.width,
      h: r.height,
    }
  })

  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = S
  const ctx = canvas.getContext('2d', { willReadFrequently: true })

  // Render the drawing with only `show` leaves visible; `solid` paints them black without strokes.
  async function render(show, solid) {
    const saved = leaves.map((el) => el.getAttribute('style'))
    leaves.forEach((el, i) => {
      if (!show(i)) el.style.visibility = 'hidden'
      else if (solid) { el.style.fill = '#000'; el.style.stroke = 'none' }
    })
    const url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(new XMLSerializer().serializeToString(root))
    leaves.forEach((el, i) => (saved[i] == null ? el.removeAttribute('style') : el.setAttribute('style', saved[i])))
    const img = new Image()
    img.src = url
    await img.decode()
    ctx.clearRect(0, 0, S, S)
    ctx.drawImage(img, 0, 0, S, S)
    return ctx.getImageData(0, 0, S, S).data
  }
  const maskOf = (px) => {
    const m = new Uint8Array(S * S)
    for (let j = 0; j < S * S; j++) m[j] = px[j * 4 + 3] > 128 ? 1 : 0
    return m
  }

  // 1. Solid ink fills: how much survives a 4px erosion, and how many tiny siblings are near.
  const isInkPaint = (p) => {
    if (!p) return false
    const [r, g, b] = p.match(/[\d.]+/g).map(Number)
    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b
    return lum < 110
  }
  const tiny = (i) => info[i].w < 8 && info[i].h < 8
  const out = info.map(() => ({}))
  const R = 4
  for (let i = 0; i < leaves.length; i++) {
    if (!isInkPaint(info[i].fill)) continue
    if (tiny(i)) {
      let near = 0
      for (let k = 0; k < leaves.length && near < 3; k++) {
        if (k !== i && tiny(k) && isInkPaint(info[k].fill) && Math.hypot(info[k].cx - info[i].cx, info[k].cy - info[i].cy) < 14) near++
      }
      out[i].dot = near >= 3
      continue
    }
    const m = maskOf(await render((k) => k === i, true))
    let area = 0
    let thick = 0
    for (let y = R; y < S - R; y++) {
      for (let x = R; x < S - R; x++) {
        const j = y * S + x
        if (!m[j]) continue
        area++
        if (m[j - R] && m[j + R] && m[j - R * S] && m[j + R * S] && m[j - R - R * S] && m[j + R + R * S] && m[j - R + R * S] && m[j + R - R * S]) thick++
      }
    }
    out[i].thick = area ? thick / area : 0
  }

  // 2. White fills: are they bounded by ink lines, and what lies under them?
  const isWhite = (p) => p && p.match(/[\d.]+/g).slice(0, 3).every((v) => Number(v) >= 250)
  const whites = info.map((d, i) => (isWhite(d.fill) ? i : -1)).filter((i) => i >= 0)
  if (whites.length) {
    const lineIdx = new Set(info.map((d, i) => i).filter((i) => isInkPaint(info[i].stroke) || (isInkPaint(info[i].fill) && !(out[i].thick >= 0.1) && !out[i].dot)))
    const lines = maskOf(await render((k) => lineIdx.has(k), false))
    // dilate the line mask by 3px (separable box max)
    const D = 3
    const tmp = new Uint8Array(S * S)
    const near = new Uint8Array(S * S)
    for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
      let v = 0
      for (let d = -D; d <= D && !v; d++) { const xx = x + d; if (xx >= 0 && xx < S && lines[y * S + xx]) v = 1 }
      tmp[y * S + x] = v
    }
    for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
      let v = 0
      for (let d = -D; d <= D && !v; d++) { const yy = y + d; if (yy >= 0 && yy < S && tmp[yy * S + x]) v = 1 }
      near[y * S + x] = v
    }
    for (const i of whites) {
      const m = maskOf(await render((k) => k === i, true))
      const under = await render((k) => k < i, false)
      let edge = 0
      let bounded = 0
      let inside = 0
      let covered = 0
      for (let y = 1; y < S - 1; y++) for (let x = 1; x < S - 1; x++) {
        const j = y * S + x
        if (!m[j]) continue
        if (!m[j - 1] || !m[j + 1] || !m[j - S] || !m[j + S]) {
          edge++
          if (near[j]) bounded++
        } else {
          inside++
          const a = under[j * 4 + 3]
          if (a < 128) continue
          const r = under[j * 4], g = under[j * 4 + 1], b = under[j * 4 + 2]
          const spread = Math.max(r, g, b) - Math.min(r, g, b)
          const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b
          if (spread > 24 || lum < 110) covered++
        }
      }
      out[i].bounded = edge ? bounded / edge : 0
      out[i].over = inside ? covered / inside : 0
    }
  }

  return info.map((d, i) => ({ fill: d.fill, stroke: d.stroke, ...out[i] }))
}

// ---- rewriting, in the page ----

// Runs in Chromium. Replaces every leaf's paint with the role vars, strips group paint, ids and
// sizes, and wraps runs of identically painted siblings in one <g> to keep the files small.
function rewrite({ svg, paints }) {
  const host = document.getElementById('host')
  host.innerHTML = svg
  const root = host.querySelector('svg')
  const leaves = [...root.querySelectorAll('path,circle,rect,polygon,polyline,ellipse,line')]
  const PAINT = ['fill', 'stroke']
  for (const el of root.querySelectorAll('*')) {
    for (const a of ['id', 'class', 'data-name']) el.removeAttribute(a)
    for (const a of PAINT) el.removeAttribute(a)
    const st = el.getAttribute('style')
    if (st != null) {
      const kept = st.split(';').map((s) => s.trim()).filter((s) => s && !/^(fill|stroke)\s*:/.test(s)).join(';')
      if (kept) el.setAttribute('style', kept)
      else el.removeAttribute('style')
    }
  }
  leaves.forEach((el, i) => {
    el.setAttribute('fill', paints[i].fill)
    if (paints[i].stroke !== 'none') el.setAttribute('stroke', paints[i].stroke)
  })
  // group runs of 3+ siblings that share paint and nothing else
  for (const parent of [root, ...root.querySelectorAll('g')]) {
    const kids = [...parent.children]
    let run = []
    const key = (el) => (el.matches('path,circle,rect,polygon,polyline,ellipse,line') ? el.getAttribute('fill') + '|' + el.getAttribute('stroke') : null)
    const flush = () => {
      if (run.length >= 3) {
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g')
        g.setAttribute('fill', run[0].getAttribute('fill'))
        if (run[0].hasAttribute('stroke')) g.setAttribute('stroke', run[0].getAttribute('stroke'))
        parent.insertBefore(g, run[0])
        for (const el of run) {
          el.removeAttribute('fill')
          el.removeAttribute('stroke')
          g.appendChild(el)
        }
      }
      run = []
    }
    for (const el of kids) {
      const k = key(el)
      if (k && run.length && key(run[0]) === k) run.push(el)
      else {
        flush()
        if (k) run.push(el)
      }
    }
    flush()
  }
  for (const a of ['width', 'height', 'x', 'y', 'version', 'style', 'xml:space']) root.removeAttribute(a)
  return new XMLSerializer().serializeToString(root).replace(/ xmlns:xlink="[^"]*"/, '')
}

// ---- main ----

const browser = await chromium.launch()
const page = await browser.newPage()
await page.setContent('<div id="host"></div>')

rmSync(OUT, { recursive: true, force: true })
mkdirSync(OUT, { recursive: true })

const tones = new Map() // tone id -> { id, pack, kind, l, c, h, area }
const packMeta = []
const counts = {}

for (const { id: pack, src } of packs) {
  const dir = scenesDir(src)
  const files = readdirSync(dir).filter((f) => f.endsWith('.svg')).sort()
  packMeta.push({ id: pack, count: files.length })
  let n = 0
  for (const f of files) {
    const svg = readFileSync(join(dir, f), 'utf8').replace(/<\?xml[^>]*\?>/, '').replace(/<!--[\s\S]*?-->/g, '')
    const els = await page.evaluate(measure, { svg, S })

    const toneFor = (paint, isStroke, m) => {
      if (!paint) return 'none'
      const rgb = parseRgb(paint)
      const lch = rgbToOklch(rgb)
      const kind = kindOf(lch)
      let role
      if (kind === 'ink') {
        role = isStroke ? 'line' : m.dot ? 'dot' : m.thick >= 0.1 ? 'mass' : 'line'
      } else if (kind === 'neutral' && lch.l > 0.985 && !isStroke) {
        role = m.bounded >= 0.5 ? 'paper' : m.over >= 0.5 ? 'glint' : null
      } else if (kind === 'neutral' && lch.l > 0.985) {
        role = 'glint'
      }
      if (role) {
        counts[role] = (counts[role] || 0) + 1
        return `var(--ill-${role})`
      }
      // surfaces and colours are keyed per pack by their source colour
      const key = hex(rgb)
      const prefix = kind === 'colour' ? 'c' : 's'
      let t = [...tones.values()].find((x) => x.pack === pack && x.hex === key)
      if (!t) {
        const idx = [...tones.values()].filter((x) => x.pack === pack && x.kind === (kind === 'colour' ? 'colour' : 'surface')).length + 1
        t = { id: `${pack}-${prefix}${idx}`, pack, kind: kind === 'colour' ? 'colour' : 'surface', hex: key, ...lch, uses: 0 }
        tones.set(t.id, t)
      }
      t.uses++
      counts[t.kind] = (counts[t.kind] || 0) + 1
      return `var(--ill-${t.id})`
    }

    const paints = els.map((m) => ({ fill: toneFor(m.fill, false, m), stroke: toneFor(m.stroke, true, m) }))
    const out = await page.evaluate(rewrite, { svg, paints })
    n++
    writeFileSync(join(OUT, `${pack}-${String(n).padStart(2, '0')}.svg`), out)
  }
  console.log(`${pack}: ${files.length} scenes`)
}

await browser.close()

// ---- data file ----

const r = (v, d = 4) => Number(v.toFixed(d))
const toneList = [...tones.values()].map(({ id, pack, kind, hex: h, l, c, h: hue, uses }) => ({ id, pack, kind, source: h, l: r(l), c: r(c), h: r(hue, 2), uses }))
const ts = `// Generated by scripts/build-illustrations.mjs. Do not edit by hand.

export interface IllustrationPack {
  id: string;
  count: number;
}

/** A source colour that keeps its own CSS var: a light neutral surface or a chromatic fill. */
export interface IllustrationSourceTone {
  id: string;
  pack: string;
  kind: "surface" | "colour";
  source: string;
  l: number;
  c: number;
  h: number;
  /** How many elements use it across the pack, so the most used colour can lead. */
  uses: number;
}

export const ILLUSTRATION_PACKS: IllustrationPack[] = ${JSON.stringify(packMeta, null, 2)};

export const ILLUSTRATION_TONES: IllustrationSourceTone[] = ${JSON.stringify(toneList, null, 2)};
`
writeFileSync(DATA, ts)
console.log('roles', counts)
console.log(toneList.map((t) => `${t.id} ${t.source} ×${t.uses}`).join('\n'))
