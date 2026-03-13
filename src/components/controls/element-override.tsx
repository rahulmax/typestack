"use client";

import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
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

  return (
    <div className={`${!isEnabled ? "opacity-50" : ""}`}>
      <div className="flex flex-col gap-3 pt-3">
          <div className="grid grid-cols-2 gap-x-5 gap-y-4">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs text-muted-foreground">Font Weight</Label>
                <span className="text-xs tabular-nums text-muted-foreground">{override.fontWeight ?? group.fontWeight}</span>
              </div>
              <Slider
                value={[override.fontWeight ?? group.fontWeight]}
                onValueChange={([v]) => handleOverride({ fontWeight: v })}
                min={100}
                max={900}
                step={100}
                formatValue={(v) => String(v)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs text-muted-foreground">Line Height</Label>
                <span className="text-xs tabular-nums text-muted-foreground">{(override.lineHeight ?? group.lineHeight).toFixed(2)}</span>
              </div>
              <Slider
                value={[override.lineHeight ?? group.lineHeight]}
                onValueChange={([v]) => handleOverride({ lineHeight: v })}
                min={0.8}
                max={2.5}
                step={0.05}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs text-muted-foreground">Tracking</Label>
                <span className="text-xs tabular-nums text-muted-foreground">{(override.letterSpacing ?? group.letterSpacing).toFixed(3)}em</span>
              </div>
              <Slider
                value={[override.letterSpacing ?? group.letterSpacing]}
                onValueChange={([v]) => handleOverride({ letterSpacing: v })}
                min={-0.1}
                max={0.2}
                step={0.005}
                formatValue={(v) => v.toFixed(3)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs text-muted-foreground">Word Sp.</Label>
                <span className="text-xs tabular-nums text-muted-foreground">{(override.wordSpacing ?? group.wordSpacing).toFixed(2)}em</span>
              </div>
              <Slider
                value={[override.wordSpacing ?? group.wordSpacing]}
                onValueChange={([v]) => handleOverride({ wordSpacing: v })}
                min={-0.1}
                max={0.5}
                step={0.01}
                formatValue={(v) => v.toFixed(2)}
              />
            </div>
          </div>

          {(() => {
            const defaultTransform = element === "eyebrow" ? "uppercase" : "none";
            const currentTransform = override.textTransform ?? defaultTransform;
            const isUppercase = currentTransform === "uppercase";
            return (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {showCapsToggle && (
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
                    className={`relative inline-flex h-4 w-8 shrink-0 cursor-pointer items-center rounded-sm transition-colors ${
                      isUppercase
                        ? "bg-foreground/25"
                        : "bg-border"
                    }`}
                  >
                    <span
                      className={`pointer-events-none flex h-4 w-2.5 items-center justify-center rounded-sm border border-foreground/15 bg-foreground shadow-sm transition-transform ${
                        isUppercase
                          ? "translate-x-[22px]"
                          : "translate-x-0"
                      }`}
                    >
                      <span className="flex gap-px">
                        <span className="block h-1.5 w-px rounded-full bg-background/40" />
                        <span className="block h-1.5 w-px rounded-full bg-background/40" />
                        <span className="block h-1.5 w-px rounded-full bg-background/40" />
                      </span>
                    </span>
                  </button>
                )}
                {showCapsToggle && (
                  <Label className="text-xs text-muted-foreground">All Caps</Label>
                )}
              </div>
              {override.isOverridden && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => store.clearElementOverride(element)}
                  className="h-6 px-2 text-[10px]"
                >
                  Reset
                </Button>
              )}
            </div>
            );
          })()}
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
          const isFirst = i === 0;
          const isLast = i === ALL_OVERRIDE_ELEMENTS.length - 1;
          return (
            <button
              key={el}
              type="button"
              onClick={() => setExpandedElement(isActive ? null : el)}
              className="hw-btn hw-selector-btn flex-1 flex-col !items-stretch !justify-end !gap-0"
              data-active={isActive}
              style={{
                height: 56,
                borderRadius: 0,
                paddingTop: 6,
                paddingBottom: 8,
                ...(isFirst ? { borderTopLeftRadius: 4, borderBottomLeftRadius: 4 } : {}),
                ...(isLast ? { borderTopRightRadius: 4, borderBottomRightRadius: 4 } : {}),
                ...(!isFirst ? { borderLeftWidth: 0 } : {}),
              }}
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
