import type { CopySet } from './types'
import { veyl } from './veyl'
import { letterhouse } from './letterhouse'
import { orbital } from './orbital'
import { rooftop } from './rooftop'
import { lowhum } from './lowhum'
import { dawnshift } from './dawnshift'
import { halden } from './halden'
import { spoke } from './spoke'
import { sorrel } from './sorrel'
import { aster } from './aster'

export type { CopySet } from './types'

export const COPY_SETS: CopySet[] = [
  veyl,
  letterhouse,
  orbital,
  rooftop,
  lowhum,
  dawnshift,
  halden,
  spoke,
  sorrel,
  aster,
]

/** A random index into COPY_SETS, different from `exclude` when there is another to choose. */
export function pickCopyIndex(exclude?: number): number {
  if (COPY_SETS.length < 2) return 0
  const n = Math.floor(Math.random() * (COPY_SETS.length - 1))
  return exclude === undefined ? Math.floor(Math.random() * COPY_SETS.length) : n >= exclude ? n + 1 : n
}
