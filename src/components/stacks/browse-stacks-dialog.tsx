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
import { generateRandomColorPair } from "@/lib/color-utils";
import { hexToRgb } from "@/lib/color-utils";

type Filter = "all" | "presets" | "community" | "mine" | "saved";

const FILTER_LABELS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "community", label: "Community" },
  { value: "mine", label: "My Stacks" },
  { value: "saved", label: "Saved" },
];

function isDark(hex: string): boolean {
  const [r, g, b] = hexToRgb(hex);
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum < 0.5;
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
  const updateHeadingsGroup = useTypographyStore((s) => s.updateHeadingsGroup);
  const updateBodyGroup = useTypographyStore((s) => s.updateBodyGroup);
  const setBackgroundColor = useTypographyStore((s) => s.setBackgroundColor);

  const cardFg = headingColor;
  const cardBodyColor = bodyColor;
  const cardBg = backgroundColor;
  const pageBg = isDark(backgroundColor) ? "#1c1c1e" : "#f0f0f0";

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
    updateHeadingsGroup({ color: fg });
    updateBodyGroup({ color: fg });
    setBackgroundColor(bg);
  }

  function handleReverse() {
    const oldBg = backgroundColor;
    const oldFg = headingColor;
    updateHeadingsGroup({ color: oldBg });
    updateBodyGroup({ color: oldBg });
    setBackgroundColor(oldFg);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-none !w-screen !h-screen !rounded-none !translate-x-[-50%] !translate-y-[-50%] flex flex-col gap-0 p-0 transition-colors duration-300" style={{ backgroundColor: pageBg }}>
        <DialogHeader className="flex flex-row items-center justify-between px-8 pt-5 pb-4 border-b border-black/10 shrink-0">
          <div>
            <DialogTitle>Stacks</DialogTitle>
            <DialogDescription>Browse typography presets and community stacks</DialogDescription>
          </div>
          <div className="flex items-center gap-1.5 mr-8">
            {/* Color pickers */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={onHeadingColorClick}
                  className="flex h-8 items-center gap-1.5 rounded-sm border bg-background px-2 text-xs hover:bg-accent"
                >
                  <span
                    className="h-4 w-4 rounded-sm border shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]"
                    style={{ backgroundColor: headingColor }}
                  />
                  <span className="text-muted-foreground">H</span>
                </button>
              </TooltipTrigger>
              <TooltipContent>Heading color</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={onBodyColorClick}
                  className="flex h-8 items-center gap-1.5 rounded-sm border bg-background px-2 text-xs hover:bg-accent"
                >
                  <span
                    className="h-4 w-4 rounded-sm border shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]"
                    style={{ backgroundColor: bodyColor }}
                  />
                  <span className="text-muted-foreground">B</span>
                </button>
              </TooltipTrigger>
              <TooltipContent>Body color</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={onBackgroundColorClick}
                  className="flex h-8 items-center gap-1.5 rounded-sm border bg-background px-2 text-xs hover:bg-accent"
                >
                  <span
                    className="h-4 w-4 rounded-sm border shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]"
                    style={{ backgroundColor }}
                  />
                  <span className="text-muted-foreground">BG</span>
                </button>
              </TooltipTrigger>
              <TooltipContent>Background color</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleRandom}
                  className="h-8 w-8 p-0"
                >
                  <Shuffle className="size-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Random accessible colors</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleReverse}
                  className="h-8 w-8 p-0"
                >
                  <ArrowLeftRight className="size-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Swap foreground / background</TooltipContent>
            </Tooltip>
            <div className="mx-1.5 h-5 w-px bg-border" />
            <Button size="sm" onClick={handleNew}>
              <Plus className="mr-1 h-4 w-4" />
              New Stack
            </Button>
          </div>
        </DialogHeader>
        <div className="px-8 pt-4 shrink-0">
          <div className="flex gap-1">
            {FILTER_LABELS.map(({ value, label }) => (
              <Button
                key={value}
                variant={filter === value ? "default" : "ghost"}
                size="sm"
                onClick={() => setFilter(value)}
                className="text-xs"
              >
                {label}
              </Button>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-8 py-5">
          {loading ? (
            <div className="py-20 text-center text-sm text-muted-foreground">
              Loading stacks...
            </div>
          ) : stacks.length === 0 ? (
            <div className="py-20 text-center text-sm text-muted-foreground">
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
      </DialogContent>
    </Dialog>
  );
}
