import { Disc3 } from "lucide-react";
import type { PreviewTemplate } from "./types";

// A 12-inch record: a flipped-colour front cover with the record sliding out of it, and the
// back cover with both sides' track lists, liner notes and credits.
export const sleeveTemplate: PreviewTemplate = {
  id: "sleeve",
  name: "Sleeve",
  icon: Disc3,
  render: (copy) => {
    const c = copy.sleeve;
    // The album sets as large as its longest word allows, so no word breaks mid-way across the cover
    const longest = Math.max(...c.album.split(" ").map((w) => w.length));
    const albumSize = Math.min(15, 84 / (longest * 0.6)).toFixed(1);
    const side = (label: string, tracks: typeof c.sideA) => `<div class="sl-side">
        <h6>Side ${label}</h6>
        ${tracks
          .map(
            (t, i) => `<div class="sl-track"><small class="sl-no">${label}${i + 1}</small><small class="sl-title">${t.title}</small><span class="sl-leader"></span><small class="sl-time">${t.time}</small></div>`,
          )
          .join("\n        ")}
      </div>`;
    return `
<style>
  .sl { --sl-rule: color-mix(in srgb, currentColor 20%, transparent); max-width: 1240px; margin: 0 auto; padding: 1.5rem 1rem 3rem; }
  .sl h1, .sl h2, .sl h3, .sl h4, .sl h5, .sl h6, .sl p { margin: 0; }
  .sl-caps { text-transform: uppercase; letter-spacing: 0.14em; }
  .sl-row { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr); gap: 3rem; align-items: center; }

  /* Front: the cover sits over a record that slides out to the right */
  .sl-front { position: relative; padding-right: 17%; }
  .sl-disc { position: absolute; top: 4%; right: 0; width: 80%; aspect-ratio: 1; border-radius: 50%;
    background:
      radial-gradient(circle, var(--tone-base) 0 16%, transparent 16.3%),
      repeating-radial-gradient(circle, oklch(0.2 0 0) 0 1.2px, oklch(0.26 0 0) 1.2px 2.4px);
    box-shadow: 0 1rem 2rem -1rem oklch(0 0 0 / 60%); }
  .sl-disc::after { content: ""; position: absolute; inset: 49%; border-radius: 50%; background: var(--bg-color); }
  .sl-cover { position: relative; aspect-ratio: 1; container-type: inline-size; overflow: hidden; background: var(--fg-color); box-shadow: 0 1.5rem 3rem -1.5rem oklch(0 0 0 / 55%); }
  .sl .sl-cover h1, .sl .sl-cover small { color: var(--bg-color); }
  .sl-cover-top { position: absolute; top: 7cqi; left: 7cqi; right: 7cqi; display: flex; justify-content: space-between; padding-bottom: 2.5cqi; border-bottom: 1px solid color-mix(in srgb, var(--bg-color) 45%, transparent); }
  .sl .sl-cover-top small { font-size: 2.8cqi; }
  .sl .sl-album { position: absolute; top: 19cqi; left: 7cqi; right: 7cqi; font-size: var(--sl-album-size, 15cqi); line-height: 0.92; text-wrap: balance; max-height: 4lh; overflow: hidden; }
  .sl .sl-artist { position: absolute; left: 7cqi; bottom: 7cqi; font-size: 3.6cqi; }

  /* Back: track lists, notes and credits */
  .sl-back { aspect-ratio: 1; display: flex; flex-direction: column; gap: 1.25rem; padding: 1.75rem 1.75rem 1.5rem; border: 1px solid var(--sl-rule); background: color-mix(in srgb, currentColor 3%, transparent); }
  .sl-back-head { display: flex; justify-content: space-between; align-items: baseline; gap: 1rem; padding-bottom: 0.8rem; border-bottom: 1px solid currentColor; }
  .sl-back-head h5 { flex-shrink: 0; white-space: nowrap; }
  .sl-back-head small { min-width: 0; white-space: nowrap; overflow: hidden; }
  .sl-sides { display: grid; grid-template-columns: 1fr 1fr; gap: 1.75rem; }
  .sl-side { min-width: 0; }
  .sl-side h6 { margin-bottom: 0.35rem; }
  .sl-track { display: flex; align-items: baseline; gap: 0.45rem; padding: 0.3rem 0; border-bottom: 1px solid var(--sl-rule); }
  .sl-no { width: 1.6rem; flex-shrink: 0; opacity: 0.6; font-variant-numeric: tabular-nums; }
  .sl-title { min-width: 0; white-space: nowrap; overflow: hidden; }
  .sl-leader { flex: 1; min-width: 0.75rem; border-bottom: 1px dotted currentColor; opacity: 0.4; }
  .sl-time { font-variant-numeric: tabular-nums; }
  .sl-notes p { hyphens: auto; }
  .sl-credits { display: grid; grid-template-columns: 1fr 1fr; gap: 0.2rem 1.5rem; }
  .sl-foot { display: flex; justify-content: space-between; align-items: flex-end; gap: 1rem; margin-top: auto; }
  .sl-foot div { display: flex; flex-direction: column; gap: 0.1rem; }
  .sl-bars { width: 6.5rem; height: 2.25rem; flex-shrink: 0; background: repeating-linear-gradient(90deg, currentColor 0 1px, transparent 1px 3px, currentColor 3px 5px, transparent 5px 6px, currentColor 6px 7px, transparent 7px 10px); opacity: 0.8; }

  @media (max-width: 800px) {
    .sl { padding: 0.75rem 0.75rem 2rem; }
    .sl-row { grid-template-columns: minmax(0, 1fr); gap: 2rem; }
    .sl-back-head { flex-direction: column; gap: 0.25rem; }
    .sl-back-head h5 { flex-shrink: 1; white-space: normal; }
    .sl-back { aspect-ratio: auto; padding: 1.25rem; }
    .sl-sides, .sl-credits { grid-template-columns: 1fr; }
  }
</style>

<div class="sl" lang="en">
  <div class="sl-row">
    <div class="sl-front">
      <div class="sl-disc"></div>
      <div class="sl-cover">
        <div class="sl-cover-top"><small class="sl-caps">${c.label}</small><small class="sl-caps">${c.catalogue}</small></div>
        <h1 class="sl-album" style="--sl-album-size: ${albumSize}cqi">${c.album}</h1>
        <small class="sl-artist sl-caps">${c.artist}</small>
      </div>
    </div>

    <div class="sl-back">
      <div class="sl-back-head"><h5>${c.artist}</h5><small>${c.album}</small></div>
      <div class="sl-sides">
        ${side("A", c.sideA)}
        ${side("B", c.sideB)}
      </div>
      <div class="sl-notes"><p><small>${c.notes}</small></p></div>
      <div class="sl-credits">
        ${c.credits.map((cr) => `<small>${cr}</small>`).join("\n        ")}
      </div>
      <div class="sl-foot">
        <div><small class="sl-caps">${c.label}</small><small>${c.catalogue} &middot; ${c.year}</small></div>
        <span class="sl-bars"></span>
      </div>
    </div>
  </div>
</div>
`;
  },
};
