import { RectangleVertical } from "lucide-react";
import type { PreviewTemplate } from "./types";
import { fitScript } from "./fit-script";

// Three portrait posters made only of type, each composed differently: centred and classical,
// one word fitted across a flipped-colour sheet, and a huge numeral. Sizes are relative to the
// poster (cqi) so each sheet keeps its composition at any width; the classes keep the user's
// families, weights and spacing.
export const postersTemplate: PreviewTemplate = {
  id: "posters",
  name: "Posters",
  icon: RectangleVertical,
  render: (copy) => {
    const { a, b, c } = copy.posters;
    return `
<style>
  .ps { max-width: 1240px; margin: 0 auto; padding: 1rem 1rem 3rem; }
  .ps h1, .ps h2, .ps h3, .ps h4, .ps h5, .ps h6, .ps p { margin: 0; }
  .ps-wall { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 2rem; align-items: start; }
  .ps-sheet { position: relative; aspect-ratio: 3 / 4; overflow: hidden; container-type: inline-size; background: var(--bg-color); box-shadow: 0 1.25rem 2.5rem -1.5rem oklch(0 0 0 / 45%); }
  .ps .ps-caps { text-transform: uppercase; letter-spacing: 0.16em; }

  /* A: centred, classical, inside a hairline frame */
  /* A sheet's own padding is in %, not cqi: cqi on the container itself resolves against the page */
  .ps-a { display: flex; flex-direction: column; align-items: center; text-align: center; padding: 11% 9% 9%; border: 1px solid color-mix(in srgb, currentColor 18%, transparent); }
  .ps-a::before { content: ""; position: absolute; inset: 3.5cqi; border: 1px solid color-mix(in srgb, currentColor 35%, transparent); pointer-events: none; }
  .ps .ps-a-top { font-size: 3.3cqi; }
  .ps .ps-a-title { font-size: 13.5cqi; line-height: 0.98; margin: auto 0 5cqi; text-wrap: balance; max-height: 4lh; overflow-x: clip; clip-path: inset(-0.5em -0.5em -0.35em); }
  .ps .ps-a-sub { font-size: 4.2cqi; line-height: 1.35; max-width: 80%; text-wrap: balance; }
  .ps-a-orn { width: 12cqi; height: 1px; background: currentColor; margin: 7cqi 0 auto; opacity: 0.6; }
  .ps-a-details { display: flex; flex-direction: column; gap: 1.4cqi; }
  .ps .ps-a-details small { font-size: 3.1cqi; }

  /* B: flipped colours, one word across the foot, a line up the edge */
  .ps-b { display: flex; flex-direction: column; padding: 8% 6% 0; background: var(--tone-base); }
  .ps .ps-b h2, .ps .ps-b p, .ps .ps-b small { color: var(--bg-color); }
  .ps-b-foot { display: flex; justify-content: space-between; gap: 4cqi; padding-bottom: 4cqi; border-bottom: 1px solid color-mix(in srgb, var(--bg-color) 50%, transparent); }
  .ps .ps-b-foot small { font-size: 3.1cqi; line-height: 1.4; }
  .ps .ps-b-foot small:last-child { text-align: right; }
  /* The side line reads upwards from the word and is cut, not wrapped, if it runs out of sheet */
  .ps-b-mid { flex: 1; min-height: 0; display: flex; align-items: flex-end; overflow: hidden; padding: 4cqi 0 3cqi; }
  .ps .ps-b-side { writing-mode: vertical-rl; transform: rotate(180deg); font-size: 3.1cqi; white-space: nowrap; }
  /* Lifted by its descender so a g or y at the foot is not cut by the sheet */
  .ps .ps-b-word { margin: 0 0 0.24em; white-space: nowrap; line-height: 0.78; }
  .ps-b-word span { display: inline-block; }

  /* C: a numeral bigger than the sheet, text tucked into the corner it leaves */
  .ps-c { display: flex; flex-direction: column; justify-content: flex-end; gap: 5cqi; padding: 0 8% 6%; background: var(--ill-surface); }
  /* The numeral fills a fixed box whatever its digit count; the unit runs down the edge beside it */
  .ps-c-numbox { position: absolute; top: 4cqi; left: -2cqi; width: 94cqi; white-space: nowrap; line-height: 0.82; }
  .ps .ps-c-num { display: inline-block; line-height: 0.82; letter-spacing: -0.05em; }
  .ps .ps-c-unit { position: absolute; top: 8cqi; right: 7cqi; writing-mode: vertical-rl; font-size: 3.3cqi; white-space: nowrap; }
  .ps-c-text { position: relative; display: flex; flex-direction: column; gap: 3cqi; max-width: 80%; }
  .ps .ps-c-title { font-size: 7.5cqi; line-height: 1.02; text-wrap: balance; }
  .ps .ps-c-body { font-size: 3.5cqi; line-height: 1.45; max-height: 5lh; overflow: hidden; }
  .ps-c-corners { position: relative; display: flex; justify-content: space-between; gap: 4cqi; padding-top: 2.5cqi; border-top: 1px solid currentColor; }
  .ps .ps-c-corners small { font-size: 2.8cqi; }

  @media (max-width: 800px) {
    .ps { padding: 0.5rem 0.75rem 2rem; }
    .ps-wall { grid-template-columns: 1fr; gap: 1.5rem; max-width: 460px; margin: 0 auto; }
  }
</style>

<div class="ps" data-desk>
  <div class="ps-wall">
    <article class="ps-sheet ps-a">
      <small class="ps-a-top ps-caps">${a.top}</small>
      <h2 class="ps-a-title">${a.title}</h2>
      <p class="ps-a-sub">${a.subtitle}</p>
      <span class="ps-a-orn"></span>
      <div class="ps-a-details">
        ${a.details.map((d) => `<small class="ps-caps">${d}</small>`).join("\n        ")}
      </div>
    </article>

    <article class="ps-sheet ps-b">
      <div class="ps-b-foot"><small>${b.foot[0]}</small><small>${b.foot[1]}</small></div>
      <div class="ps-b-mid"><small class="ps-b-side ps-caps">${b.side}</small></div>
      <h2 class="display-1 ps-b-word" data-fit><span>${b.word}</span></h2>
    </article>

    <article class="ps-sheet ps-c">
      <p class="ps-c-numbox" data-fit data-fit-max="1w"><span class="display-1 ps-c-num">${c.numeral}</span></p>
      <small class="ps-c-unit ps-caps">${c.unit}</small>
      <div class="ps-c-text">
        <h3 class="ps-c-title">${c.title}</h3>
        <p class="ps-c-body">${c.body}</p>
      </div>
      <div class="ps-c-corners"><small class="ps-caps">${c.corners[0]}</small><small class="ps-caps">${c.corners[1]}</small></div>
    </article>
  </div>
</div>

${fitScript}
`;
  },
};
