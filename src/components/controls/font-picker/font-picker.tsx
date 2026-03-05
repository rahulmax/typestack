"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FontPickerItem } from "./font-picker-item";
import { FontCategoryFilter } from "./font-category-filter";
import { useFontLoader } from "./use-font-loader";
import { fetchGoogleFonts, filterFontsByCategory, loadFontFull } from "@/lib/google-fonts";
import type { GoogleFont, FontCategory } from "@/types/google-fonts";

interface FontPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentFont: string;
  onSelectFont: (family: string) => void;
}

export function FontPicker({
  open,
  onOpenChange,
  currentFont,
  onSelectFont,
}: FontPickerProps) {
  const [fonts, setFonts] = useState<GoogleFont[]>([]);
  const [category, setCategory] = useState<FontCategory | "all">("all");
  const [search, setSearch] = useState("");
  const { observe } = useFontLoader();
  const loading = open && fonts.length === 0;

  useEffect(() => {
    if (!open || fonts.length > 0) return;
    fetchGoogleFonts()
      .then(setFonts)
      .catch(console.error);
  }, [open, fonts.length]);

  const filtered = useMemo(() => {
    let result = filterFontsByCategory(fonts, category);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((f) => f.family.toLowerCase().includes(q));
    }
    return result.slice(0, 200);
  }, [fonts, category, search]);

  const handleSelect = (family: string) => {
    loadFontFull(family);
    onSelectFont(family);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0">
        <DialogHeader className="px-4 pt-4">
          <DialogTitle>Choose a Font</DialogTitle>
          <DialogDescription>Search and select from Google Fonts.</DialogDescription>
        </DialogHeader>
        <Command shouldFilter={false} className="border-none">
          <CommandInput
            placeholder="Search fonts..."
            value={search}
            onValueChange={setSearch}
          />
          <FontCategoryFilter selected={category} onChange={setCategory} />
          <CommandList className="max-h-[400px]">
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
      </DialogContent>
    </Dialog>
  );
}
