"use client";

import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useTypographyStore, isHeadingElement } from "@/store/typography-store";
import { useUIStore } from "@/store/ui-store";
import { resolveElementStyles } from "@/lib/scale";
import type { TypographyElement, GroupProperties } from "@/types/typography";
import { ALL_ELEMENTS, HEADING_ELEMENTS } from "@/types/typography";

function ElementRow({ element }: { element: TypographyElement }) {
  const store = useTypographyStore();
  const expandedElement = useUIStore((s) => s.expandedElement);
  const setExpandedElement = useUIStore((s) => s.setExpandedElement);
  const override = store.overrides[element];
  const isExpanded = expandedElement === element;

  const resolved = resolveElementStyles(element, store);

  const group: GroupProperties = isHeadingElement(element)
    ? store.headingsGroup
    : store.bodyGroup;

  const handleOverride = (props: Partial<GroupProperties>) => {
    store.setElementOverride(element, props);
  };

  return (
    <div className="rounded-md border">
      <button
        type="button"
        className="flex w-full items-center justify-between px-3 py-2 text-sm hover:bg-accent"
        onClick={() => setExpandedElement(isExpanded ? null : element)}
      >
        <div className="flex items-center gap-2">
          <span className="font-mono font-medium">{element}</span>
          <span className="text-xs text-muted-foreground">
            {resolved.fontSizeRem.toFixed(3)}rem
          </span>
          {override.isOverridden && (
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          )}
        </div>
        <span className="text-xs text-muted-foreground">
          {isExpanded ? "−" : "+"}
        </span>
      </button>

      {isExpanded && (
        <div className="flex flex-col gap-3 border-t px-3 py-3">
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

          {HEADING_ELEMENTS.includes(element) && (
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">All Caps</Label>
              <button
                type="button"
                onClick={() => {
                  const s = useTypographyStore.getState();
                  const cur = s.overrides[element];
                  const next = (cur.textTransform || "none") === "uppercase" ? "none" : "uppercase";
                  useTypographyStore.setState({
                    overrides: {
                      ...s.overrides,
                      [element]: { ...cur, isOverridden: true, textTransform: next },
                    },
                  });
                }}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                  (override.textTransform || "none") === "uppercase" ? "bg-primary" : "bg-muted"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-background shadow-sm ring-0 transition-transform ${
                    (override.textTransform || "none") === "uppercase" ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          )}

          {override.isOverridden && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => store.clearElementOverride(element)}
              className="self-start text-xs"
            >
              Reset Override
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export function ElementOverridePanel() {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold">Per-Element Overrides</h3>
      <div className="flex flex-col gap-2">
        {ALL_ELEMENTS.map((el) => (
          <ElementRow key={el} element={el} />
        ))}
      </div>
    </div>
  );
}
