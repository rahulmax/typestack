"use client";

import { useRef, useEffect, useMemo, useCallback } from "react";
import { usePreviewStyles } from "@/hooks/use-preview-styles";
import { useTypographyStore } from "@/store/typography-store";
import { useUIStore } from "@/store/ui-store";
import { getFontLinkUrl } from "@/lib/google-fonts";
import type { TypographyElement } from "@/types/typography";

const EDITABLE_SELECTOR = "h1,h2,h3,h4,h5,h6,p,blockquote,.eyebrow";

const TAG_TO_ELEMENT: Record<string, TypographyElement> = {
  h1: "h1", h2: "h2", h3: "h3", h4: "h4", h5: "h5", h6: "h6",
  p: "p", small: "small", blockquote: "p",
};

function getTypographyElement(el: HTMLElement): TypographyElement | null {
  if (el.classList.contains("eyebrow")) return "eyebrow";
  if (el.classList.contains("display-1")) return "display-1";
  if (el.classList.contains("display-2")) return "display-2";
  if (el.classList.contains("display-3")) return "display-3";
  return TAG_TO_ELEMENT[el.tagName.toLowerCase()] ?? null;
}

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

type ColorRef = { fg: string; bg: string };

function createLabel(doc: Document, el: HTMLElement, opacity: string, colors: ColorRef): HTMLElement {
  const label = doc.createElement("div");
  label.textContent = getElementLabel(el);
  label.setAttribute("data-ts-label", "true");
  Object.assign(label.style, {
    position: "absolute",
    top: "-18px",
    left: "-2px",
    fontSize: "11px",
    fontWeight: "600",
    lineHeight: "1",
    padding: "2px 6px",
    background: colors.fg,
    color: colors.bg,
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
    opacity,
  });
  return label;
}

function setupEditableListeners(
  doc: Document,
  colorsRef: React.RefObject<ColorRef>,
  onElementFocus: (element: TypographyElement | null) => void,
) {
  let focusLabelEl: HTMLElement | null = null;
  let hoverLabelEl: HTMLElement | null = null;
  let focusedEl: HTMLElement | null = null;

  doc.addEventListener(
    "focus",
    (e) => {
      const el = e.target as HTMLElement;
      if (el.contentEditable !== "true") return;
      const colors = colorsRef.current!;
      focusedEl = el;
      onElementFocus(getTypographyElement(el));

      // Remove hover state if present
      if (hoverLabelEl && hoverLabelEl.parentNode) {
        hoverLabelEl.parentNode.removeChild(hoverLabelEl);
        hoverLabelEl = null;
      }

      el.style.outline = `2px solid ${colors.fg}`;
      el.style.outlineOffset = "2px";
      el.style.borderRadius = "4px";
      el.style.position = "relative";

      focusLabelEl = createLabel(doc, el, "1", colors);
      el.appendChild(focusLabelEl);
    },
    true
  );

  doc.addEventListener(
    "blur",
    (e) => {
      const el = e.target as HTMLElement;
      if (el.contentEditable !== "true") return;
      focusedEl = null;
      onElementFocus(null);

      el.style.outline = "";
      el.style.outlineOffset = "";
      el.style.borderRadius = "";

      if (focusLabelEl && focusLabelEl.parentNode) {
        focusLabelEl.parentNode.removeChild(focusLabelEl);
        focusLabelEl = null;
      }
    },
    true
  );

  doc.addEventListener("mouseover", (e) => {
    const el = (e.target as HTMLElement).closest(EDITABLE_SELECTOR) as HTMLElement | null;
    if (!el || el.contentEditable !== "true" || el === focusedEl) return;
    const colors = colorsRef.current!;

    el.style.outline = `2px solid color-mix(in srgb, ${colors.fg} 35%, transparent)`;
    el.style.outlineOffset = "2px";
    el.style.borderRadius = "4px";
    el.style.position = "relative";

    hoverLabelEl = createLabel(doc, el, "0.35", colors);
    el.appendChild(hoverLabelEl);
  });

  doc.addEventListener("mouseout", (e) => {
    const el = (e.target as HTMLElement).closest(EDITABLE_SELECTOR) as HTMLElement | null;
    if (!el || el.contentEditable !== "true" || el === focusedEl) return;

    el.style.outline = "";
    el.style.outlineOffset = "";
    el.style.borderRadius = "";

    if (hoverLabelEl && hoverLabelEl.parentNode) {
      hoverLabelEl.parentNode.removeChild(hoverLabelEl);
      hoverLabelEl = null;
    }
  });
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
  const foregroundColor = useTypographyStore((s) => s.bodyGroup.color);
  const backgroundColor = useTypographyStore((s) => s.backgroundColor);
  const setExpandedElement = useUIStore((s) => s.setExpandedElement);
  const colorsRef = useRef<ColorRef>({ fg: foregroundColor, bg: backgroundColor });
  colorsRef.current = { fg: foregroundColor, bg: backgroundColor };
  const handleElementFocus = useCallback((element: TypographyElement | null) => {
    setExpandedElement(element);
  }, [setExpandedElement]);

  const fontLinks = useMemo(
    () => [
      getFontLinkUrl(headingFont, [100, 200, 300, 400, 500, 600, 700, 800, 900]),
      getFontLinkUrl(bodyFont, [100, 200, 300, 400, 500, 600, 700, 800, 900]),
    ],
    [headingFont, bodyFont]
  );

  // Build srcdoc only on initial mount or when fonts/viewport change.
  // Template and CSS updates go through effects to avoid full iframe reloads.
  const srcdoc = useMemo(
    () => buildDoc(css, bodyHTML, fontLinks, mobile),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fontLinks, mobile]
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

  // Update body HTML when template changes (no full iframe reload)
  useEffect(() => {
    const doc = iframeRef.current?.contentDocument;
    if (!doc) return;
    doc.body.innerHTML = bodyHTML;
    makeEditable(doc);
    // Re-run any inline scripts (e.g. illustration injection)
    doc.body.querySelectorAll("script").forEach((old) => {
      const s = doc.createElement("script");
      s.textContent = old.textContent;
      old.replaceWith(s);
    });
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

  // Update any active focus/hover outlines and labels when colors change
  useEffect(() => {
    const doc = iframeRef.current?.contentDocument;
    if (!doc) return;

    // Update active focus outline
    const focused = doc.activeElement as HTMLElement | null;
    if (focused?.contentEditable === "true") {
      focused.style.outline = `2px solid ${foregroundColor}`;
    }

    // Update all visible labels
    doc.querySelectorAll("[data-ts-label]").forEach((label) => {
      const el = label as HTMLElement;
      el.style.background = foregroundColor;
      el.style.color = backgroundColor;
    });
  }, [foregroundColor, backgroundColor]);

  const handleLoad = () => {
    const doc = iframeRef.current?.contentDocument;
    if (!doc) return;
    makeEditable(doc);
    setupEditableListeners(doc, colorsRef, handleElementFocus);
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
