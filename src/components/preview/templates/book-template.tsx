import { BookOpen } from "lucide-react";
import type { PreviewTemplate } from "./types";

// A two-page spread: the chapter opener on the left page, the chapter continuing on the right.
// Justified, hyphenated body text with indents in place of paragraph spacing, as in a printed book.
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
    max-width: 1240px; margin: 0 auto; padding: 1rem 1rem 3rem;
  }
  .bk h1, .bk h2, .bk h3, .bk h4, .bk h5, .bk h6, .bk p { margin: 0; }
  .bk-spread { position: relative; isolation: isolate; display: grid; grid-template-columns: 1fr 1fr; border: 1px solid var(--bk-rule); box-shadow: 0 1.5rem 3rem -2rem color-mix(in srgb, black 45%, transparent); }
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
  .bk-page { display: flex; flex-direction: column; padding: 3.5rem 4rem 2.5rem; }
  /* The gutter: each page curves into shadow at the spine, with a hairline where they meet */
  .bk-verso { padding-right: 4.5rem; background: linear-gradient(to left, var(--bk-crease), var(--bk-crease-soft) 1.25rem, transparent 4rem); }
  .bk-recto { padding-left: 4.5rem; background: linear-gradient(to right, var(--bk-crease), var(--bk-crease-soft) 1.25rem, transparent 4rem); box-shadow: inset 1px 0 0 color-mix(in srgb, black 40%, transparent); }
  .bk-text p { text-align: justify; hyphens: auto; text-wrap: pretty; }
  .bk-text p + p { text-indent: 1.5em; }

  .bk-opener { display: flex; flex-direction: column; align-items: center; gap: 0.9rem; padding: 4.5rem 0 2.5rem; text-align: center; }
  .bk-opener h2 { max-width: 14em; text-wrap: balance; }
  /* At big scales titles keep whole words and clip at a line limit */
  .bk .bk-opener h2 { overflow-wrap: normal; overflow: hidden; max-height: 4lh; }
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
  .bk-break { text-align: center; padding: 1.1rem 0 1rem; letter-spacing: 0.4em; opacity: 0.7; }
  .bk-folio { display: flex; justify-content: center; padding-top: 2.5rem; margin-top: auto; font-variant-numeric: oldstyle-nums tabular-nums; }

  @media (max-width: 800px) {
    .bk { padding: 0.5rem 0 2rem; }
    .bk-spread { grid-template-columns: 1fr; border: none; box-shadow: none; }
    .bk-spread::before, .bk-spread::after { display: none; }
    .bk-page, .bk-verso, .bk-recto { padding: 2rem 1.25rem; background: none; box-shadow: none; }
    .bk-recto { border-top: 1px solid var(--bk-rule); }
    .bk-opener { padding-top: 2rem; }
    .bk-epi { max-width: 90%; }
  }
</style>

<div class="bk" lang="en">
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
