import { BookOpen } from "lucide-react";
import type { PreviewTemplate } from "./types";

export const docsTemplate: PreviewTemplate = {
  id: "docs",
  name: "Docs",
  icon: BookOpen,
  html: `
<style>
  .dx { --dx-line: color-mix(in srgb, currentColor 14%, transparent); --dx-tint: color-mix(in srgb, currentColor 5%, transparent); max-width: 1180px; margin: 0 auto; }
  .dx-top { display: flex; align-items: center; gap: 1.5rem; padding: 0.9rem 1.25rem; border-bottom: 1px solid var(--dx-line); }
  .dx-top h6 { margin: 0; }
  .dx-search { flex: 1; max-width: 320px; margin-left: auto; padding: 0.45em 0.9em; border: 1px solid var(--dx-line); border-radius: 8px; background: var(--dx-tint); display: flex; justify-content: space-between; opacity: 0.85; }
  .dx-pill { padding: 0.15em 0.6em; border-radius: 999px; border: 1px solid var(--dx-line); }
  .dx-grid { display: grid; grid-template-columns: 220px minmax(0, 1fr) 190px; gap: 2.5rem; padding: 0 1.25rem; }
  .dx-nav { padding: 1.75rem 0; border-right: 1px solid var(--dx-line); padding-right: 1.25rem; }
  .dx-nav .eyebrow { display: block; margin: 1.25rem 0 0.5rem; }
  .dx-nav .eyebrow:first-child { margin-top: 0; }
  .dx-nav small { display: block; padding: 0.35em 0.7em; margin-left: -0.7em; border-radius: 6px; opacity: 0.8; }
  .dx-nav small[data-on] { background: color-mix(in srgb, currentColor 10%, transparent); opacity: 1; font-weight: 600; }
  .dx-main { padding: 2rem 0 3rem; min-width: 0; }
  .dx-main > p { margin: 0 0 1.1rem; }
  .dx-crumbs { display: flex; gap: 0.5rem; margin-bottom: 1rem; opacity: 0.7; flex-wrap: wrap; }
  .dx-main h1 { margin: 0 0 1rem; }
  .dx-lead { margin-bottom: 1.5rem !important; opacity: 0.85; }
  .dx-main h2 { margin: 2.5rem 0 0.75rem; padding-bottom: 0.4rem; border-bottom: 1px solid var(--dx-line); }
  .dx-main h3 { margin: 1.75rem 0 0.6rem; }
  .dx-main h4 { margin: 1.5rem 0 0.5rem; }
  .dx-main h5 { margin: 1.25rem 0 0.4rem; }
  .dx-main h6 { margin: 1rem 0 0.35rem; opacity: 0.8; }
  .dx-callout { display: flex; gap: 0.85rem; margin: 1.25rem 0; padding: 1rem 1.15rem; border: 1px solid var(--dx-line); border-left: 3px solid currentColor; border-radius: 8px; background: var(--dx-tint); }
  .dx-callout > b { flex-shrink: 0; width: 1.5rem; height: 1.5rem; border-radius: 50%; border: 1.5px solid currentColor; display: flex; align-items: center; justify-content: center; }
  .dx-callout h6 { margin: 0 0 0.2rem !important; opacity: 1 !important; }
  .dx-callout p { margin: 0; }
  .dx-code { margin: 1.25rem 0; border: 1px solid var(--dx-line); border-radius: 8px; overflow: hidden; }
  .dx-code-bar { display: flex; justify-content: space-between; padding: 0.4rem 0.9rem; border-bottom: 1px solid var(--dx-line); background: var(--dx-tint); opacity: 0.85; }
  .dx-code pre { margin: 0; padding: 0.9rem 1rem; overflow-x: auto; background: color-mix(in srgb, currentColor 3%, transparent); }
  .dx-code small, .dx-mono { font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace; white-space: pre; display: block; line-height: 1.7; }
  .dx-mono { display: inline; padding: 0.1em 0.4em; border-radius: 4px; background: color-mix(in srgb, currentColor 9%, transparent); white-space: normal; }
  .dx-tablewrap { margin: 1.25rem 0; border: 1px solid var(--dx-line); border-radius: 8px; overflow-x: auto; }
  .dx-table { width: 100%; border-collapse: collapse; }
  .dx-table th, .dx-table td { padding: 0.65rem 0.9rem; text-align: left; vertical-align: top; border-bottom: 1px solid var(--dx-line); }
  .dx-table th { background: var(--dx-tint); }
  .dx-table tr:last-child td { border-bottom: none; }
  .dx-steps { margin: 1rem 0; display: grid; gap: 1rem; }
  .dx-step { display: grid; grid-template-columns: 2rem 1fr; gap: 0.9rem; }
  .dx-step > b { width: 2rem; height: 2rem; border-radius: 50%; border: 1px solid var(--dx-line); background: var(--dx-tint); display: flex; align-items: center; justify-content: center; }
  .dx-step h5 { margin: 0.2rem 0 0.25rem !important; }
  .dx-step p { margin: 0; }
  .dx-pager { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 3rem; }
  .dx-pager > div { border: 1px solid var(--dx-line); border-radius: 8px; padding: 0.9rem 1.1rem; }
  .dx-pager > div:last-child { text-align: right; }
  .dx-toc { padding: 2rem 0; position: relative; }
  .dx-toc .eyebrow { display: block; margin-bottom: 0.75rem; }
  .dx-toc small { display: block; padding: 0.3em 0 0.3em 0.8rem; border-left: 1px solid var(--dx-line); opacity: 0.7; }
  .dx-toc small[data-on] { border-left: 2px solid currentColor; opacity: 1; font-weight: 600; }
  .dx-toc small.sub { padding-left: 1.6rem; }

  @media (max-width: 900px) {
    .dx-grid { grid-template-columns: 190px minmax(0, 1fr); gap: 1.75rem; }
    .dx-toc { display: none; }
  }
  @media (max-width: 600px) {
    .dx-top { gap: 0.75rem; padding: 0.75rem; }
    .dx-search { display: none; }
    .dx-top .dx-pill { margin-left: auto; }
    .dx-grid { grid-template-columns: 1fr; gap: 0; padding: 0 0.75rem; }
    .dx-nav { display: flex; gap: 0.25rem 1rem; flex-wrap: wrap; padding: 0.9rem 0; border-right: none; border-bottom: 1px solid var(--dx-line); }
    .dx-nav .eyebrow { display: none; }
    .dx-nav small { margin-left: 0; padding: 0.25em 0.6em; }
    .dx-nav small:nth-of-type(n+5) { display: none; }
    .dx-main { padding-top: 1.5rem; }
    .dx-pager { grid-template-columns: 1fr; }
  }
</style>

<div class="dx">
  <div class="dx-top">
    <h6>Almanac</h6>
    <small>Rites</small><small>Instruments</small><small>Errata</small>
    <div class="dx-search"><small>Search the Annex</small><small>&#8984;K</small></div>
    <small class="dx-pill">Vol. 7.2</small>
  </div>

  <div class="dx-grid">
    <nav class="dx-nav">
      <span class="eyebrow">First consultations</span>
      <small>Preface</small>
      <small data-on>Calibration</small>
      <small>Before you arrive</small>
      <span class="eyebrow">Core doctrines</span>
      <small>The conditional tide</small>
      <small>Unlit rooms</small>
      <small>Retroactive oaths</small>
      <span class="eyebrow">Reference</span>
      <small>The Seven Charts</small>
      <small>The tidal console</small>
      <small>Ledger settings</small>
    </nav>

    <main class="dx-main">
      <div class="dx-crumbs"><small>Annex</small><small>/</small><small>First consultations</small><small>/</small><small>Calibration</small></div>
      <h1>Calibrating the Inverse Almanac</h1>
      <p class="dx-lead">Align the Almanac to a tide that has not yet occurred, register it with the Concordance, and consult a first entry before it has been composed.</p>

      <div class="dx-callout"><b><small>i</small></b><div><h6>Before you begin</h6><p>You need a Provost&rsquo;s seal of the seventh grade and one unlit room. A room already lit may be used if it consents.</p></div></div>

      <h2>Seat the instrument</h2>
      <p>The Almanac is delivered folded into its own past. Seat it on the lower sill so that the <span class="dx-mono"><small>ebb-gauge</small></span> faces the sea-wall that has not been built, and speak the registry oath aloud.</p>
      <div class="dx-code">
        <div class="dx-code-bar"><small>Tidal console</small><small>Repeat</small></div>
        <pre><small>concord seat --almanac inverse
concord oath --tense anterior</small></pre>
      </div>

      <h3>Enter the registry</h3>
      <p>Run the oath and wait beside the doorway. Your standing is entered in the ledger of Oriel Taskane, which will confirm it upon completion of the interval.</p>

      <h4>Using a proxy adept</h4>
      <p>When the Concordance cannot attend, dispatch an adept to be present on your behalf, and to forget it in the correct order.</p>
      <h5>Grades</h5>
      <p>Proxies are limited to the grade you have not yet been awarded.</p>
      <h6>Rotating proxies</h6>
      <p>Replace proxies every ninety tides, or at once should one recall the occasion.</p>

      <div class="dx-callout"><b><small>!</small></b><div><h6>Caution</h6><p>An oath is spoken once. Speak it twice and the second becomes the first, retroactively.</p></div></div>

      <h2>Almanac settings</h2>
      <p>Write an <span class="dx-mono"><small>almanac.toml</small></span> beside the sill to override the defaults of the current tide.</p>
      <div class="dx-tablewrap">
        <table class="dx-table">
          <thead><tr><th><small><b>Setting</b></small></th><th><small><b>Kind</b></small></th><th><small><b>Default</b></small></th><th><small><b>Effect</b></small></th></tr></thead>
          <tbody>
            <tr><td><small class="dx-mono">tide</small></td><td><small>ordinal</small></td><td><small>third</small></td><td><small>Which tide is consulted.</small></td></tr>
            <tr><td><small class="dx-mono">deferrals</small></td><td><small>integer</small></td><td><small>7</small></td><td><small>Times an entry may postpone itself.</small></td></tr>
            <tr><td><small class="dx-mono">recall</small></td><td><small>paradox</small></td><td><small>true</small></td><td><small>Remember only what has not happened.</small></td></tr>
          </tbody>
        </table>
      </div>

      <h2>Next rites</h2>
      <div class="dx-steps">
        <div class="dx-step"><b><small>1</small></b><div><h5>Open a ledger</h5><p>Run <span class="dx-mono"><small>concord open</small></span> in an unlit room.</p></div></div>
        <div class="dx-step"><b><small>2</small></b><div><h5>Consult</h5><p>Open the first entry, then compose it, and note the discrepancy.</p></div></div>
      </div>

      <div class="dx-pager">
        <div><small>Previous</small><h6 style="margin: 0.2rem 0 0;">Preface</h6></div>
        <div><small>Next</small><h6 style="margin: 0.2rem 0 0;">Before you arrive</h6></div>
      </div>
    </main>

    <aside class="dx-toc">
      <span class="eyebrow">On this leaf</span>
      <small data-on>Seat the instrument</small>
      <small class="sub">Enter the registry</small>
      <small class="sub">Using a proxy adept</small>
      <small>Almanac settings</small>
      <small>Next rites</small>
    </aside>
  </div>
</div>
`,
};
