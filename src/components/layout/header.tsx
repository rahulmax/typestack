"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Shuffle, ArrowLeftRight } from "lucide-react";
import { useTypographyStore } from "@/store/typography-store";
import { generateRandomColorPair } from "@/lib/color-utils";

interface HeaderProps {
  onExportClick: () => void;
  onShareClick: () => void;
  onHeadingColorClick: () => void;
  onBodyColorClick: () => void;
  onBackgroundColorClick: () => void;
}

export function Header({
  onExportClick,
  onShareClick,
  onHeadingColorClick,
  onBodyColorClick,
  onBackgroundColorClick,
}: HeaderProps) {
  const headingColor = useTypographyStore((s) => s.headingsGroup.color);
  const bodyColor = useTypographyStore((s) => s.bodyGroup.color);
  const backgroundColor = useTypographyStore((s) => s.backgroundColor);
  const updateHeadingsGroup = useTypographyStore((s) => s.updateHeadingsGroup);
  const updateBodyGroup = useTypographyStore((s) => s.updateBodyGroup);
  const setBackgroundColor = useTypographyStore((s) => s.setBackgroundColor);

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
    <header className="flex h-14 items-center justify-between border-b bg-background px-4">
      <div className="flex items-center gap-2">
        <span className="text-lg font-bold tracking-tight">TypeStack</span>
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Type Scale Generator</span>
      </div>

      <div className="flex items-center gap-1.5">
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
        <Separator orientation="vertical" className="mx-0.5 h-5" />
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
      </div>

      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm" onClick={onShareClick}>
              Share
            </Button>
          </TooltipTrigger>
          <TooltipContent>Share URL (Cmd+S)</TooltipContent>
        </Tooltip>
        <Separator orientation="vertical" className="h-6" />
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="sm" onClick={onExportClick}>
              Export
            </Button>
          </TooltipTrigger>
          <TooltipContent>Export (Cmd+E)</TooltipContent>
        </Tooltip>
      </div>
    </header>
  );
}
