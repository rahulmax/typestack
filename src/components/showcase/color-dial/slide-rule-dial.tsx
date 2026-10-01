'use client'

import { Shuffle } from 'lucide-react'
import { BandKeys, BandScale, StationPlate, Thumbwheel } from './parts'
import type { Tuner } from './tuner'

/** The reference radio: three stacked scales under one needle that travels the glass. */
export function SlideRuleDial({ tuner, onScan = tuner.scan }: { tuner: Tuner; onScan?: () => void }) {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="radio-glass">
        <BandScale tuner={tuner} width={326} rowHeight={27} pad={7} inset={[46, 44]} numSize={9} labelSize={7.5} tick={6} />
      </div>
      {/* Left column picks a place, right column reads it out and fine-tunes */}
      <div className="grid grid-cols-[auto_1fr] items-center gap-x-2.5 gap-y-2">
        <BandKeys tuner={tuner} />
        <StationPlate tuner={tuner} detail />
        <button type="button" onClick={onScan} className="hw-btn !h-7 !gap-1.5 !text-[9px] font-semibold uppercase tracking-widest">
          <Shuffle className="size-3" />
          Scan
        </button>
        <Thumbwheel tuner={tuner} axis="x" className="h-5" />
      </div>
    </div>
  )
}
