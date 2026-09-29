import { Grid3x3 } from "lucide-react";
import type { PreviewTemplate } from "./types";

export const swissTemplate: PreviewTemplate = {
  id: "swiss",
  name: "Swiss",
  icon: Grid3x3,
  html: `
<style>
  .sw { --sw-line: color-mix(in srgb, currentColor 30%, transparent); max-width: 1200px; margin: 0 auto; padding: 0 1.5rem 3rem; }
  .sw-row { display: grid; grid-template-columns: repeat(12, 1fr); column-gap: 1.5rem; }
  .sw-row > * { min-width: 0; }
  .sw-top { padding: 1rem 0 0.9rem; border-top: 6px solid currentColor; align-items: baseline; }
  .sw-top h6 { margin: 0; grid-column: 1 / 4; }
  .sw-top small:nth-child(2) { grid-column: 4 / 8; }
  .sw-top small:nth-child(3) { grid-column: 8 / 11; }
  .sw-top small:nth-child(4) { grid-column: 11 / 13; text-align: right; }
  .sw-hero { padding: 5rem 0 4rem; border-top: 1px solid var(--sw-line); }
  .sw-hero .eyebrow { grid-column: 1 / 4; padding-top: 0.6rem; }
  .sw-hero h1 { grid-column: 4 / 13; margin: 0; }
  .sw-intro { padding-bottom: 5rem; }
  .sw-intro p { grid-column: 4 / 9; margin: 0; }
  .sw-intro small { grid-column: 10 / 13; align-self: end; }
  .sw-blocks { padding-bottom: 5rem; align-items: stretch; }
  .sw-tone { grid-column: 1 / 7; min-height: 320px; background: var(--ill-primary, color-mix(in srgb, currentColor 40%, transparent)); position: relative; overflow: hidden; }
  .sw-tone::before { content: ""; position: absolute; left: 12%; bottom: -30%; width: 76%; aspect-ratio: 1; border-radius: 50%; background: var(--bg-color); }
  .sw-tone::after { content: ""; position: absolute; left: 0; top: 0; width: 34%; height: 26%; background: currentColor; }
  .sw-ink { grid-column: 7 / 13; background: currentColor; color: var(--bg-color); padding: 1.75rem; display: flex; flex-direction: column; justify-content: space-between; gap: 2rem; }
  .sw-ink * { color: var(--bg-color) !important; }
  .sw-ink h4, .sw-ink p { margin: 0; }
  .sw-sec { padding: 1.5rem 0 4.5rem; border-top: 1px solid var(--sw-line); }
  .sw-sec > :first-child { grid-column: 1 / 4; }
  .sw-sec .eyebrow { display: block; margin-top: 0.4rem; }
  .sw-sec-main { grid-column: 4 / 10; }
  .sw-sec-main h2 { margin: 0 0 1.5rem; }
  .sw-sec-main h3 { margin: 2rem 0 0.75rem; }
  .sw-sec-main p { margin: 0 0 1rem; max-width: 34em; }
  .sw-note { grid-column: 10 / 13; border-top: 3px solid currentColor; padding-top: 0.6rem; align-self: start; }
  .sw-note h6 { margin: 0 0 0.5rem; }
  .sw-note p { margin: 0; }
  .sw-scale { grid-column: 4 / 13; }
  .sw-scale > div { display: grid; grid-template-columns: 5rem 1fr; align-items: baseline; padding: 0.9rem 0; border-top: 1px solid var(--sw-line); gap: 1.5rem; }
  .sw-scale h1, .sw-scale h2, .sw-scale h3, .sw-scale h4, .sw-scale h5, .sw-scale h6 { margin: 0; }
  .sw-quote { padding: 1.5rem 0 5rem; border-top: 1px solid var(--sw-line); }
  .sw-quote blockquote { grid-column: 4 / 12; margin: 0; }
  .sw-quote blockquote p { margin: 0 0 1.25rem; }
  .sw-foot { padding-top: 1rem; border-top: 6px solid currentColor; }
  .sw-foot small:nth-child(1) { grid-column: 1 / 4; }
  .sw-foot small:nth-child(2) { grid-column: 4 / 10; }
  .sw-foot small:nth-child(3) { grid-column: 10 / 13; text-align: right; }

  @media (max-width: 800px) {
    .sw { padding: 0 1.25rem 2.5rem; }
    .sw-row { column-gap: 1rem; }
    .sw-hero { padding: 3rem 0 2.5rem; }
    .sw-hero .eyebrow { grid-column: 1 / 13; margin-bottom: 1rem; }
    .sw-hero h1 { grid-column: 1 / 13; }
    .sw-intro p { grid-column: 1 / 10; }
    .sw-intro small { grid-column: 1 / 13; margin-top: 1rem; }
    .sw-sec > :first-child { grid-column: 1 / 13; display: flex; gap: 1rem; align-items: baseline; margin-bottom: 1rem; }
    .sw-sec-main { grid-column: 1 / 13; }
    .sw-note { grid-column: 1 / 13; margin-top: 1.5rem; }
    .sw-scale { grid-column: 1 / 13; }
    .sw-quote blockquote { grid-column: 1 / 13; }
    .sw-tone { min-height: 240px; }
  }
  @media (max-width: 600px) {
    .sw-top h6 { grid-column: 1 / 8; }
    .sw-top small:nth-child(2), .sw-top small:nth-child(3) { display: none; }
    .sw-top small:nth-child(4) { grid-column: 8 / 13; }
    .sw-intro p { grid-column: 1 / 13; }
    .sw-blocks { row-gap: 1rem; padding-bottom: 3rem; }
    .sw-tone, .sw-ink { grid-column: 1 / 13; }
    .sw-tone { min-height: 200px; }
    .sw-sec { padding-bottom: 3rem; }
    .sw-scale > div { grid-template-columns: 3.5rem 1fr; gap: 0.75rem; }
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
    <h6>Raster</h6>
    <small>Notes on the grid</small>
    <small>Zurich &middot; Basel</small>
    <small>Nr. 07 / 2026</small>
  </div>

  <div class="sw-row sw-hero">
    <span class="eyebrow">Typography, 1959&ndash;</span>
    <h1 class="display-1">Order is a form of clarity.</h1>
  </div>

  <div class="sw-row sw-intro">
    <p>A page is a set of decisions made once and kept. Fix the grid, fix the scale, and the content is free to say what it has to say without decoration.</p>
    <small>Set flush left, ragged right. One typeface, few sizes, no ornament.</small>
  </div>

  <div class="sw-row sw-blocks">
    <div class="sw-tone"></div>
    <div class="sw-ink">
      <span class="eyebrow">Principle</span>
      <h3 class="display-2">12</h3>
      <div>
        <h4>Twelve columns</h4>
        <p>Halves, thirds, quarters and sixths all divide cleanly, so every element has a place to land.</p>
      </div>
    </div>
  </div>

  <div class="sw-row sw-sec">
    <div><p class="display-3" style="margin: 0;">01</p><span class="eyebrow">Grid</span></div>
    <div class="sw-sec-main">
      <h2>The module</h2>
      <p>Everything begins with a module: a rectangle of a fixed proportion, repeated. Columns and rows are multiples of it, and gutters are its breathing space.</p>
      <p>When two elements share an edge, the eye reads a relationship. When they miss by a few pixels, it reads an accident.</p>
      <h3>Asymmetry</h3>
      <p>The centre axis is the easy answer. Setting the headline off to one side leaves room for tension, and white space becomes an active part of the composition.</p>
    </div>
    <div class="sw-note">
      <h6>Note</h6>
      <p><small>Leave a column empty on purpose. Emptiness is the strongest contrast available.</small></p>
    </div>
  </div>

  <div class="sw-row sw-sec">
    <div><p class="display-3" style="margin: 0;">02</p><span class="eyebrow">Type</span></div>
    <div class="sw-scale">
      <div><small>Heading 1</small><h1>Aa Grid</h1></div>
      <div><small>Heading 2</small><h2>Aa Grid systems</h2></div>
      <div><small>Heading 3</small><h3>Aa Grid systems in graphic design</h3></div>
      <div><small>Heading 4</small><h4>Aa Grid systems in graphic design</h4></div>
      <div><small>Heading 5</small><h5>Aa Grid systems in graphic design</h5></div>
      <div><small>Heading 6</small><h6>Aa Grid systems in graphic design</h6></div>
      <div><small>Body</small><p>Hierarchy is made by size and weight alone. Colour, rules and position do the rest.</p></div>
    </div>
  </div>

  <div class="sw-row sw-sec">
    <div><p class="display-3" style="margin: 0;">03</p><span class="eyebrow">Voice</span></div>
    <div class="sw-sec-main">
      <h2>Say it plainly</h2>
      <p>Objective photography, sans-serif type and a mathematical grid: the tools were chosen because they let the message arrive without interference.</p>
    </div>
    <div class="sw-note">
      <h6>Reference</h6>
      <p><small>Josef M&uuml;ller-Brockmann, <em>Grid Systems in Graphic Design</em>, 1981.</small></p>
    </div>
  </div>

  <div class="sw-row sw-quote">
    <blockquote>
      <p class="display-3">The grid system is an aid, not a guarantee.</p>
      <small>Josef M&uuml;ller-Brockmann</small>
    </blockquote>
  </div>

  <div class="sw-row sw-foot">
    <small>Raster</small>
    <small>Set on a twelve column grid</small>
    <small>2026</small>
  </div>
</div>
`,
};
