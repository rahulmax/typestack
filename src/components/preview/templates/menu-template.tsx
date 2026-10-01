import { UtensilsCrossed } from "lucide-react";
import type { PreviewTemplate } from "./types";

// A printed menu card inside a single frame: dishes with dot leaders to aligned prices.
export const menuTemplate: PreviewTemplate = {
  id: "menu",
  name: "Menu",
  icon: UtensilsCrossed,
  render: (copy) => {
    const c = copy.menu;
    const section = (s: (typeof c.sections)[number], cls: string) => `<section class="mn-sec ${cls}">
      <header class="mn-sec-head">
        <h3>${s.title}</h3>
        <small>${s.note}</small>
      </header>
      <div class="mn-items">
        ${s.items
          .map(
            (it) => `<div class="mn-item">
          <div class="mn-line"><h6>${it.name}</h6><span class="mn-leader"></span><h6 class="mn-price">${it.price}</h6></div>
          <p><small>${it.desc}</small></p>
        </div>`,
          )
          .join("\n        ")}
      </div>
    </section>`;
    return `
<style>
  .mn { max-width: 980px; margin: 0 auto; padding: 1.5rem 1rem 3rem; }
  .mn h1, .mn h2, .mn h3, .mn h4, .mn h5, .mn h6, .mn p { margin: 0; }
  .mn-card { position: relative; padding: 3.5rem 3.5rem 2.5rem; border: 1px solid currentColor; background: var(--bg-color); box-shadow: 0 1.5rem 3rem -2rem oklch(0 0 0 / 45%); }
  .mn-caps { text-transform: uppercase; letter-spacing: 0.16em; }

  .mn-head { display: flex; flex-direction: column; align-items: center; gap: 0.7rem; text-align: center; padding-bottom: 2.25rem; }
  .mn-head h1 { text-wrap: balance; }
  /* At big scales titles keep whole words and clip at a line limit */
  .mn .mn-head h1, .mn .mn-sec-head h3 { overflow-wrap: normal; overflow-x: clip; clip-path: inset(-0.5em -0.5em -0.35em); max-width: 100%; }
  .mn .mn-head h1 { max-height: 3lh; }
  .mn .mn-sec-head h3 { max-height: 2lh; }
  .mn-orn { display: flex; align-items: center; gap: 0.75rem; width: 11rem; opacity: 0.7; }
  .mn-orn::before, .mn-orn::after { content: ""; flex: 1; height: 1px; background: currentColor; }

  .mn-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2.5rem 3.5rem; }
  .mn-wide { grid-column: 1 / 3; }
  .mn-wide .mn-items { display: grid; grid-template-columns: 1fr 1fr; column-gap: 3.5rem; }
  .mn-sec-head { display: flex; flex-direction: column; gap: 0.2rem; padding-bottom: 0.9rem; margin-bottom: 0.4rem; border-bottom: 1px solid currentColor; }
  .mn-item { padding: 0.75rem 0; }
  .mn-line { display: flex; align-items: baseline; gap: 0.5rem; }
  .mn-line h6:first-child { min-width: 0; }
  .mn-leader { flex: 1; min-width: 1rem; border-bottom: 1px dotted currentColor; opacity: 0.45; transform: translateY(-0.25em); }
  .mn .mn-price { font-variant-numeric: tabular-nums lining-nums; white-space: nowrap; }
  .mn-item p { max-width: 88%; margin-top: 0.2rem; }

  .mn-foot { display: flex; flex-direction: column; align-items: center; gap: 0.3rem; text-align: center; margin-top: 2.5rem; padding-top: 1.25rem; border-top: 1px solid color-mix(in srgb, currentColor 25%, transparent); }

  @media (max-width: 800px) {
    .mn { padding: 0.75rem 0.5rem 2rem; }
    .mn-card { padding: 2.25rem 1.25rem 1.75rem; }
    .mn-grid { grid-template-columns: 1fr; }
    .mn-wide { grid-column: auto; }
    .mn-wide .mn-items { grid-template-columns: 1fr; }
  }
</style>

<div class="mn" data-desk>
  <div class="mn-card">
    <header class="mn-head">
      <span class="eyebrow">${c.hours}</span>
      <h1>${c.name}</h1>
      <span class="mn-orn"><small>&#10022;</small></span>
      <p>${c.tagline}</p>
    </header>
    <div class="mn-grid">
      ${section(c.sections[0], "")}
      ${section(c.sections[1], "")}
      ${section(c.sections[2], "mn-wide")}
    </div>
    <footer class="mn-foot">
      <small>${c.footer[0]}</small>
      <small class="mn-caps">${c.footer[1]}</small>
    </footer>
  </div>
</div>
`;
  },
};
