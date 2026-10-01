import { Feather } from "lucide-react";
import type { PreviewTemplate } from "./types";
import { photoScript } from "./photo-script";

export const magazineTemplate: PreviewTemplate = {
  id: "magazine",
  name: "Magazine",
  icon: Feather,
  render: (copy) => {
    const c = copy.magazine;
    return `
<style>
  .mg { --mg-line: color-mix(in srgb, currentColor 28%, transparent); max-width: 1080px; margin: 0 auto; padding: 0 1.75rem 4rem; }
  .mg hr { border: none; border-top: 1px solid var(--mg-line); margin: 0; }
  .mg-strap { display: flex; justify-content: space-between; gap: 1rem; padding: 1.25rem 0 0.9rem; }
  .mg-strap small { text-transform: uppercase; letter-spacing: 0.16em; }
  .mg-name { text-align: center; margin: 0; padding: 1.75rem 0 1.5rem; text-transform: uppercase; letter-spacing: 0.2em; overflow-wrap: normal; }
  .mg-nav { display: flex; justify-content: center; gap: 2.5rem; padding: 0.9rem 0; }
  .mg-nav small { text-transform: uppercase; letter-spacing: 0.16em; }

  .mg-cover { display: grid; grid-template-columns: 170px 1fr; column-gap: 3rem; padding: 4.5rem 0 3rem; }
  .mg-credits { padding-top: 0.75rem; }
  .mg-credits .eyebrow { display: block; margin-bottom: 0.4rem; }
  .mg-credits p { margin: 0 0 1.4rem; }
  .mg-cover h1 { margin: 0 0 1.75rem; max-width: 12em; }
  .mg-dek { max-width: 30em; margin: 0; }
  .mg-plate { padding: 0 0 0.5rem; }
  .mg .photo { position: relative; overflow: hidden; background: var(--ill-surface); }
  .mg .photo img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity 0.4s ease; }
  .mg-plate .photo { aspect-ratio: 16 / 9; }
  .mg-cap { display: flex; justify-content: space-between; gap: 1.5rem; padding-top: 0.7rem; opacity: 0.75; }
  .mg-orn { text-align: center; padding: 3.5rem 0; letter-spacing: 1em; opacity: 0.7; }
  .mg-orn p { margin: 0; }

  .mg-toc { display: grid; grid-template-columns: 170px 1fr; column-gap: 3rem; padding-bottom: 1rem; }
  .mg-toc-list { display: grid; grid-template-columns: 1fr 1fr; column-gap: 3rem; }
  .mg-toc-row { display: grid; grid-template-columns: 2.5rem 1fr; gap: 0.5rem; padding: 1.1rem 0; border-top: 1px solid var(--mg-line); }
  .mg-toc-row h5 { margin: 0 0 0.3rem; }
  .mg-toc-row p { margin: 0; }

  .mg-story { display: grid; grid-template-columns: 170px minmax(0, 36em); column-gap: 3rem; padding-bottom: 1rem; }
  .mg-story .eyebrow { padding-top: 0.5rem; }
  .mg-body h2 { margin: 0 0 1.5rem; }
  .mg-body p { margin: 0 0 1.15rem; }
  .mg-body > p:first-of-type::first-letter { float: left; font-size: 5em; line-height: 0.8; font-weight: 400; padding: 0.08em 0.1em 0 0; }

  .mg-quote { padding: 1rem 0 0.5rem; text-align: center; }
  .mg-quote blockquote { max-width: 46rem; margin: 0 auto; }
  .mg-quote blockquote p { text-wrap: balance; }
  .mg-quote blockquote p { margin: 0 0 1.25rem; }
  .mg-quote small { text-transform: uppercase; letter-spacing: 0.16em; }

  .mg-asym { display: grid; grid-template-columns: 5fr 6fr; column-gap: 4rem; align-items: center; padding-bottom: 1rem; }
  .mg-asym .photo { aspect-ratio: 4 / 5; }
  .mg-asym .mg-cap { flex-direction: column; gap: 0.15rem; }
  .mg-asym h3 { margin: 0 0 1rem; }
  .mg-asym p { margin: 0 0 1.1rem; max-width: 26em; }

  .mg-spread { column-count: 2; column-gap: 3.5rem; column-rule: 1px solid var(--mg-line); padding: 0 0 1rem; }
  .mg-spread h3 { margin: 0 0 1rem; break-after: avoid; }
  .mg-spread h4 { margin: 1.75rem 0 0.75rem; break-after: avoid; }
  .mg-spread p { margin: 0 0 1.1rem; }

  .mg-end { display: grid; grid-template-columns: 170px 1fr; column-gap: 3rem; padding-top: 2rem; border-top: 1px solid var(--mg-line); }
  .mg-end-list { display: grid; grid-template-columns: repeat(3, 1fr); column-gap: 2rem; }
  .mg-end .eyebrow { display: block; margin-bottom: 0.4rem; }
  .mg-end h6 { margin: 0 0 0.3rem; }
  .mg-foot { display: flex; justify-content: space-between; gap: 1rem; flex-wrap: wrap; margin-top: 3.5rem; padding-top: 1rem; border-top: 1px solid var(--mg-line); opacity: 0.75; }
  .mg-foot small { text-transform: uppercase; letter-spacing: 0.16em; }

  /* Big type never breaks the grid: one-line labels and headlines past their line budget are clipped
     at the edge, poster style, with no ellipsis. */
  .mg .mg-name, .mg-strap small, .mg-nav small, .mg-toc-row h5, .mg-end h6 { white-space: nowrap; overflow-x: clip; text-overflow: clip; }
  .mg .mg-name { overflow-wrap: normal; }
  .mg-cover h1 { overflow-x: clip; clip-path: inset(-0.5em -0.5em -0.35em); max-height: 4lh; }
  .mg .mg-quote .display-3 { overflow-x: clip; clip-path: inset(-0.5em -0.5em -0.35em); max-height: 4lh; }
  .mg-body h2, .mg-asym h3, .mg-spread h3 { overflow-x: clip; clip-path: inset(-0.5em -0.5em -0.35em); max-height: 3lh; }
  .mg-strap small, .mg-nav small { min-width: 0; }

  @media (max-width: 800px) {
    .mg { padding: 0 1.25rem 3rem; }
    .mg-cover, .mg-toc, .mg-end { grid-template-columns: 1fr; padding-top: 3rem; }
    .mg-cover { padding-bottom: 2rem; }
    .mg-credits { display: flex; gap: 2rem; margin-bottom: 1.75rem; padding-top: 0; }
    .mg-credits p { margin-bottom: 0; }
    .mg-story { grid-template-columns: 1fr; }
    .mg-story .eyebrow { margin-bottom: 1rem; }
    .mg-asym { column-gap: 2rem; }
    .mg-spread { column-gap: 2rem; }
    .mg-toc-list { column-gap: 2rem; }
    .mg-toc > .eyebrow, .mg-end > .eyebrow { margin-bottom: 1rem; display: block; }
    .mg-nav { gap: 1.5rem; }
  }
  @media (max-width: 600px) {
    .mg-nav { gap: 1rem; flex-wrap: wrap; }
    .mg-name { letter-spacing: 0; padding: 1.25rem 0 1rem; }
    .mg-strap small:nth-child(2) { display: none; }
    .mg-toc-list, .mg-end-list { grid-template-columns: 1fr; }
    .mg-end-list > div { margin-bottom: 1.25rem; }
    .mg-asym { grid-template-columns: 1fr; row-gap: 1.75rem; }
    .mg-spread { column-count: 1; column-rule: none; }
    .mg-plate .photo { aspect-ratio: 4 / 3; }
    .mg-asym .photo { aspect-ratio: 4 / 3; }
    .mg-orn { padding: 2.25rem 0; }
    .mg-cap { flex-direction: column; gap: 0.15rem; }
  }
  @media (max-width: 480px) {
    .mg { padding: 0 0.75rem 2.5rem; }
    .mg-credits { flex-direction: column; gap: 0; }
    .mg-credits p { margin-bottom: 1rem; }
    .mg-foot { flex-direction: column; }
  }
</style>

<div class="mg" data-seed="${copy.id}">
  <div class="mg-strap"><small>${c.strap[0]}</small><small>${c.strap[1]}</small><small>${c.strap[2]}</small></div>
  <hr />
  <p class="display-3 mg-name">${c.masthead}</p>
  <hr />
  <div class="mg-nav">${c.nav.map((n) => `<small>${n}</small>`).join("")}</div>
  <hr />

  <header class="mg-cover">
    <div class="mg-credits">
      ${c.credits.map((cr) => `<div><span class="eyebrow">${cr.label}</span><p><small>${cr.value}</small></p></div>`).join("\n      ")}
    </div>
    <div>
      <h1 class="display-1">${c.title}</h1>
      <p class="mg-dek"><em>${c.dek}</em></p>
    </div>
  </header>

  <div class="mg-plate">
    <div class="photo" data-kind="scene"></div>
    <div class="mg-cap"><small>${c.plateCaption[0]}</small><small>${c.plateCaption[1]}</small></div>
  </div>

  <div class="mg-orn"><p>&#10086;</p></div>

  <section class="mg-toc">
    <span class="eyebrow">In this issue</span>
    <div class="mg-toc-list">
      ${c.toc.map((t) => `<div class="mg-toc-row"><small>${t.page}</small><div><h5>${t.title}</h5><p><small>${t.note}</small></p></div></div>`).join("\n      ")}
    </div>
  </section>

  <div class="mg-orn"><p>&#10022;</p></div>

  <section class="mg-story">
    <span class="eyebrow">${c.story.eyebrow}</span>
    <div class="mg-body">
      <h2>${c.story.title}</h2>
      ${c.story.paragraphs.map((p) => `<p>${p}</p>`).join("\n      ")}
    </div>
  </section>

  <div class="mg-orn"><p>&#10086;</p></div>

  <div class="mg-quote">
    <blockquote>
      <p class="display-3"><em>${c.quote}</em></p>
      <small>${c.quoteSource}</small>
    </blockquote>
  </div>

  <div class="mg-orn"><p>&#10022;</p></div>

  <section class="mg-asym">
    <figure>
      <div class="photo" data-kind="people"></div>
      <div class="mg-cap"><small>${c.portrait.caption[0]}</small><small>${c.portrait.caption[1]}</small></div>
    </figure>
    <div>
      <span class="eyebrow">${c.portrait.eyebrow}</span>
      <h3>${c.portrait.title}</h3>
      ${c.portrait.paragraphs.map((p) => `<p>${p}</p>`).join("\n      ")}
    </div>
  </section>

  <div class="mg-orn"><p>&#10086;</p></div>

  <section class="mg-spread">
    <h3>${c.spread.title}</h3>
    ${c.spread.paragraphs.map((p) => `<p>${p}</p>`).join("\n    ")}
    <h4>${c.spread.subhead}</h4>
    ${c.spread.after.map((p) => `<p>${p}</p>`).join("\n    ")}
  </section>

  <section class="mg-end">
    <span class="eyebrow">Contributors</span>
    <div class="mg-end-list">
      ${c.contributors.map((p) => `<div><h6>${p.name}</h6><p><small>${p.note}</small></p></div>`).join("\n      ")}
    </div>
  </section>

  <div class="mg-foot"><small>${c.footer[0]}</small><small>${c.footer[1]}</small></div>
</div>

${photoScript}
`;
  },
};
