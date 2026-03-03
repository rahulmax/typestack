"use client";

import { Button } from "@/components/ui/button";
import type { FontCategory } from "@/types/google-fonts";
import { FONT_CATEGORIES } from "@/types/google-fonts";

interface FontCategoryFilterProps {
  selected: FontCategory | "all";
  onChange: (category: FontCategory | "all") => void;
}

const LABELS: Record<FontCategory | "all", string> = {
  all: "All",
  "sans-serif": "Sans",
  serif: "Serif",
  display: "Display",
  monospace: "Mono",
  handwriting: "Hand",
};

export function FontCategoryFilter({
  selected,
  onChange,
}: FontCategoryFilterProps) {
  const categories: (FontCategory | "all")[] = ["all", ...FONT_CATEGORIES];

  return (
    <div className="flex gap-1 px-2 py-1">
      {categories.map((cat) => (
        <Button
          key={cat}
          variant={selected === cat ? "secondary" : "ghost"}
          size="sm"
          className="h-7 text-xs"
          onClick={() => onChange(cat)}
        >
          {LABELS[cat]}
        </Button>
      ))}
    </div>
  );
}
