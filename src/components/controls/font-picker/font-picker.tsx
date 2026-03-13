"use client"

import { useState, useEffect, useMemo } from "react"
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { FontPickerItem } from "./font-picker-item"
import { FontCategoryFilter } from "./font-category-filter"
import { useFontLoader } from "./use-font-loader"
import { fetchGoogleFonts, filterFontsByCategory, loadFontFull } from "@/lib/google-fonts"
import type { GoogleFont, FontCategory } from "@/types/google-fonts"

interface FontPickerProps {
  currentFont: string
  onSelectFont: (family: string) => void
}

export function FontPicker({
  currentFont,
  onSelectFont,
}: FontPickerProps) {
  const [open, setOpen] = useState(false)
  const [fonts, setFonts] = useState<GoogleFont[]>([])
  const [category, setCategory] = useState<FontCategory | "all">("all")
  const [search, setSearch] = useState("")
  const { observe } = useFontLoader()
  const loading = open && fonts.length === 0

  useEffect(() => {
    if (!open || fonts.length > 0) return
    fetchGoogleFonts()
      .then(setFonts)
      .catch(console.error)
  }, [open, fonts.length])

  const filtered = useMemo(() => {
    let result = filterFontsByCategory(fonts, category)
    if (search) {
      const q = search.toLowerCase()
      result = result.filter((f) => f.family.toLowerCase().includes(q))
    }
    return result.slice(0, 200)
  }, [fonts, category, search])

  const handleSelect = (family: string) => {
    loadFontFull(family)
    onSelectFont(family)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex h-8 flex-1 min-w-0 items-center justify-between rounded-[4px] border-none bg-stone-200 dark:bg-stone-800 ring-1 ring-inset ring-stone-300/50 dark:ring-stone-700/50 px-3 text-sm hover:bg-stone-300/50 dark:hover:bg-stone-700/50"
          style={{ fontFamily: currentFont }}
        >
          <span className="truncate">{currentFont}</span>
          <svg viewBox="0 0 16 16" fill="currentColor" className="size-3 shrink-0 opacity-50 ml-2">
            <polygon points="8 3 14 10 2 10" />
            <rect x="2" y="12" width="12" height="1.5" rx="0.5" />
          </svg>
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0 surface-noise overflow-hidden"
        align="start"
        sideOffset={4}
      >
        <Command shouldFilter={false} className="border-none bg-transparent">
          <CommandInput
            placeholder="Search fonts..."
            value={search}
            onValueChange={setSearch}
          />
          <FontCategoryFilter selected={category} onChange={setCategory} />
          <CommandList className="max-h-[320px]">
            {loading && (
              <div className="py-6 text-center text-sm text-muted-foreground">
                Loading fonts...
              </div>
            )}
            <CommandEmpty>No fonts found.</CommandEmpty>
            <CommandGroup>
              {filtered.map((font) => (
                <FontPickerItem
                  key={font.family}
                  font={font}
                  isSelected={font.family === currentFont}
                  onSelect={handleSelect}
                  observeRef={observe}
                />
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
