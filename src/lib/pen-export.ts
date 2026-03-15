import type { TypographyConfig } from '@/types/typography'
import { computeScale } from './scale'
import { DISPLAY_ELEMENTS } from '@/types/typography'

interface PenVariable {
  type: 'string' | 'number'
  value: string | number
}

export function generatePenFile(config: TypographyConfig): string {
  const styles = computeScale(config).filter(
    (s) => !DISPLAY_ELEMENTS.includes(s.element)
  )

  const variables: Record<string, PenVariable> = {
    'font.heading': { type: 'string', value: config.headingsGroup.fontFamily },
    'font.body': { type: 'string', value: config.bodyGroup.fontFamily },
  }

  for (const s of styles) {
    variables[`fontSize.${s.element}`] = { type: 'number', value: parseFloat(s.fontSizeRem.toFixed(4)) }
    variables[`fontWeight.${s.element}`] = { type: 'number', value: s.fontWeight }
    variables[`lineHeight.${s.element}`] = { type: 'number', value: s.lineHeight }
    variables[`letterSpacing.${s.element}`] = { type: 'number', value: s.letterSpacing }
    variables[`wordSpacing.${s.element}`] = { type: 'number', value: s.wordSpacing }
    variables[`textTransform.${s.element}`] = { type: 'string', value: s.textTransform }
  }

  return JSON.stringify({ variables }, null, 2)
}
