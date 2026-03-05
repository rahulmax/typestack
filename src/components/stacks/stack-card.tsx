"use client";

import { Heart, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Stack } from "@/lib/stacks-api";
import { PANGRAMS } from "@/data/pangrams";

interface StackCardProps {
  stack: Stack;
  cardFg?: string;
  cardBodyColor?: string;
  cardBg?: string;
  onSelect: (stack: Stack) => void;
  onLike: (stack: Stack) => void;
  onSave: (stack: Stack) => void;
}

export function StackCard({
  stack,
  cardFg = "#2b3a4a",
  cardBodyColor,
  cardBg = "#f0ebe0",
  onSelect,
  onLike,
  onSave,
}: StackCardProps) {
  const { config } = stack;
  const headingFont = config.headingsGroup.fontFamily;
  const bodyFont = config.bodyGroup.fontFamily;
  const fg = cardFg;
  const body = cardBodyColor ?? cardFg;
  const bg = cardBg;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(stack)}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onSelect(stack); }}
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-lg text-left transition-all duration-300 ease-out hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      style={{ boxShadow: "0 0 0 1px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.05)" }}
    >
      {/* Preview area */}
      <div
        className="flex flex-col gap-4 overflow-hidden px-5 pb-5 pt-5 transition-colors duration-300"
        style={{ backgroundColor: bg, color: fg }}
      >
        <div>
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
            className="mt-2 text-sm leading-relaxed"
            style={{
              fontFamily: `"${bodyFont}", sans-serif`,
              fontWeight: config.bodyGroup.fontWeight,
              color: body,
            }}
          >
            {PANGRAMS[0].text}.
          </p>
        </div>
        <div style={{ borderTop: `1px solid color-mix(in srgb, ${fg} 12%, transparent)`, paddingTop: "0.75rem" }}>
          <p
            className="text-sm leading-snug font-bold"
            style={{
              fontFamily: `"${headingFont}", sans-serif`,
              fontWeight: config.headingsGroup.fontWeight,
            }}
          >
            {PANGRAMS[1].text}
          </p>
          <p
            className="mt-1 text-xs leading-relaxed"
            style={{
              fontFamily: `"${bodyFont}", sans-serif`,
              fontWeight: config.bodyGroup.fontWeight,
              color: body,
            }}
          >
            {PANGRAMS[2].text}. {PANGRAMS[3].text}. {PANGRAMS[4].text}.
          </p>
        </div>
      </div>

      {/* Info bar — hidden by default, slides up on hover */}
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-white/90 backdrop-blur-sm px-4 py-2 translate-y-full opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
        <span className="text-xs font-medium text-neutral-700 truncate max-w-[180px]">
          {stack.name}
        </span>
        <div className="flex items-center gap-0.5">
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
                  : "text-neutral-400"
              }`}
            />
          </Button>
          {stack.likesCount > 0 && (
            <span className="text-[10px] text-neutral-400 tabular-nums">
              {stack.likesCount}
            </span>
          )}
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
                  : "text-neutral-400"
              }`}
            />
          </Button>
        </div>
      </div>
    </div>
  );
}
