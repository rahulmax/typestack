"use client";

import { useRef, useEffect, useMemo } from "react";
import { usePreviewStyles } from "@/hooks/use-preview-styles";
import { useTypographyStore } from "@/store/typography-store";
import { getFontLinkUrl } from "@/lib/google-fonts";

interface PreviewIframeProps {
  bodyHTML: string;
}

function buildDoc(css: string, bodyHTML: string, fontLinks: string[]): string {
  const linkTags = fontLinks
    .map((url) => `<link rel="stylesheet" href="${url}" />`)
    .join("\n");

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  ${linkTags}
  <style id="typestack-styles">${css}</style>
</head>
<body>${bodyHTML}</body>
</html>`;
}

export function PreviewIframe({ bodyHTML }: PreviewIframeProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const css = usePreviewStyles();
  const headingFont = useTypographyStore((s) => s.headingsGroup.fontFamily);
  const bodyFont = useTypographyStore((s) => s.bodyGroup.fontFamily);

  const fontLinks = useMemo(
    () => [
      getFontLinkUrl(headingFont, [100, 200, 300, 400, 500, 600, 700, 800, 900]),
      getFontLinkUrl(bodyFont, [100, 200, 300, 400, 500, 600, 700, 800, 900]),
    ],
    [headingFont, bodyFont]
  );

  // Build srcdoc only when template or fonts change — NOT on CSS changes.
  // CSS updates go through the effect below to avoid full iframe reload.
  const srcdoc = useMemo(
    () => buildDoc(css, bodyHTML, fontLinks),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [bodyHTML, fontLinks]
  );

  // Incremental CSS update (no iframe reload)
  useEffect(() => {
    const doc = iframeRef.current?.contentDocument;
    if (!doc) return;
    const styleEl = doc.getElementById("typestack-styles");
    if (styleEl) {
      styleEl.textContent = css;
    }
  }, [css]);

  // Update body HTML when template changes
  useEffect(() => {
    const doc = iframeRef.current?.contentDocument;
    if (!doc) return;
    doc.body.innerHTML = bodyHTML;
  }, [bodyHTML]);

  // Update font links when fonts change
  useEffect(() => {
    const doc = iframeRef.current?.contentDocument;
    if (!doc) return;
    doc.querySelectorAll('link[data-gf]').forEach(el => el.remove());
    for (const url of fontLinks) {
      const link = doc.createElement("link");
      link.rel = "stylesheet";
      link.href = url;
      link.setAttribute("data-gf", "true");
      doc.head.appendChild(link);
    }
  }, [fontLinks]);

  return (
    <iframe
      ref={iframeRef}
      srcDoc={srcdoc}
      className="h-full w-full border-0"
      style={{ minHeight: "calc(100vh - 10rem)" }}
      title="Typography Preview"
    />
  );
}
