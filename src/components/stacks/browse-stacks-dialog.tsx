"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { StackCard } from "./stack-card";
import {
  fetchStacks,
  fetchStack,
  toggleLike,
  toggleSave,
  type Stack,
} from "@/lib/stacks-api";
import { useTypographyStore } from "@/store/typography-store";
import { useUIStore } from "@/store/ui-store";
import { useFontLoader } from "./use-gallery-fonts";
import { Plus, Shuffle, ArrowLeftRight } from "lucide-react";
import { generateRandomColorPair } from "@/lib/color-utils";
import { useTheme } from "next-themes";

type Filter = "all" | "presets" | "community" | "mine" | "saved";

const FILTER_LABELS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "community", label: "Community" },
  { value: "mine", label: "Mine" },
  { value: "saved", label: "Saved" },
];

const CATEGORIES = [
  "editorial", "luxury", "elegant", "minimal", "tech", "bold",
  "warm", "heritage", "literary", "corporate", "creative", "playful", "romantic",
] as const;

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
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const loadConfig = useTypographyStore((s) => s.loadConfig);
  const setCurrentStack = useUIStore((s) => s.setCurrentStack);
  const resetConfig = useTypographyStore((s) => s.resetConfig);

  const { resolvedTheme } = useTheme();
  const headingColor = useTypographyStore((s) => s.headingsGroup.color);
  const bodyColor = useTypographyStore((s) => s.bodyGroup.color);
  const backgroundColor = useTypographyStore((s) => s.backgroundColor);
  const setColors = useTypographyStore((s) => s.setColors);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchStacks(filter, true);
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

  // Derive available categories from loaded stacks
  const availableCategories = useMemo(() => {
    const cats = new Set<string>();
    for (const s of stacks) {
      if (s.category) cats.add(s.category);
    }
    return CATEGORIES.filter((c) => cats.has(c));
  }, [stacks]);

  const filteredStacks = useMemo(() => {
    if (!categoryFilter) return stacks;
    return stacks.filter((s) => s.category === categoryFilter);
  }, [stacks, categoryFilter]);

  const handleSelect = async (stack: Stack) => {
    try {
      const full = await fetchStack(stack.id);
      loadConfig(full.config);
      setCurrentStack(stack.id, stack.name);
      onOpenChange(false);
    } catch {
      // Silently fail
    }
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
    resetConfig(resolvedTheme === 'dark');
    setCurrentStack(null, null);
    onOpenChange(false);
  };

  function handleRandom() {
    const { fg, bg } = generateRandomColorPair(resolvedTheme === "dark");
    setColors(fg, fg, bg);
  }

  function handleReverse() {
    setColors(backgroundColor, backgroundColor, headingColor);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-none !w-screen !h-screen !top-0 !left-0 !translate-x-0 !translate-y-0 !rounded-none !border-0 !shadow-none !p-0 !gap-0 !overflow-hidden !bg-muted" showCloseButton={false}>
        <div className="flex flex-col h-full w-full overflow-hidden">
          <DialogHeader className="flex flex-col gap-3 md:grid md:grid-cols-3 md:items-center px-4 md:px-8 pt-4 md:pt-5 pb-3 md:pb-4 shrink-0 border-b bg-muted surface-noise">
            <div>
              <DialogTitle>Presets</DialogTitle>
              <DialogDescription>Browse typography presets and community creations</DialogDescription>
            </div>
            <div className="hidden md:flex items-center justify-center">
              <div className="hw-btn-group flex">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button type="button" onClick={onHeadingColorClick} className="hw-btn">
                      <span className="h-4 w-4 rounded-sm shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]" style={{ backgroundColor: headingColor }} />
                      <span className="opacity-60">H</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Heading color</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button type="button" onClick={onBodyColorClick} className="hw-btn">
                      <span className="h-4 w-4 rounded-sm shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]" style={{ backgroundColor: bodyColor }} />
                      <span className="opacity-60">B</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Body color</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button type="button" onClick={onBackgroundColorClick} className="hw-btn">
                      <span className="h-4 w-4 rounded-sm shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]" style={{ backgroundColor }} />
                      <span className="opacity-60">BG</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Background color</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button type="button" onClick={handleRandom} className="hw-btn">
                      <Shuffle className="size-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Random accessible colors</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button type="button" onClick={handleReverse} className="hw-btn">
                      <ArrowLeftRight className="size-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Swap foreground / background</TooltipContent>
                </Tooltip>
              </div>
            </div>
            <div className="flex items-center md:justify-end gap-1.5 md:mr-8">
              <button
                type="button"
                onClick={handleNew}
                className="hw-btn hw-btn-primary !h-8 text-xs"
              >
                <Plus className="mr-1 h-4 w-4" />
                New Preset
              </button>
            </div>
          </DialogHeader>

          <div className="px-4 md:px-8 pt-3 md:pt-4 shrink-0 flex flex-col gap-2">
            {/* Source filter */}
            <div className="hw-btn-group flex w-fit">
              {FILTER_LABELS.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => { setFilter(value); setCategoryFilter(null); }}
                  className="hw-btn hw-selector-btn"
                  data-active={filter === value}
                  style={{ height: 34, padding: '0 16px', fontSize: 13 }}
                >
                  {label}
                </button>
              ))}
            </div>
            {/* Category filter */}
            {availableCategories.length > 0 && (
              <div className="hw-btn-group flex w-fit flex-wrap">
                <button
                  type="button"
                  onClick={() => setCategoryFilter(null)}
                  className="hw-btn hw-selector-btn"
                  data-active={categoryFilter === null}
                  style={{ height: 30, padding: '0 14px', fontSize: 12 }}
                >
                  All styles
                </button>
                {availableCategories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategoryFilter(categoryFilter === cat ? null : cat)}
                    className="hw-btn hw-selector-btn capitalize"
                    data-active={categoryFilter === cat}
                    style={{ height: 30, padding: '0 14px', fontSize: 12 }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto px-4 md:px-8 py-4 md:py-5">
            {loading ? (
              <div className="py-20 text-center text-sm text-muted-foreground">
                Loading presets...
              </div>
            ) : filteredStacks.length === 0 ? (
              <div className="py-20 text-center text-sm text-muted-foreground">
                No presets found.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
                {filteredStacks.map((stack) => (
                  <StackCard
                    key={stack.id}
                    stack={stack}
                    cardFg={headingColor}
                    cardBodyColor={bodyColor}
                    cardBg={backgroundColor}
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
