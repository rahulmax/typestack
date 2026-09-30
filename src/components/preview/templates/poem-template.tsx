import { ScrollText } from "lucide-react";
import type { PreviewTemplate } from "./types";

// A literary journal page with two poems: verse lines with hanging indents, stanza breaks,
// and line numbers every fifth line in the margin.
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
          .join("\n        ")}
      </div>`;
    const first = c.first.stanzas.map(stanza).join("\n      ");
    n = 0;
    const second = c.second.stanzas.map(stanza).join("\n      ");
    return `
<style>
  .pm { --pm-rule: color-mix(in srgb, currentColor 20%, transparent); max-width: 1100px; margin: 0 auto; padding: 1rem 1.5rem 3rem; }
  .pm h1, .pm h2, .pm h3, .pm h4, .pm h5, .pm h6, .pm p { margin: 0; }
  .pm-caps { text-transform: uppercase; letter-spacing: 0.16em; }
  .pm-head { display: flex; justify-content: space-between; align-items: baseline; gap: 1rem; padding-bottom: 0.8rem; border-bottom: 1px solid currentColor; }

  .pm-page { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); column-gap: 1.5rem; padding-top: 4.5rem; }
  .pm-first { grid-column: 2 / 8; }
  .pm-second { grid-column: 9 / 13; padding-top: 9rem; }
  /* At big scales titles keep whole words and clip at a line limit */
  .pm .pm-title h2, .pm .pm-title h3 { overflow-wrap: normal; overflow: hidden; max-height: 3lh; }
  .pm-title { display: flex; flex-direction: column; gap: 0.6rem; margin-bottom: 2rem; }
  .pm .pm-epi { max-width: 26em; margin: -0.75rem 0 2rem 2em; opacity: 0.75; }

  .pm-stanza + .pm-stanza { margin-top: 1lh; }
  /* A wrapped line hangs under its first word, so the break reads as a turn, not a new line */
  .pm .pm-line { position: relative; padding-left: 2em; text-indent: -2em; text-wrap: pretty; }
  .pm-line[data-n]::after { content: attr(data-n); position: absolute; left: -3rem; top: 0.35em; width: 2rem; text-align: right; text-indent: 0; font-size: 0.72em; font-variant-numeric: tabular-nums; opacity: 0.45; }

  .pm-foot { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); column-gap: 1.5rem; margin-top: 5rem; padding-top: 1rem; border-top: 1px solid var(--pm-rule); }
  .pm-note { grid-column: 2 / 8; }
  .pm-folio { grid-column: 12 / 13; text-align: right; font-variant-numeric: tabular-nums; }

  @media (max-width: 800px) {
    .pm { padding: 0.5rem 1rem 2rem; }
    .pm-page, .pm-foot { grid-template-columns: 1fr; }
    .pm-first, .pm-second, .pm-note, .pm-folio { grid-column: 1 / -1; }
    .pm-page { padding-top: 2.5rem; padding-left: 1.5rem; }
    .pm-second { padding-top: 3.5rem; margin-top: 3.5rem; border-top: 1px solid var(--pm-rule); }
    .pm-line[data-n]::after { left: -2.25rem; width: 1.5rem; }
    .pm-epi { margin-left: 0; }
    .pm-folio { text-align: left; margin-top: 0.75rem; }
  }
</style>

<div class="pm" lang="en">
  <header class="pm-head">
    <small class="pm-caps">${c.journal}</small>
    <small>${c.issue}</small>
  </header>

  <div class="pm-page">
    <article class="pm-first">
      <header class="pm-title">
        <h2>${c.first.title}</h2>
        <small class="pm-caps">${c.first.poet}</small>
      </header>
      <p class="pm-epi"><small>${c.first.epigraph}</small></p>
      ${first}
    </article>

    <article class="pm-second">
      <header class="pm-title">
        <h3>${c.second.title}</h3>
        <small class="pm-caps">${c.second.poet}</small>
      </header>
      ${second}
    </article>
  </div>

  <footer class="pm-foot">
    <p class="pm-note"><small>${c.note}</small></p>
    <small class="pm-folio">${c.folio}</small>
  </footer>
</div>
`;
  },
};
