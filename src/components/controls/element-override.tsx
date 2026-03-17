"use client";

import { useRef, useEffect, useContext, useCallback } from "react";
import { createPortal } from "react-dom";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RotateCcw } from "lucide-react";
import { useTypographyStore, isHeadingElement } from "@/store/typography-store";
import { useUIStore } from "@/store/ui-store";
import { SidebarOverflowContext } from "@/components/layout/sidebar";
import { AnimateExpand } from "@/components/ui/animate-expand";
import type { TypographyElement, GroupProperties } from "@/types/typography";
import { HEADING_ELEMENTS, DISPLAY_ELEMENTS, OPTIONAL_ELEMENTS, BODY_ELEMENTS } from "@/types/typography";

function ElementRow({ element }: { element: TypographyElement }) {
  const store = useTypographyStore();
  const override = store.overrides[element] ?? { isOverridden: false };
  const isOptional = OPTIONAL_ELEMENTS.includes(element);
  const isEnabled = isOptional ? !!store.enabledElements[element] : true;

  const group: GroupProperties = isHeadingElement(element)
    ? store.headingsGroup
    : store.bodyGroup;

  const handleOverride = (props: Partial<GroupProperties>) => {
    store.setElementOverride(element, props);
  };

  const fontWeight = override.fontWeight ?? group.fontWeight;
  const lineHeight = override.lineHeight ?? group.lineHeight;
  const letterSpacing = override.letterSpacing ?? group.letterSpacing;
  const wordSpacing = override.wordSpacing ?? group.wordSpacing;
  const hasFontWeightOverride = override.fontWeight !== undefined && override.fontWeight !== group.fontWeight;
  const hasLineHeightOverride = override.lineHeight !== undefined && override.lineHeight !== group.lineHeight;
  const hasLetterSpacingOverride = override.letterSpacing !== undefined && override.letterSpacing !== group.letterSpacing;
  const hasWordSpacingOverride = override.wordSpacing !== undefined && override.wordSpacing !== group.wordSpacing;

  const clearField = (field: keyof GroupProperties) => {
    const s = useTypographyStore.getState();
    const cur = { ...s.overrides[element] };
    delete cur[field];
    const hasAny = Object.keys(cur).some((k) => k !== "isOverridden");
    useTypographyStore.setState({
      overrides: { ...s.overrides, [element]: { ...cur, isOverridden: hasAny } },
    });
  };

  return (
    <div className={`pr-[30px] ${!isEnabled ? "opacity-50" : ""}`}>
      <div className="flex flex-col gap-3 pt-3">
          <div className="grid grid-cols-2 gap-x-5 gap-y-4">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Label className="text-xs text-muted-foreground">Font Weight</Label>
                  {hasFontWeightOverride && (
                    <button type="button" onClick={() => clearField("fontWeight")} className="text-muted-foreground hover:text-foreground">
                      <RotateCcw className="size-2.5" />
                    </button>
                  )}
                </div>
                <span className="text-xs tabular-nums text-muted-foreground">{fontWeight}</span>
              </div>
              <Slider
                value={[fontWeight]}
                onValueChange={([v]) => handleOverride({ fontWeight: v })}
                min={100}
                max={900}
                step={100}
                formatValue={(v) => String(v)}
                onReset={() => clearField("fontWeight")}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Label className="text-xs text-muted-foreground">Line Height</Label>
                  {hasLineHeightOverride && (
                    <button type="button" onClick={() => clearField("lineHeight")} className="text-muted-foreground hover:text-foreground">
                      <RotateCcw className="size-2.5" />
                    </button>
                  )}
                </div>
                <span className="text-xs tabular-nums text-muted-foreground">{lineHeight.toFixed(2)}</span>
              </div>
              <Slider
                value={[lineHeight]}
                onValueChange={([v]) => handleOverride({ lineHeight: v })}
                min={0.8}
                max={2.5}
                step={0.05}
                onReset={() => clearField("lineHeight")}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Label className="text-xs text-muted-foreground">Tracking</Label>
                  {hasLetterSpacingOverride && (
                    <button type="button" onClick={() => clearField("letterSpacing")} className="text-muted-foreground hover:text-foreground">
                      <RotateCcw className="size-2.5" />
                    </button>
                  )}
                </div>
                <span className="text-xs tabular-nums text-muted-foreground">{letterSpacing.toFixed(3)}em</span>
              </div>
              <Slider
                value={[letterSpacing]}
                onValueChange={([v]) => handleOverride({ letterSpacing: v })}
                min={-0.1}
                max={0.2}
                step={0.005}
                formatValue={(v) => v.toFixed(3)}
                onReset={() => clearField("letterSpacing")}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Label className="text-xs text-muted-foreground">Word Sp.</Label>
                  {hasWordSpacingOverride && (
                    <button type="button" onClick={() => clearField("wordSpacing")} className="text-muted-foreground hover:text-foreground">
                      <RotateCcw className="size-2.5" />
                    </button>
                  )}
                </div>
                <span className="text-xs tabular-nums text-muted-foreground">{wordSpacing.toFixed(2)}em</span>
              </div>
              <Slider
                value={[wordSpacing]}
                onValueChange={([v]) => handleOverride({ wordSpacing: v })}
                min={-0.1}
                max={0.5}
                step={0.01}
                formatValue={(v) => v.toFixed(2)}
                onReset={() => clearField("wordSpacing")}
              />
            </div>
          </div>

        </div>
    </div>
  );
}

const SHORT_LABELS: Partial<Record<TypographyElement, string>> = {
  eyebrow: "e",
  small: "s",
};

const ALL_OVERRIDE_ELEMENTS: TypographyElement[] = [
  ...(HEADING_ELEMENTS as unknown as TypographyElement[]),
  ...(BODY_ELEMENTS as unknown as TypographyElement[]),
];

const BUTTON_STYLES: React.CSSProperties[] = ALL_OVERRIDE_ELEMENTS.map((_, i) => {
  const isFirst = i === 0
  const isLast = i === ALL_OVERRIDE_ELEMENTS.length - 1
  return {
    height: 56,
    borderRadius: 0,
    paddingTop: 6,
    paddingBottom: 8,
    ...(isFirst ? { borderTopLeftRadius: 4, borderBottomLeftRadius: 4 } : {}),
    ...(isLast ? { borderTopRightRadius: 4, borderBottomRightRadius: 4 } : {}),
    ...(!isFirst ? { borderLeftWidth: 0 } : {}),
  }
})

function CapsSwitch({ element, anchorRef }: { element: TypographyElement; anchorRef: React.RefObject<HTMLDivElement | null> }) {
  const override = useTypographyStore((s) => s.overrides[element] ?? { isOverridden: false })
  const defaultTransform = element === "eyebrow" ? "uppercase" : "none"
  const currentTransform = override.textTransform ?? defaultTransform
  const isUppercase = currentTransform === "uppercase"
  const ctx = useContext(SidebarOverflowContext)
  const grooveRef = useRef<HTMLDivElement>(null)
  const btnContainerRef = useRef<HTMLDivElement>(null)

  const showCapsToggle =
    HEADING_ELEMENTS.includes(element) ||
    DISPLAY_ELEMENTS.includes(element) ||
    element === "eyebrow" ||
    element === "p" ||
    element === "small"

  const grooveOnly = element === "p" || element === "small"

  const lastGoodY = useRef<number | null>(null)

  const applyPosition = useCallback((topY: number) => {
    lastGoodY.current = topY
    if (grooveRef.current) grooveRef.current.style.top = `${topY}px`
    if (btnContainerRef.current) btnContainerRef.current.style.top = `${topY}px`
  }, [])

  const updatePosition = useCallback(() => {
    if (!anchorRef.current || !ctx?.portalRef.current) return
    const anchorRect = anchorRef.current.getBoundingClientRect()
    // Skip if anchor collapsed (animation in progress) — keep last good position
    if (anchorRect.height < 10) return
    const portalRect = ctx.portalRef.current.getBoundingClientRect()
    const topY = anchorRect.top - portalRect.top + 36
    applyPosition(topY)
  }, [anchorRef, ctx, applyPosition])

  // Continuously track position via ResizeObserver + scroll + rAF during mount
  useEffect(() => {
    const anchor = anchorRef.current
    const scroll = ctx?.scrollRef.current
    if (!anchor) return

    // Initial positioning with rAF polling for animation duration
    let raf: number
    let elapsed = 0
    const tick = () => {
      updatePosition()
      elapsed += 16
      if (elapsed < 500) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    // ResizeObserver catches layout shifts after animation settles
    const ro = new ResizeObserver(() => updatePosition())
    ro.observe(anchor)

    if (scroll) {
      scroll.addEventListener("scroll", updatePosition, { passive: true })
    }

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      if (scroll) scroll.removeEventListener("scroll", updatePosition)
    }
  }, [updatePosition, anchorRef, ctx])

  const toggle = useCallback(() => {
    const s = useTypographyStore.getState()
    const cur = { ...s.overrides[element] }
    const next = isUppercase ? "none" : "uppercase"
    if (next === defaultTransform) {
      delete cur.textTransform
      const hasAny = Object.keys(cur).some((k) => k !== "isOverridden")
      useTypographyStore.setState({
        overrides: { ...s.overrides, [element]: { ...cur, isOverridden: hasAny } },
      })
    } else {
      useTypographyStore.setState({
        overrides: {
          ...s.overrides,
          [element]: { ...cur, isOverridden: true, textTransform: next },
        },
      })
    }
  }, [element, isUppercase, defaultTransform])

  if (!showCapsToggle || !ctx?.portalRef.current) return null

  return createPortal(
    <>
      {/* Groove — flush right inside sidebar, clickable */}
      <div
        ref={grooveRef}
        className="caps-switch-groove absolute pointer-events-auto cursor-pointer"
        style={{ right: 0 }}
        onMouseDown={toggle}
      >
        <div
          className="caps-switch-indicator"
          style={{ opacity: isUppercase ? 1 : 0 }}
        />
        <span
          className="caps-switch-off-label"
          style={{
            fontFamily: 'var(--font-host-grotesk), system-ui, sans-serif',
            fontSize: 7,
            fontWeight: 600,
            letterSpacing: '1.5px',
          }}
        >
          OFF
        </span>
      </div>
      {/* Button — outside sidebar (hidden for groove-only elements) */}
      <div
        ref={btnContainerRef}
        className="pointer-events-auto absolute z-20"
        style={{ right: -3, display: grooveOnly ? 'none' : undefined }}
      >
      <button
        type="button"
        onMouseDown={toggle}
        className={`caps-switch-thumb ${isUppercase ? "caps-switch-on" : "caps-switch-off"}`}
      >
        {/* gripper = */}
        <div className="flex flex-col gap-[3px] pointer-events-none">
          <span className="block w-2 h-px bg-stone-400/15 dark:bg-white/12" />
          <span className="block w-2 h-px bg-stone-400/15 dark:bg-white/12" />
        </div>
        <span
          className="caps-switch-label"
          style={{
            fontFamily: 'var(--font-host-grotesk), system-ui, sans-serif',
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: '2px',
          }}
        >
          CAPS
        </span>
        {/* gripper = */}
        <div className="flex flex-col gap-[3px] pointer-events-none">
          <span className="block w-2 h-px bg-stone-400/15 dark:bg-white/12" />
          <span className="block w-2 h-px bg-stone-400/15 dark:bg-white/12" />
        </div>
      </button>
    </div>
    </>,
    ctx.portalRef.current
  )
}

export function ElementOverridePanel() {
  const expandedElement = useUIStore((s) => s.expandedElement);
  const setExpandedElement = useUIStore((s) => s.setExpandedElement);
  const overrides = useTypographyStore((s) => s.overrides);
  const activeEl = ALL_OVERRIDE_ELEMENTS.includes(expandedElement as TypographyElement)
    ? expandedElement
    : null;

  const capsAnchorRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative flex flex-col gap-4">
      <h3 className="text-sm font-semibold">Per-Element Overrides</h3>
      <div className="hw-btn-group flex">
        {ALL_OVERRIDE_ELEMENTS.map((el, i) => {
          const isActive = activeEl === el;
          const hasOverride = overrides[el]?.isOverridden;
          return (
            <button
              key={el}
              type="button"
              onClick={() => setExpandedElement(isActive ? null : el)}
              className="hw-btn hw-selector-btn flex-1 flex-col !items-stretch !justify-end !gap-0"
              data-active={isActive}
              style={BUTTON_STYLES[i]}
            >
              <div className="flex justify-center">
                <span
                  className="block rounded-sm transition-all"
                  style={{
                    width: 12,
                    height: 3,
                    backgroundColor: hasOverride ? '#f59e0b' : 'color-mix(in srgb, currentColor 15%, transparent)',
                    boxShadow: hasOverride ? '0 0 6px 1px rgba(245, 158, 11, 0.4)' : 'none',
                  }}
                />
              </div>
              <span className="relative mt-auto text-[11px]">{SHORT_LABELS[el] || el}</span>
            </button>
          );
        })}
      </div>
      <AnimateExpand open={!!activeEl}>
        <div ref={capsAnchorRef} className="relative">
          {activeEl && (
            <ElementRow element={activeEl as TypographyElement} />
          )}
        </div>
      </AnimateExpand>
      {activeEl && (
        <CapsSwitch element={activeEl as TypographyElement} anchorRef={capsAnchorRef} />
      )}
    </div>
  );
}
