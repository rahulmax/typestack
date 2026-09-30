import { Mail } from "lucide-react";
import type { PreviewTemplate } from "./types";
import { illustrationScript } from "./illustration-script";

export const newsletterTemplate: PreviewTemplate = {
  id: "newsletter",
  name: "Newsletter",
  icon: Mail,
  html: `
<style>
  .nl { --nl-line: color-mix(in srgb, currentColor 16%, transparent); --nl-tint: color-mix(in srgb, currentColor 5%, transparent); max-width: 640px; margin: 0 auto; padding: 0.5rem 0 2rem; }
  .nl-pre { display: flex; justify-content: space-between; gap: 1rem; padding: 0.5rem 0.25rem 1rem; opacity: 0.7; }
  .nl-card { border: 1px solid var(--nl-line); border-radius: 14px; background: color-mix(in srgb, currentColor 3%, transparent); overflow: hidden; }
  .nl-head { display: flex; justify-content: space-between; align-items: center; padding: 1.25rem 2rem; border-bottom: 1px solid var(--nl-line); }
  .nl-head h6 { margin: 0; }
  .nl-body { padding: 2.25rem 2rem; }
  .nl-issue { display: flex; align-items: baseline; gap: 1rem; margin-bottom: 1rem; }
  .nl-issue p { margin: 0; }
  .nl-body h1 { margin: 0 0 1rem; }
  .nl-body > p { margin: 0 0 1.1rem; }
  .nl-rule { border: none; border-top: 1px solid var(--nl-line); margin: 2rem 0; }
  .nl-item h3 { margin: 0.5rem 0 0.75rem; }
  .nl-item p { margin: 0 0 1rem; }
  .nl-item .ill { display: flex; align-items: center; justify-content: center; min-height: 180px; margin: 1.25rem 0; padding: 1.25rem; border-radius: 10px; background: var(--ill-surface); --ill-paper: var(--ill-surface); border: 1px solid var(--nl-line); }
  .nl-btn { display: inline-block; padding: 0.7em 1.6em; border-radius: 8px; background: currentColor; cursor: pointer; }
  .nl-btn small { color: var(--bg-color, #fff); font-weight: 600; }
  .nl-body blockquote { margin: 1.5rem 0; padding: 0.25rem 0 0.25rem 1.25rem; border-left: 3px solid currentColor; }
  .nl-body blockquote p { margin: 0 0 0.5rem; }
  .nl-links > div { display: grid; grid-template-columns: 1.5rem 1fr; gap: 0.75rem; padding: 0.85rem 0; border-top: 1px solid var(--nl-line); }
  .nl-links h5 { margin: 0 0 0.15rem; }
  .nl-sponsor { margin-top: 2rem; padding: 1.25rem 1.4rem; border: 1px dashed var(--nl-line); border-radius: 10px; }
  .nl-sponsor h4 { margin: 0.4rem 0 0.4rem; }
  .nl-sponsor p { margin: 0 0 0.75rem; }
  .nl-foot { padding: 1.5rem 2rem; border-top: 1px solid var(--nl-line); text-align: center; background: var(--nl-tint); }
  .nl-foot small { display: block; margin: 0.2rem 0; opacity: 0.75; }

  @media (max-width: 600px) {
    .nl-head, .nl-body, .nl-foot { padding-left: 1.25rem; padding-right: 1.25rem; }
    .nl-body { padding-top: 1.75rem; padding-bottom: 1.75rem; }
  }
  @media (max-width: 480px) {
    .nl-pre { flex-direction: column; gap: 0.25rem; }
    .nl-head, .nl-body, .nl-foot { padding-left: 1rem; padding-right: 1rem; }
  }
</style>

<div class="nl">
  <div class="nl-pre"><small>Twelve entries, three doctrines, one apology.</small><small>Attend in person</small></div>
  <div class="nl-card">
    <div class="nl-head"><h6>The Concordance Bulletin</h6><small>the ebb of Thaw</small></div>
    <div class="nl-body">
      <div class="nl-issue"><p class="display-3">42</p><span class="eyebrow">Issue &middot; The unlit rooms</span></div>
      <h1>The case for arriving late to your own audience</h1>
      <p>Good tide. This issue: why the Provost declines to sit in lit rooms, a small experiment with the Third Sea-Wall, and the finest recantation composed in Veyl this year.</p>

      <hr class="nl-rule" />

      <div class="nl-item">
        <span class="eyebrow">01 &middot; Essay</span>
        <h3>Why nobody enters the rooms that work</h3>
        <p>Ask an adept which room served her best and she will name one she has never entered. That refusal is the compliment, and it is nearly impossible to record.</p>
        <div class="ill" data-max-h="200px"></div>
        <p>I spent a tide compiling every room I reached for without arriving. The list was short, dim, and older than the building.</p>
        <div class="nl-btn"><small>Enter the essay</small></div>
      </div>

      <hr class="nl-rule" />

      <div class="nl-item">
        <span class="eyebrow">02 &middot; Doctrine</span>
        <h3>Attend a tide before it has risen</h3>
        <blockquote>
          <p><em>&ldquo;The swiftest witness is the one who has not yet been summoned.&rdquo;</em></p>
          <small>Petitioner Malik R., replying to issue 39</small>
        </blockquote>
        <h4 style="margin: 1.5rem 0 0.5rem;">How it proceeded</h4>
        <p>On the fifth day I stopped expecting the water. On the seventh I missed its absence. Conclusion: keep the wall, decline the water, and file the interval.</p>
      </div>

      <hr class="nl-rule" />

      <span class="eyebrow">03 &middot; Worth the interval</span>
      <div class="nl-links" style="margin-top: 0.75rem;">
        <div><small>1</small><div><h5>A field guide to the tenses of the Annex</h5><small>annex.veyl &middot; 6 tides</small></div></div>
        <div><small>2</small><div><h5>What an unpaid debt taught me about hospitality</h5><small>marginalia.veyl &middot; 9 tides</small></div></div>
        <div><small>3</small><div><h5>The one-wall recantation</h5><small>provostry.veyl &middot; 4 tides</small></div></div>
      </div>

      <div class="nl-sponsor">
        <span class="eyebrow">Endowed by</span>
        <h4>The Lantern Office keeps your rooms quiet</h4>
        <p><small>Unlighting and reconciliation for solitary adepts. Your first three tides are already behind you.</small></p>
        <h6 style="margin: 0;">Inquire &rarr;</h6>
      </div>
    </div>
    <div class="nl-foot">
      <small>You receive this because you petitioned the Concordance before it was founded.</small>
      <small>Withdraw &middot; Amend the oath &middot; Forward to a future adept</small>
    </div>
  </div>
</div>

${illustrationScript}
`,
};
