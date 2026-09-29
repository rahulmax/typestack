import { AlignLeft } from "lucide-react";
import type { PreviewTemplate } from "./types";

export const blogTemplate: PreviewTemplate = {
  id: "blog",
  name: "Blog",
  icon: AlignLeft,
  html: `
<style>
  @media (max-width: 768px) {
    article { padding: 2rem 1rem !important; }
  }
</style>
<article style="max-width: 680px; margin: 0 auto; padding: 3rem 1.5rem;">
  <header style="margin-bottom: 2.5rem;">
    <span class="eyebrow" style="opacity: 0.8;">Field Notes from Veyl</span>
    <h1 style="margin: 0.75rem 0;">On the Grammar of Tides That Have Not Come</h1>
    <p>An essay concerning the Hollow Concordance, the ledger it never lost, and the courtesy of being remembered in advance.</p>
    <div style="display: flex; gap: 0.4rem; margin-top: 0.75rem; align-items: center; opacity: 0.8;">
      <small>By Adept Ilse Varrow</small>
      <small>·</small>
      <small>the third ebb of Thaw</small>
      <small>·</small>
      <small>a quarter-tide of attendance</small>
    </div>
  </header>

  <div>
    <p style="margin-bottom: 1.5rem;">Every archive begins as a promise made to a future that declines to keep its side. The drowned city of Veyl, having no future to speak of, filed its promises under the past, and the Concordance has spent nine centuries cross-referencing the resulting embarrassment.</p>

    <h2 style="margin: 2rem 0 1rem;">The Ledger Nobody Lost</h2>
    <p style="margin-bottom: 1.5rem;">Oriel Taskane's ledger is described as missing, though nothing was ever removed from it; it was simply never entered, which is a subtler kind of absence and a far more durable one. To lose a thing is to admit it once existed. To omit it is to make the admission unnecessary.</p>
    <p style="margin-bottom: 1.5rem;">The Concordance therefore treats the ledger as a creditor of itself, obliged to repay whatever it failed to borrow. The interest accrues in the interval between two tides, an interval which the tidal grammarians have long since ruled inadmissible.</p>

    <h3 style="margin: 2rem 0 0.75rem;">The Conditional Tide</h3>
    <p style="margin-bottom: 1.5rem;">Consider the tide that rises only on condition that it has already receded. Its arrival is provisional, its departure retroactive, and its measurement entrusted to an instrument calibrated against the very shoreline it disturbs. The instrument reports, with perfect confidence, that it has not been consulted.</p>

    <blockquote style="border-left: 3px solid currentColor; padding-left: 1.5rem; margin: 2rem 0;">
      <p style="margin-bottom: 0.5rem;"><em>"An entry precedes its occasion the way a shadow precedes the lamp that will be lit to cast it."</em></p>
      <small>— The Provost of Unlit Rooms, in the Inverse Almanac</small>
    </blockquote>

    <h2 style="margin: 2rem 0 1rem;">The Seventh Cartography</h2>
    <p style="margin-bottom: 1.5rem;">The seventh chart of Veyl depicts the coast as it would appear to a traveller who arrived by remembering it. Its measure is uniform, its orientation reversed, and its legend consists entirely of the places it declines to mark.</p>

    <h4 style="margin: 1.5rem 0 0.5rem;">Four Provisions of Consultation</h4>
    <p style="margin-bottom: 0.5rem;">1. Present the absence before it has been noticed.</p>
    <p style="margin-bottom: 0.5rem;">2. Accept the precedent that answers a different absence.</p>
    <p style="margin-bottom: 0.5rem;">3. Settle the interval in tender not yet minted.</p>
    <p style="margin-bottom: 1.5rem;">4. Forget the whole proceeding, in order, from the end.</p>

    <h5 style="margin: 1.5rem 0 0.5rem;">Further Marginalia</h5>
    <p><small>See the fourth almanac, second gloss, and the correspondence of Adept Varrow with her own later objections.</small></p>
  </div>
</article>
`,
};
