"use client";

import { Heart, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Stack } from "@/lib/stacks-api";

interface StackCardProps {
  stack: Stack;
  onSelect: (stack: Stack) => void;
  onLike: (stack: Stack) => void;
  onSave: (stack: Stack) => void;
}

export function StackCard({ stack, onSelect, onLike, onSave }: StackCardProps) {
  const { config } = stack;
  const headingFont = config.headingsGroup.fontFamily;
  const bodyFont = config.bodyGroup.fontFamily;
  const fg = config.headingsGroup.color;
  const bg = config.backgroundColor;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(stack)}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onSelect(stack); }}
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-xl border text-left shadow-sm transition-all hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {/* Preview area */}
      <div
        className="flex flex-col gap-3 px-6 pb-5 pt-6"
        style={{ backgroundColor: bg, color: fg }}
      >
        <p
          className="text-2xl leading-tight"
          style={{
            fontFamily: `"${headingFont}", sans-serif`,
            fontWeight: config.headingsGroup.fontWeight,
          }}
        >
          {headingFont}
        </p>
        <p
          className="text-sm leading-relaxed opacity-80"
          style={{
            fontFamily: `"${bodyFont}", sans-serif`,
            fontWeight: config.bodyGroup.fontWeight,
          }}
        >
          The quick brown fox jumps over the lazy dog. Pack my box with five
          dozen liquor jugs.
        </p>
      </div>

      {/* Info bar */}
      <div className="flex items-center justify-between border-t bg-card px-4 py-2.5">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-medium text-foreground truncate max-w-[180px]">
            {stack.name}
          </span>
          <span className="text-[10px] text-muted-foreground">
            {headingFont} + {bodyFont}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={(e) => {
              e.stopPropagation();
              onLike(stack);
            }}
          >
            <Heart
              className={`h-3.5 w-3.5 ${
                stack.isLiked
                  ? "fill-red-500 text-red-500"
                  : "text-muted-foreground"
              }`}
            />
          </Button>
          <span className="text-[10px] text-muted-foreground tabular-nums min-w-[1ch]">
            {stack.likesCount}
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={(e) => {
              e.stopPropagation();
              onSave(stack);
            }}
          >
            <Bookmark
              className={`h-3.5 w-3.5 ${
                stack.isSaved
                  ? "fill-blue-500 text-blue-500"
                  : "text-muted-foreground"
              }`}
            />
          </Button>
        </div>
      </div>

      {/* Preset badge */}
      {stack.isPreset && (
        <div className="absolute right-2 top-2 rounded-full bg-black/20 px-2 py-0.5 text-[9px] font-medium uppercase tracking-wider" style={{ color: fg }}>
          Preset
        </div>
      )}
    </div>
  );
}
