"use client";

import { useRef, useEffect, useMemo, useCallback } from "react";
import { usePreviewStyles } from "@/hooks/use-preview-styles";
import { useTypographyStore } from "@/store/typography-store";
import { useUIStore } from "@/store/ui-store";
import { getFontLinkUrls } from "@/lib/fonts";
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

// The label floats on the page above the element instead of inside it: a child, even an absolutely
// positioned one, makes text-wrap: balance re-break the heading, so it jumped on hover.
function createLabel(doc: Document, el: HTMLElement, opacity: string, colors: ColorRef): HTMLElement {
  const label = doc.createElement("div");
  const rect = el.getBoundingClientRect();
  const win = doc.defaultView;
  label.textContent = getElementLabel(el);
  label.setAttribute("data-ts-label", "true");
  label.contentEditable = "false";
  Object.assign(label.style, {
    position: "absolute",
    top: `${rect.top + (win?.scrollY ?? 0) - 18}px`,
    left: `${rect.left + (win?.scrollX ?? 0) - 2}px`,
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
    userSelect: "none",
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

      focusLabelEl = createLabel(doc, el, "1", colors);
      doc.body.appendChild(focusLabelEl);
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

    hoverLabelEl = createLabel(doc, el, "0.35", colors);
    doc.body.appendChild(hoverLabelEl);
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

function applyBody(doc: Document, bodyHTML: string) {
  doc.body.innerHTML = bodyHTML;
  makeEditable(doc);
  // Re-run any inline scripts (e.g. illustration injection)
  doc.body.querySelectorAll("script").forEach((old) => {
    const s = doc.createElement("script");
    s.textContent = old.textContent;
    old.replaceWith(s);
  });
}

interface PreviewIframeProps {
  bodyHTML: string;
  mobile?: boolean;
  /** Content width (px) to keep clear of the phone overlay; null when the phone is hidden. */
  phoneRoom?: number | null;
  /** Magnification. The page keeps its layout width and is scaled, so nothing reflows. */
  zoom?: number;
}

// Width of the phone overlay plus a gap, measured from the iframe's right edge
const PHONE_CLEARANCE = 400;

// Right padding that moves the page out from under the phone, but never below its content width
function applyPhoneRoom(doc: Document, room: number | null | undefined) {
  const root = doc.documentElement;
  if (room) {
    root.style.setProperty("--phone-pad", `clamp(0px, 100vw - ${room + 64}px, ${PHONE_CLEARANCE}px)`);
  } else {
    root.style.removeProperty("--phone-pad");
  }
}

function buildDoc(css: string, bodyHTML: string, fontLinks: string[], mobile?: boolean): string {
  const linkTags = fontLinks
    .map((url) => `<link rel="stylesheet" href="${url}" />`)
    .join("\n");

  const mobileStyle = mobile
    ? `body { overflow-x: hidden; }`
    : `html body { padding-right: calc(2rem + var(--phone-pad, 0px)); transition: padding-right 0.3s ease; }`;

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

export function PreviewIframe({ bodyHTML, mobile, phoneRoom, zoom = 1 }: PreviewIframeProps) {
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
    () =>
      getFontLinkUrls(
        [headingFont, bodyFont],
        [100, 200, 300, 400, 500, 600, 700, 800, 900]
      ),
    [headingFont, bodyFont]
  );

  // Build srcdoc only on initial mount or when fonts/viewport change.
  // Template and CSS updates go through effects to avoid full iframe reloads.
  // Remember which body the srcdoc was built with: a template switch while the
  // iframe is still loading lands on the old document and must be re-applied.
  const built = useMemo(
    () => ({ html: buildDoc(css, bodyHTML, fontLinks, mobile), body: bodyHTML }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fontLinks, mobile]
  );
  const bodyRef = useRef(bodyHTML);
  bodyRef.current = bodyHTML;
  const cssRef = useRef(css);
  cssRef.current = css;
  const phoneRoomRef = useRef(phoneRoom);
  phoneRoomRef.current = phoneRoom;

  useEffect(() => {
    const doc = iframeRef.current?.contentDocument;
    if (doc) applyPhoneRoom(doc, phoneRoom);
  }, [phoneRoom]);

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
    applyBody(doc, bodyHTML);
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
    const styleEl = doc.getElementById("typestack-styles");
    if (styleEl) styleEl.textContent = cssRef.current;
    if (bodyRef.current !== built.body) applyBody(doc, bodyRef.current);
    applyPhoneRoom(doc, phoneRoomRef.current);
    makeEditable(doc);
    setupEditableListeners(doc, colorsRef, handleElementFocus);
  };

  const iframe = (
    <iframe
      ref={iframeRef}
      srcDoc={built.html}
      className={mobile ? "h-full w-full border-0" : "absolute left-0 top-0 border-0"}
      style={
        mobile
          ? undefined
          : {
              // Laid out at the frame's width and height, then scaled to the zoom
              width: `${100 / zoom}%`,
              height: `${100 / zoom}%`,
              transform: zoom === 1 ? undefined : `scale(${zoom})`,
              transformOrigin: "0 0",
            }
      }
      title="Typography Preview"
      onLoad={handleLoad}
    />
  );
  if (mobile) return iframe;

  // The sizer takes the zoomed size: centred when smaller than the frame, scrolled sideways when larger
  return (
    <div className="overflow-x-auto overflow-y-hidden" style={{ height: "calc(100vh - 10rem)" }}>
      <div className="relative mx-auto h-full overflow-hidden" style={{ width: `${zoom * 100}%` }}>
        {iframe}
      </div>
    </div>
  );
}
