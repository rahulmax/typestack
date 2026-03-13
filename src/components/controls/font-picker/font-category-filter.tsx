"use client";

import { useRef, useEffect, useState } from "react";
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
  display: "Disp",
  monospace: "Mono",
  handwriting: "Hand",
};

export function FontCategoryFilter({
  selected,
  onChange,
}: FontCategoryFilterProps) {
  const categories: (FontCategory | "all")[] = ["all", ...FONT_CATEGORIES];
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const btn = buttonRefs.current.get(selected);
    const container = containerRef.current;
    if (!btn || !container) return;
    const cRect = container.getBoundingClientRect();
    const bRect = btn.getBoundingClientRect();
    setIndicator({ left: bRect.left - cRect.left, width: bRect.width });
    if (!ready) setReady(true);
  }, [selected, ready]);

  return (
    <div
      ref={containerRef}
      className="relative mx-2 my-1.5 h-8 rounded-[5px] overflow-hidden bg-gradient-to-b from-stone-300 to-stone-200 dark:from-stone-900 dark:to-stone-800 shadow-[inset_0_2px_4px_rgba(0,0,0,0.15),inset_0_1px_1px_rgba(0,0,0,0.1),0_1px_0_rgba(255,255,255,0.05)] ring-1 ring-inset ring-stone-400/30 dark:ring-stone-600/40 flex items-center p-[2px]"
    >
      {/* Sliding indicator */}
      <div
        className="absolute top-[2px] bottom-[2px] rounded-[3px] bg-stone-700 dark:bg-stone-300 shadow-[0_2px_4px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.15)]"
        style={{
          left: indicator.left,
          width: indicator.width,
          transition: ready ? 'left 200ms cubic-bezier(0.4, 0, 0.2, 1), width 200ms cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
        }}
      />
      {categories.map((cat) => {
        const isActive = selected === cat;
        return (
          <button
            key={cat}
            type="button"
            ref={(el) => { if (el) buttonRefs.current.set(cat, el) }}
            onClick={() => onChange(cat)}
            className={`relative z-[1] flex-1 h-full rounded-[3px] text-[10px] font-semibold tracking-wide uppercase transition-colors duration-200 select-none ${
              isActive
                ? "text-white dark:text-stone-900 slider-embossed-text"
                : "text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-400"
            }`}
          >
            {LABELS[cat]}
          </button>
        );
      })}
    </div>
  );
}
