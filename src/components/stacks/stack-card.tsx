"use client";

import { Heart, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Stack } from "@/lib/stacks-api";
import { PANGRAMS } from "@/data/pangrams";

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
  const bodyColor = config.bodyGroup.color;
  const bg = config.backgroundColor;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(stack)}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onSelect(stack); }}
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)", transition: "transform 0.5s ease-in-out", willChange: "transform" }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.035)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
    >
      {/* Preview area */}
      <div
        className="flex flex-1 flex-col gap-5 overflow-hidden px-7 pb-7 pt-7"
        style={{ backgroundColor: bg, color: fg, minHeight: 200 }}
      >
        <div>
          <p
            className="text-3xl leading-tight"
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
              color: bodyColor,
            }}
          >
            {PANGRAMS[0].text}.
          </p>
        </div>
        <div style={{ borderTop: `1px solid color-mix(in srgb, ${fg} 12%, transparent)`, paddingTop: "1rem" }}>
          <p
            className="text-lg leading-snug"
            style={{
              fontFamily: `"${headingFont}", sans-serif`,
              fontWeight: config.headingsGroup.fontWeight,
            }}
          >
            {PANGRAMS[1].text}
          </p>
          <p
            className="mt-1.5 text-sm leading-relaxed"
            style={{
              fontFamily: `"${bodyFont}", sans-serif`,
              fontWeight: config.bodyGroup.fontWeight,
              color: bodyColor,
            }}
          >
            {PANGRAMS[2].text}. {PANGRAMS[3].text}. {PANGRAMS[4].text}.
          </p>
        </div>
      </div>

      {/* Info bar */}
      <div className="flex items-center justify-between bg-card px-4 py-2.5">
        <span className="text-xs font-medium text-foreground truncate max-w-[180px]">
          {stack.name}
        </span>
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
          {stack.likesCount > 0 && (
            <span className="text-[10px] text-muted-foreground tabular-nums">
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
                  : "text-muted-foreground"
              }`}
            />
          </Button>
        </div>
      </div>

    </div>
  );
}
