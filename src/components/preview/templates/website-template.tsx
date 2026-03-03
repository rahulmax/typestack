import type { PreviewTemplate } from "./types";

const border = `1px solid color-mix(in srgb, currentColor 20%, transparent)`;
const borderLight = `1px solid color-mix(in srgb, currentColor 10%, transparent)`;

export const websiteTemplate: PreviewTemplate = {
  id: "website",
  name: "Website",
  html: `
<style>
  @media (max-width: 768px) {
    nav, section, footer {
      padding-left: 1rem !important;
      padding-right: 1rem !important;
    }
    #hero {
      grid-template-columns: 1fr !important;
      padding-top: 2.5rem !important;
      padding-bottom: 3rem !important;
    }
    #ill-hero {
      min-height: 220px !important;
    }
    #features-grid {
      grid-template-columns: repeat(2, 1fr) !important;
    }
    #split-1, #split-2 {
      grid-template-columns: 1fr !important;
      gap: 2rem !important;
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
  @media (max-width: 480px) {
    #nav-links small:not(:last-child) {
      display: none !important;
    }
    #nav-links {
      gap: 0.75rem !important;
    }
    #ill-hero {
      min-height: 160px !important;
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
      gap: 1.5rem !important;
      padding-bottom: 3rem !important;
    }
    #hiw-grid {
      gap: 1.5rem !important;
    }
    nav, section, footer {
      padding-left: 0.75rem !important;
      padding-right: 0.75rem !important;
    }
    footer > div:first-child {
      flex-direction: column !important;
      align-items: flex-start !important;
    }
    footer > div:last-child {
      flex-direction: column !important;
    }
  }
</style>

<!-- NAV -->
<nav style="max-width: 960px; margin: 0 auto; padding: 1.25rem 1.5rem; display: flex; justify-content: space-between; align-items: center;">
  <h6 style="margin: 0; letter-spacing: -0.02em;">TypeStack</h6>
  <div id="nav-links" style="display: flex; gap: 2rem; align-items: center;">
    <small style="opacity: 0.7; cursor: pointer;">Features</small>
    <small style="opacity: 0.7; cursor: pointer;">Pricing</small>
    <small style="opacity: 0.7; cursor: pointer;">Docs</small>
    <small style="display: inline-block; padding: 0.4em 1.1em; border: ${border}; border-radius: 6px; cursor: pointer;">Sign in</small>
  </div>
</nav>

<!-- HERO -->
<section id="hero" style="max-width: 960px; margin: 0 auto; padding: 4rem 1.5rem 5rem; display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: center;">
  <div>
    <small style="opacity: 0.4; text-transform: uppercase; letter-spacing: 0.1em; display: block; margin-bottom: 1rem;">Typography toolkit for modern teams</small>
    <h2 style="margin: 0 0 1.25rem; line-height: 1.15; letter-spacing: -0.02em;">Your type system, from first sketch to shipped code</h2>
    <p style="margin: 0 0 2rem; opacity: 0.65; max-width: 440px;">Create harmonious type scales, preview them in real layouts, and export production-ready CSS &mdash; all in one place.</p>
    <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
      <div style="display: inline-block; padding: 0.65em 1.75em; background: currentColor; border-radius: 8px; cursor: pointer;">
        <small style="color: var(--bg-color, #fff); font-weight: 600;">Get started free</small>
      </div>
      <small style="opacity: 0.5;">No account required</small>
    </div>
  </div>
  <div class="ill" id="ill-hero" style="display: flex; align-items: center; justify-content: center; min-height: 320px;"></div>
</section>

<!-- LOGOS / TRUST BAR -->
<section style="max-width: 960px; margin: 0 auto; padding: 0 1.5rem 4rem; text-align: center;">
  <small style="opacity: 0.4; text-transform: uppercase; letter-spacing: 0.1em;">Trusted by design teams at</small>
  <div style="display: flex; justify-content: center; gap: 3rem; margin-top: 1.25rem; flex-wrap: wrap; opacity: 0.3;">
    <h6 style="margin: 0;">Vercel</h6>
    <h6 style="margin: 0;">Stripe</h6>
    <h6 style="margin: 0;">Linear</h6>
    <h6 style="margin: 0;">Notion</h6>
    <h6 style="margin: 0;">Figma</h6>
  </div>
</section>

<!-- FEATURES GRID -->
<section style="max-width: 960px; margin: 0 auto; padding: 0 1.5rem 5rem;">
  <div style="text-align: center; margin-bottom: 3rem;">
    <h2 style="margin: 0 0 0.75rem;">Everything you need</h2>
    <p style="opacity: 0.6; max-width: 520px; margin: 0 auto;">A complete toolkit for typographic precision, from choosing scales to exporting production-ready tokens.</p>
  </div>
  <div id="features-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem;">
    <div style="border: ${border}; border-radius: 12px; padding: 1.75rem;">
      <div style="width: 40px; height: 40px; border-radius: 10px; background: color-mix(in srgb, currentColor 8%, transparent); margin-bottom: 1rem; display: flex; align-items: center; justify-content: center;">
        <small style="font-weight: 700; opacity: 0.6;">Aa</small>
      </div>
      <h4 style="margin: 0 0 0.5rem;">Per-Element Control</h4>
      <p><small style="opacity: 0.65;">Override font weight, line height, and letter spacing for each individual element in your type scale.</small></p>
    </div>
    <div style="border: ${border}; border-radius: 12px; padding: 1.75rem;">
      <div style="width: 40px; height: 40px; border-radius: 10px; background: color-mix(in srgb, currentColor 8%, transparent); margin-bottom: 1rem; display: flex; align-items: center; justify-content: center;">
        <small style="font-weight: 700; opacity: 0.6;">50+</small>
      </div>
      <h4 style="margin: 0 0 0.5rem;">Scale Ratios</h4>
      <p><small style="opacity: 0.65;">Choose from over 50 musical and mathematical ratios, or define your own custom scale factor.</small></p>
    </div>
    <div style="border: ${border}; border-radius: 12px; padding: 1.75rem;">
      <div style="width: 40px; height: 40px; border-radius: 10px; background: color-mix(in srgb, currentColor 8%, transparent); margin-bottom: 1rem; display: flex; align-items: center; justify-content: center;">
        <small style="font-weight: 700; opacity: 0.6;">{&nbsp;}</small>
      </div>
      <h4 style="margin: 0 0 0.5rem;">Export Anywhere</h4>
      <p><small style="opacity: 0.65;">Copy clean CSS custom properties, Tailwind config, or push tokens directly to Figma as variables.</small></p>
    </div>
    <div style="border: ${border}; border-radius: 12px; padding: 1.75rem;">
      <div style="width: 40px; height: 40px; border-radius: 10px; background: color-mix(in srgb, currentColor 8%, transparent); margin-bottom: 1rem; display: flex; align-items: center; justify-content: center;">
        <small style="font-weight: 700; opacity: 0.6;">Rr</small>
      </div>
      <h4 style="margin: 0 0 0.5rem;">Live Preview</h4>
      <p><small style="opacity: 0.65;">See typography come alive in real-world templates -- websites, dashboards, and blog layouts.</small></p>
    </div>
    <div style="border: ${border}; border-radius: 12px; padding: 1.75rem;">
      <div style="width: 40px; height: 40px; border-radius: 10px; background: color-mix(in srgb, currentColor 8%, transparent); margin-bottom: 1rem; display: flex; align-items: center; justify-content: center;">
        <small style="font-weight: 700; opacity: 0.6;">px</small>
      </div>
      <h4 style="margin: 0 0 0.5rem;">Fluid Typography</h4>
      <p><small style="opacity: 0.65;">Generate fluid clamp() values that smoothly interpolate sizes between mobile and desktop breakpoints.</small></p>
    </div>
    <div style="border: ${border}; border-radius: 12px; padding: 1.75rem;">
      <div style="width: 40px; height: 40px; border-radius: 10px; background: color-mix(in srgb, currentColor 8%, transparent); margin-bottom: 1rem; display: flex; align-items: center; justify-content: center;">
        <small style="font-weight: 700; opacity: 0.6;">G</small>
      </div>
      <h4 style="margin: 0 0 0.5rem;">Google Fonts</h4>
      <p><small style="opacity: 0.65;">Browse and preview any Google Font with instant pairing suggestions and weight recommendations.</small></p>
    </div>
  </div>
</section>

<!-- SPLIT SECTION: ILLUSTRATION LEFT, TEXT RIGHT -->
<section id="split-1" style="max-width: 960px; margin: 0 auto; padding: 0 1.5rem 5rem; display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: center;">
  <div class="ill" id="ill-split-1" style="display: flex; align-items: center; justify-content: center; min-height: 240px; border: ${borderLight}; border-radius: 16px; padding: 2rem; background: color-mix(in srgb, currentColor 3%, transparent);"></div>
  <div>
    <small style="opacity: 0.4; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.75rem; display: block;">Precision</small>
    <h3 style="margin: 0 0 1rem; line-height: 1.2;">Per-element control over every detail</h3>
    <p style="opacity: 0.65; margin: 0 0 1.5rem;">Go beyond global settings. Adjust font weight, line height, letter spacing, and text transform for each heading level independently. Your h1 can be tight and bold while your h4 stays light and airy.</p>
    <div style="display: flex; gap: 2rem;">
      <div>
        <h5 style="margin: 0;">Weight</h5>
        <small style="opacity: 0.5;">100 -- 900</small>
      </div>
      <div>
        <h5 style="margin: 0;">Tracking</h5>
        <small style="opacity: 0.5;">-0.05 -- 0.2em</small>
      </div>
      <div>
        <h5 style="margin: 0;">Leading</h5>
        <small style="opacity: 0.5;">1.0 -- 2.0</small>
      </div>
    </div>
  </div>
</section>

<!-- SPLIT SECTION: TEXT LEFT, ILLUSTRATION RIGHT -->
<section id="split-2" style="max-width: 960px; margin: 0 auto; padding: 0 1.5rem 5rem; display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: center;">
  <div>
    <small style="opacity: 0.4; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.75rem; display: block;">Responsive</small>
    <h3 style="margin: 0 0 1rem; line-height: 1.2;">Mobile-first responsive scales</h3>
    <p style="opacity: 0.65; margin: 0 0 1.5rem;">Headings that look grand on desktop can overwhelm a small screen. Define separate scales for mobile and desktop, then let TypeStack generate fluid clamp() values that adapt smoothly across every viewport.</p>
    <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
      <div style="padding: 0.5em 1em; border: ${border}; border-radius: 8px;">
        <small style="opacity: 0.7;">320px</small>
      </div>
      <div style="padding: 0.5em 1em; border: ${border}; border-radius: 8px;">
        <small style="opacity: 0.7;">768px</small>
      </div>
      <div style="padding: 0.5em 1em; border: ${border}; border-radius: 8px;">
        <small style="opacity: 0.7;">1440px</small>
      </div>
    </div>
  </div>
  <div class="ill" id="ill-split-2" style="display: flex; align-items: center; justify-content: center; min-height: 240px; border: ${borderLight}; border-radius: 16px; padding: 2rem; background: color-mix(in srgb, currentColor 3%, transparent);"></div>
</section>

<!-- STATS ROW -->
<section style="max-width: 960px; margin: 0 auto; padding: 3rem 1.5rem 4rem; border-top: ${borderLight}; border-bottom: ${borderLight};">
  <div id="stats-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 2rem; text-align: center;">
    <div>
      <h2 style="margin: 0 0 0.25rem;">50+</h2>
      <small style="opacity: 0.5;">Scale Ratios</small>
    </div>
    <div>
      <h2 style="margin: 0 0 0.25rem;">1000+</h2>
      <small style="opacity: 0.5;">Font Pairings</small>
    </div>
    <div>
      <h2 style="margin: 0 0 0.25rem;">3</h2>
      <small style="opacity: 0.5;">Export Formats</small>
    </div>
    <div>
      <h2 style="margin: 0 0 0.25rem;">0ms</h2>
      <small style="opacity: 0.5;">Sign-up Required</small>
    </div>
  </div>
</section>

<!-- TESTIMONIAL -->
<section style="max-width: 700px; margin: 0 auto; padding: 5rem 1.5rem;">
  <blockquote style="border-left: 3px solid currentColor; padding-left: 1.75rem; margin: 0;">
    <p style="margin: 0 0 1.25rem; opacity: 0.85;"><em>"TypeStack completely transformed our design workflow. We went from spending hours tweaking font sizes in Figma to having a perfect, mathematically harmonious scale in under a minute. The per-element overrides are a game changer."</em></p>
    <div>
      <p style="margin: 0; font-weight: 600;">Sarah Chen</p>
      <small style="opacity: 0.5;">Design Systems Lead at Linear</small>
    </div>
  </blockquote>
</section>

<!-- HOW IT WORKS -->
<section style="max-width: 960px; margin: 0 auto; padding: 0 1.5rem 5rem;">
  <div style="text-align: center; margin-bottom: 3rem;">
    <h2 style="margin: 0 0 0.75rem;">How it works</h2>
    <p style="opacity: 0.6; max-width: 460px; margin: 0 auto;">Three steps to typographic harmony.</p>
  </div>
  <div id="hiw-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem;">
    <div style="text-align: center; padding: 0 1rem;">
      <div style="width: 48px; height: 48px; border-radius: 50%; border: ${border}; margin: 0 auto 1.25rem; display: flex; align-items: center; justify-content: center;">
        <h5 style="margin: 0;">1</h5>
      </div>
      <h4 style="margin: 0 0 0.5rem;">Choose your scale</h4>
      <p><small style="opacity: 0.6;">Pick a base size and ratio. Start with a preset like Minor Third or Perfect Fourth, or go custom.</small></p>
    </div>
    <div style="text-align: center; padding: 0 1rem;">
      <div style="width: 48px; height: 48px; border-radius: 50%; border: ${border}; margin: 0 auto 1.25rem; display: flex; align-items: center; justify-content: center;">
        <h5 style="margin: 0;">2</h5>
      </div>
      <h4 style="margin: 0 0 0.5rem;">Refine each element</h4>
      <p><small style="opacity: 0.6;">Fine-tune weight, spacing, and line height for each heading level. Preview changes in real time.</small></p>
    </div>
    <div style="text-align: center; padding: 0 1rem;">
      <div style="width: 48px; height: 48px; border-radius: 50%; border: ${border}; margin: 0 auto 1.25rem; display: flex; align-items: center; justify-content: center;">
        <h5 style="margin: 0;">3</h5>
      </div>
      <h4 style="margin: 0 0 0.5rem;">Export and ship</h4>
      <p><small style="opacity: 0.6;">Copy CSS custom properties, grab Tailwind config, or sync directly to Figma as design tokens.</small></p>
    </div>
  </div>
</section>

<!-- CTA -->
<section style="max-width: 960px; margin: 0 auto; padding: 4rem 1.5rem; text-align: center; border-top: ${borderLight};">
  <h3 style="margin: 0 0 1rem;">Ready to build your type scale?</h3>
  <p style="opacity: 0.6; max-width: 480px; margin: 0 auto 2rem;">Join thousands of designers and developers who use TypeStack to create beautiful, consistent typography.</p>
  <div style="display: inline-block; padding: 0.7em 2.5em; background: currentColor; border-radius: 8px; cursor: pointer;">
    <small style="color: var(--bg-color, #fff); font-weight: 600;">Get started for free</small>
  </div>
</section>

<!-- FOOTER -->
<footer style="max-width: 960px; margin: 0 auto; padding: 3rem 1.5rem 2rem; border-top: ${borderLight};">
  <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
    <div style="display: flex; align-items: center; gap: 2rem;">
      <h6 style="margin: 0;">TypeStack</h6>
      <small style="opacity: 0.4;">Beautiful type scales, instantly.</small>
    </div>
    <div style="display: flex; gap: 1.5rem;">
      <small style="opacity: 0.5;">Features</small>
      <small style="opacity: 0.5;">Pricing</small>
      <small style="opacity: 0.5;">Docs</small>
      <small style="opacity: 0.5;">GitHub</small>
    </div>
  </div>
  <div style="margin-top: 2rem; padding-top: 1.5rem; border-top: ${borderLight}; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem;">
    <small style="opacity: 0.35;">2026 TypeStack. All rights reserved.</small>
    <div style="display: flex; gap: 1.5rem;">
      <small style="opacity: 0.35;">Privacy</small>
      <small style="opacity: 0.35;">Terms</small>
    </div>
  </div>
</footer>

<!-- ILLUSTRATION INJECTION SCRIPT -->
<script>
(function() {
  var nums = [];
  while (nums.length < 3) {
    var n = Math.floor(Math.random() * 8) + 1;
    if (nums.indexOf(n) === -1) nums.push(n);
  }

  var slots = document.querySelectorAll('.ill');
  slots.forEach(function(slot, i) {
    if (i >= nums.length) return;
    fetch('/ill/ill-' + nums[i] + '.svg')
      .then(function(r) { return r.text(); })
      .then(function(svg) {
        slot.innerHTML = svg;
        var svgEl = slot.querySelector('svg');
        if (svgEl) {
          svgEl.style.width = '100%';
          svgEl.style.height = 'auto';
          svgEl.style.maxHeight = '320px';
          svgEl.style.fill = 'var(--tone-base)';
        }
      });
  });
})();
</script>
`,
};
