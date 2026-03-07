"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState, useEffect, useRef } from "react";
import { Shuffle, ArrowLeftRight, Undo2, Redo2, RotateCcw, Wand2, Dices, Sun, Moon, Grid3x3 } from "lucide-react";
import { useTypographyStore } from "@/store/typography-store";
import { useUIStore } from "@/store/ui-store";
import { useStore } from "zustand";
import { generateRandomColorPair } from "@/lib/color-utils";
import { fetchStacks, type Stack } from "@/lib/stacks-api";
import { TemplateTabs } from "@/components/preview/template-tabs";
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
  const resetConfig = useTypographyStore((s) => s.resetConfig);
  const loadConfig = useTypographyStore((s) => s.loadConfig);
  const autoBalance = useTypographyStore((s) => s.autoBalance);
  const setAutoBalance = useTypographyStore((s) => s.setAutoBalance);
  const gridPattern = useUIStore((s) => s.gridPattern);
  const cycleGridPattern = useUIStore((s) => s.cycleGridPattern);
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
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

  const stacksCache = useRef<Stack[]>([]);

  async function handleRandomStack() {
    if (stacksCache.current.length === 0) {
      try {
        stacksCache.current = await fetchStacks("all");
      } catch {
        return;
      }
    }
    const stacks = stacksCache.current;
    if (stacks.length === 0) return;
    const stack = stacks[Math.floor(Math.random() * stacks.length)];
    loadConfig(stack.config);
  }

  function handleReverse() {
    setColors(backgroundColor, backgroundColor, headingColor);
  }

  return (
    <header className="flex h-14 items-center justify-between border-b bg-background px-2 md:px-4">
      {/* Left: logo */}
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-lg font-bold tracking-tight">TypeStax</span>
        <span className="hidden sm:inline text-[10px] uppercase tracking-widest text-muted-foreground">Type Scale Generator</span>
      </div>

      {/* Center: tabs, viewport, then action buttons */}
      <div className="hidden lg:flex items-center gap-1.5">
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

        {/* Template tabs */}
        <TemplateTabs />

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
          <TooltipContent>{gridPattern ? `Pattern: ${gridPattern}` : "Background pattern"}</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <button type="button" onClick={handleRandom} className={btnClass}>
              <svg className="size-3.5" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="4.5" cy="4.5" r="3" fill="#ff5f57" />
                <circle cx="11.5" cy="4.5" r="3" fill="#febc2e" />
                <circle cx="4.5" cy="11.5" r="3" fill="#28c840" />
                <circle cx="11.5" cy="11.5" r="3" fill="#5b9cf6" />
              </svg>
            </button>
          </TooltipTrigger>
          <TooltipContent>Random accessible colors</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <button type="button" onClick={handleReverse} className={btnClass}>
              <svg className="size-3.5" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="0.5" y="3" width="6" height="10" rx="1.5" fill={headingColor} stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.2" />
                <rect x="9.5" y="3" width="6" height="10" rx="1.5" fill={backgroundColor} stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.2" />
                <path d="M7.5 8L8.5 8M8.5 6.5L8.5 9.5" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" opacity="0.4" />
              </svg>
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
      <div className="flex items-center gap-1 md:gap-1.5 shrink-0">
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

        <Separator orientation="vertical" className="mx-0.5 h-5 hidden md:block" />

        <div className="hidden md:flex items-center gap-1.5">
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
              <button type="button" onClick={() => setResetOpen(true)} className={btnClass}>
                <RotateCcw className="size-3.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Reset to defaults</TooltipContent>
          </Tooltip>
        </div>

        <Separator orientation="vertical" className="mx-0.5 h-5 hidden sm:block" />

        <div className="hidden sm:flex items-center gap-1.5">
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
        </div>

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

      <Dialog open={resetOpen} onOpenChange={setResetOpen}>
        <DialogContent className="max-w-xs">
          <DialogHeader>
            <DialogTitle>Reset to defaults?</DialogTitle>
            <DialogDescription>This will reset all typography settings. This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setResetOpen(false)}>Cancel</Button>
            <Button variant="destructive" size="sm" onClick={() => { resetConfig(); setResetOpen(false); }}>Reset</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
}
