import { describe, test, expect } from 'vitest'
import { isKitSlug, labelFromSlug, parseKit } from '../adobe-fonts'

// Trimmed from a real use.typekit.net kit payload: the `c` array that pairs a
// `.tk-` helper class with its font stack, and `fc` entries for each @font-face.
const KIT_JS = String.raw`(function(){window.Typekit.config={"c":[".tk-adobe-clean","\"adobe-clean\",sans-serif",".tk-source-code-pro","\"source-code-pro\",monospace",".tk-p22-mackinac-pro","\"p22-mackinac-pro\",serif"],"fi":[7180,7182],"fc":[{"id":7180,"family":"adobe-clean","src":"https://use.typekit.net/af/59b220/00000000000000007735dac8/31/{format}{?primer,subset_id,fvd,v}","descriptors":{"weight":"400","style":"normal","stretch":"normal","display":"swap","variable":false,"primer":"f592e0a4"}},{"id":7181,"family":"adobe-clean","src":"https://use.typekit.net/af/597099/00000000000000007735dacd/31/{format}{?primer,subset_id,fvd,v}","descriptors":{"weight":"700","style":"italic","stretch":"normal","display":"swap","variable":false,"primer":"f592e0a4"}},{"id":7182,"family":"source-code-pro","src":"https://use.typekit.net/af/aaaaaa/00000000000000007735dad0/31/{format}{?primer,subset_id,fvd,v}","descriptors":{"weight":"400","style":"normal","stretch":"normal","display":"swap","variable":false,"primer":"f592e0a4"}}],"kt":"abc1234"};})();`

describe('parseKit', () => {
  const kit = parseKit('abc1234', KIT_JS)

  test('lists every family that has at least one face', () => {
    expect(kit.families.map((f) => f.family)).toEqual(['adobe-clean', 'source-code-pro'])
  })

  test('reads each family category from its declared font stack', () => {
    expect(kit.families.find((f) => f.family === 'adobe-clean')?.category).toBe('sans-serif')
    expect(kit.families.find((f) => f.family === 'source-code-pro')?.category).toBe('monospace')
  })

  test('titles the slug for display while keeping it as the CSS identifier', () => {
    const family = kit.families.find((f) => f.family === 'source-code-pro')
    expect(family?.label).toBe('Source Code Pro')
    expect(family?.family).toBe('source-code-pro')
  })

  test('collects the weights a family actually ships', () => {
    expect(kit.families.find((f) => f.family === 'adobe-clean')?.weights).toEqual([400, 700])
  })

  test('keeps one face per weight and style', () => {
    expect(kit.faces).toHaveLength(3)
    expect(kit.faces[1]).toMatchObject({ family: 'adobe-clean', weight: 700, style: 'italic' })
  })

  test('reports a kit whose payload shape it cannot read as empty', () => {
    expect(parseKit('abc1234', 'window.Typekit.config={};').families).toEqual([])
  })
})

describe('labelFromSlug', () => {
  test('keeps foundry and format tokens in capitals, as Adobe names them', () => {
    expect(labelFromSlug('futura-pt')).toBe('Futura PT')
    expect(labelFromSlug('p22-mackinac-pro')).toBe('P22 Mackinac Pro')
    expect(labelFromSlug('ff-tisa-web-pro')).toBe('FF Tisa Web Pro')
  })

  test('uses the real name where title-casing cannot reach it', () => {
    expect(labelFromSlug('ivymode')).toBe('IvyMode')
    expect(labelFromSlug('ivypresto-display')).toBe('IvyPresto Display')
  })
})

describe('isKitSlug', () => {
  test('tells kit slugs from Google family names by shape alone', () => {
    expect(isKitSlug('neue-haas-grotesk-display')).toBe(true)
    expect(isKitSlug('ivymode')).toBe(true)
    expect(isKitSlug('Inter')).toBe(false)
    expect(isKitSlug('Source Serif 4')).toBe(false)
  })
})
