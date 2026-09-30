import { Clapperboard } from "lucide-react";
import type { PreviewTemplate } from "./types";

// End credits on a centre gutter: roles set small to the left, names to the right.
export const creditsTemplate: PreviewTemplate = {
  id: "credits",
  name: "Credits",
  icon: Clapperboard,
  render: (copy) => {
    const c = copy.credits;
    const block = (label: string, rows: typeof c.cast) => `<section class="cr-block">
    <span class="eyebrow cr-label">${label}</span>
    ${rows.map((r) => `<div class="cr-row"><small class="cr-role">${r.role}</small><h5 class="cr-name">${r.name}</h5></div>`).join("\n    ")}
  </section>`;
    return `
<style>
  .cr { max-width: 900px; margin: 0 auto; padding: 5rem 1.5rem 6rem; text-align: center; }
  .cr h1, .cr h2, .cr h3, .cr h4, .cr h5, .cr h6, .cr p { margin: 0; }
  .cr-caps { text-transform: uppercase; letter-spacing: 0.2em; }

  .cr-title { display: flex; flex-direction: column; align-items: center; gap: 1.4rem; min-height: 26rem; justify-content: center; }
  /* At big scales titles keep whole words and clip at a line limit */
  .cr .cr-title h1 { text-wrap: balance; max-height: 3lh; overflow: hidden; overflow-wrap: normal; max-width: 100%; }
  .cr .cr-end h2 { max-height: 3lh; overflow: hidden; overflow-wrap: normal; max-width: 100%; }

  .cr-block { display: flex; flex-direction: column; gap: 0.7rem; padding-top: 7rem; }
  .cr-label { display: block; margin-bottom: 1.25rem; }
  .cr-row { display: grid; grid-template-columns: 1fr 1fr; column-gap: 2.5rem; align-items: baseline; }
  .cr-role { text-align: right; text-transform: uppercase; letter-spacing: 0.14em; opacity: 0.75; }
  .cr-name { text-align: left; }

  .cr-music { display: flex; flex-direction: column; gap: 1.75rem; padding-top: 7rem; }
  .cr-song { display: flex; flex-direction: column; gap: 0.3rem; }
  .cr-thanks { display: flex; flex-direction: column; gap: 0.45rem; padding-top: 7rem; }
  .cr-end { display: flex; flex-direction: column; align-items: center; gap: 2rem; padding-top: 12rem; }
  .cr-end h2 { text-wrap: balance; }
  .cr-end small { max-width: 30em; opacity: 0.7; }

  @media (max-width: 800px) {
    .cr { padding: 2.5rem 1rem 3rem; }
    .cr-title { min-height: 16rem; }
    .cr-block, .cr-music, .cr-thanks { padding-top: 4rem; }
    .cr-row { column-gap: 1rem; }
    .cr-end { padding-top: 6rem; }
  }
</style>

<div class="cr">
  <header class="cr-title">
    <small class="cr-caps">${c.presenter}</small>
    <h1 class="display-2">${c.title}</h1>
    <h6>${c.byline}</h6>
  </header>

  ${block("Cast", c.cast)}
  ${block("Crew", c.crew)}

  <section class="cr-music">
    <span class="eyebrow">Music</span>
    ${c.music.map((m) => `<div class="cr-song"><h5>${m.title}</h5><small>${m.credit}</small></div>`).join("\n    ")}
  </section>

  <section class="cr-thanks">
    <span class="eyebrow cr-label">With thanks to</span>
    ${c.thanks.map((t) => `<p>${t}</p>`).join("\n    ")}
  </section>

  <footer class="cr-end">
    <h2>${c.closing}</h2>
    <small>${c.legal}</small>
  </footer>
</div>
`;
  },
};
