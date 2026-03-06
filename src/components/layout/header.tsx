"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState, useEffect } from "react";
import { Shuffle, ArrowLeftRight, Undo2, Redo2, RotateCcw, Wand2, Dices, Sun, Moon, Grid3x3 } from "lucide-react";
import { useTypographyStore } from "@/store/typography-store";
import { useUIStore } from "@/store/ui-store";
import { useStore } from "zustand";
import { generateRandomColorPair } from "@/lib/color-utils";
import { PRESETS } from "@/db/seed-presets";
import { TemplateTabs } from "@/components/preview/template-tabs";
import { ViewportToggle } from "@/components/preview/viewport-toggle";
import { useTheme } from "next-themes";
import { Show, UserButton, SignInButton } from "@clerk/nextjs";

const btnClass = "flex h-8 items-center gap-1.5 rounded-sm border bg-background px-2 text-xs hover:bg-accent";

interface HeaderProps {
  onExportClick: () => void;
  onShareClick: () => void;
  onHeadingColorClick: () => void;
  onBodyColorClick: () => void;
  onBackgroundColorClick: () => void;
  onBrowseStacks: () => void;
}

export function Header({
  onExportClick,
  onShareClick,
  onHeadingColorClick,
  onBodyColorClick,
  onBackgroundColorClick,
  onBrowseStacks,
}: HeaderProps) {
  const headingColor = useTypographyStore((s) => s.headingsGroup.color);
  const bodyColor = useTypographyStore((s) => s.bodyGroup.color);
  const backgroundColor = useTypographyStore((s) => s.backgroundColor);
  const setColors = useTypographyStore((s) => s.setColors);
  const setFonts = useTypographyStore((s) => s.setFonts);
  const resetConfig = useTypographyStore((s) => s.resetConfig);
  const autoBalance = useTypographyStore((s) => s.autoBalance);
  const setAutoBalance = useTypographyStore((s) => s.setAutoBalance);
  const gridPattern = useUIStore((s) => s.gridPattern);
  const cycleGridPattern = useUIStore((s) => s.cycleGridPattern);
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { undo, redo, pastStates, futureStates } = useStore(
    useTypographyStore.temporal
  );
  const canUndo = pastStates.length > 0;
  const canRedo = futureStates.length > 0;

  function handleRandom() {
    const { fg, bg } = generateRandomColorPair(resolvedTheme === "dark");
    setColors(fg, fg, bg);
  }

  function handleRandomStack() {
    const preset = PRESETS[Math.floor(Math.random() * PRESETS.length)];
    setFonts(preset.headingFont, preset.headingWeight, preset.bodyFont, preset.bodyWeight);
  }

  function handleReverse() {
    setColors(backgroundColor, backgroundColor, headingColor);
  }

  return (
    <header className="flex h-14 items-center justify-between border-b bg-background px-4">
      {/* Left: logo */}
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-lg font-bold tracking-tight">TypeStax</span>
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Type Scale Generator</span>
      </div>

      {/* Center: tabs, viewport, then action buttons */}
      <div className="flex items-center gap-1.5">
        {/* Auto Balance + Random Stack */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={() => setAutoBalance(!autoBalance)}
              className={`${btnClass} ${autoBalance ? "bg-accent" : ""}`}
            >
              <Wand2 className="size-3.5" />
            </button>
          </TooltipTrigger>
          <TooltipContent>Auto Balance</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <button type="button" onClick={handleRandomStack} className={btnClass}>
              <Dices className="size-3.5" />
            </button>
          </TooltipTrigger>
          <TooltipContent>Random type stack</TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" className="mx-0.5 h-5" />

        {/* Template tabs + viewport */}
        <TemplateTabs />
        <ViewportToggle />

        <Separator orientation="vertical" className="mx-0.5 h-5" />

        {/* Color controls */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button type="button" onClick={onHeadingColorClick} className={btnClass}>
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
            <button type="button" onClick={onBodyColorClick} className={btnClass}>
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
            <button type="button" onClick={onBackgroundColorClick} className={btnClass}>
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
            <button
              type="button"
              onClick={cycleGridPattern}
              className={`${btnClass} ${gridPattern !== null ? "bg-accent" : ""}`}
            >
              <Grid3x3 className="size-3.5" />
            </button>
          </TooltipTrigger>
          <TooltipContent>{gridPattern !== null ? `Pattern ${gridPattern}` : "Background pattern"}</TooltipContent>
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
        <Tooltip>
          <TooltipTrigger asChild>
            <button type="button" onClick={onBrowseStacks} className={btnClass}>
              <span className="text-muted-foreground">Stacks</span>
            </button>
          </TooltipTrigger>
          <TooltipContent>Browse Stacks</TooltipContent>
        </Tooltip>
      </div>

      {/* Right: theme, undo/redo/reset, share, export */}
      <div className="flex items-center gap-1.5 shrink-0">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className={btnClass}
            >
              {mounted ? (resolvedTheme === "dark" ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />) : <span className="size-3.5" />}
            </button>
          </TooltipTrigger>
          <TooltipContent>Toggle dark mode</TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" className="mx-0.5 h-5" />

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={() => undo()}
              disabled={!canUndo}
              className={`${btnClass} ${!canUndo ? "opacity-40 pointer-events-none" : ""}`}
            >
              <Undo2 className="size-3.5" />
            </button>
          </TooltipTrigger>
          <TooltipContent>Undo (Cmd+Z)</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={() => redo()}
              disabled={!canRedo}
              className={`${btnClass} ${!canRedo ? "opacity-40 pointer-events-none" : ""}`}
            >
              <Redo2 className="size-3.5" />
            </button>
          </TooltipTrigger>
          <TooltipContent>Redo (Cmd+Shift+Z)</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <button type="button" onClick={resetConfig} className={btnClass}>
              <RotateCcw className="size-3.5" />
            </button>
          </TooltipTrigger>
          <TooltipContent>Reset to defaults</TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" className="mx-0.5 h-5" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm" onClick={onShareClick} className="h-8">
              Share
            </Button>
          </TooltipTrigger>
          <TooltipContent>Share URL (Cmd+S)</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="sm" onClick={onExportClick} className="h-8">
              Export
            </Button>
          </TooltipTrigger>
          <TooltipContent>Export (Cmd+E)</TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" className="mx-0.5 h-5" />

        <Show when="signed-out">
          <SignInButton mode="modal">
            <Button variant="outline" size="sm" className="h-8">
              Sign in
            </Button>
          </SignInButton>
        </Show>
        <Show when="signed-in">
          <UserButton />
        </Show>
      </div>
    </header>
  );
}
