"use client"

import { memo, useCallback } from "react"
import { ArrowUpRight } from "lucide-react"
import { CommandItem } from "@/components/ui/command"
import { getFontPageUrl, getFontSourceName } from "@/lib/fonts"
import type { FontOption } from "@/types/fonts"

/** A foundry family wears its foundry's name; the services wear their own. */
function sourceBadge(font: FontOption): string | undefined {
  if (font.source === "adobe") return "Adobe"
  if (font.source === "fontsource") return "Fontsource"
  return font.foundry
}

interface FontPickerItemProps {
  font: FontOption
  isSelected: boolean
  onSelect: (family: string) => void
  observeRef: (el: HTMLElement | null) => void
  showCategory?: boolean
}

export const FontPickerItem = memo(function FontPickerItem({
  font,
  isSelected,
  onSelect,
  observeRef,
  showCategory,
}: FontPickerItemProps) {
  const handleSelect = useCallback(() => onSelect(font.family), [onSelect, font.family])
  const badge = sourceBadge(font)
  const sourceName = getFontSourceName(font.family)

  return (
    <CommandItem
      ref={observeRef}
      data-font-family={font.family}
      value={font.family}
      onSelect={handleSelect}
      className={`flex items-center justify-between py-2.5 hw-groove-separator ${
        isSelected ? "!bg-stone-200 dark:!bg-stone-700 font-semibold" : ""
      }`}
    >
      <span style={{ fontFamily: `'${font.family}', ${font.category}` }}>
        {font.label}
      </span>
      <span className="flex shrink-0 items-center gap-1.5">
        {badge ? (
          <span className="hw-font-source">{badge}</span>
        ) : (
          showCategory && (
            <span className="text-[10px] text-muted-foreground/60">{font.category}</span>
          )
        )}
        {/* Lit only on the highlighted row; a click here must not pick the font */}
        <a
          href={getFontPageUrl(font.family)}
          target="_blank"
          rel="noreferrer"
          aria-label={`${font.label} at ${sourceName}`}
          title={`Get it from ${sourceName}`}
          className="hw-font-link"
          onClick={(e) => e.stopPropagation()}
        >
          <ArrowUpRight className="size-3 text-current" />
        </a>
      </span>
    </CommandItem>
  )
})
