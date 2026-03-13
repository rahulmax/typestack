"use client"

import { memo, useCallback } from "react"
import { CommandItem } from "@/components/ui/command"
import type { GoogleFont } from "@/types/google-fonts"

interface FontPickerItemProps {
  font: GoogleFont
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
        {font.family}
      </span>
      {showCategory && (
        <span className="text-[10px] text-muted-foreground/60">{font.category}</span>
      )}
    </CommandItem>
  )
})
