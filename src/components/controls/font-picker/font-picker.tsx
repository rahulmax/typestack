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
import { fetchFontOptions, filterFontsByCategory, getFontLabel, getFontStack, loadFontFull } from "@/lib/fonts"
import type { FontCategory } from "@/types/google-fonts"
import type { FontOption } from "@/types/fonts"

const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, "")

interface FontPickerProps {
  currentFont: string
  onSelectFont: (family: string) => void
}

export function FontPicker({
  currentFont,
  onSelectFont,
}: FontPickerProps) {
  const [open, setOpen] = useState(false)
  const [fonts, setFonts] = useState<FontOption[]>([])
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
    fetchFontOptions()
      .then(setFonts)
      .catch(console.error)
  }, [open, fonts.length])

  // Kit, foundry and Fontsource fonts are small curated sets, so only the catalog list is capped.
  const [adobeFonts, foundryFonts, fontsourceFonts, googleFonts] = useMemo(() => {
    let result = filterFontsByCategory(fonts, category)
    if (search) {
      // Kit families are slugs, so "Sofia Pro" has to match "sofia-pro":
      // compare on letters and digits alone.
      const q = normalize(search)
      result = result.filter(
        (f) => normalize(f.family).includes(q) || normalize(f.label).includes(q)
      )
    }
    return [
      result.filter((f) => f.source === "adobe"),
      result.filter((f) => f.source === "foundry"),
      result.filter((f) => f.source === "fontsource"),
      result.filter((f) => f.source === "google").slice(0, 200),
    ]
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
          className="hw-display !h-8 flex-1 min-w-0 !justify-between !text-sm text-left"
          style={{ fontFamily: getFontStack(currentFont) }}
        >
          <span className="truncate">{getFontLabel(currentFont)}</span>
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
              {adobeFonts.length > 0 && (
                <CommandGroup heading="Adobe Fonts">
                  {adobeFonts.map((font) => (
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
              )}
              {foundryFonts.length > 0 && (
                <CommandGroup heading="Open Foundries">
                  {foundryFonts.map((font) => (
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
              )}
              {fontsourceFonts.length > 0 && (
                <CommandGroup heading="Fontsource">
                  {fontsourceFonts.map((font) => (
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
              )}
              {googleFonts.length > 0 && (
                <CommandGroup heading={adobeFonts.length + foundryFonts.length + fontsourceFonts.length > 0 ? "Google Fonts" : undefined}>
                  {googleFonts.map((font) => (
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
              )}
            </CommandList>
          </Command>
        </div>
      </PopoverContent>
    </Popover>
  )
}
