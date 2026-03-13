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
    <div className={`rounded-sm border ${!isEnabled ? "opacity-50" : ""}`}>
      <div className="flex flex-col gap-3 px-3 py-3">
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
                <Label className="text-xs text-muted-foreground">Letter Spacing</Label>
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
                <Label className="text-xs text-muted-foreground">Word Spacing</Label>
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

function ElementTabs({ elements, label }: { elements: TypographyElement[]; label: string }) {
  const expandedElement = useUIStore((s) => s.expandedElement);
  const setExpandedElement = useUIStore((s) => s.setExpandedElement);
  const activeEl = elements.includes(expandedElement as TypographyElement) ? expandedElement : null;

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-semibold text-muted-foreground">{label}</span>
      <div className="flex gap-0.5 rounded-md bg-muted p-0.5">
        {elements.map((el) => {
          const isActive = activeEl === el;
          return (
            <button
              key={el}
              type="button"
              onClick={() => setExpandedElement(isActive ? null : el)}
              className={`flex-1 rounded-sm px-1.5 py-1 text-center font-mono text-xs transition-colors ${
                isActive
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {el}
            </button>
          );
        })}
      </div>
      {activeEl && <ElementRow element={activeEl as TypographyElement} />}
    </div>
  );
}

export function ElementOverridePanel() {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-semibold">Per-Element Overrides</h3>
      <ElementTabs elements={HEADING_ELEMENTS as unknown as TypographyElement[]} label="Headings" />
      <ElementTabs elements={BODY_ELEMENTS as unknown as TypographyElement[]} label="Body" />
    </div>
  );
}
