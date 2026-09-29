import { Feather } from "lucide-react";
import type { PreviewTemplate } from "./types";
import { illustrationScript } from "./illustration-script";

export const magazineTemplate: PreviewTemplate = {
  id: "magazine",
  name: "Magazine",
  icon: Feather,
  html: `
<style>
  .mg { --mg-line: color-mix(in srgb, currentColor 28%, transparent); max-width: 1080px; margin: 0 auto; padding: 0 1.75rem 4rem; }
  .mg hr { border: none; border-top: 1px solid var(--mg-line); margin: 0; }
  .mg-strap { display: flex; justify-content: space-between; gap: 1rem; padding: 1.25rem 0 0.9rem; }
  .mg-strap small { text-transform: uppercase; letter-spacing: 0.16em; }
  .mg-name { text-align: center; margin: 0; padding: 1.75rem 0 1.5rem; text-transform: uppercase; letter-spacing: 0.2em; overflow-wrap: normal; }
  .mg-nav { display: flex; justify-content: center; gap: 2.5rem; padding: 0.9rem 0; }
  .mg-nav small { text-transform: uppercase; letter-spacing: 0.16em; }

  .mg-cover { display: grid; grid-template-columns: 170px 1fr; column-gap: 3rem; padding: 4.5rem 0 3rem; }
  .mg-credits { padding-top: 0.75rem; }
  .mg-credits .eyebrow { display: block; margin-bottom: 0.4rem; }
  .mg-credits p { margin: 0 0 1.4rem; }
  .mg-cover h1 { margin: 0 0 1.75rem; max-width: 12em; }
  .mg-dek { max-width: 30em; margin: 0; }
  .mg-plate { padding: 0 0 0.5rem; }
  .mg-plate .ill { display: flex; align-items: center; justify-content: center; min-height: 380px; padding: 2rem; background: var(--ill-surface); }
  .mg-cap { display: flex; justify-content: space-between; gap: 1.5rem; padding-top: 0.7rem; opacity: 0.75; }
  .mg-orn { text-align: center; padding: 3.5rem 0; letter-spacing: 1em; opacity: 0.7; }
  .mg-orn p { margin: 0; }

  .mg-toc { display: grid; grid-template-columns: 170px 1fr; column-gap: 3rem; padding-bottom: 1rem; }
  .mg-toc-list { display: grid; grid-template-columns: 1fr 1fr; column-gap: 3rem; }
  .mg-toc-row { display: grid; grid-template-columns: 2.5rem 1fr; gap: 0.5rem; padding: 1.1rem 0; border-top: 1px solid var(--mg-line); }
  .mg-toc-row h5 { margin: 0 0 0.3rem; }
  .mg-toc-row p { margin: 0; }

  .mg-story { display: grid; grid-template-columns: 170px minmax(0, 36em); column-gap: 3rem; padding-bottom: 1rem; }
  .mg-story .eyebrow { padding-top: 0.5rem; }
  .mg-body h2 { margin: 0 0 1.5rem; }
  .mg-body p { margin: 0 0 1.15rem; }
  .mg-body > p:first-of-type::first-letter { float: left; font-size: 5em; line-height: 0.8; font-weight: 400; padding: 0.08em 0.1em 0 0; }

  .mg-quote { padding: 1rem 0 0.5rem; text-align: center; }
  .mg-quote blockquote { max-width: 46rem; margin: 0 auto; }
  .mg-quote blockquote p { text-wrap: balance; }
  .mg-quote blockquote p { margin: 0 0 1.25rem; }
  .mg-quote small { text-transform: uppercase; letter-spacing: 0.16em; }

  .mg-asym { display: grid; grid-template-columns: 5fr 6fr; column-gap: 4rem; align-items: center; padding-bottom: 1rem; }
  .mg-asym .ill { display: flex; align-items: center; justify-content: center; min-height: 340px; padding: 1.5rem; background: var(--ill-surface); }
  .mg-asym .mg-cap { flex-direction: column; gap: 0.15rem; }
  .mg-asym h3 { margin: 0 0 1rem; }
  .mg-asym p { margin: 0 0 1.1rem; max-width: 26em; }

  .mg-spread { column-count: 2; column-gap: 3.5rem; column-rule: 1px solid var(--mg-line); padding: 0 0 1rem; }
  .mg-spread h3 { margin: 0 0 1rem; break-after: avoid; }
  .mg-spread h4 { margin: 1.75rem 0 0.75rem; break-after: avoid; }
  .mg-spread p { margin: 0 0 1.1rem; }

  .mg-end { display: grid; grid-template-columns: 170px 1fr; column-gap: 3rem; padding-top: 2rem; border-top: 1px solid var(--mg-line); }
  .mg-end-list { display: grid; grid-template-columns: repeat(3, 1fr); column-gap: 2rem; }
  .mg-end .eyebrow { display: block; margin-bottom: 0.4rem; }
  .mg-end h6 { margin: 0 0 0.3rem; }
  .mg-foot { display: flex; justify-content: space-between; gap: 1rem; flex-wrap: wrap; margin-top: 3.5rem; padding-top: 1rem; border-top: 1px solid var(--mg-line); opacity: 0.75; }
  .mg-foot small { text-transform: uppercase; letter-spacing: 0.16em; }

  @media (max-width: 800px) {
    .mg { padding: 0 1.25rem 3rem; }
    .mg-cover, .mg-toc, .mg-end { grid-template-columns: 1fr; padding-top: 3rem; }
    .mg-cover { padding-bottom: 2rem; }
    .mg-credits { display: flex; gap: 2rem; margin-bottom: 1.75rem; padding-top: 0; }
    .mg-credits p { margin-bottom: 0; }
    .mg-story { grid-template-columns: 1fr; }
    .mg-story .eyebrow { margin-bottom: 1rem; }
    .mg-asym { column-gap: 2rem; }
    .mg-spread { column-gap: 2rem; }
    .mg-toc-list { column-gap: 2rem; }
    .mg-toc > .eyebrow, .mg-end > .eyebrow { margin-bottom: 1rem; display: block; }
    .mg-nav { gap: 1.5rem; }
  }
  @media (max-width: 600px) {
    .mg-nav { gap: 1rem; flex-wrap: wrap; }
    .mg-name { letter-spacing: 0; padding: 1.25rem 0 1rem; }
    .mg-strap small:nth-child(2) { display: none; }
    .mg-toc-list, .mg-end-list { grid-template-columns: 1fr; }
    .mg-end-list > div { margin-bottom: 1.25rem; }
    .mg-asym { grid-template-columns: 1fr; row-gap: 1.75rem; }
    .mg-spread { column-count: 1; column-rule: none; }
    .mg-plate .ill { min-height: 220px; }
    .mg-asym .ill { min-height: 240px; }
    .mg-orn { padding: 2.25rem 0; }
    .mg-cap { flex-direction: column; gap: 0.15rem; }
  }
  @media (max-width: 480px) {
    .mg { padding: 0 0.75rem 2.5rem; }
    .mg-credits { flex-direction: column; gap: 0; }
    .mg-credits p { margin-bottom: 1rem; }
    .mg-foot { flex-direction: column; }
  }
</style>

<div class="mg">
  <div class="mg-strap"><small>Ebb Season</small><small>Issue No. 14</small><small>Veyl</small></div>
  <hr />
  <p class="display-3 mg-name">The Concordance Quarterly</p>
  <hr />
  <div class="mg-nav"><small>Testimonies</small><small>Almanacs</small><small>Cartography</small><small>The Annex</small></div>
  <hr />

  <header class="mg-cover">
    <div class="mg-credits">
      <div><span class="eyebrow">Words</span><p><small>Adept Ilse Varrow</small></p></div>
      <div><span class="eyebrow">Drawings</span><p><small>The Provost of Unlit Rooms</small></p></div>
      <div><span class="eyebrow">Cover story</span><p><small>Page 12</small></p></div>
    </div>
    <div>
      <h1 class="display-1">The Lamplighter of the Third Sea-Wall</h1>
      <p class="mg-dek"><em>She lights one lamp each evening for a tide that has not arrived, and by morning the tide has thanked her for it in advance.</em></p>
    </div>
  </header>

  <div class="mg-plate">
    <div class="ill" data-max-h="360px"></div>
    <div class="mg-cap"><small>Plate I. The lamp in the interval, as recorded before it was lit.</small><small>Inverse Almanac, folio 9</small></div>
  </div>

  <div class="mg-orn"><p>&#10086;</p></div>

  <section class="mg-toc">
    <span class="eyebrow">In this issue</span>
    <div class="mg-toc-list">
      <div class="mg-toc-row"><small>12</small><div><h5>The Lamplighter of the Third Sea-Wall</h5><p><small>A vigil kept for water that has yet to be owed.</small></p></div></div>
      <div class="mg-toc-row"><small>28</small><div><h5>Forty years among the unlit rooms</h5><p><small>A Provost recalls the audiences that concluded first.</small></p></div></div>
      <div class="mg-toc-row"><small>36</small><div><h5>An atlas of coasts that look back</h5><p><small>The Seventh Cartography, folded into its own shore.</small></p></div></div>
      <div class="mg-toc-row"><small>44</small><div><h5>Marginal correspondence</h5><p><small>Missives answered by their replies, with apology.</small></p></div></div>
    </div>
  </section>

  <div class="mg-orn"><p>&#10022;</p></div>

  <section class="mg-story">
    <span class="eyebrow">Cover story</span>
    <div class="mg-body">
      <h2>She arrives before the evening does</h2>
      <p>There is a woman on the Third Sea-Wall of Veyl who has lit the same lamp every dusk for thirty-one years, and who is quite certain she has never once lit it. The lamp, being consulted, agrees; it says only that it was already burning when she arrived, and that arriving is an activity she performs in the past tense.</p>
      <p>The Concordance records her as the Lamplighter, a title granted retroactively and revoked in advance. She keeps no ledger of her own. She keeps, instead, a small brass tin of the hours she has been lent, and returns them at the end of each season with a note of thanks that predates the loan.</p>
      <p>To visit her is to be expected. Adept Varrow, who made the crossing in the ebb of Thaw, reports that tea had already been poured, and that it was cold in a way that suggested it would be hot in an hour she had not yet reached.</p>
    </div>
  </section>

  <div class="mg-orn"><p>&#10086;</p></div>

  <div class="mg-quote">
    <blockquote>
      <p class="display-3"><em>&ldquo;A lamp is only a promise that the dark will be introduced.&rdquo;</em></p>
      <small>The Lamplighter, to the Provost</small>
    </blockquote>
  </div>

  <div class="mg-orn"><p>&#10022;</p></div>

  <section class="mg-asym">
    <figure>
      <div class="ill" data-max-h="300px"></div>
      <div class="mg-cap"><small>Plate II. The Third Sea-Wall at the hour it is not.</small><small>Drawn from memory, in advance</small></div>
    </figure>
    <div>
      <span class="eyebrow">The wall</span>
      <h3>A rampart against nothing in particular</h3>
      <p>The wall was raised to hold back a flood that no record supports, and it has done so with a diligence that embarrasses the sea. Its masons left a gap at the centre for the water to enter, out of courtesy, and the water has never presumed.</p>
      <p>Tidewardens are stationed at the gap in shifts of exactly no length, and are paid in the hours they subsequently forget.</p>
    </div>
  </section>

  <div class="mg-orn"><p>&#10086;</p></div>

  <section class="mg-spread">
    <h3>The arithmetic of a vigil</h3>
    <p>Counting the lamps she has not lit, the Lamplighter arrives at eleven thousand and forty-two, a figure the Concordance rounds down to the nearest impossible number. The remainder is carried forward into the next season, where it is spent on a dusk that has already elapsed.</p>
    <p>Nothing about the arrangement is considered irregular by the tidal grammarians. They regard the lamp as a footnote to the sea, and the sea as an appendix to the lamp, and the Lamplighter as the only reader who has ever finished either.</p>
    <h4>On being expected</h4>
    <p>To be expected is a form of tenure. The Lamplighter holds hers in perpetuity, and in perpetuity, she notes, there is no shortage of evenings.</p>
    <p>When asked whether she will ever cease, she answers that she has already stopped, and that this is why the lamp is still lit.</p>
  </section>

  <section class="mg-end">
    <span class="eyebrow">Contributors</span>
    <div class="mg-end-list">
      <div><h6>Adept Ilse Varrow</h6><p><small>Keeper of the Fourth Almanac, resident of the Annex.</small></p></div>
      <div><h6>The Provost of Unlit Rooms</h6><p><small>Draughtsman of the plates, by candle not yet lit.</small></p></div>
      <div><h6>Oriel Taskane</h6><p><small>Author of the ledger, in absentia and in perpetuity.</small></p></div>
    </div>
  </section>

  <div class="mg-foot"><small>&copy; The Concordance Quarterly</small><small>Issued in arrears from Veyl</small></div>
</div>

${illustrationScript}
`,
};
