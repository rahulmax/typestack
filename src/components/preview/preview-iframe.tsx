"use client";

import { useRef, useEffect, useMemo } from "react";
import { usePreviewStyles } from "@/hooks/use-preview-styles";
import { useTypographyStore } from "@/store/typography-store";
import { getFontLinkUrl } from "@/lib/google-fonts";

const EDITABLE_SELECTOR = "h1,h2,h3,h4,h5,h6,p,blockquote,.eyebrow";

function makeEditable(doc: Document) {
  doc.querySelectorAll(EDITABLE_SELECTOR).forEach((el) => {
    if (!el.querySelector("input,select,textarea,button,svg")) {
      (el as HTMLElement).contentEditable = "true";
    }
  });
}

function getElementLabel(el: HTMLElement): string {
  const tag = el.tagName.toLowerCase();
  // Check for class-based elements first
  if (el.classList.contains("eyebrow")) return "Eyebrow";
  if (el.classList.contains("display-1")) return "Display 1";
  if (el.classList.contains("display-2")) return "Display 2";
  if (el.classList.contains("display-3")) return "Display 3";
  const labels: Record<string, string> = {
    h1: "Heading 1", h2: "Heading 2", h3: "Heading 3",
    h4: "Heading 4", h5: "Heading 5", h6: "Heading 6",
    p: "Paragraph", small: "Small", span: "Span",
    blockquote: "Blockquote", label: "Label",
    td: "Table Cell", th: "Table Header", li: "List Item",
  };
  return labels[tag] || tag;
}

function setupEditableListeners(doc: Document) {
  let labelEl: HTMLElement | null = null;

  doc.addEventListener(
    "focus",
    (e) => {
      const el = e.target as HTMLElement;
      if (el.contentEditable !== "true") return;

      el.style.outline = "2px solid #3b82f6";
      el.style.outlineOffset = "2px";
      el.style.borderRadius = "4px";
      el.style.position = "relative";

      labelEl = doc.createElement("div");
      labelEl.textContent = getElementLabel(el);
      Object.assign(labelEl.style, {
        position: "absolute",
        top: "-18px",
        left: "-2px",
        fontSize: "11px",
        fontWeight: "600",
        lineHeight: "1",
        padding: "2px 6px",
        background: "#3b82f6",
        color: "#fff",
        borderRadius: "3px 3px 0 0",
        pointerEvents: "none",
        whiteSpace: "nowrap",
        fontFamily: "system-ui, sans-serif",
        zIndex: "9999",
        letterSpacing: "normal",
        textTransform: "none",
        fontStyle: "normal",
        textDecoration: "none",
        wordSpacing: "normal",
      });
      el.appendChild(labelEl);
    },
    true
  );

  doc.addEventListener(
    "blur",
    (e) => {
      const el = e.target as HTMLElement;
      if (el.contentEditable !== "true") return;

      el.style.outline = "";
      el.style.outlineOffset = "";
      el.style.borderRadius = "";

      if (labelEl && labelEl.parentNode) {
        labelEl.parentNode.removeChild(labelEl);
        labelEl = null;
      }
    },
    true
  );
}

interface PreviewIframeProps {
  bodyHTML: string;
  mobile?: boolean;
}

function buildDoc(css: string, bodyHTML: string, fontLinks: string[], mobile?: boolean): string {
  const linkTags = fontLinks
    .map((url) => `<link rel="stylesheet" href="${url}" />`)
    .join("\n");

  const mobileStyle = mobile ? `body { overflow-x: hidden; }` : "";

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  ${linkTags}
  <style>${mobileStyle}</style>
  <style id="typestack-styles">${css}</style>
</head>
<body>${bodyHTML}</body>
</html>`;
}

export function PreviewIframe({ bodyHTML, mobile }: PreviewIframeProps) {
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
    () => buildDoc(css, bodyHTML, fontLinks, mobile),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [bodyHTML, fontLinks, mobile]
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
    makeEditable(doc);
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

  const handleLoad = () => {
    const doc = iframeRef.current?.contentDocument;
    if (!doc) return;
    makeEditable(doc);
    setupEditableListeners(doc);
  };

  return (
    <iframe
      ref={iframeRef}
      srcDoc={srcdoc}
      className="h-full w-full border-0"
      style={mobile ? undefined : { minHeight: "calc(100vh - 10rem)" }}
      title="Typography Preview"
      onLoad={handleLoad}
    />
  );
}
