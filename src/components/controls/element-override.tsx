"use client";

import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RotateCcw } from "lucide-react";
import { useTypographyStore, isHeadingElement } from "@/store/typography-store";
import { useUIStore } from "@/store/ui-store";
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

  const showCapsToggle =
    HEADING_ELEMENTS.includes(element) ||
    DISPLAY_ELEMENTS.includes(element) ||
    element === "eyebrow";

  const fontWeight = override.fontWeight ?? group.fontWeight;
  const lineHeight = override.lineHeight ?? group.lineHeight;
  const letterSpacing = override.letterSpacing ?? group.letterSpacing;
  const wordSpacing = override.wordSpacing ?? group.wordSpacing;
  const defaultTransform = element === "eyebrow" ? "uppercase" : "none";
  const currentTransform = override.textTransform ?? defaultTransform;
  const isUppercase = currentTransform === "uppercase";

  const hasFontWeightOverride = override.fontWeight !== undefined && override.fontWeight !== group.fontWeight;
  const hasLineHeightOverride = override.lineHeight !== undefined && override.lineHeight !== group.lineHeight;
  const hasLetterSpacingOverride = override.letterSpacing !== undefined && override.letterSpacing !== group.letterSpacing;
  const hasWordSpacingOverride = override.wordSpacing !== undefined && override.wordSpacing !== group.wordSpacing;
  const hasCapsOverride = override.textTransform !== undefined && override.textTransform !== defaultTransform;

  const clearField = (field: keyof GroupProperties) => {
    const s = useTypographyStore.getState();
    const cur = { ...s.overrides[element] };
    delete cur[field];
    const hasAny = Object.keys(cur).some((k) => k !== "isOverridden");
    useTypographyStore.setState({
      overrides: { ...s.overrides, [element]: { ...cur, isOverridden: hasAny } },
    });
  };

  const clearCaps = () => {
    const s = useTypographyStore.getState();
    const cur = { ...s.overrides[element] };
    delete cur.textTransform;
    const hasAny = Object.keys(cur).some((k) => k !== "isOverridden");
    useTypographyStore.setState({
      overrides: { ...s.overrides, [element]: { ...cur, isOverridden: hasAny } },
    });
  };

  return (
    <div className={`${!isEnabled ? "opacity-50" : ""}`}>
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
              />
            </div>
          </div>

          {showCapsToggle && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const s = useTypographyStore.getState();
                  const cur = s.overrides[element];
                  const next = isUppercase ? "none" : "uppercase";
                  useTypographyStore.setState({
                    overrides: {
                      ...s.overrides,
                      [element]: { ...cur, isOverridden: true, textTransform: next },
                    },
                  });
                }}
                className={`hw-btn flex-1 ${isUppercase ? "" : "opacity-50"}`}
                data-active={isUppercase}
                style={{ height: 36 }}
              >
                <span className="text-xs">ALL CAPS</span>
              </button>
              {hasCapsOverride && (
                <button type="button" onClick={clearCaps} className="text-muted-foreground hover:text-foreground p-1">
                  <RotateCcw className="size-3" />
                </button>
              )}
            </div>
          )}
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

export function ElementOverridePanel() {
  const expandedElement = useUIStore((s) => s.expandedElement);
  const setExpandedElement = useUIStore((s) => s.setExpandedElement);
  const overrides = useTypographyStore((s) => s.overrides);
  const activeEl = ALL_OVERRIDE_ELEMENTS.includes(expandedElement as TypographyElement)
    ? expandedElement
    : null;

  return (
    <div className="flex flex-col gap-4">
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
      {activeEl && <ElementRow element={activeEl as TypographyElement} />}
    </div>
  );
}
