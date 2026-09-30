import { Globe } from "lucide-react";
import type { PreviewTemplate } from "./types";
import { illustrationScript } from "./illustration-script";

const border = `1px solid color-mix(in srgb, currentColor 20%, transparent)`;
const borderLight = `1px solid color-mix(in srgb, currentColor 10%, transparent)`;

export const websiteTemplate: PreviewTemplate = {
  id: "website",
  name: "Website",
  icon: Globe,
  render: (copy) => {
    const c = copy.website;
    return `
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
  <h6 style="margin: 0;">${c.brand}</h6>
  <div id="nav-links" style="display: flex; gap: 2rem; align-items: center;">
    ${c.nav.map((n) => `<small style="cursor: pointer;">${n}</small>`).join("\n    ")}
    <small style="display: inline-block; padding: 0.4em 1.1em; border: ${border}; border-radius: 6px; cursor: pointer;">${c.navCta}</small>
  </div>
</nav>

<!-- HERO -->
<section id="hero" style="max-width: 1024px; margin: 0 auto; padding: 4rem 1.5rem 5rem; display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: center;">
  <div>
    <span class="eyebrow" style="display: block; margin-bottom: 1rem;">${c.hero.eyebrow}</span>
    <h1 style="margin: 0 0 1.25rem;">${c.hero.title}</h1>
    <p style="margin: 0 0 2rem; max-width: 440px;">${c.hero.body}</p>
    <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
      <div style="display: inline-block; padding: 0.65em 1.75em; background: currentColor; border-radius: 8px; cursor: pointer;">
        <small style="color: var(--bg-color, #fff); font-weight: 600;">${c.hero.cta}</small>
      </div>
      <small>${c.hero.note}</small>
    </div>
  </div>
  <div class="ill" id="ill-hero" style="display: flex; align-items: center; justify-content: center; min-height: 320px;"></div>
</section>

<!-- LOGOS / TRUST BAR -->
<section style="max-width: 1024px; margin: 0 auto; padding: 0 1.5rem 4rem; text-align: center;">
  <span class="eyebrow">${c.trust.label}</span>
  <div style="display: flex; justify-content: center; gap: 3rem; margin-top: 1.25rem; flex-wrap: wrap;">
    ${c.trust.names.map((n) => `<h6 style="margin: 0;">${n}</h6>`).join("\n    ")}
  </div>
</section>

<!-- FEATURES GRID -->
<section style="max-width: 1024px; margin: 0 auto; padding: 0 1.5rem 5rem;">
  <div style="text-align: center; margin-bottom: 3rem;">
    <h2 style="margin: 0 0 0.75rem;">${c.features.title}</h2>
    <p style="max-width: 520px; margin: 0 auto;">${c.features.body}</p>
  </div>
  <div id="features-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem;">
    ${c.features.items.map((f) => `<div style="border: ${border}; border-radius: 12px; padding: 1.75rem;">
      <div style="width: 40px; height: 40px; border-radius: 10px; background: color-mix(in srgb, currentColor 8%, transparent); margin-bottom: 1rem; display: flex; align-items: center; justify-content: center;">
        <small style="font-weight: 700;">${f.mark}</small>
      </div>
      <h4 style="margin: 0 0 0.5rem;">${f.title}</h4>
      <p><small>${f.body}</small></p>
    </div>`).join("\n")}
  </div>
</section>

<!-- SPLIT SECTION: ILLUSTRATION LEFT, TEXT RIGHT -->
<section id="split-1" style="max-width: 1024px; margin: 0 auto; padding: 0 1.5rem 5rem; display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: center;">
  <div>
    <div class="ill" id="ill-split-1" style="display: flex; align-items: center; justify-content: center; min-height: 240px; border: ${borderLight}; border-radius: 16px; padding: 2rem; background: var(--ill-surface); --ill-paper: var(--ill-surface);"></div>
    <small style="display: block; margin-top: 0.5rem; font-size: 0.65em; text-align: center;">Illustration by <a href="https://www.getillustrations.com" target="_blank" rel="noopener noreferrer" style="text-decoration: underline;">getillustrations.com</a></small>
  </div>
  <div>
    <span class="eyebrow" style="margin-bottom: 0.75rem; display: block;">${c.split1.eyebrow}</span>
    <h3 style="margin: 0 0 1rem;">${c.split1.title}</h3>
    <p style="margin: 0 0 1.5rem;">${c.split1.body}</p>
    <div style="display: flex; gap: 2rem;">
      ${c.split1.facts.map((f) => `<div><h5 style="margin: 0;">${f.title}</h5><small>${f.note}</small></div>`).join("\n      ")}
    </div>
  </div>
</section>

<!-- SPLIT SECTION: TEXT LEFT, ILLUSTRATION RIGHT -->
<section id="split-2" style="max-width: 1024px; margin: 0 auto; padding: 0 1.5rem 5rem; display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: center;">
  <div>
    <span class="eyebrow" style="margin-bottom: 0.75rem; display: block;">${c.split2.eyebrow}</span>
    <h3 style="margin: 0 0 1rem;">${c.split2.title}</h3>
    <p style="margin: 0 0 1.5rem;">${c.split2.body}</p>
    <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
      ${c.split2.tags.map((t) => `<div style="padding: 0.5em 1em; border: ${border}; border-radius: 8px;">
        <small>${t}</small>
      </div>`).join("\n")}
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
    ${c.stats.map((st) => `<div><h2 style="margin: 0 0 0.25rem;">${st.value}</h2><small>${st.label}</small></div>`).join("\n    ")}
  </div>
</section>

<!-- TESTIMONIAL -->
<section style="max-width: 700px; margin: 0 auto; padding: 5rem 1.5rem;">
  <blockquote style="border-left: 3px solid currentColor; padding-left: 1.75rem; margin: 0;">
    <p style="margin: 0 0 1.25rem;"><em>${c.testimonial.quote}</em></p>
    <div>
      <p style="margin: 0; font-weight: 600;">${c.testimonial.name}</p>
      <small>${c.testimonial.role}</small>
    </div>
  </blockquote>
</section>

<!-- HOW IT WORKS -->
<section style="max-width: 1024px; margin: 0 auto; padding: 0 1.5rem 5rem;">
  <div style="text-align: center; margin-bottom: 3rem;">
    <h2 style="margin: 0 0 0.75rem;">${c.steps.title}</h2>
    <p style="max-width: 460px; margin: 0 auto;">${c.steps.body}</p>
  </div>
  <div id="hiw-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem;">
    ${c.steps.items.map((st, i) => `<div style="text-align: center; padding: 0 1rem;">
      <div style="width: 48px; height: 48px; border-radius: 50%; border: ${border}; margin: 0 auto 1.25rem; display: flex; align-items: center; justify-content: center;">
        <h5 style="margin: 0;">${i + 1}</h5>
      </div>
      <h4 style="margin: 0 0 0.5rem;">${st.title}</h4>
      <p><small>${st.body}</small></p>
    </div>`).join("\n")}
  </div>
</section>

<!-- CTA -->
<section style="max-width: 1024px; margin: 0 auto; padding: 4rem 1.5rem; text-align: center; border-top: ${borderLight};">
  <h3 style="margin: 0 0 1rem;">${c.cta.title}</h3>
  <p style="max-width: 480px; margin: 0 auto 2rem;">${c.cta.body}</p>
  <div style="display: inline-block; padding: 0.7em 2.5em; background: currentColor; border-radius: 8px; cursor: pointer;">
    <small style="color: var(--bg-color, #fff); font-weight: 600;">${c.cta.button}</small>
  </div>
</section>

<!-- FOOTER -->
<footer style="max-width: 1024px; margin: 0 auto; padding: 3rem 1.5rem 2rem; border-top: ${borderLight};">
  <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
    <div style="display: flex; align-items: center; gap: 2rem;">
      <h6 style="margin: 0;">${c.brand}</h6>
      <small>${c.footer.tagline}</small>
    </div>
    <div style="display: flex; gap: 1.5rem;">
      ${c.footer.links.map((l) => `<small>${l}</small>`).join("\n      ")}
    </div>
  </div>
  <div style="margin-top: 2rem; padding-top: 1.5rem; border-top: ${borderLight}; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem;">
    <small>${c.footer.legal}</small>
    <div style="display: flex; gap: 1.5rem;">
      ${c.footer.legalLinks.map((l) => `<small>${l}</small>`).join("\n      ")}
    </div>
  </div>
</footer>

${illustrationScript}
`;
  },
};
