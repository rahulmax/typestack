// One copy set is a small fictional world written out for every preview page.
// Layout strings may contain inline HTML (<em>, entities such as &ndash;). They are rendered
// as-is, so keep them to trusted copy. In docs fields, `backticks` render as inline code.
// Specimen strings are rendered by React: plain text, with Unicode characters instead of entities.

type Two<T> = [T, T]
type Three<T> = [T, T, T]
type Four<T> = [T, T, T, T]
type Five<T> = [T, T, T, T, T]
type Six<T> = [T, T, T, T, T, T]

export interface SpecimenCopy {
  /** Set huge at the top of the page. 1–3 words, at most ~18 characters. */
  hero: string
  /** One word, 5–8 letters, repeated across the weight ramp. */
  rampWord: string
  lead: string
  paragraph: string
  /** Include the curly quotes. */
  quote: string
  /** Type scale samples: a short heading (2–4 words), a long heading (6–9 words), a body sentence, an eyebrow. */
  scaleShort: string
  scaleLong: string
  scaleBody: string
  scaleEyebrow: string
  /** Three headings for the H2 / H3 / H4 pairing cards, and one shared body sentence. */
  pairingTitles: Three<string>
  pairingBody: string
  article: {
    eyebrow: string
    title: string
    standfirst: string
    paragraphs: Three<string>
    notes: Three<string>
    pullQuote: string
  }
}

export interface WebsiteCopy {
  brand: string
  nav: Three<string>
  navCta: string
  hero: { eyebrow: string; title: string; body: string; cta: string; note: string }
  trust: { label: string; names: Five<string> }
  features: {
    title: string
    body: string
    /** `mark` is a tiny glyph in the icon well: a numeral, 1–3 characters. */
    items: Six<{ mark: string; title: string; body: string }>
  }
  split1: { eyebrow: string; title: string; body: string; facts: Three<{ title: string; note: string }> }
  split2: { eyebrow: string; title: string; body: string; tags: Three<string> }
  stats: Four<{ value: string; label: string }>
  testimonial: { quote: string; name: string; role: string }
  steps: { title: string; body: string; items: Three<{ title: string; body: string }> }
  cta: { title: string; body: string; button: string }
  footer: { tagline: string; links: Four<string>; legal: string; legalLinks: Two<string> }
}

export interface BlogCopy {
  eyebrow: string
  title: string
  dek: string
  author: string
  date: string
  readTime: string
  intro: string
  heading1: string
  section1: Two<string>
  subheading: string
  section2: string
  quote: string
  quoteSource: string
  heading2: string
  section3: string
  listTitle: string
  list: Four<string>
  noteTitle: string
  note: string
}

export interface MagazineCopy {
  /** Strap across the top: season, issue, place. */
  strap: Three<string>
  masthead: string
  nav: Four<string>
  credits: Three<{ label: string; value: string }>
  title: string
  dek: string
  /** Caption for the wide opening photo (a street, sign or design detail): [caption, credit]. */
  plateCaption: Two<string>
  toc: Four<{ page: string; title: string; note: string }>
  story: { eyebrow: string; title: string; paragraphs: Three<string> }
  quote: string
  quoteSource: string
  /** The tall photo is a candid portrait of a smiling person. Caption: [caption, credit]. */
  portrait: { caption: Two<string>; eyebrow: string; title: string; paragraphs: Two<string> }
  spread: { title: string; paragraphs: Two<string>; subhead: string; after: Two<string> }
  contributors: Three<{ name: string; note: string }>
  footer: Two<string>
}

export interface DocsCopy {
  product: string
  topNav: Three<string>
  search: string
  version: string
  /** Sidebar groups. The page shown is the second item of the first group. */
  navGroups: Three<{ label: string; items: Three<string> }>
  crumbRoot: string
  title: string
  lead: string
  callout: { title: string; body: string }
  heading1: string
  body1: string
  codeLabel: string
  /** Two short shell-style lines, newline separated. */
  code: string
  heading2: string
  body2: string
  heading3: string
  body3: string
  heading4: string
  body4: string
  heading5: string
  body5: string
  warning: { title: string; body: string }
  heading6: string
  body6: string
  settings: Three<{ key: string; kind: string; value: string; effect: string }>
  heading7: string
  steps: Two<{ title: string; body: string }>
}

export interface SwissCopy {
  /** Top strip: organisation, series, venue, dates. */
  top: Four<string>
  eyebrow: string
  title: string
  lede: string
  aside: string
  premise: {
    eyebrow: string
    title: string
    paragraphs: Two<string>
    subhead: string
    after: string
    noteTitle: string
    note: string
  }
  /** Six headings from largest to smallest, then a closing sentence. */
  chain: Six<string>
  chainEnd: string
  programme: Four<{ date: string; title: string; place: string }>
  quote: string
  quoteSource: string
  footer: Three<string>
}

export interface NewsletterCopy {
  preheader: Two<string>
  name: string
  date: string
  issue: string
  issueLabel: string
  title: string
  intro: string
  essay: { eyebrow: string; title: string; body: string; after: string; button: string }
  second: { eyebrow: string; title: string; quote: string; quoteSource: string; subhead: string; body: string }
  linksLabel: string
  links: Three<{ title: string; meta: string }>
  sponsor: { eyebrow: string; title: string; body: string; link: string }
  footer: Two<string>
}

export interface CopySet {
  id: string
  /** The world's name, shown small on the specimen page. */
  name: string
  specimen: SpecimenCopy
  website: WebsiteCopy
  blog: BlogCopy
  magazine: MagazineCopy
  docs: DocsCopy
  swiss: SwissCopy
  newsletter: NewsletterCopy
}
