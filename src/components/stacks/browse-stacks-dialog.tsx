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
  { value: "mine", label: "My Stacks" },
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
    const { fg, bg } = generateRandomColorPair(resolvedTheme === "dark");
    setColors(fg, fg, bg);
  }

  function handleReverse() {
    setColors(backgroundColor, backgroundColor, headingColor);
  }

  const btnClass = "flex h-8 items-center gap-1.5 rounded-sm border bg-background px-2 text-xs text-muted-foreground hover:bg-accent";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-none !w-screen !h-screen !rounded-none !translate-x-[-50%] !translate-y-[-50%] !border-0 !shadow-none !p-0 !gap-0 !overflow-hidden !bg-muted">
        <div className="flex flex-col h-full w-full overflow-hidden">
          <DialogHeader className="grid grid-cols-3 items-center px-8 pt-5 pb-4 shrink-0 border-b bg-muted">
            <div>
              <DialogTitle>Stacks</DialogTitle>
              <DialogDescription>Browse typography presets and community stacks</DialogDescription>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button type="button" onClick={onHeadingColorClick} className={btnClass}>
                    <span className="h-4 w-4 rounded-sm border shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]" style={{ backgroundColor: headingColor }} />
                    <span>H</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent>Heading color</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button type="button" onClick={onBodyColorClick} className={btnClass}>
                    <span className="h-4 w-4 rounded-sm border shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]" style={{ backgroundColor: bodyColor }} />
                    <span>B</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent>Body color</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button type="button" onClick={onBackgroundColorClick} className={btnClass}>
                    <span className="h-4 w-4 rounded-sm border shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]" style={{ backgroundColor }} />
                    <span>BG</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent>Background color</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button type="button" onClick={handleRandom} className={btnClass}>
                    <Shuffle className="size-3.5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Random accessible colors</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button type="button" onClick={handleReverse} className={btnClass}>
                    <ArrowLeftRight className="size-3.5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Swap foreground / background</TooltipContent>
              </Tooltip>
            </div>
            <div className="flex items-center justify-end gap-1.5 mr-8">
              <button
                onClick={handleNew}
                className="flex h-8 items-center rounded-sm bg-primary text-primary-foreground px-3 text-xs font-medium hover:bg-primary/90"
              >
                <Plus className="mr-1 h-4 w-4" />
                New Stack
              </button>
            </div>
          </DialogHeader>

          <div className="px-8 pt-4 shrink-0 flex flex-col gap-2">
            {/* Source filter */}
            <div className="flex gap-1">
              {FILTER_LABELS.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => { setFilter(value); setCategoryFilter(null); }}
                  className={`rounded-sm px-3 py-1.5 text-xs font-medium transition-colors ${
                    filter === value
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            {/* Category filter */}
            {availableCategories.length > 0 && (
              <div className="flex gap-1 flex-wrap">
                <button
                  onClick={() => setCategoryFilter(null)}
                  className={`rounded-sm px-2.5 py-1 text-[11px] font-medium transition-colors ${
                    categoryFilter === null
                      ? "bg-secondary text-secondary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  All styles
                </button>
                {availableCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(categoryFilter === cat ? null : cat)}
                    className={`rounded-sm px-2.5 py-1 text-[11px] font-medium capitalize transition-colors ${
                      categoryFilter === cat
                        ? "bg-secondary text-secondary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto px-8 py-5">
            {loading ? (
              <div className="py-20 text-center text-sm text-muted-foreground">
                Loading stacks...
              </div>
            ) : filteredStacks.length === 0 ? (
              <div className="py-20 text-center text-sm text-muted-foreground">
                No stacks found.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
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
