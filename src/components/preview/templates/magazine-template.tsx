import { Feather } from "lucide-react";
import type { PreviewTemplate } from "./types";
import { photoScript } from "./photo-script";

// An open magazine: the contents page on the left, the feature on the right, lying on the desk.
// The spread keeps a real page width instead of squeezing to the frame, so its tab opens zoomed
// out (TAB_ZOOM in the UI store) to show both pages; at full size it scrolls sideways. There is no
// gutter: the pages share one sheet and a hairline marks where one ends and the next begins.
export const magazineTemplate: PreviewTemplate = {
  id: "magazine",
  name: "Magazine",
  icon: Feather,
  render: (copy) => {
    const c = copy.magazine;
    return `
<style>
  .mg {
    --mg-line: color-mix(in srgb, currentColor 28%, transparent);
    /* Two pages wide at the least. The 16px keeps clear of a scrollbar. */
    --mg-w: clamp(1640px, 100vw - 4rem - 16px, 2400px);
    /* Margins are a share of the spread, within limits, and the same on all four sides of a page */
    --mg-pad: clamp(2.75rem, 3.6cqi, 4.75rem);
    container: mg / inline-size;
    width: var(--mg-w); margin: 0 auto; padding: 0.5rem 0 3rem;
  }
  .mg hr { border: none; border-top: 1px solid var(--mg-line); margin: 0; }
  .mg-sheet { display: grid; grid-template-columns: 1fr 1fr; background: var(--bg-color); box-shadow: 0 0 0 1px color-mix(in srgb, currentColor 14%, transparent), 0 1.75rem 3.5rem -2rem color-mix(in srgb, black 50%, transparent); }
  .mg-page { display: flex; flex-direction: column; justify-content: space-between; row-gap: 3.25rem; min-width: 0; padding: 2.25rem var(--mg-pad) 2rem; }
  .mg-recto { box-shadow: inset 1px 0 0 var(--mg-line); }

  .mg-strap { display: flex; justify-content: space-between; gap: 1rem; padding-bottom: 0.9rem; }
  .mg-strap small, .mg-nav small, .mg-run small, .mg-folio small { text-transform: uppercase; letter-spacing: 0.16em; }
  .mg-name { text-align: center; margin: 1.5rem 0 1.25rem; text-transform: uppercase; letter-spacing: 0.06em; overflow-wrap: normal; text-wrap: balance; }
  .mg-nav { display: flex; justify-content: center; gap: 2.25rem; padding: 0.9rem 0; }

  .mg-cover h1 { margin: 0 0 1.5rem; }
  .mg-dek { max-width: 32em; margin: 0; }
  .mg-credits { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); column-gap: 2rem; margin-top: 2.25rem; }
  .mg-credits .eyebrow { display: block; margin-bottom: 0.4rem; }
  .mg-credits p { margin: 0; }
  .mg .photo { position: relative; overflow: hidden; background: var(--ill-surface); }
  .mg .photo img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity 0.4s ease; }
  .mg-plate .photo { aspect-ratio: 16 / 9; }
  .mg-cap { display: flex; justify-content: space-between; gap: 1.5rem; padding-top: 0.7rem; opacity: 0.75; }

  .mg-toc > .eyebrow, .mg-end > .eyebrow { display: block; margin-bottom: 1rem; }
  .mg-toc-list { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); column-gap: 2.5rem; }
  .mg-toc-row { display: grid; grid-template-columns: 2.5rem minmax(0, 1fr); gap: 0.5rem; padding: 1rem 0; border-top: 1px solid var(--mg-line); }
  .mg-toc-row h5 { margin: 0 0 0.3rem; }
  .mg-toc-row p { margin: 0; }
  .mg-end-list { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); column-gap: 2rem; }
  .mg-end h6 { margin: 0 0 0.3rem; }

  .mg-run { display: flex; justify-content: space-between; gap: 1rem; padding-bottom: 0.9rem; border-bottom: 1px solid var(--mg-line); }
  .mg-story .eyebrow { display: block; margin-bottom: 1rem; }
  .mg-story h2 { margin: 0 0 1.5rem; }
  .mg-cols { column-count: 2; column-gap: 2.5rem; }
  .mg-cols p { margin: 0 0 1.1rem; hyphens: auto; hyphenate-limit-chars: 8 3 4; }
  .mg-cols h4 { margin: 1.5rem 0 0.75rem; break-after: avoid; }
  .mg-story .mg-cols > p:first-of-type::first-letter { float: left; font-size: 5em; line-height: 0.8; font-weight: 400; padding: 0.08em 0.1em 0 0; }

  .mg-asym { display: grid; grid-template-columns: 4fr 5fr; column-gap: 3rem; align-items: center; }
  .mg-asym .photo { aspect-ratio: 4 / 5; }
  .mg-asym .mg-cap { flex-direction: column; gap: 0.15rem; }
  .mg-asym .eyebrow { display: block; margin-bottom: 0.75rem; }
  .mg-asym h3 { margin: 0 0 1rem; }
  .mg-asym p { margin: 0 0 1.1rem; }
  .mg-piece h3 { margin: 0 0 1.25rem; }

  .mg-folio { display: flex; justify-content: space-between; gap: 1rem; padding-top: 1rem; border-top: 1px solid var(--mg-line); opacity: 0.75; }

  /* Big type never breaks the grid: one-line labels and headlines past their line budget are clipped
     at the edge, poster style, with no ellipsis. */
  .mg-strap small, .mg-nav small, .mg-run small, .mg-folio small, .mg-end h6 { white-space: nowrap; overflow-x: clip; text-overflow: clip; }
  .mg-cover h1 { overflow-x: clip; clip-path: inset(-0.5em -0.5em -0.35em); max-height: 4lh; }
  .mg-story h2, .mg-asym h3, .mg-piece h3 { overflow-x: clip; clip-path: inset(-0.5em -0.5em -0.35em); max-height: 3lh; }
  .mg .mg-name, .mg-toc-row h5 { overflow-x: clip; clip-path: inset(-0.5em -0.5em -0.35em); max-height: 2lh; }
  .mg-strap small, .mg-nav small, .mg-run small, .mg-folio small { min-width: 0; }

  /* The page grows to hold the spread, so the desk shows on both sides of it when it scrolls */
  @media (min-width: 801px) {
    html:has(.mg) { width: max-content; min-width: 100%; }
  }
  /* No room for a spread: one page after the other, as a single sheet */
  @media (max-width: 800px) {
    .mg { width: auto; padding: 0 0 2rem; }
    .mg-sheet { grid-template-columns: minmax(0, 1fr); box-shadow: none; }
    .mg-page, .mg-recto { row-gap: 2.5rem; padding: 1.5rem 1.25rem; box-shadow: none; }
    .mg-recto { border-top: 1px solid var(--mg-line); }
    .mg-nav { gap: 1.5rem; }
    .mg-asym { column-gap: 2rem; }
    .mg-toc-list, .mg-cols { column-gap: 2rem; }
  }
  @media (max-width: 600px) {
    .mg-nav { gap: 1rem; flex-wrap: wrap; }
    .mg-name { letter-spacing: 0; margin: 1.25rem 0 1rem; }
    .mg-strap small:nth-child(2) { display: none; }
    .mg-credits { grid-template-columns: minmax(0, 1fr); row-gap: 1rem; margin-top: 1.75rem; }
    .mg-toc-list, .mg-end-list { grid-template-columns: minmax(0, 1fr); }
    .mg-end-list > div { margin-bottom: 1.25rem; }
    .mg-cols { column-count: 1; }
    .mg-asym { grid-template-columns: 1fr; row-gap: 1.75rem; }
    .mg-plate .photo, .mg-asym .photo { aspect-ratio: 4 / 3; }
    .mg-cap { flex-direction: column; gap: 0.15rem; }
  }
  @media (max-width: 480px) {
    .mg-page { padding: 1.25rem 0.75rem; }
  }
</style>

<div class="mg" lang="en" data-desk data-seed="${copy.id}">
  <div class="mg-sheet">
    <article class="mg-page mg-verso">
      <div>
        <div class="mg-strap"><small>${c.strap[0]}</small><small>${c.strap[1]}</small><small>${c.strap[2]}</small></div>
        <hr />
        <p class="display-3 mg-name">${c.masthead}</p>
        <hr />
        <div class="mg-nav">${c.nav.map((n) => `<small>${n}</small>`).join("")}</div>
        <hr />
      </div>

      <header class="mg-cover">
        <h1 class="display-1">${c.title}</h1>
        <p class="mg-dek"><em>${c.dek}</em></p>
        <div class="mg-credits">
          ${c.credits.map((cr) => `<div><span class="eyebrow">${cr.label}</span><p><small>${cr.value}</small></p></div>`).join("\n          ")}
        </div>
      </header>

      <div class="mg-plate">
        <div class="photo" data-kind="scene"></div>
        <div class="mg-cap"><small>${c.plateCaption[0]}</small><small>${c.plateCaption[1]}</small></div>
      </div>

      <section class="mg-toc">
        <span class="eyebrow">In this issue</span>
        <div class="mg-toc-list">
          ${c.toc.map((t) => `<div class="mg-toc-row"><small>${t.page}</small><div><h5>${t.title}</h5><p><small>${t.note}</small></p></div></div>`).join("\n          ")}
        </div>
      </section>

      <div class="mg-folio"><small>2</small><small>${c.footer[0]}</small></div>
    </article>

    <article class="mg-page mg-recto">
      <div class="mg-run"><small>${c.masthead}</small><small>${c.strap[1]}</small></div>

      <section class="mg-story">
        <span class="eyebrow">${c.story.eyebrow}</span>
        <h2>${c.story.title}</h2>
        <div class="mg-cols">
          ${c.story.paragraphs.map((p) => `<p>${p}</p>`).join("\n          ")}
        </div>
      </section>

      <section class="mg-asym">
        <figure>
          <div class="photo" data-kind="people"></div>
          <div class="mg-cap"><small>${c.portrait.caption[0]}</small><small>${c.portrait.caption[1]}</small></div>
        </figure>
        <div>
          <span class="eyebrow">${c.portrait.eyebrow}</span>
          <h3>${c.portrait.title}</h3>
          ${c.portrait.paragraphs.map((p) => `<p>${p}</p>`).join("\n          ")}
        </div>
      </section>

      <section class="mg-piece">
        <h3>${c.spread.title}</h3>
        <div class="mg-cols">
          ${c.spread.paragraphs.map((p) => `<p>${p}</p>`).join("\n          ")}
          <h4>${c.spread.subhead}</h4>
          ${c.spread.after.map((p) => `<p>${p}</p>`).join("\n          ")}
        </div>
      </section>

      <section class="mg-end">
        <span class="eyebrow">Contributors</span>
        <div class="mg-end-list">
          ${c.contributors.map((p) => `<div><h6>${p.name}</h6><p><small>${p.note}</small></p></div>`).join("\n          ")}
        </div>
      </section>

      <div class="mg-folio"><small>${c.footer[1]}</small><small>3</small></div>
    </article>
  </div>
</div>

${photoScript}
`;
  },
};
