import { BookOpen } from "lucide-react";
import type { PreviewTemplate } from "./types";

// A two-page spread: the chapter opener on the left page, the chapter continuing on the right.
// Hyphenated body text with indents in place of paragraph spacing, as in a printed book. It is
// justified only where the line is long enough to take it; a short line is set ragged instead of
// being stretched. Margins follow the book convention: the gutter is the narrowest, then the head,
// the fore-edge and the foot, so the two text blocks sit together and slightly high on the spread.
export const bookTemplate: PreviewTemplate = {
  id: "book",
  name: "Book",
  icon: BookOpen,
  render: (copy) => {
    const c = copy.book;
    // The first five words open the chapter in small capitals
    const words = c.verso[0].split(" ");
    const lead = words.slice(0, 5).join(" ");
    const rest = words.slice(5).join(" ");
    return `
<style>
  .bk {
    --bk-rule: color-mix(in srgb, currentColor 16%, transparent);
    /* Page edges are drawn solid so overlapping layers don't add up */
    --bk-edge: color-mix(in srgb, currentColor 20%, var(--bg-color));
    /* The crease is a shadow, so it darkens on light and dark paper alike */
    --bk-crease: color-mix(in srgb, black 22%, transparent);
    --bk-crease-soft: color-mix(in srgb, black 7%, transparent);
    /* Margins are a share of the spread, within limits; read by the pages, which sit inside this container */
    --bk-in: clamp(1.75rem, 4.4cqi, 3.25rem);
    --bk-out: clamp(2.25rem, 6.2cqi, 4.75rem);
    --bk-top: clamp(2.5rem, 5cqi, 3.75rem);
    --bk-foot: clamp(3.75rem, 7.6cqi, 5.75rem);
    /* The container carries the body size, so its queries can count in ems of the text */
    container: bk / inline-size; font-size: var(--size-p);
    max-width: 1240px; margin: 0 auto; padding: 1rem 1rem 3rem;
  }
  .bk h1, .bk h2, .bk h3, .bk h4, .bk h5, .bk h6, .bk p { margin: 0; }
  .bk-spread { position: relative; isolation: isolate; background: var(--bg-color); display: grid; grid-template-columns: 1fr 1fr; border: 1px solid var(--bk-rule); box-shadow: 0 1.5rem 3rem -2rem color-mix(in srgb, black 45%, transparent); }
  /* The page block: a few leaves fanning out past each outer edge and along the foot.
     Each leaf is a paper-filled shadow over an edge-colored one a pixel larger. */
  .bk-spread::before, .bk-spread::after { content: ""; position: absolute; top: -1px; bottom: -1px; z-index: -1; background: var(--bg-color); }
  .bk-spread::before {
    left: -1px; right: 50%;
    box-shadow:
      -3px 2px 0 -1px var(--bg-color), -3px 2px 0 0 var(--bk-edge),
      -6px 4px 0 -1px var(--bg-color), -6px 4px 0 0 var(--bk-edge),
      -9px 6px 0 -1px var(--bg-color), -9px 6px 0 0 var(--bk-edge),
      -12px 8px 0 -1px var(--bg-color), -12px 8px 0 0 var(--bk-rule);
  }
  .bk-spread::after {
    left: 50%; right: -1px;
    box-shadow:
      3px 2px 0 -1px var(--bg-color), 3px 2px 0 0 var(--bk-edge),
      6px 4px 0 -1px var(--bg-color), 6px 4px 0 0 var(--bk-edge),
      9px 6px 0 -1px var(--bg-color), 9px 6px 0 0 var(--bk-edge),
      12px 8px 0 -1px var(--bg-color), 12px 8px 0 0 var(--bk-rule);
  }
  .bk-page { position: relative; display: flex; flex-direction: column; min-width: 0; padding: var(--bk-top) var(--bk-out) var(--bk-foot); }
  /* The gutter: each page curves into shadow at the spine, with a hairline where they meet.
     The shadow has faded out by the time the text starts. */
  .bk-verso { padding-right: var(--bk-in); background: linear-gradient(to left, var(--bk-crease), var(--bk-crease-soft) calc(var(--bk-in) * 0.35), transparent calc(var(--bk-in) * 1.1)); }
  .bk-recto { padding-left: var(--bk-in); background: linear-gradient(to right, var(--bk-crease), var(--bk-crease-soft) calc(var(--bk-in) * 0.35), transparent calc(var(--bk-in) * 1.1)); box-shadow: inset 1px 0 0 color-mix(in srgb, black 40%, transparent); }
  /* The text block measures itself in its own ems. Under 27 of them a justified line has too few
     word spaces to share the slack, and the gaps show; there the text is set ragged, and only
     long words are hyphenated, since a ragged edge has no need to fill the line. */
  .bk-text { container-type: inline-size; font-size: var(--size-p); }
  .bk-text p { hyphens: auto; hyphenate-limit-chars: 8 3 4; }
  .bk-text p + p { text-indent: 1.25em; }
  @container (min-width: 27em) {
    .bk-text p { text-align: justify; hyphenate-limit-chars: 5 3 3; text-wrap: pretty; }
  }

  .bk-opener { display: flex; flex-direction: column; align-items: center; gap: 0.9rem; padding: 3.5rem 0 2.5rem; text-align: center; }
  .bk-opener h2 { max-width: 14em; text-wrap: balance; }
  /* At big scales titles keep whole words and clip at a line limit */
  .bk .bk-opener h2 { overflow-wrap: normal; overflow-x: clip; clip-path: inset(-0.5em -0.5em -0.35em); max-height: 4lh; }
  .bk-orn { width: 2.5rem; height: 1px; background: currentColor; opacity: 0.5; margin-top: 0.4rem; }
  .bk-by { letter-spacing: 0.14em; text-transform: uppercase; }
  .bk-epi { align-self: flex-end; max-width: 72%; margin-bottom: 2rem; text-align: right; opacity: 0.8; }
  .bk-epi small { display: block; }
  .bk-epi small + small { margin-top: 0.35rem; letter-spacing: 0.06em; }

  /* Drop cap in the heading face, three lines deep; the opening words in small capitals */
  .bk-first::first-letter { initial-letter: 3; font-family: var(--font-heading); font-weight: var(--weight-heading); color: var(--tone-base); margin-right: calc(0.12em + var(--bk-nudge, 0px)); }
  .bk-lead { font-variant-caps: all-small-caps; letter-spacing: 0.05em; }

  .bk-head { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 2.25rem; }
  .bk-head small { letter-spacing: 0.14em; text-transform: uppercase; }
  .bk-head small:first-child { flex: 1; text-align: center; }
  /* The break takes exactly three lines, so the text after it stays on the same line grid */
  .bk-break { padding: 1lh 0; text-align: center; letter-spacing: 0.4em; opacity: 0.7; }
  /* The folio stands in the foot margin, so both text blocks end at the same height */
  .bk-folio { position: absolute; right: var(--bk-in); bottom: calc(var(--bk-foot) * 0.38); left: var(--bk-out); display: flex; justify-content: center; font-variant-numeric: oldstyle-nums tabular-nums; }

  /* Too narrow for two readable pages: one page after the other, as a single sheet */
  @container bk (max-width: 52em) {
    .bk-spread { grid-template-columns: minmax(0, 1fr); max-width: 38em; margin: 0 auto; border: none; box-shadow: none; }
    .bk-spread::before, .bk-spread::after { display: none; }
    .bk-page, .bk-verso, .bk-recto { padding: var(--bk-top) max(1.25rem, 7cqi) var(--bk-foot); background: none; box-shadow: none; }
    .bk-recto { border-top: 1px solid var(--bk-rule); }
    .bk-folio { right: 0; left: 0; }
    .bk-opener { padding-top: 1.5rem; }
    .bk-epi { max-width: 90%; }
  }
  @media (max-width: 800px) {
    .bk { padding: 0.5rem 0 2rem; }
  }
</style>

<div class="bk" lang="en" data-desk>
  <div class="bk-spread">
    <article class="bk-page bk-verso">
      <header class="bk-opener">
        <span class="eyebrow">Chapter ${c.chapter}</span>
        <h2>${c.chapterTitle}</h2>
        <span class="bk-orn"></span>
        <small class="bk-by">${c.author}</small>
      </header>
      <div class="bk-epi">
        <small>${c.epigraph}</small>
        <small>&mdash; ${c.epigraphSource}</small>
      </div>
      <div class="bk-text">
        <p class="bk-first"><span class="bk-lead">${lead}</span> ${rest}</p>
        <p>${c.verso[1]}</p>
      </div>
      <div class="bk-folio"><small>${c.folios[0]}</small></div>
    </article>

    <article class="bk-page bk-recto">
      <div class="bk-head"><small>${c.title}</small><small>${c.folios[1]}</small></div>
      <div class="bk-text">
        ${c.recto.map((p) => `<p>${p}</p>`).join("\n        ")}
      </div>
      <p class="bk-break">* * *</p>
      <div class="bk-text">
        <p>${c.afterBreak}</p>
      </div>
    </article>
  </div>
</div>

<script>
// Chrome sizes an initial-letter with whatever font is loaded at first layout and doesn't redo
// it when the web font arrives or the preview swaps faces. Only a real change to the drop cap's
// style makes it, so each nudge moves it by a new, invisible fraction of a pixel.
(function() {
  function nudge() {
    window.__bkNudge = ((window.__bkNudge || 0) + 1) % 50;
    document.querySelectorAll('.bk-first').forEach(function(p) {
      p.style.setProperty('--bk-nudge', window.__bkNudge * 0.01 + 'px');
    });
  }
  if (window.__bkObserver) window.__bkObserver.disconnect();
  var styles = document.getElementById('typestack-styles');
  if (styles) {
    window.__bkObserver = new MutationObserver(function() { document.fonts.ready.then(nudge); });
    window.__bkObserver.observe(styles, { childList: true, characterData: true, subtree: true });
  }
  if (!window.__bkBound) {
    window.__bkBound = true;
    document.fonts.addEventListener('loadingdone', function() { requestAnimationFrame(nudge); });
  }
  document.fonts.ready.then(function() { requestAnimationFrame(nudge); });
})();
</script>
`;
  },
};
