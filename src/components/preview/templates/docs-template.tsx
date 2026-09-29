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
    <h6>Meridian</h6>
    <small>Guides</small><small>API</small><small>Changelog</small>
    <div class="dx-search"><small>Search docs</small><small>&#8984;K</small></div>
    <small class="dx-pill">v3.2</small>
  </div>

  <div class="dx-grid">
    <nav class="dx-nav">
      <span class="eyebrow">Getting started</span>
      <small>Introduction</small>
      <small data-on>Installation</small>
      <small>Quick start</small>
      <span class="eyebrow">Core concepts</span>
      <small>Projects</small>
      <small>Environments</small>
      <small>Webhooks</small>
      <span class="eyebrow">Reference</span>
      <small>REST API</small>
      <small>Command line</small>
      <small>Configuration</small>
    </nav>

    <main class="dx-main">
      <div class="dx-crumbs"><small>Docs</small><small>/</small><small>Getting started</small><small>/</small><small>Installation</small></div>
      <h1>Installation</h1>
      <p class="dx-lead">Install the Meridian command line tool, connect it to your account, and deploy a first project in a few minutes.</p>

      <div class="dx-callout"><b><small>i</small></b><div><h6>Before you begin</h6><p>You need Node 20 or newer and a Meridian account. Free accounts work for everything on this page.</p></div></div>

      <h2>Install the CLI</h2>
      <p>The CLI is distributed as a single package. Install it globally so the <span class="dx-mono"><small>meridian</small></span> command is available in every project.</p>
      <div class="dx-code">
        <div class="dx-code-bar"><small>Terminal</small><small>Copy</small></div>
        <pre><small>pnpm add -g @meridian/cli
meridian --version</small></pre>
      </div>

      <h3>Sign in</h3>
      <p>Run the login command and follow the prompt in your browser. Your credentials are stored in the system keychain.</p>

      <h4>Using a token instead</h4>
      <p>In CI, skip the browser flow and export a token before running any command.</p>
      <h5>Scopes</h5>
      <p>Tokens are limited to the scopes you grant them.</p>
      <h6>Rotating tokens</h6>
      <p>Rotate tokens every ninety days, or immediately if one is exposed.</p>

      <div class="dx-callout"><b><small>!</small></b><div><h6>Heads up</h6><p>Tokens are shown once. Copy yours somewhere safe before closing the dialog.</p></div></div>

      <h2>Configuration options</h2>
      <p>Create a <span class="dx-mono"><small>meridian.json</small></span> at the root of your project to override the defaults.</p>
      <div class="dx-tablewrap">
        <table class="dx-table">
          <thead><tr><th><small><b>Option</b></small></th><th><small><b>Type</b></small></th><th><small><b>Default</b></small></th><th><small><b>Description</b></small></th></tr></thead>
          <tbody>
            <tr><td><small class="dx-mono">region</small></td><td><small>string</small></td><td><small>auto</small></td><td><small>Where builds run.</small></td></tr>
            <tr><td><small class="dx-mono">retries</small></td><td><small>number</small></td><td><small>3</small></td><td><small>Attempts before a deploy fails.</small></td></tr>
            <tr><td><small class="dx-mono">telemetry</small></td><td><small>boolean</small></td><td><small>true</small></td><td><small>Share anonymous usage data.</small></td></tr>
          </tbody>
        </table>
      </div>

      <h2>Next steps</h2>
      <div class="dx-steps">
        <div class="dx-step"><b><small>1</small></b><div><h5>Create a project</h5><p>Run <span class="dx-mono"><small>meridian init</small></span> in an empty folder.</p></div></div>
        <div class="dx-step"><b><small>2</small></b><div><h5>Deploy</h5><p>Push your first build with a single command and watch it go live.</p></div></div>
      </div>

      <div class="dx-pager">
        <div><small>Previous</small><h6 style="margin: 0.2rem 0 0;">Introduction</h6></div>
        <div><small>Next</small><h6 style="margin: 0.2rem 0 0;">Quick start</h6></div>
      </div>
    </main>

    <aside class="dx-toc">
      <span class="eyebrow">On this page</span>
      <small data-on>Install the CLI</small>
      <small class="sub">Sign in</small>
      <small class="sub">Using a token</small>
      <small>Configuration options</small>
      <small>Next steps</small>
    </aside>
  </div>
</div>
`,
};
