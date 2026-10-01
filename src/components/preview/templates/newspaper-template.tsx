import { Newspaper } from "lucide-react";
import type { PreviewTemplate } from "./types";
import { fitScript } from "./fit-script";

// A broadsheet front page, all type: the masthead fitted to the full width, a lead story in
// three ragged columns set tight, a rail with a second story and the index, and briefs across the foot.
export const newspaperTemplate: PreviewTemplate = {
  id: "newspaper",
  name: "Newspaper",
  icon: Newspaper,
  render: (copy) => {
    const c = copy.newspaper;
    return `
<style>
  .np { --np-rule: color-mix(in srgb, currentColor 22%, transparent); max-width: 1240px; margin: 0 auto; padding: 0.5rem 1.5rem 3rem; }
  .np h1, .np h2, .np h3, .np h4, .np h5, .np h6, .np p { margin: 0; }
  .np-caps { text-transform: uppercase; letter-spacing: 0.12em; }

  .np-top { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 1.5rem; padding-bottom: 0.5rem; }
  .np-ear { padding: 0.45rem 0.7rem; border: 1px solid var(--np-rule); max-width: 15rem; line-height: 1.3; }
  .np-ear:last-child { justify-self: end; text-align: right; }
  .np-motto { text-align: center; }
  .np .np-mast { white-space: nowrap; text-align: center; line-height: 1; padding: 0.25rem 0 0.6rem; overflow-x: clip; }
  /* Room under the line for descenders, so a "y" doesn't cut the rule */
  .np-mast span { display: inline-block; line-height: 1.12; }
  .np-date { display: flex; justify-content: space-between; gap: 1rem; padding: 0.45rem 0; border-top: 1px solid currentColor; border-bottom: 1px solid currentColor; }

  .np-front { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); column-gap: 1.5rem; padding-top: 1.5rem; }
  .np-lead { grid-column: 1 / 10; }
  .np-lead h1 { margin: 0.4rem 0 0.9rem; text-wrap: balance; }
  .np-lead h4 { font-weight: 400; margin-bottom: 0.9rem; max-width: 40em; }
  .np-by { display: block; padding-bottom: 0.9rem; margin-bottom: 1.1rem; border-bottom: 1px solid var(--np-rule); }
  .np-cols { column-count: 3; column-gap: 1.5rem; column-rule: 1px solid var(--np-rule); }
  /* News columns are set tighter than the page: closer lines and closer words, both still led by
     the body dials. Ragged, so no line is stretched to fill the measure; only long words break. */
  .np .np-cols p { line-height: calc(var(--leading-p, 1.5) * 0.86); word-spacing: calc(var(--word-space-p, 0em) - 0.04em); hyphens: auto; hyphenate-limit-chars: 8 3 4; text-wrap: pretty; }
  .np-cols p + p { text-indent: 1.2em; }
  .np-place { font-weight: 700; letter-spacing: 0.06em; }
  .np-quote { break-inside: avoid; margin: 0.9rem 0; padding: 0.8rem 0; border-top: 2px solid currentColor; border-bottom: 1px solid currentColor; }
  .np-quote h4 { margin-bottom: 0.5rem; }

  .np-rail { grid-column: 10 / 13; padding-left: 1.5rem; border-left: 1px solid var(--np-rule); display: flex; flex-direction: column; gap: 2rem; }
  .np-rail h3 { margin: 0.4rem 0 0.6rem; text-wrap: balance; }
  .np-rail .np-by { padding-bottom: 0.6rem; margin-bottom: 0.8rem; }
  .np-rail p { hyphens: auto; }
  .np-rail p + p { margin-top: 0.6rem; }
  .np-index { padding: 0.9rem 1rem 0.5rem; border: 1px solid currentColor; }
  .np-index .eyebrow { display: block; padding-bottom: 0.5rem; border-bottom: 1px solid currentColor; }
  .np-row { display: flex; align-items: baseline; gap: 0.4rem; padding: 0.45rem 0; border-bottom: 1px solid var(--np-rule); }
  .np-row:last-child { border-bottom: none; }
  .np-row small:first-child { white-space: nowrap; overflow-x: clip; }
  .np-leader { flex: 1; min-width: 1rem; border-bottom: 1px dotted currentColor; opacity: 0.5; }
  .np-row small:last-child { font-variant-numeric: tabular-nums; font-weight: 700; }

  .np-briefs { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); margin-top: 2rem; border-top: 1px solid currentColor; }
  .np-brief { padding: 1rem 1.25rem 0; }
  .np-brief:first-child { padding-left: 0; }
  .np-brief:last-child { padding-right: 0; }
  .np-brief + .np-brief { border-left: 1px solid var(--np-rule); }
  .np-brief h5 { margin-bottom: 0.4rem; text-wrap: balance; }
  /* At big scales headlines keep whole words and clip at a line limit, as print would cut to fit */
  .np .np-lead h1, .np .np-rail h3, .np .np-quote h4, .np .np-brief h5 { overflow-wrap: normal; overflow-x: clip; clip-path: inset(-0.5em -0.5em -0.35em); }
  .np .np-lead h1 { max-height: 4lh; }
  .np .np-rail h3 { max-height: 5lh; }
  .np .np-quote h4 { max-height: 6lh; }
  .np .np-brief h5 { max-height: 3lh; }
  .np-brief p { hyphens: auto; }

  @media (max-width: 800px) {
    .np { padding: 0.25rem 1rem 2rem; }
    .np-top { grid-template-columns: 1fr 1fr; }
    .np-motto { display: none; }
    .np-date { flex-wrap: wrap; }
    .np-date small:nth-child(3) { display: none; }
    .np-lead, .np-rail { grid-column: 1 / 13; }
    .np-cols { column-count: 1; }
    .np-rail { padding: 1.5rem 0 0; margin-top: 1.5rem; border-left: none; border-top: 1px solid var(--np-rule); }
    .np-briefs { grid-template-columns: 1fr; }
    .np-brief, .np-brief:first-child, .np-brief:last-child { padding: 1rem 0; }
    .np-brief + .np-brief { border-left: none; border-top: 1px solid var(--np-rule); }
  }
</style>

<div class="np" lang="en">
  <div class="np-top">
    <small class="np-ear">${c.ears[0]}</small>
    <small class="np-motto np-caps">${c.motto}</small>
    <small class="np-ear">${c.ears[1]}</small>
  </div>
  <p class="display-1 np-mast" data-fit data-fit-max="220"><span>${c.name}</span></p>
  <div class="np-date">${c.dateline.map((d) => `<small class="np-caps">${d}</small>`).join("")}</div>

  <div class="np-front">
    <article class="np-lead">
      <span class="eyebrow">${c.lead.kicker}</span>
      <h1>${c.lead.headline}</h1>
      <h4>${c.lead.deck}</h4>
      <small class="np-by np-caps">${c.lead.byline}</small>
      <div class="np-cols">
        <p><span class="np-place">${c.lead.place} &mdash;</span> ${c.lead.body[0]}</p>
        <p>${c.lead.body[1]}</p>
        <div class="np-quote">
          <h4>&ldquo;${c.quote}&rdquo;</h4>
          <small class="np-caps">${c.quoteSource}</small>
        </div>
        <p>${c.lead.body[2]}</p>
        <p>${c.lead.body[3]}</p>
      </div>
    </article>

    <aside class="np-rail">
      <article>
        <span class="eyebrow">${c.second.kicker}</span>
        <h3>${c.second.headline}</h3>
        <small class="np-by np-caps">${c.second.byline}</small>
        ${c.second.body.map((p) => `<p>${p}</p>`).join("\n        ")}
      </article>
      <div class="np-index">
        <span class="eyebrow">Inside</span>
        ${c.index.map((i) => `<div class="np-row"><small>${i.title}</small><span class="np-leader"></span><small>${i.page}</small></div>`).join("\n        ")}
      </div>
    </aside>
  </div>

  <div class="np-briefs">
    ${c.briefs
      .map(
        (b) => `<article class="np-brief">
      <h5>${b.headline}</h5>
      <p><small>${b.body}</small></p>
    </article>`,
      )
      .join("\n    ")}
  </div>
</div>

${fitScript}
`;
  },
};
