import { BookOpen } from "lucide-react";
import type { PreviewTemplate } from "./types";

// `code` in copy becomes the inline code style
const mono = (text: string) => text.replace(/`([^`]+)`/g, '<span class="dx-mono"><small>$1</small></span>');

export const docsTemplate: PreviewTemplate = {
  id: "docs",
  name: "Docs",
  icon: BookOpen,
  render: (copy) => {
    const c = copy.docs;
    return `
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
  .dx-callout { display: flex; gap: 0.85rem; margin: 1.25rem 0; padding: 1rem 1.15rem; border: 1px solid var(--dx-line); border-radius: 8px; background: var(--dx-tint); }
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
    <h6>${c.product}</h6>
    ${c.topNav.map((t) => `<small>${t}</small>`).join("")}
    <div class="dx-search"><small>${c.search}</small><small>&#8984;K</small></div>
    <small class="dx-pill">${c.version}</small>
  </div>

  <div class="dx-grid">
    <nav class="dx-nav">
      ${c.navGroups
        .map(
          (g, gi) =>
            `<span class="eyebrow">${g.label}</span>` +
            g.items.map((item, ii) => `<small${gi === 0 && ii === 1 ? " data-on" : ""}>${item}</small>`).join(""),
        )
        .join("\n      ")}
    </nav>

    <main class="dx-main">
      <div class="dx-crumbs"><small>${c.crumbRoot}</small><small>/</small><small>${c.navGroups[0].label}</small><small>/</small><small>${c.navGroups[0].items[1]}</small></div>
      <h1>${c.title}</h1>
      <p class="dx-lead">${c.lead}</p>

      <div class="dx-callout"><b><small>i</small></b><div><h6>${c.callout.title}</h6><p>${mono(c.callout.body)}</p></div></div>

      <h2>${c.heading1}</h2>
      <p>${mono(c.body1)}</p>
      <div class="dx-code">
        <div class="dx-code-bar"><small>${c.codeLabel}</small><small>Copy</small></div>
        <pre><small>${c.code}</small></pre>
      </div>

      <h3>${c.heading2}</h3>
      <p>${mono(c.body2)}</p>

      <h4>${c.heading3}</h4>
      <p>${mono(c.body3)}</p>
      <h5>${c.heading4}</h5>
      <p>${mono(c.body4)}</p>
      <h6>${c.heading5}</h6>
      <p>${mono(c.body5)}</p>

      <div class="dx-callout"><b><small>!</small></b><div><h6>${c.warning.title}</h6><p>${mono(c.warning.body)}</p></div></div>

      <h2>${c.heading6}</h2>
      <p>${mono(c.body6)}</p>
      <div class="dx-tablewrap">
        <table class="dx-table">
          <thead><tr><th><small><b>Setting</b></small></th><th><small><b>Type</b></small></th><th><small><b>Default</b></small></th><th><small><b>Effect</b></small></th></tr></thead>
          <tbody>
            ${c.settings
              .map(
                (row) =>
                  `<tr><td><small class="dx-mono">${row.key}</small></td><td><small>${row.kind}</small></td><td><small>${row.value}</small></td><td><small>${row.effect}</small></td></tr>`,
              )
              .join("\n            ")}
          </tbody>
        </table>
      </div>

      <h2>${c.heading7}</h2>
      <div class="dx-steps">
        ${c.steps
          .map((step, i) => `<div class="dx-step"><b><small>${i + 1}</small></b><div><h5>${step.title}</h5><p>${mono(step.body)}</p></div></div>`)
          .join("\n        ")}
      </div>

      <div class="dx-pager">
        <div><small>Previous</small><h6 style="margin: 0.2rem 0 0;">${c.navGroups[0].items[0]}</h6></div>
        <div><small>Next</small><h6 style="margin: 0.2rem 0 0;">${c.navGroups[0].items[2]}</h6></div>
      </div>
    </main>

    <aside class="dx-toc">
      <span class="eyebrow">On this page</span>
      <small data-on>${c.heading1}</small>
      <small class="sub">${c.heading2}</small>
      <small class="sub">${c.heading3}</small>
      <small>${c.heading6}</small>
      <small>${c.heading7}</small>
    </aside>
  </div>
</div>
`;
  },
};
