"use client";

import { CommandItem } from "@/components/ui/command";
import type { GoogleFont } from "@/types/google-fonts";

interface FontPickerItemProps {
  font: GoogleFont;
  isSelected: boolean;
  onSelect: (family: string) => void;
  observeRef: (el: HTMLElement | null) => void;
}

export function FontPickerItem({
  font,
  isSelected,
  onSelect,
  observeRef,
}: FontPickerItemProps) {
  return (
    <CommandItem
      ref={observeRef}
      data-font-family={font.family}
      value={font.family}
      onSelect={() => onSelect(font.family)}
      className="flex items-center justify-between py-2"
    >
      <span style={{ fontFamily: `'${font.family}', ${font.category}` }}>
        {font.family}
      </span>
      <span className="text-xs text-muted-foreground">{font.category}</span>
      {isSelected && <span className="ml-2 text-xs">&#10003;</span>}
    </CommandItem>
  );
}
