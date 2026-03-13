"use client"

import { useState, useEffect, useMemo, useRef, useCallback } from "react"
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
  const triggerRef = useRef<HTMLButtonElement>(null)
  const [alignOffset, setAlignOffset] = useState(0)

  const calcOffset = useCallback(() => {
    const btn = triggerRef.current
    if (!btn) return
    const sidebar = btn.closest("aside")
    if (!sidebar) return
    const sidebarRect = sidebar.getBoundingClientRect()
    const btnRect = btn.getBoundingClientRect()
    setAlignOffset(Math.round(sidebarRect.left - btnRect.left))
  }, [])

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

  const handleSelect = useCallback((family: string) => {
    loadFontFull(family)
    onSelectFont(family)
    setOpen(false)
  }, [onSelectFont])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          ref={triggerRef}
          type="button"
          onClick={calcOffset}
          className="hw-btn flex h-8 flex-1 min-w-0 items-center !justify-between !rounded-[4px] px-3 text-sm text-left"
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
        className="!w-[var(--sidebar-width,360px)] p-0 surface-noise overflow-hidden hw-module-panel"
        side="bottom"
        align="start"
        alignOffset={alignOffset}
        sideOffset={4}
        avoidCollisions={false}
      >
        <span className="hw-bolt hw-bolt-tl" />
        <span className="hw-bolt hw-bolt-tr" />
        <span className="hw-bolt hw-bolt-bl" />
        <span className="hw-bolt hw-bolt-br" />
        <div className="px-3 pt-3 pb-1">
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
                    showCategory={category === "all"}
                  />
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      </PopoverContent>
    </Popover>
  )
}
