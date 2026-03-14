"use client";

import { memo, useMemo, useState, useCallback } from "react";
import { useComputedScale } from "@/hooks/use-computed-scale";
import { useTypographyStore } from "@/store/typography-store";
import { useUIStore } from "@/store/ui-store";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PANGRAMS } from "@/data/pangrams";
import type { ResolvedElementStyle } from "@/types/typography";


const CUSTOM_VALUE = "__custom__";

function SampleTextSelector({ fgColor, bgColor }: { fgColor: string; bgColor: string }) {
  const sampleText = useTypographyStore((s) => s.sampleText);
  const setSampleText = useTypographyStore((s) => s.setSampleText);
  const [isCustomMode, setIsCustomMode] = useState(() => {
    return !PANGRAMS.some((p) => p.text === sampleText);
  });

  const selectValue = useMemo(() => {
    if (isCustomMode) return CUSTOM_VALUE;
    const match = PANGRAMS.findIndex((p) => p.text === sampleText);
    return match !== -1 ? String(match) : CUSTOM_VALUE;
  }, [sampleText, isCustomMode]);

  function handleSelectChange(value: string) {
    if (value === CUSTOM_VALUE) {
      setIsCustomMode(true);
      return;
    }
    setIsCustomMode(false);
    const idx = parseInt(value, 10);
    setSampleText(PANGRAMS[idx].text);
  }

  const controlStyle: React.CSSProperties = {
    color: fgColor,
    background: bgColor,
    borderColor: `color-mix(in srgb, ${fgColor} 25%, transparent)`,
  };

  return (
    <div className="flex items-center gap-2">
      <Select value={selectValue} onValueChange={handleSelectChange}>
        <SelectTrigger className="h-7 w-[180px] text-xs" style={controlStyle}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent style={controlStyle}>
          {PANGRAMS.map((p, i) => (
            <SelectItem key={i} value={String(i)} className="text-xs">
              {p.label}
            </SelectItem>
          ))}
          <SelectSeparator style={{ backgroundColor: `color-mix(in srgb, ${fgColor} 15%, transparent)` }} />
          <SelectItem value={CUSTOM_VALUE} className="text-xs">
            Custom
          </SelectItem>
        </SelectContent>
      </Select>
      {isCustomMode && (
        <Input
          value={sampleText}
          onChange={(e) => setSampleText(e.target.value)}
          placeholder="Type your sample text…"
          className="h-7 w-[220px] text-xs"
          style={controlStyle}
        />
      )}
    </div>
  );
}

const ScaleRow = memo(function ScaleRow({
  style,
  sampleText,
  isActive,
  onToggle,
}: {
  style: ResolvedElementStyle
  sampleText: string
  isActive: boolean
  onToggle: (element: string) => void
}) {
  const handleClick = useCallback(() => onToggle(style.element), [onToggle, style.element])

  return (
    <button
      type="button"
      className="group flex w-full items-start gap-4 rounded-lg px-4 py-1.5 text-left transition-colors hover:brightness-95"
      style={{
        background: isActive ? `color-mix(in srgb, ${style.color} 8%, transparent)` : undefined,
        ['--row-hover-bg' as string]: `color-mix(in srgb, ${style.color} 4%, transparent)`,
      }}
      onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = `var(--row-hover-bg)` }}
      onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "" }}
      onClick={handleClick}
    >
      <div className="flex w-24 shrink-0 flex-col pt-0.5">
        <span className="font-mono text-sm font-semibold" style={{ color: style.color }}>{style.element}</span>
        <span className="text-xs" style={{ color: style.color }}>
          {style.fontSizeRem.toFixed(3)}rem
        </span>
        <span className="text-xs" style={{ color: style.color }}>
          {style.fontSize.toFixed(1)}px
        </span>
      </div>
      <div
        className="min-w-0 flex-1 overflow-x-clip overflow-y-visible whitespace-nowrap"
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
  )
})

export function TypeScaleView() {
  const { desktop } = useComputedScale()
  const sampleText = useTypographyStore((s) => s.sampleText)
  const backgroundColor = useTypographyStore((s) => s.backgroundColor)
  const foregroundColor = useTypographyStore((s) => s.bodyGroup.color)
  const enabledElements = useTypographyStore((s) => s.enabledElements)
  const expandedElement = useUIStore((s) => s.expandedElement)
  const setExpandedElement = useUIStore((s) => s.setExpandedElement)
  const headerColor = desktop[0]?.color

  const visibleStyles = useMemo(
    () => desktop.filter((s) => {
      if (s.element in enabledElements) return enabledElements[s.element]
      return true
    }),
    [desktop, enabledElements]
  )

  const handleToggle = useCallback(
    (element: string) => setExpandedElement(expandedElement === element ? null : element),
    [expandedElement, setExpandedElement]
  )

  return (
    <div
      className="flex flex-col px-6 py-3"
      style={{ backgroundColor, minHeight: "calc(100vh - 10rem)" }}
    >
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-semibold" style={{ color: headerColor }}>Type Scale</h2>
        <SampleTextSelector fgColor={foregroundColor} bgColor={backgroundColor} />
      </div>
      <div className="flex flex-col gap-0">
        {visibleStyles.map((style) => (
          <ScaleRow
            key={style.element}
            style={style}
            sampleText={sampleText}
            isActive={expandedElement === style.element}
            onToggle={handleToggle}
          />
        ))}
      </div>
    </div>
  )
}
