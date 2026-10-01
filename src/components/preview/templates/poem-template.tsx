import { ScrollText } from "lucide-react";
import type { PreviewTemplate } from "./types";

// Two facing pages of a literary journal, one poem to a page. Each poem is set flush left and then
// centred on its page as a block, by its longest line, the way verse is placed in print. Lines hang
// their turns under the first word, stanzas are a line apart, and every fifth line is numbered in
// the margin. A head rule runs across both pages and a hairline stands in the gutter; the
// contributors' note sits at the foot of the left page as a footnote.
export const poemTemplate: PreviewTemplate = {
  id: "poem",
  name: "Poetry",
  icon: ScrollText,
  render: (copy) => {
    const c = copy.poem;
    let n = 0;
    const stanza = (lines: readonly string[]) => `<div class="pm-stanza">
          ${lines
            .map((line) => {
              n += 1;
              return `<p class="pm-line"${n % 5 === 0 ? ` data-n="${n}"` : ""}>${line}</p>`;
            })
            .join("\n          ")}
        </div>`;
    const first = c.first.stanzas.map(stanza).join("\n        ");
    n = 0;
    const second = c.second.stanzas.map(stanza).join("\n        ");
    // The folio in the copy is the right-hand page; the left one is the page before it
    const recto = Number(c.folio);
    const verso = Number.isInteger(recto) && recto > 1 ? String(recto - 1) : "";
    return `
<style>
  .pm {
    --pm-rule: color-mix(in srgb, currentColor 20%, transparent);
    /* The pages' inner margins are a share of the spread; read by the pages, which sit inside this container */
    --pm-pad: clamp(1.25rem, 3.2cqi, 3rem);
    --pm-sink: clamp(3rem, 6.5cqi, 5.5rem);
    /* Room in the margin for the line numbers */
    --pm-num: 3rem;
    /* The container carries the body size, so its query can count in ems of the verse */
    container: pm / inline-size; font-size: var(--size-p);
    max-width: 1240px; margin: 0 auto; padding: 1rem 1.5rem 3rem;
  }
  .pm h1, .pm h2, .pm h3, .pm h4, .pm h5, .pm h6, .pm p { margin: 0; }
  .pm-caps { text-transform: uppercase; letter-spacing: 0.16em; }

  /* Head, poem and foot are three shared rows, so they line up across the two pages */
  .pm-spread { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); grid-template-rows: auto 1fr auto; }
  .pm-page { display: grid; grid-row: 1 / -1; grid-template-rows: subgrid; min-width: 0; }
  .pm-verso { grid-column: 1; }
  .pm-recto { grid-column: 2; }
  /* The gutter: a hairline from under the head rule to the foot */
  .pm-spread::after { content: ""; grid-column: 2; grid-row: 2 / -1; width: 1px; margin-top: var(--pm-pad); background: var(--pm-rule); pointer-events: none; }

  .pm-head { display: flex; align-items: baseline; padding-bottom: 0.8rem; border-bottom: 1px solid currentColor; }
  .pm-recto .pm-head { justify-content: flex-end; }

  .pm-body { padding: var(--pm-sink) var(--pm-pad) var(--pm-sink) max(var(--pm-pad), var(--pm-num) + 0.25rem); }
  .pm-poem { width: fit-content; max-width: 100%; margin: 0 auto; }
  /* At big scales titles keep whole words and clip at a line limit */
  .pm .pm-title h2 { max-width: 12em; overflow-wrap: normal; overflow-x: clip; clip-path: inset(-0.5em -0.5em -0.35em); max-height: 3lh; text-wrap: balance; }
  .pm-title { display: flex; flex-direction: column; gap: 0.7rem; margin-bottom: 2.25rem; }
  /* The epigraph stands a step in from the verse, a line above it */
  .pm .pm-epi { max-width: 24em; margin: -0.5rem 0 1lh 2em; opacity: 0.75; }

  .pm-stanza + .pm-stanza { margin-top: 1lh; }
  /* A wrapped line hangs under its first word, so the break reads as a turn, not a new line */
  .pm .pm-line { position: relative; padding-left: 2em; text-indent: -2em; }
  .pm-line[data-n]::after { content: attr(data-n); position: absolute; left: calc(var(--pm-num) * -1); top: 0.35em; width: calc(var(--pm-num) - 1rem); text-align: right; text-indent: 0; font-size: 0.72em; font-variant-numeric: tabular-nums; opacity: 0.45; }

  /* Foot: the note as a footnote under a short rule, and a folio in each outer corner */
  .pm-foot { display: flex; flex-direction: column; justify-content: flex-end; gap: 1.5rem; }
  .pm-verso .pm-foot { padding-right: var(--pm-pad); }
  .pm-recto .pm-foot { align-items: flex-end; }
  .pm .pm-note { max-width: 30em; }
  .pm-note::before { content: ""; display: block; width: 3rem; height: 1px; margin-bottom: 0.9rem; background: currentColor; opacity: 0.5; }
  .pm-folio { font-variant-numeric: tabular-nums; }

  /* Too narrow for two pages of verse: one page after the other */
  @container pm (max-width: 54em) {
    .pm { --pm-num: 2rem; }
    .pm-spread { grid-template-columns: minmax(0, 1fr); grid-template-rows: none; row-gap: 3.5rem; }
    .pm-page { grid-column: 1; grid-row: auto; grid-template-rows: none; }
    .pm-spread::after { display: none; }
    .pm-body { padding: 2.75rem 0 2.75rem var(--pm-num); }
    .pm-verso .pm-foot { padding-right: 0; }
    .pm-epi { margin-left: 1em; }
  }
  @media (max-width: 800px) {
    .pm { padding: 0.5rem 1rem 2rem; }
  }
</style>

<div class="pm" lang="en">
  <div class="pm-spread">
    <article class="pm-page pm-verso">
      <header class="pm-head"><small class="pm-caps">${c.journal}</small></header>
      <div class="pm-body">
        <div class="pm-poem">
          <header class="pm-title">
            <h2>${c.first.title}</h2>
            <small class="pm-caps">${c.first.poet}</small>
          </header>
          <p class="pm-epi"><small>${c.first.epigraph}</small></p>
          ${first}
        </div>
      </div>
      <footer class="pm-foot">
        <p class="pm-note"><small>${c.note}</small></p>
        <small class="pm-folio">${verso}</small>
      </footer>
    </article>

    <article class="pm-page pm-recto">
      <header class="pm-head"><small>${c.issue}</small></header>
      <div class="pm-body">
        <div class="pm-poem">
          <header class="pm-title">
            <h2>${c.second.title}</h2>
            <small class="pm-caps">${c.second.poet}</small>
          </header>
          ${second}
        </div>
      </div>
      <footer class="pm-foot">
        <small class="pm-folio">${c.folio}</small>
      </footer>
    </article>
  </div>
</div>
`;
  },
};
