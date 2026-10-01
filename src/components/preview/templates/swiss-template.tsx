import { Grid3x3 } from "lucide-react";
import type { PreviewTemplate } from "./types";
import { fitScript } from "./fit-script";

export const swissTemplate: PreviewTemplate = {
  id: "swiss",
  name: "Swiss",
  icon: Grid3x3,
  render: (copy) => {
    const c = copy.swiss;
    return `
<style>
  .sw { max-width: 1200px; margin: 0 auto; padding: 1rem 1.5rem 3rem; text-align: left; }
  .sw-row { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); column-gap: 1.5rem; }
  .sw-l { grid-column: 1 / 5; }
  .sw-r { grid-column: 5 / 13; }
  .sw h1, .sw h2, .sw h3, .sw h4, .sw h5, .sw h6, .sw p { margin: 0; }
  .sw hr { border: none; border-top: 1px solid currentColor; margin: 0; }
  .sw-show > hr { grid-column: 1 / 13; }
  /* Second tone of the headline: the body colour, pulled toward the page so it reads even when both colours match */
  .sw .sw-tone2 { color: color-mix(in oklab, var(--fg-color) 55%, var(--bg-color)); }

  .sw-mast { align-items: start; padding-bottom: 9rem; }
  .sw-kicker { padding-top: 0.6rem; }
  /* Poster leading: the big lines sit close, whatever the scale's own line height */
  .sw .sw-title { line-height: 1; text-wrap: balance; }
  .sw .sw-show h2, .sw .sw-era-name { line-height: 1; }

  .sw-giant-row { display: flex; align-items: flex-end; gap: 2rem; padding-bottom: 0.9rem; border-bottom: 1px solid currentColor; }
  .sw .sw-giant { flex: 1; min-width: 0; white-space: nowrap; line-height: 0.85; }
  .sw-giant span { display: inline-block; }
  .sw-aside { flex-shrink: 0; padding-bottom: 0.4rem; }

  .sw-prog { display: grid; row-gap: 5rem; padding-top: 6rem; }
  .sw-show { row-gap: 0.75rem; }
  .sw-show h2 { padding-top: 0.25rem; }

  .sw-ladder { align-items: end; padding-top: 9rem; }
  .sw-vert { display: flex; align-items: flex-end; }
  .sw .sw-vert p { writing-mode: vertical-rl; transform: rotate(180deg); white-space: nowrap; line-height: 0.9; }
  .sw-chain { display: grid; row-gap: 1.1rem; }

  .sw-eras { display: grid; row-gap: 5rem; padding-top: 9rem; }
  .sw-era { align-items: start; }
  .sw-era .sw-l { display: grid; row-gap: 0.75rem; padding-right: 1rem; }
  .sw .sw-year { line-height: 1; }
  .sw-era .sw-r { display: grid; row-gap: 1rem; }
  .sw-era-name { padding-top: 0.5rem; }

  .sw-close { align-items: end; padding-top: 9rem; }
  .sw-essay { grid-column: 1 / 7; }
  .sw-essay h3 { margin-bottom: 0.5rem; }
  .sw .sw-dek { font-weight: 700; margin-bottom: 1.75rem; max-width: 28em; }
  .sw-cols { display: grid; grid-template-columns: 1fr 1fr; column-gap: 1.5rem; }
  .sw-quote { grid-column: 8 / 13; margin: 0; }
  .sw .sw-q { font-size: 1.75rem; font-weight: 300; line-height: 1.3; text-indent: -0.4em; margin-bottom: 1.5rem; }

  .sw-foot { padding-top: 4rem; }
  .sw-foot small:first-child { grid-column: 1 / 5; }
  .sw-foot small:last-child { grid-column: 5 / 13; }

  /* Big type never breaks the grid: one-line items and headlines past their line budget are clipped
     at the column edge, poster style, with no ellipsis. */
  .sw .sw-title { overflow-x: clip; clip-path: inset(-0.5em -0.5em -0.35em); max-height: 5lh; }
  .sw-show h2, .sw .sw-year, .sw .sw-era-name, .sw-aside, .sw-chain > *, .sw-kicker h6 { white-space: nowrap; overflow-x: clip; text-overflow: clip; }
  .sw-aside { min-width: 0; max-width: 40%; }
  /* The vertical name stops at a set height and is clipped at its top end; only along
     its length, so descenders, which point sideways here, keep their tails */
  .sw .sw-vert p { max-height: min(36rem, 85vh); overflow-y: clip; }

  @media (max-width: 800px) {
    .sw { padding: 0.5rem 1.25rem 2.5rem; }
    .sw-row { column-gap: 1rem; }
    .sw-l, .sw-r, .sw-essay, .sw-quote { grid-column: 1 / 13; }
    .sw-mast { row-gap: 2.5rem; padding-bottom: 5rem; }
    .sw-prog { padding-top: 4rem; row-gap: 3.5rem; }
    .sw-show .sw-l { margin-top: 0.25rem; }
    .sw-ladder, .sw-eras, .sw-close { padding-top: 5rem; }
    .sw-ladder { row-gap: 2rem; }
    .sw .sw-vert p { writing-mode: horizontal-tb; transform: none; }
    .sw-eras { row-gap: 3.5rem; }
    .sw-era { row-gap: 1.5rem; }
    .sw-close { row-gap: 3rem; }
    .sw-foot small:first-child, .sw-foot small:last-child { grid-column: 1 / 13; }
  }
  @media (max-width: 480px) {
    .sw { padding: 0.5rem 0.75rem 2rem; }
    .sw-giant-row { flex-direction: column; align-items: flex-start; gap: 0.75rem; }
    .sw-giant-row .sw-giant { width: 100%; }
    .sw-cols { grid-template-columns: 1fr; row-gap: 1rem; }
  }
</style>

<div class="sw">
  <header class="sw-row sw-mast">
    <div class="sw-l sw-kicker">
      ${c.kicker.map((k) => `<h6>${k}</h6>`).join("\n      ")}
    </div>
    <h1 class="display-1 sw-r sw-title">${c.title[0]}<br /><span class="sw-tone2">${c.title[1]}</span></h1>
  </header>

  <div class="sw-giant-row">
    <p class="display-1 sw-giant" data-fit><span>${c.giant}</span></p>
    <h4 class="sw-aside">${c.aside[0]}<br />${c.aside[1]}</h4>
  </div>

  <section class="sw-prog">
    ${c.programme
      .map(
        (s) => `<article class="sw-row sw-show">
      <h2 class="display-2 sw-r">${s.title}</h2>
      <hr />
      <p class="sw-l"><b>${s.when[0]}</b><br /><b>${s.when[1]}</b><br />${s.note}</p>
      <p class="sw-r"><b>${s.lead}</b><br />${s.credits.join("<br />")}</p>
    </article>`,
      )
      .join("\n    ")}
  </section>

  <section class="sw-row sw-ladder">
    <div class="sw-l sw-vert"><p class="display-1">${c.vertical}</p></div>
    <div class="sw-r sw-chain">
      ${c.chain.map((h, i) => `<h${i + 1}>${h}</h${i + 1}>`).join("\n      ")}
    </div>
  </section>

  <section class="sw-eras">
    ${c.timeline
      .map(
        (e) => `<article class="sw-row sw-era">
      <div class="sw-l">
        <p class="display-2 sw-year">${e.year}</p>
        <h6>${e.label}</h6>
        <p><small>${e.body}</small></p>
      </div>
      <div class="sw-r">
        <p><small>${e.intro}</small></p>
        <hr />
        <p class="display-1 sw-era-name">${e.name}</p>
      </div>
    </article>`,
      )
      .join("\n    ")}
  </section>

  <section class="sw-row sw-close">
    <div class="sw-essay">
      <h3>${c.essay.title}</h3>
      <p class="sw-dek">${c.essay.dek}</p>
      <div class="sw-cols">
        ${c.essay.columns.map((col) => `<p><small>${col}</small></p>`).join("\n        ")}
      </div>
    </div>
    <blockquote class="sw-quote">
      <p class="sw-q">&ldquo;${c.quote}&rdquo;</p>
      <p>&mdash; ${c.quoteSource}</p>
    </blockquote>
  </section>

  <footer class="sw-row sw-foot">
    <small>${c.footer[0]}</small>
    <small>${c.footer[1]}</small>
  </footer>
</div>

${fitScript}
`;
  },
};
