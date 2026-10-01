'use client'

import { BandSelector, StationPlate, Thumbwheel } from './parts'
import { BANDS, mod, px, scaleMarks, useEased, useTuningGesture, type Band, type ScaleMark, type Tuner } from './tuner'

const WIDTH = 326
const HEIGHT = 92
const ROW = 48
const PEEK = (HEIGHT - ROW) / 2
/** How much a row flattens as it curves away from the window. */
const SQUASH = 0.6
const PITCH = 9
const REACH = Math.ceil(WIDTH / 2 / PITCH) + 1

// The tape is a loop, so 360 would print on top of 0.
const MARKS: Record<Band['id'], ScaleMark[]> = Object.fromEntries(
  BANDS.map((band) => [band.id, scaleMarks(band.stations, 30 / PITCH, 5 / PITCH).filter((m) => m.hue !== 360)])
) as Record<Band['id'], ScaleMark[]>

/** Rows are stacked edge to edge around the lit one, squashed once they leave it. */
function rowTransform(offset: number): string {
  const squashed = ROW * SQUASH
  const centre =
    offset === 0 ? HEIGHT / 2 : offset < 0 ? PEEK + (offset + 0.5) * squashed : PEEK + ROW + (offset - 0.5) * squashed
  return `translateY(${centre - ROW / 2}px) scaleY(${offset === 0 ? 1 : SQUASH})`
}

function Tape({ band, turns }: { band: Band; turns: number }) {
  const { stations } = band
  const count = stations.length
  const at = turns * count
  const first = Math.ceil(at - REACH)

  return (
    <svg viewBox={`0 0 ${WIDTH} ${ROW}`} width="100%" height={ROW} preserveAspectRatio="none" className="radio-band block" data-active aria-hidden>
      {MARKS[band.id].map((mark) => {
        const away = mod(mark.at - at + count / 2, count) - count / 2
        if (Math.abs(away) > REACH) return null
        const x = px(WIDTH / 2 + away * PITCH)
        return (
          <g key={mark.hue}>
            <line x1={x} x2={x} y1={17} y2={mark.label ? 23 : 20} strokeWidth={mark.label ? 0.8 : 0.5} opacity={mark.label ? 1 : 0.7} />
            {mark.label && (
              <text x={x} y={13} fontSize={9} fontWeight={500} textAnchor="middle">
                {mark.hue}
              </text>
            )}
          </g>
        )
      })}
      {/* Each station is a chip of its own background, with a dot each for heading and body. */}
      {Array.from({ length: REACH * 2 + 1 }, (_, k) => {
        const i = first + k
        const station = stations[mod(i, count)]
        const x = px(WIDTH / 2 + (i - at) * PITCH)
        return (
          <g key={i}>
            <rect x={x - 3} y={27} width={6} height={16} rx={1} fill={station.bg} stroke="white" strokeOpacity={0.14} strokeWidth={0.5} />
            <rect x={x - 1.5} y={30} width={3} height={3} rx={0.5} fill={station.heading} />
            <rect x={x - 1.5} y={36} width={3} height={3} rx={0.5} fill={station.body} />
          </g>
        )
      })}
    </svg>
  )
}

/** A fixed needle over a tape that scrolls, on a drum that rolls to change band. */
export function DrumDial({ tuner }: { tuner: Tuner }) {
  const turns = useEased(tuner.pos / BANDS[tuner.band].stations.length)

  const { ref, bind } = useTuningGesture<HTMLDivElement>(tuner, {
    axis: 'x',
    pxPerStep: PITCH,
    reverse: true,
    onTap: (e) => {
      const rect = e.currentTarget.getBoundingClientRect()
      const y = e.clientY - rect.top
      if (y < PEEK) tuner.setBand(mod(tuner.band - 1, BANDS.length))
      else if (y > HEIGHT - PEEK) tuner.setBand(mod(tuner.band + 1, BANDS.length))
      else tuner.step(Math.round((e.clientX - rect.left - rect.width / 2) / PITCH))
    },
  })

  return (
    <div className="flex flex-col gap-2.5">
      <div
        ref={ref}
        {...bind}
        className="radio-glass cursor-grab outline-none focus-visible:ring-2 focus-visible:ring-accent-warm/70 active:cursor-grabbing"
        style={{ height: HEIGHT + 2 }}
      >
        <div className="radio-backlight inset-x-0" data-active style={{ top: PEEK, height: ROW }} />
        {[-2, -1, 0, 1, 2].map((offset) => {
          const slot = tuner.bandTurn + offset
          const band = BANDS[mod(slot, BANDS.length)]
          return (
            <div key={slot} className="radio-drum-row" data-active={offset === 0} style={{ height: ROW, transform: rowTransform(offset) }}>
              <Tape band={band} turns={turns} />
              <span className="absolute inset-y-0 left-0 flex w-14 items-start bg-gradient-to-r from-[oklch(0.1_0.006_60)] from-55% to-transparent pl-2.5 pt-[7px] text-[7.5px] font-bold uppercase leading-none tracking-[0.16em] text-[color:var(--radio-print)]">
                {band.label}
              </span>
            </div>
          )
        })}
        {/* The drum falls into shadow as it curves away */}
        <div className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(180deg,oklch(0.09_0.006_60/95%)_0%,transparent_27%,transparent_73%,oklch(0.09_0.006_60/95%)_100%)]" />
        {/* Lens over the tuned chip */}
        <div
          className="pointer-events-none absolute left-1/2 z-[2] w-[14px] -translate-x-1/2 rounded-[3px] border border-white/25 bg-white/[0.04] shadow-[0_0_6px_oklch(0_0_0/60%),inset_0_1px_0_oklch(1_0_0/18%)]"
          style={{ top: PEEK + 24, height: 22 }}
        />
        <div className="radio-needle inset-y-[3px] left-1/2" />
      </div>
      <div className="flex items-end gap-2.5">
        <BandSelector tuner={tuner} />
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <StationPlate tuner={tuner} />
          <Thumbwheel tuner={tuner} axis="x" reverse className="h-4" />
        </div>
      </div>
    </div>
  )
}
