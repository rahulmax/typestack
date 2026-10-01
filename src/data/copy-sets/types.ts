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

/**
 * One person's own site, nearly empty: a name, a large claim, three principles and a short list of
 * writing. First person, plain and a little dry. No inline HTML except in `footer`.
 */
export interface PersonalCopy {
  /** First name, then surname, stacked in the header. */
  name: Two<string>
  /** What they do, 3–5 words. The template adds a trailing slash. */
  kicker: string
  /** The claim, set huge. 5–8 words, no full stop. */
  title: string
  /** Three short sentences, about 170–220 characters: the situation, what they want to find out, and a two-part self-description. */
  lead: string
  /** `label` is 2–4 words. `statement` is set large: two sentences, 110–150 characters, starting 'I am …'. */
  about: { label: string; statement: string }
  /** Titles 2–5 words; bodies about 120–170 characters. */
  principles: Three<{ title: string; body: string }>
  writing: {
    /** 2–4 words. */
    label: string
    /** Set large: a placeholder for a heading that will exist once there is enough writing. 110–150 characters. */
    statement: string
    /** `kicker` is a subtitle under 45 characters (the template adds a trailing slash); `title` 3–7 words; `tags` 1–2 words each; `meta` a reading time, e.g. '8 min'. */
    articles: Three<{ kicker: string; title: string; tags: Two<string>; meta: string }>
  }
  /** `prompt` is one short question. `email` is set large and uses an invented domain, under 26 characters. `links` are 1–3 words. */
  contact: { prompt: string; email: string; links: Two<string> }
  /** A copyright line, e.g. '&copy; 2026 Ada Pell'. */
  footer: string
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
  /** Small bold lines at the top left: series, venue, dates. */
  kicker: Three<string>
  /** Stacked headline in two tones: the name (heading colour), then what's on (body colour). 2–5 words each. */
  title: Two<string>
  /** One word, 8–13 letters, fitted across the full width of the page. */
  giant: string
  /** Two short lines (1–3 words each) set beside the giant word. */
  aside: Two<string>
  /**
   * Programme entries, like an opera poster. `title` is 1–2 short words (set very large);
   * `when` is a date line and a time line; `note` is one short line; `lead` is one bold line
   * (under 45 characters); `credits` are four short "Role: Name" lines.
   */
  programme: Three<{ title: string; when: Two<string>; note: string; lead: string; credits: Four<string> }>
  /** A name of two words (up to 15 characters) set vertically beside the heading ladder. */
  vertical: string
  /** Six headings from largest to smallest, each 2–6 words. */
  chain: Six<string>
  /**
   * Two dated milestones. `year` is 4 characters; `label` 2–3 words; `body` a small paragraph
   * of about 250 characters; `intro` one sentence under 80 characters; `name` two short words set huge.
   */
  timeline: Two<{ year: string; label: string; body: string; intro: string; name: string }>
  /** Closing text: a heading (2–5 words), a bold dek sentence, and two columns of about 300 characters each. */
  essay: { title: string; dek: string; columns: Two<string> }
  /** No quote marks; the template adds them. About 120–180 characters. */
  quote: string
  quoteSource: string
  footer: Two<string>
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

/**
 * A two-page book spread: a chapter opener on the left page, the chapter continuing on the right.
 * Plain prose, no inline HTML. Paragraphs are about 380–480 characters each.
 */
export interface BookCopy {
  /** The book's title, for the right-hand running head. 2–5 words. */
  title: string
  /** The author, for the left-hand running head. */
  author: string
  /** Chapter number as a word, e.g. 'Three'. */
  chapter: string
  /** 2–5 words. */
  chapterTitle: string
  /** One or two sentences, under 140 characters, no quote marks. */
  epigraph: string
  epigraphSource: string
  /** Opening paragraphs on the left page. The first gets a drop cap and its first five words in small caps. */
  verso: Two<string>
  /** The chapter continuing on the right page. */
  recto: Three<string>
  /** After a section break on the right page. */
  afterBreak: string
  /** Page numbers, left then right, e.g. ['46', '47']. */
  folios: Two<string>
}

/** A broadsheet front page. No images; all type. */
export interface NewspaperCopy {
  /** The paper's name, set huge across the top. 2–3 words, 12–22 characters. */
  name: string
  /** A short motto under the masthead, under 60 characters. */
  motto: string
  /** Three dateline cells: volume and number, full date, price. */
  dateline: Three<string>
  /** Top-left ear: weather or tide, under 40 characters. Top-right ear: a teaser, under 40 characters. */
  ears: Two<string>
  lead: {
    /** 1–3 words set small above the headline. */
    kicker: string
    /** 6–11 words. */
    headline: string
    /** One sentence, under 140 characters. */
    deck: string
    byline: string
    /** Place name for the dateline, e.g. 'VEYL'. Set in capitals. */
    place: string
    /** Four paragraphs of about 350–450 characters, set in three justified columns. */
    body: Four<string>
  }
  /** A pull quote from the lead story, under 120 characters, no quote marks. */
  quote: string
  quoteSource: string
  /** The second story in the right-hand rail. */
  second: { kicker: string; headline: string; byline: string; body: Two<string> }
  /** 'Inside' index: section titles with page numbers. Titles 1–4 words; pages 1–2 digits. */
  index: Five<{ title: string; page: string }>
  /** Four short news items across the foot of the page. Headline 3–7 words; body about 180–230 characters. */
  briefs: Four<{ headline: string; body: string }>
}

/**
 * Three typographic posters, each composed differently. No images.
 * `a` is centred and classical; `b` is one giant word fitted across the poster;
 * `c` is built around a huge numeral.
 */
export interface PostersCopy {
  a: {
    /** A short line at the top, e.g. 'Hollow Concordance presents'. Under 40 characters. */
    top: string
    /** 2–4 words, the event. */
    title: string
    /** One line under the title, under 50 characters. */
    subtitle: string
    /** Three short lines at the foot: date, venue, admission. Each under 36 characters. */
    details: Three<string>
  }
  b: {
    /** One word, 5–9 letters, fitted to the poster's width. */
    word: string
    /** A line set sideways along the edge, under 40 characters. */
    side: string
    /** Two lines at the foot, each under 36 characters. */
    foot: Two<string>
  }
  c: {
    /** 1–3 characters, e.g. '09' or '14'. Set enormous. */
    numeral: string
    /** What the numeral counts or dates, e.g. 'November' or 'nights'. One word. */
    unit: string
    /** 2–5 words. */
    title: string
    /** About 140–180 characters. */
    body: string
    /** Two tiny corner labels, each under 24 characters. */
    corners: Two<string>
  }
}

/** A 12-inch record: square front cover and a back cover with the track list. */
export interface SleeveCopy {
  /** The artist or ensemble. 1–4 words. */
  artist: string
  /** The album title. 1–5 words, under 32 characters. */
  album: string
  /** Record label name, 1–3 words. */
  label: string
  /** Catalogue number, e.g. 'LH-014'. */
  catalogue: string
  year: string
  /** Track titles 1–5 words; times like '4:12'. */
  sideA: Four<{ title: string; time: string }>
  sideB: Four<{ title: string; time: string }>
  /** Liner notes, about 280–340 characters. */
  notes: string
  /** Four short credit lines, 'Role: Name', each under 40 characters. */
  credits: Four<string>
}

/** A printed menu card. Prices are plain numbers or short amounts, e.g. '6', '12.50', '3 tokens'. */
export interface MenuCopy {
  /** The house name, 1–3 words. */
  name: string
  /** Under 60 characters. */
  tagline: string
  /** Opening hours, under 50 characters. */
  hours: string
  /** Section titles 1–3 words; note under 60 characters; item names 1–5 words; desc under 90 characters. */
  sections: Three<{ title: string; note: string; items: Four<{ name: string; desc: string; price: string }> }>
  /** Two small lines at the foot: a house rule and an address. Each under 70 characters. */
  footer: Two<string>
}

/** End credits of a short film, set on a centre gutter: roles to the left, names to the right. */
export interface CreditsCopy {
  /** e.g. 'Hollow Concordance presents'. Under 40 characters. */
  presenter: string
  /** The film title, 1–5 words. */
  title: string
  /** e.g. 'A film by Ilse Varrow'. */
  byline: string
  /** Roles are character names or jobs, 1–4 words; names are people, 2–3 words. */
  cast: Six<{ role: string; name: string }>
  crew: Six<{ role: string; name: string }>
  /** Songs used: title, and a credit line under 50 characters. */
  music: Two<{ title: string; credit: string }>
  /** Four names or groups thanked, each under 36 characters. */
  thanks: Four<string>
  /** A closing card, 1–5 words. */
  closing: string
  /** A small legal or joke line, under 100 characters. */
  legal: string
}

/**
 * A literary journal page with two poems. Plain text, no inline HTML. Lines are 25–60 characters,
 * written as poetry: concrete images, not rhyming doggerel.
 */
export interface PoemCopy {
  /** The journal's name, 1–4 words. */
  journal: string
  /** e.g. 'No. 9, Winter'. */
  issue: string
  first: {
    title: string
    poet: string
    /** Under 90 characters, no quote marks. */
    epigraph: string
    stanzas: Three<Four<string>>
  }
  second: {
    title: string
    poet: string
    stanzas: Two<Three<string>>
  }
  /** Contributor notes for both poets together, about 200–260 characters. */
  note: string
  /** The page number. */
  folio: string
}

export interface CopySet {
  id: string
  /** The world's name, shown small on the specimen page. */
  name: string
  specimen: SpecimenCopy
  website: WebsiteCopy
  personal: PersonalCopy
  blog: BlogCopy
  magazine: MagazineCopy
  docs: DocsCopy
  swiss: SwissCopy
  newsletter: NewsletterCopy
  book: BookCopy
  newspaper: NewspaperCopy
  posters: PostersCopy
  sleeve: SleeveCopy
  menu: MenuCopy
  credits: CreditsCopy
  poem: PoemCopy
}
