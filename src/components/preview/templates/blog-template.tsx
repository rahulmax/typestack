import { AlignLeft } from "lucide-react";
import type { PreviewTemplate } from "./types";

export const blogTemplate: PreviewTemplate = {
  id: "blog",
  name: "Blog",
  icon: AlignLeft,
  render: (copy) => {
    const c = copy.blog;
    return `
<style>
  @media (max-width: 768px) {
    article { padding: 2rem 1rem !important; }
  }
</style>
<article style="max-width: 680px; margin: 0 auto; padding: 3rem 1.5rem;">
  <header style="margin-bottom: 2.5rem;">
    <span class="eyebrow" style="opacity: 0.8;">${c.eyebrow}</span>
    <h1 style="margin: 0.75rem 0;">${c.title}</h1>
    <p>${c.dek}</p>
    <div style="display: flex; gap: 0.4rem; margin-top: 0.75rem; align-items: center; opacity: 0.8;">
      <small>${c.author}</small>
      <small>·</small>
      <small>${c.date}</small>
      <small>·</small>
      <small>${c.readTime}</small>
    </div>
  </header>

  <div>
    <p style="margin-bottom: 1.5rem;">${c.intro}</p>

    <h2 style="margin: 2rem 0 1rem;">${c.heading1}</h2>
    <p style="margin-bottom: 1.5rem;">${c.section1[0]}</p>
    <p style="margin-bottom: 1.5rem;">${c.section1[1]}</p>

    <h3 style="margin: 2rem 0 0.75rem;">${c.subheading}</h3>
    <p style="margin-bottom: 1.5rem;">${c.section2}</p>

    <blockquote style="border-left: 3px solid currentColor; padding-left: 1.5rem; margin: 2rem 0;">
      <p style="margin-bottom: 0.5rem;"><em>${c.quote}</em></p>
      <small>&mdash; ${c.quoteSource}</small>
    </blockquote>

    <h2 style="margin: 2rem 0 1rem;">${c.heading2}</h2>
    <p style="margin-bottom: 1.5rem;">${c.section3}</p>

    <h4 style="margin: 1.5rem 0 0.5rem;">${c.listTitle}</h4>
    <p style="margin-bottom: 0.5rem;">1. ${c.list[0]}</p>
    <p style="margin-bottom: 0.5rem;">2. ${c.list[1]}</p>
    <p style="margin-bottom: 0.5rem;">3. ${c.list[2]}</p>
    <p style="margin-bottom: 1.5rem;">4. ${c.list[3]}</p>

    <h5 style="margin: 1.5rem 0 0.5rem;">${c.noteTitle}</h5>
    <p><small>${c.note}</small></p>
  </div>
</article>
`;
  },
};
