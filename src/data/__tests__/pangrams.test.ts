import { describe, test, expect } from 'vitest'
import { PANGRAMS, DEFAULT_PANGRAM, isStockPangram, pickRandomPangram } from '../pangrams'
import { DEFAULT_CONFIG } from '../default-config'

describe('pangrams', () => {
  test('never includes the fox', () => {
    for (const p of PANGRAMS) expect(p.text.toLowerCase()).not.toContain('brown fox')
    expect(DEFAULT_CONFIG.sampleText).toBe(DEFAULT_PANGRAM)
  })

  test('random pick comes from the list', () => {
    for (let i = 0; i < 20; i++) expect(isStockPangram(pickRandomPangram())).toBe(true)
  })

  test('treats the retired default as stock, and typed text as custom', () => {
    expect(isStockPangram('The quick brown fox jumps over the lazy dog')).toBe(true)
    expect(isStockPangram('Something I typed')).toBe(false)
  })
})
