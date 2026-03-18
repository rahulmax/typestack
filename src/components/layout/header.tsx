"use client";

import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import { Undo2, Redo2, RotateCcw, Sun, Moon, SkipBack, SkipForward } from "lucide-react";
import { useTypographyStore } from "@/store/typography-store";
import { useStore } from "zustand";
import { useTheme } from "next-themes";
import { Show, UserButton, SignInButton } from "@clerk/nextjs";
import { fetchStacks, type Stack } from "@/lib/stacks-api";
import { useUIStore } from "@/store/ui-store";

interface HeaderProps {
  onExportClick: () => void;
  onShareClick: () => void;
  onBrowseStacks: () => void;
}

export function Header({
  onExportClick,
  onShareClick,
  onBrowseStacks,
}: HeaderProps) {
  const resetConfig = useTypographyStore((s) => s.resetConfig);
  const loadConfig = useTypographyStore((s) => s.loadConfig);
  const setCurrentStack = useUIStore((s) => s.setCurrentStack);
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [stacks, setStacks] = useState<Stack[]>([]);
  const [stackIndex, setStackIndex] = useState(-1);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    fetchStacks('all').then((data) => {
      if (data.length > 0) setStacks(data);
    }).catch(() => {})
  }, []);

  const navigateStack = (direction: 'prev' | 'next') => {
    if (stacks.length === 0) return;
    const newIndex = direction === 'next'
      ? (stackIndex + 1) % stacks.length
      : (stackIndex - 1 + stacks.length) % stacks.length;
    const stack = stacks[newIndex];
    loadConfig(stack.config);
    setCurrentStack(stack.id, stack.name);
    setStackIndex(newIndex);
  };

  const { undo, redo, pastStates, futureStates } = useStore(
    useTypographyStore.temporal
  );
  const canUndo = pastStates.length > 0;
  const canRedo = futureStates.length > 0;

  return (
    <header className="relative flex h-14 items-center justify-between border-b bg-background px-2 md:px-4 surface-noise">
      {/* Left: logo + strapline */}
      <div className="relative z-[2] flex items-center gap-2 shrink-0">
        <span className="text-lg font-bold tracking-tight">TypeStax</span>
        <span className="hidden sm:inline text-xs text-muted-foreground/60 tracking-wide translate-y-px">Harmonious Type Stacks</span>
      </div>

      {/* Center: browse button (offset by half sidebar width so it centers in the preview area) */}
      <div className="absolute inset-x-0 flex items-center justify-center gap-1.5 pointer-events-none z-[2]" style={{ paddingLeft: 180 }}>
        <button
          type="button"
          onClick={() => navigateStack('prev')}
          disabled={stacks.length === 0}
          className="hw-btn hidden sm:inline-flex pointer-events-auto"
          style={{ height: 36, width: 36, padding: 0, justifyContent: 'center' }}
        >
          <SkipBack className="size-3.5" />
        </button>
        <button type="button" onClick={onBrowseStacks} className="hw-btn hidden sm:inline-flex text-sm pointer-events-auto" style={{ height: 36, padding: '0 16px' }}>
          <svg viewBox="0 0 16 16" fill="currentColor" className="size-3.5">
            <polygon points="8 3 14 10 2 10" />
            <rect x="2" y="12" width="12" height="1.5" rx="0.5" />
          </svg>
          Browse Typeface Combos
        </button>
        <button
          type="button"
          onClick={() => navigateStack('next')}
          disabled={stacks.length === 0}
          className="hw-btn hidden sm:inline-flex pointer-events-auto"
          style={{ height: 36, width: 36, padding: 0, justifyContent: 'center' }}
        >
          <SkipForward className="size-3.5" />
        </button>
      </div>

      {/* Right: theme, undo/redo/reset, share, export */}
      <div className="relative z-[2] flex items-center gap-1 md:gap-1.5 shrink-0">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className="hw-btn relative flex items-center gap-0 !w-auto !px-0.5"
            >
              {mounted ? (
                <>
                  <span className={`flex items-center justify-center size-6 rounded-[5px] transition-colors ${resolvedTheme === "light" ? "bg-foreground text-background" : ""}`}>
                    <Sun className="size-3" />
                  </span>
                  <span className={`flex items-center justify-center size-6 rounded-[5px] transition-colors ${resolvedTheme === "dark" ? "bg-foreground text-background" : ""}`}>
                    <Moon className="size-3" />
                  </span>
                </>
              ) : <span className="size-6" />}
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
                className="hw-btn"
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
                className="hw-btn"
              >
                <Redo2 className="size-3.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Redo (Cmd+Shift+Z)</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <button type="button" onClick={() => resetConfig(resolvedTheme === 'dark')} className="hw-btn">
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
              <button type="button" onClick={onShareClick} className="hw-btn">
                Share
              </button>
            </TooltipTrigger>
            <TooltipContent>Share URL (Cmd+S)</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <button type="button" onClick={onExportClick} className="hw-btn hw-btn-primary">
                Export
              </button>
            </TooltipTrigger>
            <TooltipContent>Export (Cmd+E)</TooltipContent>
          </Tooltip>
        </div>

        <Separator orientation="vertical" className="mx-0.5 h-5" />

        <Show when="signed-out">
          <SignInButton mode="modal">
            <button type="button" className="hw-btn">
              Sign in
            </button>
          </SignInButton>
        </Show>
        <Show when="signed-in">
          <UserButton />
        </Show>
      </div>

    </header>
  );
}
