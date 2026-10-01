'use client'

import { useRef, type CSSProperties } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { BandCycle, TuningKnob, hueTint } from './parts'
import { BANDS, clamp, px, scaleMarks, type Tuner } from './tuner'

const WIDTH = 326
const HEIGHT = 140
// The pivot sits below the glass, under the knob, like the VU meters.
const PIVOT = { x: 163, y: 176 }
const RADII = [152, 130, 108]
/** Degrees the arcs reach either side of straight up. */
const SPAN = 56
const KNOB = 60
// The arm only shows across the scales, so it never crosses the readout.
const NEEDLE = { from: 96, to: RADII[0] + 14 }

function polar(deg: number, r: number): [number, number] {
  const rad = ((deg - 90) * Math.PI) / 180
  return [px(PIVOT.x + r * Math.cos(rad)), px(PIVOT.y + r * Math.sin(rad))]
}

const angleAt = (at: number, band: number) => -SPAN + (at / (BANDS[band].stations.length - 1)) * SPAN * 2

const MARKS = BANDS.map(({ stations }, b) => {
  const perStation = (RADII[b] * SPAN * 2 * (Math.PI / 180)) / (stations.length - 1)
  return scaleMarks(stations, 21 / perStation, 3 / perStation)
})

/** Three concentric arcs swept by a needle that pivots on the tuning knob. */
export function CompassDial({ tuner }: { tuner: Tuner }) {
  const scrubbing = useRef<number | null>(null)

  const locate = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const dx = ((e.clientX - rect.left) / rect.width) * WIDTH - PIVOT.x
    const dy = PIVOT.y - ((e.clientY - rect.top) / rect.height) * HEIGHT
    return { angle: (Math.atan2(dx, dy) * 180) / Math.PI, radius: Math.hypot(dx, dy) }
  }

  const seekTo = (angle: number, band: number) => {
    const along = (clamp(angle, -SPAN, SPAN) + SPAN) / (SPAN * 2)
    tuner.seek(Math.round(along * (BANDS[band].stations.length - 1)))
  }

  return (
    <div className="flex flex-col">
      <div
        className="radio-glass cursor-pointer"
        style={{ aspectRatio: `${WIDTH} / ${HEIGHT}` }}
        onPointerDown={(e) => {
          const { angle, radius } = locate(e)
          // Numbers sit outside each arc, so a band's hit zone leans outward.
          const band = RADII.reduce((best, r, b) => (Math.abs(radius - r - 5) < Math.abs(radius - RADII[best] - 5) ? b : best), 0)
          scrubbing.current = band
          e.currentTarget.setPointerCapture(e.pointerId)
          tuner.setBand(band)
          seekTo(angle, band)
        }}
        onPointerMove={(e) => {
          if (scrubbing.current !== null) seekTo(locate(e).angle, scrubbing.current)
        }}
        onPointerUp={() => {
          scrubbing.current = null
        }}
        onPointerCancel={() => {
          scrubbing.current = null
        }}
      >
        <div className="radio-backlight inset-0" data-active />
        {BANDS.map((band, b) => {
          const r = RADII[b]
          const active = b === tuner.band
          const [sx, sy] = polar(-SPAN, r)
          const [ex, ey] = polar(SPAN, r)
          const [lx, ly] = polar(-SPAN - 4 - b * 1.5, r + 4)
          return (
            <svg key={band.id} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="radio-band absolute inset-0 size-full" data-active={active} aria-hidden>
              <path d={`M ${sx} ${sy} A ${r} ${r} 0 0 1 ${ex} ${ey}`} strokeWidth={0.5} opacity={0.6} />
              <text x={lx} y={ly} fontSize={7} fontWeight={700} letterSpacing={1.1} textAnchor="end">
                {band.label.toUpperCase()}
              </text>
              {MARKS[b].map((mark) => {
                const angle = angleAt(mark.at, b)
                const [x1, y1] = polar(angle, r)
                const [x2, y2] = polar(angle, r + (mark.label ? 5 : 2.5))
                const [tx, ty] = polar(angle, r + 11)
                return (
                  <g key={mark.hue}>
                    {/* Ticks on the lit band take the color of the hue they mark */}
                    <line
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      strokeWidth={mark.label ? 1 : 0.6}
                      style={active ? { stroke: hueTint(mark.hue) } : undefined}
                    />
                    {mark.label && (
                      <text x={tx} y={ty + 3} fontSize={8.5} fontWeight={500} textAnchor="middle">
                        {mark.hue}
                      </text>
                    )}
                  </g>
                )
              })}
            </svg>
          )
        })}
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="absolute inset-0 size-full">
          <text
            x={PIVOT.x}
            y={112}
            fontSize={24}
            textAnchor="middle"
            fill="oklch(0.84 0.09 75)"
            style={{ fontFamily: 'var(--font-oswald)', fontWeight: 200 }}
          >
            {Math.round(tuner.station.hue)}°
          </text>
          <text
            x={PIVOT.x}
            y={127}
            fontSize={6.5}
            fontWeight={600}
            letterSpacing={1.6}
            textAnchor="middle"
            fill="var(--radio-print)"
            opacity={0.65}
            style={{ fontFamily: 'var(--font-host-grotesk)' }}
          >
            {tuner.station.name.toUpperCase()}
          </text>
          <g
            className="radio-needle-arm"
            style={{ '--pivot': `${PIVOT.x}px ${PIVOT.y}px`, transform: `rotate(${px(angleAt(tuner.index, tuner.band))}deg)` } as CSSProperties}
          >
            <line x1={PIVOT.x} y1={PIVOT.y - NEEDLE.from} x2={PIVOT.x} y2={PIVOT.y - NEEDLE.to} stroke="var(--radio-needle)" strokeWidth={4} strokeLinecap="round" opacity={0.22} />
            <line x1={PIVOT.x} y1={PIVOT.y - NEEDLE.from} x2={PIVOT.x} y2={PIVOT.y - NEEDLE.to} stroke="var(--radio-needle)" strokeWidth={1} strokeLinecap="round" />
          </g>
        </svg>
      </div>
      {/* The knob's centre lands on the pivot */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3" style={{ marginTop: PIVOT.y - HEIGHT - KNOB / 2 - 1 }}>
        <BandCycle tuner={tuner} />
        <TuningKnob tuner={tuner} size={KNOB} />
        <div className="hw-btn-group flex justify-self-end">
          <button type="button" aria-label="Previous preset" onClick={() => tuner.step(-1)} className="hw-btn !h-9 !px-2.5">
            <ChevronLeft className="size-3.5" />
          </button>
          <button type="button" aria-label="Next preset" onClick={() => tuner.step(1)} className="hw-btn !h-9 !px-2.5">
            <ChevronRight className="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
