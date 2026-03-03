"use client";

import { useComputedScale } from "@/hooks/use-computed-scale";
import { useTypographyStore } from "@/store/typography-store";
import { useUIStore } from "@/store/ui-store";
import type { ResolvedElementStyle } from "@/types/typography";

function ScaleRow({ style, sampleText }: { style: ResolvedElementStyle; sampleText: string }) {
  const expandedElement = useUIStore((s) => s.expandedElement);
  const setExpandedElement = useUIStore((s) => s.setExpandedElement);
  const isActive = expandedElement === style.element;

  return (
    <button
      type="button"
      className={`group flex w-full items-start gap-4 rounded-lg border p-4 text-left transition-colors hover:bg-accent/15 ${isActive ? "border-primary bg-accent/20" : "border-transparent"}`}
      onClick={() => setExpandedElement(isActive ? null : style.element)}
    >
      <div className="flex w-24 shrink-0 flex-col gap-0.5 pt-1">
        <span className="font-mono text-sm font-semibold" style={{ color: style.color }}>{style.element}</span>
        <span className="text-xs" style={{ color: style.color, opacity: 0.6 }}>
          {style.fontSizeRem.toFixed(3)}rem
        </span>
        <span className="text-xs" style={{ color: style.color, opacity: 0.6 }}>
          {style.fontSize.toFixed(1)}px
        </span>
      </div>
      <div
        className="min-w-0 flex-1"
        style={{
          fontSize: `${style.fontSizeRem}rem`,
          fontFamily: `'${style.fontFamily}', sans-serif`,
          fontWeight: style.fontWeight,
          lineHeight: style.lineHeight,
          letterSpacing: `${style.letterSpacing}em`,
          wordSpacing: `${style.wordSpacing}em`,
          color: style.color,
          textTransform: style.textTransform as React.CSSProperties['textTransform'],
        }}
      >
        {sampleText}
      </div>
    </button>
  );
}

export function TypeScaleView() {
  const { desktop } = useComputedScale();
  const sampleText = useTypographyStore((s) => s.sampleText);
  const backgroundColor = useTypographyStore((s) => s.backgroundColor);

  return (
    <div
      className="flex flex-col gap-2 p-6"
      style={{ backgroundColor }}
    >
      {desktop.map((style) => (
        <ScaleRow key={style.element} style={style} sampleText={sampleText} />
      ))}
    </div>
  );
}
