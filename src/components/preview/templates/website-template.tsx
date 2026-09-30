import { Globe } from "lucide-react";
import type { PreviewTemplate } from "./types";
import { illustrationScript } from "./illustration-script";

const border = `1px solid color-mix(in srgb, currentColor 20%, transparent)`;
const borderLight = `1px solid color-mix(in srgb, currentColor 10%, transparent)`;

export const websiteTemplate: PreviewTemplate = {
  id: "website",
  name: "Website",
  icon: Globe,
  html: `
<style>
  /* Tablet */
  @media (max-width: 800px) {
    nav, section, footer {
      padding-left: 1.25rem !important;
      padding-right: 1.25rem !important;
    }
    #hero {
      grid-template-columns: 1fr 0.8fr !important;
      gap: 2rem !important;
      padding-top: 2.5rem !important;
      padding-bottom: 3rem !important;
    }
    #ill-hero {
      min-height: 200px !important;
    }
    #features-grid {
      grid-template-columns: repeat(2, 1fr) !important;
      gap: 1rem !important;
    }
    #split-1, #split-2 {
      gap: 2rem !important;
    }
    #stats-grid {
      grid-template-columns: repeat(4, 1fr) !important;
      gap: 1rem !important;
    }
    #hiw-grid {
      grid-template-columns: repeat(3, 1fr) !important;
      gap: 1.25rem !important;
    }
  }
  /* Small tablet / large phone */
  @media (max-width: 600px) {
    #hero {
      grid-template-columns: 1fr !important;
      padding-top: 2rem !important;
      padding-bottom: 2.5rem !important;
    }
    #ill-hero {
      min-height: 180px !important;
    }
    #split-1, #split-2 {
      grid-template-columns: 1fr !important;
      gap: 1.5rem !important;
    }
    #split-1 > :first-child {
      order: 2 !important;
    }
    #stats-grid {
      grid-template-columns: repeat(2, 1fr) !important;
    }
    #hiw-grid {
      grid-template-columns: 1fr !important;
    }
    footer > div:first-child {
      flex-direction: column !important;
      align-items: flex-start !important;
    }
  }
  /* Mobile */
  @media (max-width: 480px) {
    nav, section, footer {
      padding-left: 0.75rem !important;
      padding-right: 0.75rem !important;
    }
    #nav-links small:not(:last-child) {
      display: none !important;
    }
    #nav-links {
      gap: 0.75rem !important;
    }
    #ill-hero {
      min-height: 140px !important;
    }
    #features-grid {
      grid-template-columns: 1fr !important;
      gap: 1rem !important;
    }
    #stats-grid {
      grid-template-columns: 1fr !important;
      gap: 1.5rem !important;
    }
    #split-1, #split-2 {
      padding-bottom: 3rem !important;
    }
    #hiw-grid {
      gap: 1.5rem !important;
    }
    footer > div:last-child {
      flex-direction: column !important;
    }
  }
</style>

<!-- NAV -->
<nav style="max-width: 1024px; margin: 0 auto; padding: 1.25rem 1.5rem; display: flex; justify-content: space-between; align-items: center;">
  <h6 style="margin: 0;">Concordance</h6>
  <div id="nav-links" style="display: flex; gap: 2rem; align-items: center;">
    <small style="cursor: pointer;">Holdings</small>
    <small style="cursor: pointer;">Recitals</small>
    <small style="cursor: pointer;">Charter</small>
    <small style="display: inline-block; padding: 0.4em 1.1em; border: ${border}; border-radius: 6px; cursor: pointer;">Petition entry</small>
  </div>
</nav>

<!-- HERO -->
<section id="hero" style="max-width: 1024px; margin: 0 auto; padding: 4rem 1.5rem 5rem; display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: center;">
  <div>
    <span class="eyebrow" style="display: block; margin-bottom: 1rem;">Tidal grammarians of Veyl</span>
    <h1 style="margin: 0 0 1.25rem;">A catalogue of everything that has not yet occurred</h1>
    <p style="margin: 0 0 2rem; max-width: 440px;">The Hollow Concordance files each future event under the hour in which it will be forgotten, so that remembering may begin before the event is obliged to.</p>
    <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
      <div style="display: inline-block; padding: 0.65em 1.75em; background: currentColor; border-radius: 8px; cursor: pointer;">
        <small style="color: var(--bg-color, #fff); font-weight: 600;">Request a consultation</small>
      </div>
      <small>Payable in retrospect</small>
    </div>
  </div>
  <div class="ill" id="ill-hero" style="display: flex; align-items: center; justify-content: center; min-height: 320px;"></div>
</section>

<!-- LOGOS / TRUST BAR -->
<section style="max-width: 1024px; margin: 0 auto; padding: 0 1.5rem 4rem; text-align: center;">
  <span class="eyebrow">Cited in the marginalia of</span>
  <div style="display: flex; justify-content: center; gap: 3rem; margin-top: 1.25rem; flex-wrap: wrap;">
    <h6 style="margin: 0;">The Provostry</h6>
    <h6 style="margin: 0;">Tidewall Hall</h6>
    <h6 style="margin: 0;">Unlit Rooms</h6>
    <h6 style="margin: 0;">Sea-Wall III</h6>
    <h6 style="margin: 0;">The Annex</h6>
  </div>
</section>

<!-- FEATURES GRID -->
<section style="max-width: 1024px; margin: 0 auto; padding: 0 1.5rem 5rem;">
  <div style="text-align: center; margin-bottom: 3rem;">
    <h2 style="margin: 0 0 0.75rem;">Six services, none yet rendered</h2>
    <p style="max-width: 520px; margin: 0 auto;">Each is performed in the interval between two tides, which the Concordance holds to be annulled on alternate Thursdays.</p>
  </div>
  <div id="features-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem;">
    <div style="border: ${border}; border-radius: 12px; padding: 1.75rem;">
      <div style="width: 40px; height: 40px; border-radius: 10px; background: color-mix(in srgb, currentColor 8%, transparent); margin-bottom: 1rem; display: flex; align-items: center; justify-content: center;">
        <small style="font-weight: 700;">I</small>
      </div>
      <h4 style="margin: 0 0 0.5rem;">The Conditional Tide</h4>
      <p><small>Rises only for those who have already departed, and recedes on their arrival.</small></p>
    </div>
    <div style="border: ${border}; border-radius: 12px; padding: 1.75rem;">
      <div style="width: 40px; height: 40px; border-radius: 10px; background: color-mix(in srgb, currentColor 8%, transparent); margin-bottom: 1rem; display: flex; align-items: center; justify-content: center;">
        <small style="font-weight: 700;">41</small>
      </div>
      <h4 style="margin: 0 0 0.5rem;">Inverse Almanac</h4>
      <p><small>Forty-one entries recorded in the tense that precedes them, consulted before composition.</small></p>
    </div>
    <div style="border: ${border}; border-radius: 12px; padding: 1.75rem;">
      <div style="width: 40px; height: 40px; border-radius: 10px; background: color-mix(in srgb, currentColor 8%, transparent); margin-bottom: 1rem; display: flex; align-items: center; justify-content: center;">
        <small style="font-weight: 700;">{&nbsp;}</small>
      </div>
      <h4 style="margin: 0 0 0.5rem;">Seventh Cartography</h4>
      <p><small>Charts of coasts that resemble their own maps more closely than any coast could.</small></p>
    </div>
    <div style="border: ${border}; border-radius: 12px; padding: 1.75rem;">
      <div style="width: 40px; height: 40px; border-radius: 10px; background: color-mix(in srgb, currentColor 8%, transparent); margin-bottom: 1rem; display: flex; align-items: center; justify-content: center;">
        <small style="font-weight: 700;">VII</small>
      </div>
      <h4 style="margin: 0 0 0.5rem;">Ledger Recovery</h4>
      <p><small>Reconstruction of the missing accounts of Oriel Taskane from the debts they would have caused.</small></p>
    </div>
    <div style="border: ${border}; border-radius: 12px; padding: 1.75rem;">
      <div style="width: 40px; height: 40px; border-radius: 10px; background: color-mix(in srgb, currentColor 8%, transparent); margin-bottom: 1rem; display: flex; align-items: center; justify-content: center;">
        <small style="font-weight: 700;">XII</small>
      </div>
      <h4 style="margin: 0 0 0.5rem;">Unlit Audiences</h4>
      <p><small>Private hearings with the Provost, conducted in rooms that decline to be entered.</small></p>
    </div>
    <div style="border: ${border}; border-radius: 12px; padding: 1.75rem;">
      <div style="width: 40px; height: 40px; border-radius: 10px; background: color-mix(in srgb, currentColor 8%, transparent); margin-bottom: 1rem; display: flex; align-items: center; justify-content: center;">
        <small style="font-weight: 700;">&Oslash;</small>
      </div>
      <h4 style="margin: 0 0 0.5rem;">Marginal Correspondence</h4>
      <p><small>Missives answered by their own replies, filed beside the questions they resolve.</small></p>
    </div>
  </div>
</section>

<!-- SPLIT SECTION: ILLUSTRATION LEFT, TEXT RIGHT -->
<section id="split-1" style="max-width: 1024px; margin: 0 auto; padding: 0 1.5rem 5rem; display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: center;">
  <div>
    <div class="ill" id="ill-split-1" style="display: flex; align-items: center; justify-content: center; min-height: 240px; border: ${borderLight}; border-radius: 16px; padding: 2rem; background: var(--ill-surface); --ill-paper: var(--ill-surface);"></div>
    <small style="display: block; margin-top: 0.5rem; font-size: 0.65em; text-align: center;">Illustration by <a href="https://www.getillustrations.com" target="_blank" rel="noopener noreferrer" style="text-decoration: underline;">getillustrations.com</a></small>
  </div>
  <div>
    <span class="eyebrow" style="margin-bottom: 0.75rem; display: block;">Method</span>
    <h3 style="margin: 0 0 1rem;">Cataloguing the event before its occasion</h3>
    <p style="margin: 0 0 1.5rem;">Adepts consult the entry, then supply the event that entry presupposes. Where the two disagree, the entry prevails and the event is asked to reconsider its date.</p>
    <div style="display: flex; gap: 2rem;">
      <div>
        <h5 style="margin: 0;">Ebb</h5>
        <small>the second hour</small>
      </div>
      <div>
        <h5 style="margin: 0;">Flood</h5>
        <small>the unmarked hour</small>
      </div>
      <div>
        <h5 style="margin: 0;">Slack</h5>
        <small>the hour lent back</small>
      </div>
    </div>
  </div>
</section>

<!-- SPLIT SECTION: TEXT LEFT, ILLUSTRATION RIGHT -->
<section id="split-2" style="max-width: 1024px; margin: 0 auto; padding: 0 1.5rem 5rem; display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: center;">
  <div>
    <span class="eyebrow" style="margin-bottom: 0.75rem; display: block;">Cartography</span>
    <h3 style="margin: 0 0 1rem;">Coasts that survey their surveyors</h3>
    <p style="margin: 0 0 1.5rem;">The Seventh Cartography draws each shoreline from the memory of the water that will erase it. Surveyors are advised that the survey is, at every stage, already looking back.</p>
    <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
      <div style="padding: 0.5em 1em; border: ${border}; border-radius: 8px;">
        <small>Sea-Wall I</small>
      </div>
      <div style="padding: 0.5em 1em; border: ${border}; border-radius: 8px;">
        <small>Sea-Wall II</small>
      </div>
      <div style="padding: 0.5em 1em; border: ${border}; border-radius: 8px;">
        <small>Sea-Wall III</small>
      </div>
    </div>
  </div>
  <div>
    <div class="ill" id="ill-split-2" style="display: flex; align-items: center; justify-content: center; min-height: 240px; border: ${borderLight}; border-radius: 16px; padding: 2rem; background: var(--ill-surface); --ill-paper: var(--ill-surface);"></div>
    <small style="display: block; margin-top: 0.5rem; font-size: 0.65em; text-align: center;">Illustration by <a href="https://www.getillustrations.com" target="_blank" rel="noopener noreferrer" style="text-decoration: underline;">getillustrations.com</a></small>
  </div>
</section>

<!-- STATS ROW -->
<section style="max-width: 1024px; margin: 0 auto; padding: 3rem 1.5rem 4rem; border-top: ${borderLight}; border-bottom: ${borderLight};">
  <div id="stats-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 2rem; text-align: center;">
    <div>
      <h2 style="margin: 0 0 0.25rem;">41</h2>
      <small>Entries Unmade</small>
    </div>
    <div>
      <h2 style="margin: 0 0 0.25rem;">1,207</h2>
      <small>Tides Annulled</small>
    </div>
    <div>
      <h2 style="margin: 0 0 0.25rem;">7</h2>
      <small>Rooms Unlit</small>
    </div>
    <div>
      <h2 style="margin: 0 0 0.25rem;">&minus;3</h2>
      <small>Hours Owed</small>
    </div>
  </div>
</section>

<!-- TESTIMONIAL -->
<section style="max-width: 700px; margin: 0 auto; padding: 5rem 1.5rem;">
  <blockquote style="border-left: 3px solid currentColor; padding-left: 1.75rem; margin: 0;">
    <p style="margin: 0 0 1.25rem;"><em>"I consulted the Concordance before I had a question, and it returned an answer so exact that I was obliged to invent the question afterward. The invoice arrived a season earlier than my need for it."</em></p>
    <div>
      <p style="margin: 0; font-weight: 600;">Adept Ilse Varrow</p>
      <small>Keeper of the Fourth Almanac</small>
    </div>
  </blockquote>
</section>

<!-- HOW IT WORKS -->
<section style="max-width: 1024px; margin: 0 auto; padding: 0 1.5rem 5rem;">
  <div style="text-align: center; margin-bottom: 3rem;">
    <h2 style="margin: 0 0 0.75rem;">How a consultation proceeds</h2>
    <p style="max-width: 460px; margin: 0 auto;">Three movements, taken in the order they were forgotten.</p>
  </div>
  <div id="hiw-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem;">
    <div style="text-align: center; padding: 0 1rem;">
      <div style="width: 48px; height: 48px; border-radius: 50%; border: ${border}; margin: 0 auto 1.25rem; display: flex; align-items: center; justify-content: center;">
        <h5 style="margin: 0;">1</h5>
      </div>
      <h4 style="margin: 0 0 0.5rem;">Present the absence</h4>
      <p><small>Name what you lack, and the Concordance will name what lacked you first.</small></p>
    </div>
    <div style="text-align: center; padding: 0 1rem;">
      <div style="width: 48px; height: 48px; border-radius: 50%; border: ${border}; margin: 0 auto 1.25rem; display: flex; align-items: center; justify-content: center;">
        <h5 style="margin: 0;">2</h5>
      </div>
      <h4 style="margin: 0 0 0.5rem;">Receive the precedent</h4>
      <p><small>An adept supplies the entry that your circumstance would have required, dated before its cause.</small></p>
    </div>
    <div style="text-align: center; padding: 0 1rem;">
      <div style="width: 48px; height: 48px; border-radius: 50%; border: ${border}; margin: 0 auto 1.25rem; display: flex; align-items: center; justify-content: center;">
        <h5 style="margin: 0;">3</h5>
      </div>
      <h4 style="margin: 0 0 0.5rem;">Settle the interval</h4>
      <p><small>Discharge the debt to a creditor not yet born, in tender that has not yet been minted.</small></p>
    </div>
  </div>
</section>

<!-- CTA -->
<section style="max-width: 1024px; margin: 0 auto; padding: 4rem 1.5rem; text-align: center; border-top: ${borderLight};">
  <h3 style="margin: 0 0 1rem;">Ready to be already consulted?</h3>
  <p style="max-width: 480px; margin: 0 auto 2rem;">Join the eleven hundred petitioners whose questions were answered before the Concordance was founded.</p>
  <div style="display: inline-block; padding: 0.7em 2.5em; background: currentColor; border-radius: 8px; cursor: pointer;">
    <small style="color: var(--bg-color, #fff); font-weight: 600;">Enter the ledger</small>
  </div>
</section>

<!-- FOOTER -->
<footer style="max-width: 1024px; margin: 0 auto; padding: 3rem 1.5rem 2rem; border-top: ${borderLight};">
  <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
    <div style="display: flex; align-items: center; gap: 2rem;">
      <h6 style="margin: 0;">Concordance</h6>
      <small>Everything, in advance.</small>
    </div>
    <div style="display: flex; gap: 1.5rem;">
      <small>Holdings</small>
      <small>Recitals</small>
      <small>Charter</small>
      <small>Annex</small>
    </div>
  </div>
  <div style="margin-top: 2rem; padding-top: 1.5rem; border-top: ${borderLight}; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem;">
    <small>Hollow Concordance, Veyl. All rights deferred.</small>
    <div style="display: flex; gap: 1.5rem;">
      <small>Oaths</small>
      <small>Erasures</small>
    </div>
  </div>
</footer>

${illustrationScript}
`,
};
