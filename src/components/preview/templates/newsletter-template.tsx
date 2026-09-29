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
  .nl-item .ill { display: flex; align-items: center; justify-content: center; min-height: 180px; margin: 1.25rem 0; padding: 1.25rem; border-radius: 10px; background: var(--ill-surface); border: 1px solid var(--nl-line); }
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
  <div class="nl-pre"><small>Twelve links, three ideas, one recipe.</small><small>View in browser</small></div>
  <div class="nl-card">
    <div class="nl-head"><h6>The Sunday Dispatch</h6><small>Sep 28, 2026</small></div>
    <div class="nl-body">
      <div class="nl-issue"><p class="display-3">42</p><span class="eyebrow">Issue &middot; Slow tech</span></div>
      <h1>The case for boring software</h1>
      <p>Good morning. This week: why the tools that last are rarely the ones that shout, a small experiment with paper calendars, and the best pasta I have made all year.</p>

      <hr class="nl-rule" />

      <div class="nl-item">
        <span class="eyebrow">01 &middot; Essay</span>
        <h3>Why nobody writes about the tools that work</h3>
        <p>Ask a team what their best piece of software is and they will name something they stopped noticing years ago. That absence is the compliment, and it is nearly impossible to market.</p>
        <div class="ill" data-max-h="200px"></div>
        <p>I spent a month keeping a list of every tool I reached for without thinking. It was short, unglamorous, and older than I expected.</p>
        <div class="nl-btn"><small>Read the essay</small></div>
      </div>

      <hr class="nl-rule" />

      <div class="nl-item">
        <span class="eyebrow">02 &middot; Idea</span>
        <h3>Try a paper calendar for a week</h3>
        <blockquote>
          <p><em>&ldquo;The fastest interface is the one that has no loading state.&rdquo;</em></p>
          <small>Reader Malik R., replying to issue 39</small>
        </blockquote>
        <h4 style="margin: 1.5rem 0 0.5rem;">How it went</h4>
        <p>Five days in, I stopped checking my phone before meetings. Seven days in, I missed the reminders. Net result: keep the paper, keep the reminders.</p>
      </div>

      <hr class="nl-rule" />

      <span class="eyebrow">03 &middot; Worth your time</span>
      <div class="nl-links" style="margin-top: 0.75rem;">
        <div><small>1</small><div><h5>A field guide to typefaces on old signs</h5><small>typesignage.example &middot; 6 min</small></div></div>
        <div><small>2</small><div><h5>What a compiler error taught me about kindness</h5><small>notes.example &middot; 9 min</small></div></div>
        <div><small>3</small><div><h5>The one-pot lemon pasta</h5><small>kitchen.example &middot; 4 min</small></div></div>
      </div>

      <div class="nl-sponsor">
        <span class="eyebrow">Sponsored</span>
        <h4>Ledgerly keeps your books quiet</h4>
        <p><small>Invoicing and reconciliation for one-person studios. Your first three months are free.</small></p>
        <h6 style="margin: 0;">Learn more &rarr;</h6>
      </div>
    </div>
    <div class="nl-foot">
      <small>You are receiving this because you signed up at sundaydispatch.example.</small>
      <small>Unsubscribe &middot; Preferences &middot; Forward to a friend</small>
    </div>
  </div>
</div>

${illustrationScript}
`,
};
