import { Grid3x3 } from "lucide-react";
import type { PreviewTemplate } from "./types";

export const swissTemplate: PreviewTemplate = {
  id: "swiss",
  name: "Swiss",
  icon: Grid3x3,
  html: `
<style>
  .sw { --sw-line: color-mix(in srgb, currentColor 30%, transparent); max-width: 1200px; margin: 0 auto; padding: 0 1.5rem 3rem; text-align: left; }
  .sw-row { display: grid; grid-template-columns: repeat(12, 1fr); column-gap: 1.5rem; }
  .sw-row > * { min-width: 0; }
  .sw-top { padding: 1rem 0 0.9rem; border-top: 8px solid currentColor; align-items: baseline; }
  .sw-top small:nth-child(1) { grid-column: 1 / 4; font-weight: 700; }
  .sw-top small:nth-child(2) { grid-column: 4 / 7; }
  .sw-top small:nth-child(3) { grid-column: 7 / 10; }
  .sw-top small:nth-child(4) { grid-column: 10 / 13; }
  .sw-hero { padding: 4.5rem 0 3rem; border-top: 1px solid var(--sw-line); }
  .sw-hero .eyebrow { grid-column: 1 / 13; margin-bottom: 2.5rem; }
  .sw-hero h1 { grid-column: 1 / 13; margin: 0; max-width: 11em; }
  .sw-lede { padding: 1rem 0 6rem; }
  .sw-lede p { grid-column: 1 / 7; margin: 0; }
  .sw-lede small { grid-column: 9 / 13; align-self: end; }
  .sw-sec { padding: 1.25rem 0 5rem; border-top: 1px solid var(--sw-line); }
  .sw-num { grid-column: 1 / 3; margin: 0; line-height: 0.9; }
  .sw-sec-main { grid-column: 3 / 9; }
  .sw-sec-main .eyebrow { display: block; margin-bottom: 1.25rem; }
  .sw-sec-main h2 { margin: 0 0 1.5rem; }
  .sw-sec-main h3 { margin: 2.25rem 0 0.75rem; }
  .sw-sec-main p { margin: 0 0 1rem; max-width: 32em; }
  .sw-note { grid-column: 10 / 13; border-top: 3px solid currentColor; padding-top: 0.6rem; align-self: start; }
  .sw-note h6 { margin: 0 0 0.5rem; }
  .sw-note p { margin: 0; }
  .sw-chain { grid-column: 3 / 13; }
  .sw-chain > div { display: grid; grid-template-columns: 3rem 1fr; align-items: baseline; padding: 0.85rem 0; border-top: 1px solid var(--sw-line); gap: 1.5rem; }
  .sw-chain h1, .sw-chain h2, .sw-chain h3, .sw-chain h4, .sw-chain h5, .sw-chain h6 { margin: 0; }
  .sw-chain > div:last-child { border-bottom: 1px solid var(--sw-line); }
  .sw-prog { grid-column: 3 / 13; }
  .sw-prog > div { display: grid; grid-template-columns: 7rem 1fr 9rem; gap: 1.5rem; align-items: baseline; padding: 1rem 0; border-top: 1px solid var(--sw-line); }
  .sw-prog h4 { margin: 0; }
  .sw-prog small:last-child { text-align: left; }
  .sw-quote { padding: 1.25rem 0 6rem; border-top: 1px solid var(--sw-line); }
  .sw-quote blockquote { grid-column: 1 / 11; margin: 0; }
  .sw-quote .display-2 { margin: 0 0 1.5rem; }
  .sw-foot { padding-top: 1rem; border-top: 8px solid currentColor; }
  .sw-foot small:nth-child(1) { grid-column: 1 / 4; font-weight: 700; }
  .sw-foot small:nth-child(2) { grid-column: 4 / 10; }
  .sw-foot small:nth-child(3) { grid-column: 10 / 13; }

  @media (max-width: 800px) {
    .sw { padding: 0 1.25rem 2.5rem; }
    .sw-row { column-gap: 1rem; }
    .sw-hero { padding: 3rem 0 2rem; }
    .sw-lede { padding-bottom: 3.5rem; }
    .sw-lede p { grid-column: 1 / 11; }
    .sw-lede small { grid-column: 1 / 13; margin-top: 1rem; }
    .sw-num { grid-column: 1 / 4; }
    .sw-sec-main { grid-column: 4 / 13; }
    .sw-note { grid-column: 4 / 13; margin-top: 1.5rem; }
    .sw-chain, .sw-prog { grid-column: 4 / 13; }
    .sw-prog > div { grid-template-columns: 5rem 1fr; }
    .sw-prog small:last-child { grid-column: 2; }
    .sw-quote blockquote { grid-column: 1 / 13; }
  }
  @media (max-width: 600px) {
    .sw-top small:nth-child(1) { grid-column: 1 / 8; }
    .sw-top small:nth-child(2), .sw-top small:nth-child(3) { display: none; }
    .sw-top small:nth-child(4) { grid-column: 8 / 13; }
    .sw-lede p { grid-column: 1 / 13; }
    .sw-sec { padding-bottom: 3rem; }
    .sw-num, .sw-sec-main, .sw-note, .sw-chain, .sw-prog { grid-column: 1 / 13; }
    .sw-num { margin-bottom: 1rem; }
    .sw-chain > div { grid-template-columns: 2rem 1fr; gap: 0.75rem; }
    .sw-foot small:nth-child(2) { display: none; }
    .sw-foot small:nth-child(1) { grid-column: 1 / 8; }
    .sw-foot small:nth-child(3) { grid-column: 8 / 13; }
  }
  @media (max-width: 480px) {
    .sw { padding: 0 0.75rem 2rem; }
  }
</style>

<div class="sw">
  <div class="sw-row sw-top">
    <small>Hollow Concordance</small>
    <small>Exhibition No. 7</small>
    <small>Tidewall Hall, Veyl</small>
    <small>3 Nov &ndash; 19 Dec</small>
  </div>

  <div class="sw-row sw-hero">
    <span class="eyebrow">The Inverse Almanac, first showing</span>
    <h1 class="display-1">What has not yet happened is already indexed.</h1>
  </div>

  <div class="sw-row sw-lede">
    <p>Forty-one entries, each recording an event in the tense that precedes it, drawn from the ledger Oriel Taskane never delivered and the Concordance never admitted to lacking.</p>
    <small>Admission by recollection only. Doors open at the ebb.</small>
  </div>

  <div class="sw-row sw-sec">
    <p class="display-2 sw-num">01</p>
    <div class="sw-sec-main">
      <span class="eyebrow">Premise</span>
      <h2>The absent ledger</h2>
      <p>Taskane compiled her ledger in the interval between two tides, and the interval has since been annulled. What survives is the debt it describes, owed by nobody to a creditor who has not been born.</p>
      <p>Adept Ilse Varrow reads this as an argument; the Provost of Unlit Rooms reads it as a receipt. The exhibition declines to arbitrate between them.</p>
      <h3>The conditional tide</h3>
      <p>Each entry is filed under the hour in which it would have been forgotten, so that consultation precedes composition and the archive answers before it is asked.</p>
    </div>
    <div class="sw-note">
      <h6>Note</h6>
      <p><small>Entries marked with an open circle have been consulted more often than they exist.</small></p>
    </div>
  </div>

  <div class="sw-row sw-sec">
    <p class="display-2 sw-num">02</p>
    <div class="sw-chain">
      <div><small>I</small><h1>The Debt</h1></div>
      <div><small>II</small><h2>The Debt Without a Creditor</h2></div>
      <div><small>III</small><h3>The Creditor Who Has Not Yet Been Born</h3></div>
      <div><small>IV</small><h4>The Birth Deferred to a Later Almanac</h4></div>
      <div><small>V</small><h5>The Almanac Consulted in Advance of Itself</h5></div>
      <div><small>VI</small><h6>The Consultation Entered as a Loan</h6></div>
      <div><small>VII</small><p>Provenance is recorded from the end of the chain toward its beginning, and the beginning is left blank.</p></div>
    </div>
  </div>

  <div class="sw-row sw-sec">
    <p class="display-2 sw-num">03</p>
    <div class="sw-prog">
      <div><small>3 Nov</small><h4>Opening recital of the Seventh Cartography</h4><small>Tidewall Hall</small></div>
      <div><small>17 Nov</small><h4>The Provost addresses the unlit rooms</h4><small>Lower Gallery</small></div>
      <div><small>1 Dec</small><h4>A recital of entries not yet made</h4><small>The Drowned Annex</small></div>
      <div><small>19 Dec</small><h4>Closing, retroactively</h4><small>Everywhere</small></div>
    </div>
  </div>

  <div class="sw-row sw-quote">
    <blockquote>
      <p class="display-2">To catalogue the unhappened is to lend it a past.</p>
      <small>Adept Ilse Varrow, marginal note to the fourth almanac</small>
    </blockquote>
  </div>

  <div class="sw-row sw-foot">
    <small>Hollow Concordance</small>
    <small>Veyl, between the second and third sea-walls</small>
    <small>Nr. 7 / the year after</small>
  </div>
</div>
`,
};
