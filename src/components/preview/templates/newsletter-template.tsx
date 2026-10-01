import { Mail } from "lucide-react";
import type { PreviewTemplate } from "./types";
import { illustrationScript } from "./illustration-script";

export const newsletterTemplate: PreviewTemplate = {
  id: "newsletter",
  name: "Newsletter",
  icon: Mail,
  render: (copy) => {
    const c = copy.newsletter;
    return `
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
  .nl-item .ill { display: flex; align-items: center; justify-content: center; min-height: 180px; margin: 1.25rem 0; padding: 1.25rem; border-radius: 10px; background: var(--ill-surface); --ill-paper: var(--ill-surface); border: 1px solid var(--nl-line); }
  .nl-btn { display: inline-block; padding: 0.7em 1.6em; border-radius: 8px; background: currentColor; cursor: pointer; }
  .nl-btn small { color: var(--bg-color, #fff); font-weight: 600; }
  /* Set in from the measure, with the opening quote hung into the margin, not a side stripe */
  .nl-body blockquote { margin: 1.75rem 0; padding-left: 1.75rem; }
  .nl-body blockquote .nl-hang { text-indent: -0.42em; }
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
  <div class="nl-pre"><small>${c.preheader[0]}</small><small>${c.preheader[1]}</small></div>
  <div class="nl-card">
    <div class="nl-head"><h6>${c.name}</h6><small>${c.date}</small></div>
    <div class="nl-body">
      <div class="nl-issue"><p class="display-3">${c.issue}</p><span class="eyebrow">${c.issueLabel}</span></div>
      <h1>${c.title}</h1>
      <p>${c.intro}</p>

      <hr class="nl-rule" />

      <div class="nl-item">
        <span class="eyebrow">${c.essay.eyebrow}</span>
        <h3>${c.essay.title}</h3>
        <p>${c.essay.body}</p>
        <div class="ill" data-max-h="200px"></div>
        <p>${c.essay.after}</p>
        <div class="nl-btn"><small>${c.essay.button}</small></div>
      </div>

      <hr class="nl-rule" />

      <div class="nl-item">
        <span class="eyebrow">${c.second.eyebrow}</span>
        <h3>${c.second.title}</h3>
        <blockquote>
          <p${c.second.quote.startsWith("“") ? ' class="nl-hang"' : ""}><em>${c.second.quote}</em></p>
          <small>${c.second.quoteSource}</small>
        </blockquote>
        <h4 style="margin: 1.5rem 0 0.5rem;">${c.second.subhead}</h4>
        <p>${c.second.body}</p>
      </div>

      <hr class="nl-rule" />

      <span class="eyebrow">${c.linksLabel}</span>
      <div class="nl-links" style="margin-top: 0.75rem;">
        <div><small>1</small><div><h5>${c.links[0].title}</h5><small>${c.links[0].meta}</small></div></div>
        <div><small>2</small><div><h5>${c.links[1].title}</h5><small>${c.links[1].meta}</small></div></div>
        <div><small>3</small><div><h5>${c.links[2].title}</h5><small>${c.links[2].meta}</small></div></div>
      </div>

      <div class="nl-sponsor">
        <span class="eyebrow">${c.sponsor.eyebrow}</span>
        <h4>${c.sponsor.title}</h4>
        <p><small>${c.sponsor.body}</small></p>
        <h6 style="margin: 0;">${c.sponsor.link}</h6>
      </div>
    </div>
    <div class="nl-foot">
      <small>${c.footer[0]}</small>
      <small>${c.footer[1]}</small>
    </div>
  </div>
</div>

${illustrationScript}
`;
  },
};
