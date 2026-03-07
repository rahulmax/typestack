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
          <div className="flex flex-col gap-2">
            <Label className="text-xs text-muted-foreground">
              Font Weight: {override.isOverridden && override.fontWeight !== undefined ? override.fontWeight : group.fontWeight}
            </Label>
            <Slider
              value={[override.fontWeight ?? group.fontWeight]}
              onValueChange={([v]) => handleOverride({ fontWeight: v })}
              min={100}
              max={900}
              step={100}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-xs text-muted-foreground">
              Line Height:{" "}
              {(override.lineHeight ?? group.lineHeight).toFixed(2)}
            </Label>
            <Slider
              value={[override.lineHeight ?? group.lineHeight]}
              onValueChange={([v]) => handleOverride({ lineHeight: v })}
              min={0.8}
              max={2.5}
              step={0.05}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-xs text-muted-foreground">
              Letter Spacing:{" "}
              {(override.letterSpacing ?? group.letterSpacing).toFixed(3)}em
            </Label>
            <Slider
              value={[override.letterSpacing ?? group.letterSpacing]}
              onValueChange={([v]) => handleOverride({ letterSpacing: v })}
              min={-0.1}
              max={0.2}
              step={0.005}
            />
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
                    className={`relative inline-flex h-[22px] w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors before:absolute before:left-[7px] before:top-1/2 before:h-2.5 before:w-[2px] before:-translate-y-1/2 before:rounded-full before:bg-white/70 before:transition-opacity ${
                      isUppercase
                        ? "bg-accent-warm shadow-[inset_0_1px_3px_rgba(0,0,0,0.15)] before:opacity-100"
                        : "bg-muted shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] before:opacity-0"
                    }`}
                  >
                    <span
                      className={`pointer-events-none relative inline-block h-[18px] w-[18px] rounded-full bg-background ring-0 transition-transform after:absolute after:left-1/2 after:top-1/2 after:h-1.5 after:w-1.5 after:-translate-x-1/2 after:-translate-y-1/2 after:rounded-full ${
                        isUppercase
                          ? "translate-x-[18px] shadow-[0_1px_4px_rgba(0,0,0,0.15),0_0_0_1px_rgba(0,0,0,0.05)] after:bg-accent-warm"
                          : "translate-x-0 shadow-[0_1px_3px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.04)] after:bg-border"
                      }`}
                    />
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
