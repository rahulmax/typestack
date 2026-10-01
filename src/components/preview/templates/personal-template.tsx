import { UserRound } from "lucide-react";
import type { PreviewTemplate } from "./types";

// A one-person site with almost nothing on it: a name, one large claim, three principles, a short
// list of writing and an address. No pictures and no cards; hairlines and empty space do the work.
// All spacing comes from one square module, a twelfth of the page wide, so the air between sections
// is measured in the same unit as the columns.
export const personalTemplate: PreviewTemplate = {
  id: "personal",
  name: "Personal",
  icon: UserRound,
  phoneRoom: 700,
  render: (copy) => {
    const c = copy.personal;
    // Set large, the address may only break after the @ or before a dot
    const email = c.contact.email.replace("@", "@<wbr>").replace(/\./g, "<wbr>.");
    const arrow = `<svg class="ps-arrow" viewBox="0 0 30 16" width="30" height="16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M0 8h28M21 1l7 7-7 7" /></svg>`;
    return `
<style>
  /* --ps-u is the module. It is only read by descendants: container units resolve against the nearest
     container above the element that uses them, so .ps itself could not measure its own width.
     --ps-two is the width of two of the three columns plus the gutter between them. */
  .ps { container-type: inline-size; max-width: 1400px; margin: 0 auto; --ps-u: clamp(5rem, 100cqi / 12, 7rem); --ps-two: calc((100% - var(--ps-u)) * 2 / 3 + var(--ps-u) / 2); --ps-rule: color-mix(in srgb, var(--fg-color) 50%, transparent); }
  .ps h1, .ps h2, .ps h3, .ps h4, .ps h5, .ps h6, .ps p { margin: 0; }
  .ps .eyebrow { display: block; opacity: 0.7; }
  .ps-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); column-gap: calc(var(--ps-u) / 2); }
  .ps-label { display: flex; align-items: center; height: var(--ps-u); }
  /* Statements keep to two columns, until the type is too big for that to hold a sentence */
  .ps .ps-say { max-width: max(var(--ps-two), min(18em, 100%)); text-wrap: pretty; }

  /* Header: stays put while the page moves under it */
  .ps-head { position: sticky; top: 0; z-index: 2; display: flex; justify-content: space-between; align-items: center; height: var(--ps-u); background: var(--bg-color); border-bottom: 1px solid var(--ps-rule); }
  .ps .ps-name { line-height: 1.05; }
  .ps-toggle { display: flex; flex-shrink: 0; width: calc(var(--ps-u) / 3); height: calc(var(--ps-u) / 3); border-radius: 50%; overflow: hidden; transform: rotate(180deg); transition: transform 0.3s cubic-bezier(0, 0, 0.2, 1); cursor: pointer; }
  .ps-toggle:hover { transform: rotate(0deg); }
  .ps-toggle i { width: 50%; height: 100%; }
  .ps-toggle i:first-child { background: var(--fg-color); }
  .ps-toggle i:last-child { margin-left: -1px; border: 1px solid var(--fg-color); border-radius: 0 999px 999px 0; }

  /* Hero */
  .ps-hero { display: flex; flex-direction: column; gap: calc(var(--ps-u) / 4); padding: calc(var(--ps-u) * 2.5) 0 calc(var(--ps-u) * 2); }
  /* The page can grow, so the claim has no line limit: at big scales it keeps whole words and runs as
     long as it needs. Only a word wider than the page is clipped, at the edge. */
  .ps .ps-hero h1 { max-width: max(var(--ps-two), min(9em, 100%)); overflow-wrap: normal; overflow-x: clip; text-wrap: balance; }
  .ps-hero p { max-width: var(--ps-two); }

  /* About, and the three principles under it */
  .ps-about { padding-top: var(--ps-u); }
  .ps-points { padding: var(--ps-u) 0; }
  /* Each principle borrows the section's two rows, so the three bodies start level even when one title wraps */
  .ps-point { display: grid; grid-row: span 2; grid-template-rows: subgrid; row-gap: var(--ps-u); }
  .ps-point-head { display: flex; flex-direction: column; gap: calc(var(--ps-u) / 8); padding-top: calc(var(--ps-u) / 8); border-top: 1px solid var(--ps-rule); }

  /* Writing: ruled rows, each one a link */
  .ps-writing { padding-top: calc(var(--ps-u) * 3); }
  .ps-list { padding-top: calc(var(--ps-u) * 0.75); margin-bottom: var(--ps-u); }
  .ps-row { display: flex; align-items: center; justify-content: space-between; gap: 1.5rem; padding: 0.5rem 0 calc(var(--ps-u) / 2 + 0.5rem); border-top: 1px solid var(--ps-rule); cursor: pointer; }
  .ps-row-main { display: flex; flex-direction: column; gap: 0.5rem; min-width: 0; }
  .ps-row h4 { margin-top: calc(var(--ps-u) / 2); }
  .ps-tags { display: flex; flex-wrap: wrap; gap: 0.25rem; }
  .ps-tag { display: inline-flex; padding: 0.4em 1.4em; border-radius: 999px; background: var(--fg-color); }
  .ps .ps-tag small { color: var(--bg-color); font-weight: 700; line-height: 1; letter-spacing: 0.1em; text-transform: uppercase; }
  .ps-row-end { display: flex; align-items: center; gap: var(--ps-u); flex-shrink: 0; }
  .ps-meta { font-variant-numeric: tabular-nums; white-space: nowrap; opacity: 0.6; }
  .ps-arrow { display: block; flex-shrink: 0; transition: opacity 0.15s ease; }
  .ps-row:hover .ps-arrow { opacity: 0.5; }

  /* Contact and footer */
  .ps-contact { display: flex; align-items: center; justify-content: space-between; gap: calc(var(--ps-u) / 2); margin-top: calc(var(--ps-u) * 2); padding: var(--ps-u) 0; border-top: 1px solid var(--ps-rule); }
  .ps-contact > div:first-child { min-width: 0; }
  .ps-contact p { margin-bottom: calc(var(--ps-u) / 4); opacity: 0.6; }
  .ps .ps-contact h2 { overflow-wrap: anywhere; }
  .ps-links { display: flex; flex-shrink: 0; gap: calc(var(--ps-u) / 2); opacity: 0.7; }
  .ps-links small { cursor: pointer; }
  .ps-foot { padding: calc(var(--ps-u) / 8) 0; border-top: 1px solid var(--ps-rule); }

  @media (max-width: 800px) {
    /* Four modules across instead of twelve, and one column */
    .ps { --ps-u: clamp(5rem, 100cqi / 4, 7rem); --ps-two: 100%; }
    .ps-grid { grid-template-columns: minmax(0, 1fr); row-gap: calc(var(--ps-u) / 4); }
    .ps-hero { padding: calc(var(--ps-u) * 1.25) 0 calc(var(--ps-u) * 1.5); }
    .ps-point { row-gap: calc(var(--ps-u) * 0.75); padding-bottom: calc(var(--ps-u) / 4); }
    .ps-writing { padding-top: var(--ps-u); }
    .ps-meta { display: none; }
    .ps-contact { flex-direction: column; align-items: flex-start; margin-top: var(--ps-u); }
  }
  @media (prefers-reduced-motion: reduce) {
    .ps-toggle, .ps-arrow { transition: none; }
  }
</style>

<div class="ps">
  <header class="ps-head">
    <h6 class="ps-name">${c.name[0]}<br />${c.name[1]}</h6>
    <span class="ps-toggle" role="img" aria-label="Theme switch"><i></i><i></i></span>
  </header>

  <section class="ps-hero">
    <span class="eyebrow">${c.kicker} /</span>
    <h1>${c.title}</h1>
    <p>${c.lead}</p>
  </section>

  <section class="ps-about">
    <div class="ps-label"><span class="eyebrow">${c.about.label}</span></div>
    <h3 class="ps-say">${c.about.statement}</h3>
  </section>

  <section class="ps-grid ps-points">
    ${c.principles
      .map(
        (p, i) => `<article class="ps-point">
      <div class="ps-point-head">
        <span class="eyebrow">${String(i + 1).padStart(2, "0")} /</span>
        <h5>${p.title}</h5>
      </div>
      <p>${p.body}</p>
    </article>`,
      )
      .join("\n    ")}
  </section>

  <section class="ps-writing">
    <div class="ps-label"><span class="eyebrow">${c.writing.label}</span></div>
    <h3 class="ps-say">${c.writing.statement}</h3>
    <div class="ps-list">
      ${c.writing.articles
        .map(
          (a) => `<div class="ps-row">
        <div class="ps-row-main">
          <span class="eyebrow">${a.kicker} /</span>
          <h4>${a.title}</h4>
          <div class="ps-tags">
            ${a.tags.map((t) => `<span class="ps-tag"><small>${t}</small></span>`).join("")}
          </div>
        </div>
        <div class="ps-row-end">
          <small class="ps-meta">${a.meta}</small>
          ${arrow}
        </div>
      </div>`,
        )
        .join("\n      ")}
    </div>
  </section>

  <section class="ps-contact">
    <div>
      <p>${c.contact.prompt}</p>
      <h2>${email}</h2>
    </div>
    <div class="ps-links">
      ${c.contact.links.map((l) => `<small>${l}</small>`).join("\n      ")}
    </div>
  </section>

  <footer class="ps-foot"><small>${c.footer}</small></footer>
</div>
`;
  },
};
