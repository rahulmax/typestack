import { Grid3x3 } from "lucide-react";
import type { PreviewTemplate } from "./types";

const NUMERALS = ["I", "II", "III", "IV", "V", "VI", "VII"];

export const swissTemplate: PreviewTemplate = {
  id: "swiss",
  name: "Swiss",
  icon: Grid3x3,
  render: (copy) => {
    const c = copy.swiss;
    return `
<style>
  .sw { max-width: 1200px; margin: 0 auto; padding: 0 1.5rem 3rem; text-align: left; }
  .sw-row { display: grid; grid-template-columns: repeat(12, 1fr); column-gap: 1.5rem; }
  .sw-row > * { min-width: 0; }
  .sw-top { padding: 1rem 0 0.9rem; border-top: 8px solid currentColor; align-items: baseline; }
  .sw-top small:nth-child(1) { grid-column: 1 / 4; font-weight: 700; }
  .sw-top small:nth-child(2) { grid-column: 4 / 7; }
  .sw-top small:nth-child(3) { grid-column: 7 / 10; }
  .sw-top small:nth-child(4) { grid-column: 10 / 13; }
  .sw-hero { padding: 5rem 0 3rem; }
  .sw-hero .eyebrow { grid-column: 1 / 13; margin-bottom: 2.5rem; }
  .sw-hero h1 { grid-column: 1 / 13; margin: 0; max-width: 11em; }
  .sw-lede { padding: 1rem 0 7rem; }
  .sw-lede p { grid-column: 1 / 7; margin: 0; }
  .sw-lede small { grid-column: 9 / 13; align-self: end; }
  .sw-sec { padding: 0 0 7rem; }
  .sw-num { grid-column: 1 / 3; margin: 0; line-height: 0.9; }
  .sw-sec-main { grid-column: 3 / 9; }
  .sw-sec-main .eyebrow { display: block; margin-bottom: 1.25rem; }
  .sw-sec-main h2 { margin: 0 0 1.5rem; }
  .sw-sec-main h3 { margin: 2.25rem 0 0.75rem; }
  .sw-sec-main p { margin: 0 0 1rem; max-width: 32em; }
  .sw-note { grid-column: 10 / 13; align-self: start; padding-top: 0.35rem; }
  .sw-note h6 { margin: 0 0 0.5rem; }
  .sw-note p { margin: 0; }
  .sw-chain { grid-column: 3 / 13; display: grid; row-gap: 1.1rem; }
  .sw-chain > div { display: grid; grid-template-columns: 3rem 1fr; align-items: baseline; gap: 1.5rem; }
  .sw-chain h1, .sw-chain h2, .sw-chain h3, .sw-chain h4, .sw-chain h5, .sw-chain h6, .sw-chain p { margin: 0; }
  .sw-chain > div:last-child { margin-top: 0.75rem; }
  .sw-chain > div:last-child p { max-width: 32em; }
  .sw-prog { grid-column: 3 / 13; display: grid; row-gap: 1.5rem; }
  .sw-prog > div { display: grid; grid-template-columns: 7rem 1fr 9rem; gap: 1.5rem; align-items: baseline; }
  .sw-prog h4 { margin: 0; }
  .sw-quote { padding: 0 0 7rem; }
  .sw-quote blockquote { grid-column: 1 / 11; margin: 0; }
  .sw-quote .display-2 { margin: 0 0 1.5rem; }
  .sw-foot { padding-top: 1rem; border-top: 1px solid currentColor; }
  .sw-foot small:nth-child(1) { grid-column: 1 / 4; font-weight: 700; }
  .sw-foot small:nth-child(2) { grid-column: 4 / 10; }
  .sw-foot small:nth-child(3) { grid-column: 10 / 13; }

  @media (max-width: 800px) {
    .sw { padding: 0 1.25rem 2.5rem; }
    .sw-row { column-gap: 1rem; }
    .sw-hero { padding: 3rem 0 2rem; }
    .sw-lede { padding-bottom: 4.5rem; }
    .sw-lede p { grid-column: 1 / 11; }
    .sw-lede small { grid-column: 1 / 13; margin-top: 1rem; }
    .sw-sec, .sw-quote { padding-bottom: 4.5rem; }
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
    .sw-sec, .sw-quote { padding-bottom: 3.5rem; }
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
    ${c.top.map((t) => `<small>${t}</small>`).join("\n    ")}
  </div>

  <div class="sw-row sw-hero">
    <span class="eyebrow">${c.eyebrow}</span>
    <h1 class="display-1">${c.title}</h1>
  </div>

  <div class="sw-row sw-lede">
    <p>${c.lede}</p>
    <small>${c.aside}</small>
  </div>

  <div class="sw-row sw-sec">
    <p class="display-2 sw-num">01</p>
    <div class="sw-sec-main">
      <span class="eyebrow">${c.premise.eyebrow}</span>
      <h2>${c.premise.title}</h2>
      ${c.premise.paragraphs.map((p) => `<p>${p}</p>`).join("\n      ")}
      <h3>${c.premise.subhead}</h3>
      <p>${c.premise.after}</p>
    </div>
    <div class="sw-note">
      <h6>${c.premise.noteTitle}</h6>
      <p><small>${c.premise.note}</small></p>
    </div>
  </div>

  <div class="sw-row sw-sec">
    <p class="display-2 sw-num">02</p>
    <div class="sw-chain">
      ${c.chain.map((h, i) => `<div><small>${NUMERALS[i]}</small><h${i + 1}>${h}</h${i + 1}></div>`).join("\n      ")}
      <div><small>${NUMERALS[6]}</small><p>${c.chainEnd}</p></div>
    </div>
  </div>

  <div class="sw-row sw-sec">
    <p class="display-2 sw-num">03</p>
    <div class="sw-prog">
      ${c.programme.map((e) => `<div><small>${e.date}</small><h4>${e.title}</h4><small>${e.place}</small></div>`).join("\n      ")}
    </div>
  </div>

  <div class="sw-row sw-quote">
    <blockquote>
      <p class="display-2">${c.quote}</p>
      <small>${c.quoteSource}</small>
    </blockquote>
  </div>

  <div class="sw-row sw-foot">
    ${c.footer.map((f) => `<small>${f}</small>`).join("\n    ")}
  </div>
</div>
`;
  },
};
