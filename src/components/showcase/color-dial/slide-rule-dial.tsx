'use client'

import { BandKeys, BandScale, StationPlate, TuningKnob } from './parts'
import type { Tuner } from './tuner'

/** The reference radio: three stacked scales under one needle that travels the glass. */
export function SlideRuleDial({ tuner }: { tuner: Tuner }) {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="radio-glass">
        <BandScale tuner={tuner} width={326} rowHeight={27} pad={7} inset={[46, 44]} numSize={9} labelSize={7.5} tick={6} />
      </div>
      <div className="flex items-center gap-2.5">
        <BandKeys tuner={tuner} />
        <StationPlate tuner={tuner} detail className="flex-1" />
        <TuningKnob tuner={tuner} size={56} />
      </div>
    </div>
  )
}
