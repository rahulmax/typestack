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
    <small>Autumn Issue &middot; No. 14</small>
    <h6>The Quarterly Review</h6>
    <small>Subscribe</small>
  </div>
  <hr class="ed-rule" style="margin: 0;" />
  <div class="ed-nav">
    <small>Essays</small><small>Design</small><small>Culture</small><small>Interviews</small><small>Archive</small>
  </div>
  <hr class="ed-rule" style="margin: 0;" />

  <header class="ed-open">
    <div>
      <span class="eyebrow" style="display: block; margin-bottom: 1rem;">Feature &middot; Design</span>
      <h1 class="display-1">The quiet grammar of everyday things</h1>
      <p class="ed-dek">Why the best-set page is the one you never notice, and what a century of typesetters can still teach the people who build screens.</p>
      <div class="ed-byline">
        <small>Words by <b>Marguerite Hale</b></small><small>&middot;</small><small>Photographs by Ines Okafor</small><small>&middot;</small><small>14 min read</small>
      </div>
    </div>
    <figure class="ed-figure">
      <div class="ill" data-max-h="300px"></div>
      <small>Above: a proof sheet from the 1961 reprint, annotated by hand.</small>
    </figure>
  </header>

  <hr class="ed-rule" style="margin: 0;" />

  <div class="ed-body">
    <article class="ed-cols">
      <p>There is a moment, in every good book, when the reader forgets they are reading. The letters recede, the margins hold their breath, and the sentence simply arrives. Typographers call this transparency, and it is the hardest thing in the trade to achieve, because it is made entirely of decisions nobody will ever see.</p>
      <p>Consider the humble paragraph. Its size, its leading, the length of its line: each is a small negotiation between the eye and the page. Get them right and the text feels inevitable. Get one wrong and the whole thing begins to itch, though the reader could not tell you why.</p>
      <h2>A scale is a promise</h2>
      <p>The old printers worked from a fixed cabinet of sizes. Six point, eight, ten, twelve: a ladder with only so many rungs. That limit was a gift. It forced every headline, caption and folio to belong to the same family, and the pages that resulted have a calm that no amount of freedom has managed to reproduce.</p>
      <blockquote class="ed-pull">
        <p class="display-3">&ldquo;Good type is invisible; great type is felt.&rdquo;</p>
        <small>Beatrice Warde, <em>The Crystal Goblet</em></small>
      </blockquote>
      <p>A modular scale restores that ladder. Choose a ratio, choose a base, and every size in the document is now a relative of every other. The headline is not merely bigger than the caption; it is bigger by a known, repeatable amount, and the eye learns to trust it.</p>
      <h3>The measure of a line</h3>
      <p>Somewhere between forty-five and seventy-five characters, a line of text becomes comfortable. Shorter and the eye lurches from row to row; longer and it loses its place on the return. Columns, the magazine's oldest trick, exist to keep lines inside that window.</p>
      <h4>On rhythm</h4>
      <p>Vertical rhythm is the same idea turned ninety degrees. When every block sits on a shared baseline, the page acquires a pulse, and pulse is what separates a layout from a pile of text.</p>
      <h5>A note on colour</h5>
      <p>Ink on paper is never quite black. Screens, freed from the constraint, often overshoot into pure contrast. Soften it a little and the page breathes.</p>
    </article>

    <aside class="ed-side">
      <h5>By the numbers</h5>
      <div class="ed-stat"><h3>1.25</h3><small>The ratio most often chosen for long-form reading, the major third.</small></div>
      <div class="ed-stat"><h3>66</h3><small>Characters per line, the classic ideal measure.</small></div>
      <div class="ed-stat"><h3>1.5</h3><small>A comfortable line height for body copy in the wild.</small></div>
      <h6 style="margin-top: 1.5rem;">Further reading</h6>
      <p><small>Robert Bringhurst, <em>The Elements of Typographic Style</em>; Ellen Lupton, <em>Thinking with Type</em>.</small></p>
    </aside>
  </div>

  <section style="margin-top: 3rem;">
    <hr class="ed-rule-thick" style="margin: 0 0 1rem;" />
    <h5>Continue reading</h5>
    <div class="ed-more">
      <div><span class="eyebrow">Essay</span><h4>Why serifs came back</h4><p><small>A short history of the return of the humble bracketed foot.</small></p></div>
      <div><span class="eyebrow">Interview</span><h4>Forty years of setting other people's words</h4><p><small>A compositor on the craft of staying out of the way.</small></p></div>
      <div><span class="eyebrow">Culture</span><h4>The last sign painter on Canal Street</h4><p><small>Ladders, enamel and a very steady hand.</small></p></div>
    </div>
  </section>

  <div class="ed-foot"><small>&copy; 2026 The Quarterly Review</small><small>Set in the fonts you chose</small></div>
</div>

${illustrationScript}
`,
};
