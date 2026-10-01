"use client"

import { memo, useCallback } from "react"
import { ArrowUpRight } from "lucide-react"
import { CommandItem } from "@/components/ui/command"
import { FONT_SOURCE_NAMES, getFontPageUrl } from "@/lib/fonts"
import type { FontOption, FontSource } from "@/types/fonts"

const SOURCE_BADGES: Record<Exclude<FontSource, "google">, string> = {
  adobe: "Adobe",
  fontsource: "Fontsource",
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
        {font.source !== "google" ? (
          <span className="hw-font-source">{SOURCE_BADGES[font.source]}</span>
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
          aria-label={`${font.label} on ${FONT_SOURCE_NAMES[font.source]}`}
          title={`Get it on ${FONT_SOURCE_NAMES[font.source]}`}
          className="hw-font-link"
          onClick={(e) => e.stopPropagation()}
        >
          <ArrowUpRight className="size-3 text-current" />
        </a>
      </span>
    </CommandItem>
  )
})
