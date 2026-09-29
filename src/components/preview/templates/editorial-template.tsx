import { Newspaper } from "lucide-react";
import type { PreviewTemplate } from "./types";
import { illustrationScript } from "./illustration-script";

export const editorialTemplate: PreviewTemplate = {
  id: "editorial",
  name: "Editorial",
  icon: Newspaper,
  html: `
<style>
  .ed { max-width: 1040px; margin: 0 auto; padding: 0 1.5rem 3rem; }
  .ed-rule { border: none; border-top: 1px solid color-mix(in srgb, currentColor 22%, transparent); }
  .ed-rule-thick { border: none; border-top: 3px double color-mix(in srgb, currentColor 40%, transparent); }
  .ed-mast { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; padding: 0.9rem 0; }
  .ed-mast > :last-child { text-align: right; }
  .ed-mast h6 { text-align: center; }
  .ed-nav { display: flex; justify-content: center; gap: 2rem; padding: 0.75rem 0; }
  .ed-open { display: grid; grid-template-columns: 1.35fr 1fr; gap: 3rem; align-items: end; padding: 3rem 0 2.5rem; }
  .ed-open h1 { margin: 0 0 1.25rem; }
  .ed-open .ed-dek { max-width: 34em; }
  .ed-byline { display: flex; gap: 0.6rem; flex-wrap: wrap; margin-top: 1.5rem; opacity: 0.75; }
  .ed-figure .ill { display: flex; align-items: center; justify-content: center; min-height: 260px; background: var(--ill-surface); border-radius: 4px; padding: 1.5rem; }
  .ed-figure small { display: block; margin-top: 0.6rem; opacity: 0.7; }
  .ed-body { display: grid; grid-template-columns: 1fr 250px; gap: 3rem; padding-top: 2.5rem; }
  .ed-cols { column-count: 2; column-gap: 2.5rem; column-rule: 1px solid color-mix(in srgb, currentColor 14%, transparent); }
  .ed-cols p { margin: 0 0 1em; text-align: justify; hyphens: auto; }
  .ed-cols h2, .ed-cols h3 { margin: 1.25rem 0 0.75rem; break-after: avoid; }
  .ed-cols > p:first-child::first-letter { float: left; font-size: 4.6em; line-height: 0.82; font-weight: 700; padding: 0.06em 0.1em 0 0; }
  .ed-pull { column-span: all; margin: 1.5rem 0 2rem; padding: 1.75rem 0; border-top: 1px solid currentColor; border-bottom: 1px solid currentColor; text-align: center; }
  .ed-pull p { margin: 0 auto 0.75rem; max-width: 22em; text-align: center; }
  .ed-side { border-top: 4px solid currentColor; padding-top: 1rem; align-self: start; }
  .ed-side h5 { margin: 0 0 1rem; }
  .ed-stat { padding: 0.9rem 0; border-top: 1px solid color-mix(in srgb, currentColor 18%, transparent); }
  .ed-stat h3 { margin: 0 0 0.15rem; }
  .ed-more { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; padding-top: 1.75rem; }
  .ed-more > div { border-top: 1px solid color-mix(in srgb, currentColor 22%, transparent); padding-top: 1rem; }
  .ed-more h4 { margin: 0.5rem 0 0.5rem; }
  .ed-foot { display: flex; justify-content: space-between; gap: 1rem; flex-wrap: wrap; padding-top: 1.25rem; margin-top: 3rem; border-top: 3px double color-mix(in srgb, currentColor 40%, transparent); opacity: 0.8; }

  @media (max-width: 800px) {
    .ed { padding: 0 1.25rem 2.5rem; }
    .ed-open { grid-template-columns: 1fr; gap: 1.75rem; padding: 2rem 0 1.75rem; }
    .ed-body { grid-template-columns: 1fr; gap: 2rem; }
    .ed-side { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
    .ed-side h5 { grid-column: 1 / -1; margin-bottom: 0; }
    .ed-stat { border-top: none; padding: 0; }
    .ed-more { gap: 1.25rem; }
  }
  @media (max-width: 600px) {
    .ed-cols { column-count: 1; column-rule: none; }
    .ed-cols p { text-align: left; }
    .ed-more { grid-template-columns: 1fr; }
    .ed-nav { gap: 1rem; flex-wrap: wrap; }
    .ed-side { grid-template-columns: 1fr; }
    .ed-stat { border-top: 1px solid color-mix(in srgb, currentColor 18%, transparent); padding: 0.75rem 0; }
  }
  @media (max-width: 480px) {
    .ed { padding: 0 0.75rem 2rem; }
    .ed-mast { grid-template-columns: 1fr; gap: 0.25rem; text-align: center; }
    .ed-mast > :last-child, .ed-mast > :first-child { text-align: center; }
    .ed-mast > :last-child { display: none; }
    .ed-figure .ill { min-height: 180px; }
    .ed-foot { flex-direction: column; }
  }
</style>

<div class="ed">
  <hr class="ed-rule-thick" style="margin: 0;" />
  <div class="ed-mast">
    <small>Ebb Issue &middot; No. 14</small>
    <h6>The Veyl Quarterly</h6>
    <small>Petition</small>
  </div>
  <hr class="ed-rule" style="margin: 0;" />
  <div class="ed-nav">
    <small>Essays</small><small>Cartography</small><small>Almanacs</small><small>Testimonies</small><small>Annex</small>
  </div>
  <hr class="ed-rule" style="margin: 0;" />

  <header class="ed-open">
    <div>
      <span class="eyebrow" style="display: block; margin-bottom: 1rem;">Feature &middot; The Annex</span>
      <h1 class="display-1">The city that filed itself under Later</h1>
      <p class="ed-dek">How Veyl went under without ever having been above, and what the Hollow Concordance owes to a flood that arrived only in the minutes.</p>
      <div class="ed-byline">
        <small>Words by <b>Adept Ilse Varrow</b></small><small>&middot;</small><small>Drawings by the Provost of Unlit Rooms</small><small>&middot;</small><small>a full ebb of attendance</small>
      </div>
    </div>
    <figure class="ed-figure">
      <div class="ill" data-max-h="300px"></div>
      <small>Above: a plate from the Inverse Almanac, coloured by hand before it was drawn.</small>
    </figure>
  </header>

  <hr class="ed-rule" style="margin: 0;" />

  <div class="ed-body">
    <article class="ed-cols">
      <p>There is a moment, in the history of every drowned place, when the water is said to have arrived. The tidal grammarians of Veyl maintain that no such moment occurred, and that the city was submerged by an administrative decision taken in its own future, ratified retroactively, and never quite communicated to the streets.</p>
      <p>Consider the Sea-Wall, built to keep out a flood that had not yet been recorded. Its masons worked from a description of the wall they would have built had the flood been foreseen, and the wall, aware of its own hypothesis, has held ever since against nothing whatever.</p>
      <h2>A ledger is a debt</h2>
      <p>Oriel Taskane understood this. Her ledger enumerated what the city would owe if it were ever solvent, and the Concordance has honoured every line in advance, drawing on an account that opens only when it is closed. The arrangement is generally described as prudent, and occasionally as grammatical.</p>
      <blockquote class="ed-pull">
        <p class="display-3">&ldquo;An archive is the future, pardoned in advance.&rdquo;</p>
        <small>The Provost of Unlit Rooms, <em>Marginalia to the Fourth Almanac</em></small>
      </blockquote>
      <p>The Inverse Almanac completes the arrangement. Each of its forty-one entries records an event in the tense that precedes it, so that consultation becomes a form of prophecy conducted backward, and prophecy a form of housekeeping. Nothing in the almanac has occurred; everything in it has been filed.</p>
      <h3>The interval between tides</h3>
      <p>Between the ebb and the flood lies an hour the Concordance declares annulled. It is held that whatever transpires in that hour is discharged in advance, and the grammarians are accordingly obliged to be elsewhere, which they achieve by remaining precisely where they are.</p>
      <h4>On the Seventh Cartography</h4>
      <p>The seventh chart of the coast was drawn from the water&rsquo;s point of view, and it shows the city as the flood will remember it: enlarged, tender, and slightly overdue.</p>
      <h5>A note on the unlit rooms</h5>
      <p>There are rooms in Veyl that decline to be entered, and in declining they have acquired the only certain address in the city.</p>
    </article>

    <aside class="ed-side">
      <h5>By the tallies</h5>
      <div class="ed-stat"><h3>41</h3><small>Entries in the Inverse Almanac, none yet occurred.</small></div>
      <div class="ed-stat"><h3>907</h3><small>Years the Concordance has spent awaiting its own founding.</small></div>
      <div class="ed-stat"><h3>&minus;3</h3><small>Hours owed by the Sea-Wall to the tide it anticipated.</small></div>
      <h6 style="margin-top: 1.5rem;">Further marginalia</h6>
      <p><small>Taskane, <em>The Unentered Ledger</em>; Varrow, <em>Gloss on a Tide Not Yet Drawn</em>.</small></p>
    </aside>
  </div>

  <section style="margin-top: 3rem;">
    <hr class="ed-rule-thick" style="margin: 0 0 1rem;" />
    <h5>Continue in the Annex</h5>
    <div class="ed-more">
      <div><span class="eyebrow">Essay</span><h4>Why the Provost sits in the dark</h4><p><small>A brief account of the audience that concludes before it begins.</small></p></div>
      <div><span class="eyebrow">Testimony</span><h4>Forty years cataloguing what did not happen</h4><p><small>A grammarian on the courtesy of the unrecorded.</small></p></div>
      <div><span class="eyebrow">Almanacs</span><h4>The last tidewarden of the Third Sea-Wall</h4><p><small>Ladders, lamps and an unpaid interval.</small></p></div>
    </div>
  </section>

  <div class="ed-foot"><small>&copy; The Veyl Quarterly, issued in arrears</small><small>Bound on the far side of the tide</small></div>
</div>

${illustrationScript}
`,
};
