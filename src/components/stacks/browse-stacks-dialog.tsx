"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { StackCard } from "./stack-card";
import {
  fetchStacks,
  toggleLike,
  toggleSave,
  type Stack,
} from "@/lib/stacks-api";
import { useTypographyStore } from "@/store/typography-store";
import { useUIStore } from "@/store/ui-store";
import { useFontLoader } from "./use-gallery-fonts";
import { Plus, Shuffle, ArrowLeftRight } from "lucide-react";
import { generateRandomColorPair, hexToRgb } from "@/lib/color-utils";

type Filter = "all" | "presets" | "community" | "mine" | "saved";

const FILTER_LABELS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "community", label: "Community" },
  { value: "mine", label: "My Stacks" },
  { value: "saved", label: "Saved" },
];

function isDarkBg(hex: string): boolean {
  const [r, g, b] = hexToRgb(hex);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.5;
}

interface BrowseStacksDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onHeadingColorClick: () => void;
  onBodyColorClick: () => void;
  onBackgroundColorClick: () => void;
}

export function BrowseStacksDialog({
  open,
  onOpenChange,
  onHeadingColorClick,
  onBodyColorClick,
  onBackgroundColorClick,
}: BrowseStacksDialogProps) {
  const [stacks, setStacks] = useState<Stack[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [loading, setLoading] = useState(true);
  const loadConfig = useTypographyStore((s) => s.loadConfig);
  const setCurrentStack = useUIStore((s) => s.setCurrentStack);
  const resetConfig = useTypographyStore((s) => s.resetConfig);

  const headingColor = useTypographyStore((s) => s.headingsGroup.color);
  const bodyColor = useTypographyStore((s) => s.bodyGroup.color);
  const backgroundColor = useTypographyStore((s) => s.backgroundColor);
  const setColors = useTypographyStore((s) => s.setColors);

  const cardFg = headingColor;
  const cardBodyColor = bodyColor;
  const cardBg = backgroundColor;
  const darkMode = isDarkBg(backgroundColor);
  const pageBg = darkMode ? "#1c1c1e" : "#f0f0f0";

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchStacks(filter);
      setStacks(data);
    } catch {
      // Silently fail
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    if (open) load();
  }, [open, load]);

  useFontLoader(stacks);

  const handleSelect = (stack: Stack) => {
    loadConfig(stack.config);
    setCurrentStack(stack.id, stack.name);
    onOpenChange(false);
  };

  const handleLike = async (stack: Stack) => {
    const { liked } = await toggleLike(stack.id);
    setStacks((prev) =>
      prev.map((s) =>
        s.id === stack.id
          ? { ...s, isLiked: liked, likesCount: s.likesCount + (liked ? 1 : -1) }
          : s
      )
    );
  };

  const handleSave = async (stack: Stack) => {
    const { saved } = await toggleSave(stack.id);
    setStacks((prev) =>
      prev.map((s) =>
        s.id === stack.id
          ? { ...s, isSaved: saved, savesCount: s.savesCount + (saved ? 1 : -1) }
          : s
      )
    );
  };

  const handleNew = () => {
    resetConfig();
    setCurrentStack(null, null);
    onOpenChange(false);
  };

  function handleRandom() {
    const { fg, bg } = generateRandomColorPair();
    setColors(fg, fg, bg);
  }

  function handleReverse() {
    setColors(backgroundColor, backgroundColor, headingColor);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-none !w-screen !h-screen !rounded-none !translate-x-[-50%] !translate-y-[-50%] !bg-transparent !border-0 !shadow-none !p-0 !gap-0 !overflow-hidden">
        <div
          className="flex flex-col h-full w-full overflow-hidden transition-colors duration-300"
          style={{ backgroundColor: pageBg }}
        >
          <DialogHeader
            className="grid grid-cols-3 items-center px-8 pt-5 pb-4 shrink-0 transition-colors duration-300"
            style={{ backgroundColor: pageBg, borderBottom: `1px solid ${darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}` }}
          >
            <div>
              <DialogTitle style={{ color: cardFg }}>Stacks</DialogTitle>
              <DialogDescription style={{ color: darkMode ? "#a1a1aa" : "#737373" }}>Browse typography presets and community stacks</DialogDescription>
            </div>
            {(() => {
              const btnBorder = darkMode ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)";
              const btnBg = darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.03)";
              const btnLabel = darkMode ? "#a1a1aa" : "#737373";
              const btnStyle = { border: `1px solid ${btnBorder}`, backgroundColor: btnBg, color: btnLabel };
              const swatchBorder = { border: `1px solid ${btnBorder}` };
              return (
            <div className="flex items-center justify-center gap-1.5">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button type="button" onClick={onHeadingColorClick} className="flex h-8 items-center gap-1.5 rounded-sm px-2 text-xs" style={btnStyle}>
                    <span className="h-4 w-4 rounded-sm shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]" style={{ backgroundColor: headingColor, ...swatchBorder }} />
                    <span style={{ color: btnLabel }}>H</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent>Heading color</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button type="button" onClick={onBodyColorClick} className="flex h-8 items-center gap-1.5 rounded-sm px-2 text-xs" style={btnStyle}>
                    <span className="h-4 w-4 rounded-sm shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]" style={{ backgroundColor: bodyColor, ...swatchBorder }} />
                    <span style={{ color: btnLabel }}>B</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent>Body color</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button type="button" onClick={onBackgroundColorClick} className="flex h-8 items-center gap-1.5 rounded-sm px-2 text-xs" style={btnStyle}>
                    <span className="h-4 w-4 rounded-sm shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]" style={{ backgroundColor, ...swatchBorder }} />
                    <span style={{ color: btnLabel }}>BG</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent>Background color</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button type="button" onClick={handleRandom} className="flex h-8 items-center gap-1.5 rounded-sm px-2 text-xs" style={btnStyle}>
                    <Shuffle className="size-3.5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Random accessible colors</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button type="button" onClick={handleReverse} className="flex h-8 items-center gap-1.5 rounded-sm px-2 text-xs" style={btnStyle}>
                    <ArrowLeftRight className="size-3.5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Swap foreground / background</TooltipContent>
              </Tooltip>
            </div>
              );
            })()}
            <div className="flex items-center justify-end gap-1.5 mr-8">
              <button
                onClick={handleNew}
                className="flex h-8 items-center rounded-sm px-3 text-xs font-medium"
                style={{ backgroundColor: cardFg, color: cardBg }}
              >
                <Plus className="mr-1 h-4 w-4" />
                New Stack
              </button>
            </div>
          </DialogHeader>

          <div className="px-8 pt-4 shrink-0">
            <div className="flex gap-1">
              {FILTER_LABELS.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setFilter(value)}
                  className="rounded-sm px-3 py-1.5 text-xs font-medium transition-colors"
                  style={filter === value
                    ? { backgroundColor: cardFg, color: cardBg }
                    : { backgroundColor: "transparent", color: darkMode ? "#a1a1aa" : "#737373" }
                  }
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto px-8 py-5">
            {loading ? (
              <div className="py-20 text-center text-sm" style={{ color: darkMode ? "#a1a1aa" : "#737373" }}>
                Loading stacks...
              </div>
            ) : stacks.length === 0 ? (
              <div className="py-20 text-center text-sm" style={{ color: darkMode ? "#a1a1aa" : "#737373" }}>
                No stacks found.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
                {stacks.map((stack) => (
                  <StackCard
                    key={stack.id}
                    stack={stack}
                    cardFg={cardFg}
                    cardBodyColor={cardBodyColor}
                    cardBg={cardBg}
                    onSelect={handleSelect}
                    onLike={handleLike}
                    onSave={handleSave}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
