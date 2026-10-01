'use client'

import { Shuffle } from 'lucide-react'
import { BandScale, BandSlide, StationPlate, Thumbwheel } from './parts'
import type { Tuner } from './tuner'

const ROWS = { pad: 5, rowHeight: 17 }

/** The pocket transistor: one short strip, a slide switch level with the rows, a thumbwheel on the edge. */
export function PocketDial({ tuner }: { tuner: Tuner }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-stretch gap-1.5">
        <BandSlide tuner={tuner} rows={ROWS} />
        <div className="radio-glass min-w-0 flex-1">
          <BandScale tuner={tuner} width={270} {...ROWS} inset={[38, 12]} numSize={7.5} labelSize={6.5} tick={4} spectrum />
        </div>
        <Thumbwheel tuner={tuner} axis="y" tint="orange" className="w-6" />
      </div>
      <div className="flex gap-1.5">
        <StationPlate tuner={tuner} className="flex-1" />
        <button type="button" onClick={tuner.scan} className="hw-btn !h-7 !gap-1.5 !text-[9px] font-semibold uppercase tracking-widest">
          <Shuffle className="size-3" />
          Scan
        </button>
      </div>
    </div>
  )
}
