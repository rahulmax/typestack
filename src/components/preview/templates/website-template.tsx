import { Globe } from "lucide-react";
import type { PreviewTemplate } from "./types";
import { illustrationScript } from "./illustration-script";

export const websiteTemplate: PreviewTemplate = {
  id: "website",
  name: "Website",
  icon: Globe,
  phoneRoom: 700,
  render: (copy) => {
    const c = copy.website;
    const credit = `<small class="ws-credit">Illustration by <a href="https://www.getillustrations.com" target="_blank" rel="noopener noreferrer">getillustrations.com</a></small>`;
    return `
<style>
  .ws { --ws-rule: color-mix(in srgb, currentColor 16%, transparent); --ws-tint: color-mix(in srgb, currentColor 5%, transparent); }
  .ws h1, .ws h2, .ws h3, .ws h4, .ws h5, .ws h6, .ws p { margin: 0; }
  .ws-wrap { max-width: 1120px; margin: 0 auto; padding-left: 1.5rem; padding-right: 1.5rem; }
  .ws-btn { display: inline-flex; align-items: center; gap: 0.6em; padding: 0.8em 1.6em; border-radius: 999px; background: currentColor; cursor: pointer; }
  .ws .ws-btn small { color: var(--bg-color); font-weight: 600; }
  .ws-link { display: inline-flex; align-items: center; gap: 0.5em; cursor: pointer; }
  .ws-link small { font-weight: 600; }
  .ws-arrow { display: inline-block; width: 0.9em; height: 1px; background: currentColor; position: relative; }
  .ws-arrow::after { content: ""; position: absolute; right: 0; top: -3px; width: 6px; height: 6px; border-top: 1px solid currentColor; border-right: 1px solid currentColor; transform: rotate(45deg); }

  /* Nav */
  .ws-nav { display: flex; justify-content: space-between; align-items: center; padding-top: 1.25rem; padding-bottom: 1.25rem; }
  .ws-nav-links { display: flex; align-items: center; gap: 2.25rem; }
  .ws-nav-links > small { cursor: pointer; }
  .ws-nav .ws-btn { padding: 0.55em 1.25em; }

  /* Hero */
  #hero { display: grid; grid-template-columns: 1.15fr 0.85fr; gap: 4rem; align-items: center; padding-top: 4.5rem; padding-bottom: 5rem; }
  .ws-eyebrow { display: inline-flex; align-items: center; gap: 0.6rem; margin-bottom: 1.5rem; }
  .ws-dot { width: 7px; height: 7px; border-radius: 50%; background: currentColor; flex-shrink: 0; }
  #hero h1 { margin-bottom: 1.5rem; text-wrap: balance; }
  #hero p { max-width: 34em; margin-bottom: 2.25rem; }
  .ws-actions { display: flex; align-items: center; gap: 1.75rem; flex-wrap: wrap; }
  .ws-plate { display: flex; align-items: center; justify-content: center; aspect-ratio: 1 / 1; border-radius: 28px; background: var(--ill-surface); --ill-paper: var(--ill-surface); padding: 2.5rem; }

  /* Trust */
  .ws-trust { display: flex; align-items: center; gap: 3rem; padding-top: 1.75rem; padding-bottom: 1.75rem; border-top: 1px solid var(--ws-rule); border-bottom: 1px solid var(--ws-rule); }
  .ws-trust .eyebrow { flex-shrink: 0; max-width: 14rem; }
  .ws-names { display: flex; flex: 1; gap: 0.75rem 2.5rem; flex-wrap: wrap; }

  /* Section heads: title left, lead right */
  .ws-head { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: end; margin-bottom: 3.5rem; }
  .ws-head h2 { text-wrap: balance; }
  .ws-head p { max-width: 30em; }
  .ws-section { padding-top: 7rem; }

  /* Features: a ruled table of six */
  .ws-features { display: grid; grid-template-columns: repeat(3, 1fr); }
  .ws-feature { display: flex; flex-direction: column; gap: 0.6rem; padding: 2rem 2rem 2.5rem; border-top: 1px solid var(--ws-rule); }
  .ws-feature:not(:nth-child(3n + 1)) { border-left: 1px solid var(--ws-rule); }
  .ws-feature:nth-child(3n + 1) { padding-left: 0; }
  .ws-mark { display: flex; align-items: center; justify-content: center; min-width: 3rem; height: 3rem; padding: 0 0.75rem; margin-bottom: 1.25rem; align-self: flex-start; border-radius: 999px; background: var(--ws-tint); }
  .ws-mark h5 { line-height: 1; }

  /* Splits */
  .ws-split { display: grid; grid-template-columns: 1fr 1fr; gap: 5rem; align-items: center; }
  .ws-split .ws-plate { aspect-ratio: 5 / 4; position: relative; }
  .ws-credit { position: absolute; right: 1.1rem; bottom: 0.8rem; font-size: 0.6em; opacity: 0.6; }
  .ws-copy { display: flex; flex-direction: column; gap: 1.25rem; }
  .ws-copy h3 { text-wrap: balance; }
  .ws-facts { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin-top: 1rem; }
  .ws-facts > div { padding-top: 1rem; border-top: 1px solid currentColor; }
  .ws-tags { display: flex; gap: 0.6rem; flex-wrap: wrap; margin-top: 0.5rem; }
  .ws-tags small { padding: 0.45em 1em; border: 1px solid var(--ws-rule); border-radius: 999px; }
  .ws-split + .ws-split { padding-top: 6rem; }

  /* Stats */
  .ws-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2rem; }
  .ws-stats > div { display: flex; flex-direction: column; gap: 0.75rem; padding-top: 1.25rem; border-top: 1px solid var(--ws-rule); }
  .ws .ws-stats .display-3 { line-height: 1; }

  /* Testimonial */
  .ws-quote { display: grid; grid-template-columns: 1fr 2.4fr; gap: 4rem; align-items: start; margin: 0; padding-top: 1.5rem; border-top: 1px solid currentColor; }
  .ws-quote h3 { text-wrap: pretty; text-indent: -0.4em; }
  .ws-person { display: flex; align-items: flex-start; gap: 1rem; padding-top: 0.4rem; }
  .ws-avatar { display: flex; align-items: center; justify-content: center; width: 3rem; height: 3rem; border-radius: 50%; background: var(--ws-tint); }
  .ws-person p { font-weight: 600; }

  /* Steps */
  .ws-steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2.5rem; }
  .ws-step { display: flex; flex-direction: column; gap: 0.6rem; }
  .ws-step-num { display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; }
  .ws-step-num::after { content: ""; flex: 1; height: 1px; background: var(--ws-rule); }

  /* Closing call to action: the page colours flipped */
  .ws-cta { display: grid; grid-template-columns: 1.3fr 1fr; gap: 3rem; align-items: end; padding: 4.5rem 4rem; border-radius: 28px; background: var(--fg-color); }
  .ws .ws-cta h2, .ws .ws-cta p, .ws .ws-cta small { color: var(--bg-color); }
  .ws-cta h2 { text-wrap: balance; }
  .ws-cta-side { display: flex; flex-direction: column; align-items: flex-start; gap: 1.75rem; }
  .ws-cta .ws-btn { background: var(--bg-color); }
  .ws .ws-cta .ws-btn small { color: var(--fg-color); }

  /* Footer */
  .ws-foot { padding-top: 5rem; padding-bottom: 2rem; }
  .ws-foot-top { display: flex; justify-content: space-between; align-items: flex-end; gap: 2rem; padding-bottom: 2.5rem; border-bottom: 1px solid var(--ws-rule); }
  .ws-foot-brand { display: flex; flex-direction: column; gap: 0.5rem; }
  .ws-foot-links { display: flex; gap: 2rem; }
  .ws-foot-legal { display: flex; justify-content: space-between; gap: 1rem; padding-top: 1.25rem; }
  .ws-foot-legal div { display: flex; gap: 1.5rem; }

  @media (max-width: 800px) {
    .ws-wrap { padding-left: 1.25rem; padding-right: 1.25rem; }
    .ws-nav-links > small { display: none; }
    #hero { grid-template-columns: 1fr; gap: 2.5rem; padding-top: 2.5rem; padding-bottom: 3rem; }
    .ws-plate { aspect-ratio: 4 / 3; padding: 1.5rem; }
    .ws-trust { flex-direction: column; align-items: flex-start; gap: 1rem; }
    .ws-names { justify-content: flex-start; gap: 0.75rem 1.5rem; }
    .ws-section { padding-top: 4.5rem; }
    .ws-head { grid-template-columns: 1fr; gap: 1rem; margin-bottom: 2rem; }
    .ws-features { grid-template-columns: 1fr; }
    .ws-feature, .ws-feature:nth-child(3n + 1) { padding: 1.5rem 0 1.75rem; border-left: none !important; }
    .ws-mark { margin-bottom: 0.5rem; }
    .ws-split { grid-template-columns: 1fr; gap: 2rem; }
    .ws-split + .ws-split { padding-top: 4rem; }
    .ws-split-flip > :first-child { order: 2; }
    .ws-stats { grid-template-columns: 1fr 1fr; gap: 1.5rem; }
    .ws-quote { grid-template-columns: 1fr; gap: 1.5rem; }
    .ws-quote h3 { order: -1; }
    .ws-steps { grid-template-columns: 1fr; gap: 2rem; }
    .ws-cta { grid-template-columns: 1fr; gap: 1.5rem; padding: 2.5rem 1.5rem; border-radius: 20px; }
    .ws-foot { padding-top: 3.5rem; }
    .ws-foot-top, .ws-foot-legal { flex-direction: column; align-items: flex-start; }
    .ws-foot-links { flex-wrap: wrap; gap: 0.75rem 1.5rem; }
  }
</style>

<div class="ws">
  <nav class="ws-wrap ws-nav">
    <h6>${c.brand}</h6>
    <div class="ws-nav-links">
      ${c.nav.map((n) => `<small>${n}</small>`).join("\n      ")}
      <span class="ws-btn"><small>${c.navCta}</small></span>
    </div>
  </nav>

  <section id="hero" class="ws-wrap">
    <div>
      <div class="ws-eyebrow"><span class="ws-dot"></span><span class="eyebrow">${c.hero.eyebrow}</span></div>
      <h1>${c.hero.title}</h1>
      <p>${c.hero.body}</p>
      <div class="ws-actions">
        <span class="ws-btn"><small>${c.hero.cta}</small></span>
        <span class="ws-link"><small>${c.hero.note}</small><span class="ws-arrow"></span></span>
      </div>
    </div>
    <div class="ill ws-plate" id="ill-hero" data-max-h="380px"></div>
  </section>

  <div class="ws-wrap">
    <div class="ws-trust">
      <span class="eyebrow">${c.trust.label}</span>
      <div class="ws-names">
        ${c.trust.names.map((n) => `<h6>${n}</h6>`).join("\n        ")}
      </div>
    </div>
  </div>

  <section class="ws-wrap ws-section">
    <div class="ws-head">
      <h2>${c.features.title}</h2>
      <p>${c.features.body}</p>
    </div>
    <div class="ws-features">
      ${c.features.items
        .map(
          (f) => `<div class="ws-feature">
        <div class="ws-mark"><h5>${f.mark}</h5></div>
        <h4>${f.title}</h4>
        <p><small>${f.body}</small></p>
      </div>`,
        )
        .join("\n      ")}
    </div>
  </section>

  <section class="ws-wrap ws-section">
    <div class="ws-split ws-split-flip">
      <div class="ws-plate"><div class="ill" id="ill-split-1"></div>${credit}</div>
      <div class="ws-copy">
        <span class="eyebrow">${c.split1.eyebrow}</span>
        <h3>${c.split1.title}</h3>
        <p>${c.split1.body}</p>
        <div class="ws-facts">
          ${c.split1.facts.map((f) => `<div><h5>${f.title}</h5><small>${f.note}</small></div>`).join("\n          ")}
        </div>
      </div>
    </div>
    <div class="ws-split">
      <div class="ws-copy">
        <span class="eyebrow">${c.split2.eyebrow}</span>
        <h3>${c.split2.title}</h3>
        <p>${c.split2.body}</p>
        <div class="ws-tags">
          ${c.split2.tags.map((t) => `<small>${t}</small>`).join("\n          ")}
        </div>
      </div>
      <div class="ws-plate"><div class="ill" id="ill-split-2"></div>${credit}</div>
    </div>
  </section>

  <section class="ws-wrap ws-section">
    <div class="ws-stats">
      ${c.stats.map((st) => `<div><p class="display-3">${st.value}</p><small>${st.label}</small></div>`).join("\n      ")}
    </div>
  </section>

  <section class="ws-wrap ws-section">
    <figure class="ws-quote">
      <figcaption class="ws-person">
        <div class="ws-avatar"><h6>${c.testimonial.name.charAt(0)}</h6></div>
        <div><p>${c.testimonial.name}</p><small>${c.testimonial.role}</small></div>
      </figcaption>
      <h3>${c.testimonial.quote}</h3>
    </figure>
  </section>

  <section class="ws-wrap ws-section">
    <div class="ws-head">
      <h2>${c.steps.title}</h2>
      <p>${c.steps.body}</p>
    </div>
    <div class="ws-steps">
      ${c.steps.items
        .map(
          (st, i) => `<div class="ws-step">
        <div class="ws-step-num"><span class="eyebrow">Step ${String(i + 1).padStart(2, "0")}</span></div>
        <h4>${st.title}</h4>
        <p><small>${st.body}</small></p>
      </div>`,
        )
        .join("\n      ")}
    </div>
  </section>

  <section class="ws-wrap ws-section">
    <div class="ws-cta">
      <h2>${c.cta.title}</h2>
      <div class="ws-cta-side">
        <p>${c.cta.body}</p>
        <span class="ws-btn"><small>${c.cta.button}</small><span class="ws-arrow"></span></span>
      </div>
    </div>
  </section>

  <footer class="ws-wrap ws-foot">
    <div class="ws-foot-top">
      <div class="ws-foot-brand">
        <h4>${c.brand}</h4>
        <small>${c.footer.tagline}</small>
      </div>
      <div class="ws-foot-links">
        ${c.footer.links.map((l) => `<small>${l}</small>`).join("\n        ")}
      </div>
    </div>
    <div class="ws-foot-legal">
      <small>${c.footer.legal}</small>
      <div>
        ${c.footer.legalLinks.map((l) => `<small>${l}</small>`).join("\n        ")}
      </div>
    </div>
  </footer>
</div>

${illustrationScript}
`;
  },
};
