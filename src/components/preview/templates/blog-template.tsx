import type { PreviewTemplate } from "./types";

export const blogTemplate: PreviewTemplate = {
  id: "blog",
  name: "Blog",
  html: `
<style>
  @media (max-width: 768px) {
    article { padding: 2rem 1rem !important; }
  }
</style>
<article style="max-width: 680px; margin: 0 auto; padding: 3rem 1.5rem;">
  <header style="margin-bottom: 2.5rem;">
    <span class="eyebrow" style="opacity: 0.5;">Design Systems</span>
    <h1 style="margin: 0.75rem 0;">The Art of Typographic Hierarchy</h1>
    <p style="opacity: 0.7;">How a well-crafted type scale can transform the readability and aesthetics of your digital products.</p>
    <div style="display: flex; gap: 1rem; margin-top: 1rem; align-items: center;">
      <small style="opacity: 0.5;">By Sarah Chen</small>
      <small style="opacity: 0.4;">·</small>
      <small style="opacity: 0.5;">March 3, 2026</small>
      <small style="opacity: 0.4;">·</small>
      <small style="opacity: 0.5;">8 min read</small>
    </div>
  </header>

  <div>
    <p style="margin-bottom: 1.5rem;">Typography is the foundation of good design. When we talk about typographic hierarchy, we're referring to the system of organizing text to establish an order of importance, helping readers navigate content efficiently and intuitively.</p>

    <h2 style="margin: 2rem 0 1rem;">Understanding Scale Ratios</h2>
    <p style="margin-bottom: 1.5rem;">A type scale is a sequence of font sizes that relate to each other through a consistent mathematical ratio. The most common ratios are drawn from music — like the Minor Third (1.200) or the Perfect Fourth (1.333).</p>
    <p style="margin-bottom: 1.5rem;">These ratios create natural harmony between sizes, much like musical intervals create harmony between notes. The key is choosing a ratio that provides enough contrast between levels without being too dramatic.</p>

    <h3 style="margin: 2rem 0 0.75rem;">Choosing the Right Ratio</h3>
    <p style="margin-bottom: 1.5rem;">For body-heavy content like articles and documentation, a tighter ratio like Minor Third (1.200) or Major Second (1.125) works well. For marketing pages where you need dramatic headings, a wider ratio like Perfect Fourth (1.333) or higher creates more visual impact.</p>

    <blockquote style="border-left: 3px solid currentColor; padding-left: 1.5rem; margin: 2rem 0; opacity: 0.85;">
      <p style="margin-bottom: 0.5rem;"><em>"The type scale is to typography what the color palette is to visual design — it's the foundational system that everything else builds upon."</em></p>
      <small style="opacity: 0.6;">— Tim Brown, Head of Typography at Adobe</small>
    </blockquote>

    <h2 style="margin: 2rem 0 1rem;">Mobile Considerations</h2>
    <p style="margin-bottom: 1.5rem;">Mobile screens demand a different approach. Headings that look grand on desktop can overwhelm a small screen. Use a tighter ratio for mobile and adjust your base font size to maintain readability.</p>

    <h4 style="margin: 1.5rem 0 0.5rem;">Key Takeaways</h4>
    <p style="margin-bottom: 0.5rem;">1. Start with a clear base font size (typically 16px for web).</p>
    <p style="margin-bottom: 0.5rem;">2. Choose a ratio that matches your content type.</p>
    <p style="margin-bottom: 0.5rem;">3. Test with real content, not just lorem ipsum.</p>
    <p style="margin-bottom: 1.5rem;">4. Always design for mobile separately.</p>

    <h5 style="margin: 1.5rem 0 0.5rem;">Further Reading</h5>
    <p><small>Explore more about type scales at typescale.com and learn about fluid typography techniques for responsive design.</small></p>
  </div>
</article>
`,
};
