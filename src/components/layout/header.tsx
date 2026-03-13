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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState, useEffect, useRef } from "react";
import { Undo2, Redo2, RotateCcw, Wand2, Dices, Sun, Moon, Grid3x3, CircleDot, Plus, RectangleVertical, Slash, Hash, Minus, Diamond, Ban } from "lucide-react";
import { HexColorPicker } from "react-colorful";
import { HexRgbInput } from "@/components/controls/color-picker/hex-rgb-input";
import { TailwindPalette } from "@/components/controls/color-picker/tailwind-palette";
import { useTypographyStore } from "@/store/typography-store";
import { useUIStore, GRID_PATTERN_TYPES, type GridPatternType } from "@/store/ui-store";
import { useStore } from "zustand";
import { generateRandomColorPair } from "@/lib/color-utils";
import { fetchStacks, type Stack } from "@/lib/stacks-api";
import { TemplateTabs } from "@/components/preview/template-tabs";
import { useTheme } from "next-themes";
import { Show, UserButton, SignInButton } from "@clerk/nextjs";

function ColorPickerButton({
  color,
  onChange,
  label,
  tooltipText,
}: {
  color: string
  onChange: (color: string) => void
  label: string
  tooltipText: string
}) {
  return (
    <Popover>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <button type="button" className="hw-btn">
              <span
                className="h-4 w-4 rounded-sm shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]"
                style={{ backgroundColor: color }}
              />
              <span className="opacity-60">{label}</span>
            </button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>{tooltipText}</TooltipContent>
      </Tooltip>
      <PopoverContent className="w-[320px] p-0 hw-module-panel" align="center" sideOffset={8}>
        <span className="hw-bolt hw-bolt-tl" />
        <span className="hw-bolt hw-bolt-tr" />
        <span className="hw-bolt hw-bolt-bl" />
        <span className="hw-bolt hw-bolt-br" />
        <div className="flex flex-col gap-3 px-4 py-4">
          <HexColorPicker
            color={color}
            onChange={onChange}
            style={{ width: "100%", height: 140 }}
          />
          <HexRgbInput color={color} onChange={onChange} />
          <TailwindPalette onSelect={onChange} />
        </div>
      </PopoverContent>
    </Popover>
  )
}

const PATTERN_ICONS: Record<string, React.ReactNode> = {
  square: <Grid3x3 className="size-3.5" />,
  dots: <CircleDot className="size-3.5" />,
  plus: <Plus className="size-3.5" />,
  tallrect: <RectangleVertical className="size-3.5" />,
  diagonal: <Slash className="size-3.5" />,
  crosshatch: <Hash className="size-3.5" />,
  hlines: <Minus className="size-3.5" />,
  diamond: <Diamond className="size-3.5" />,
}

const PATTERN_TOOLTIPS: Record<string, string> = {
  square: "Square Grid",
  dots: "Dots",
  plus: "Plus",
  tallrect: "Tall Rect",
  diagonal: "Diagonal",
  crosshatch: "Crosshatch",
  hlines: "H-Lines",
  diamond: "Diamond",
}

function PatternSelector() {
  const gridPattern = useUIStore((s) => s.gridPattern);
  const setGridPattern = useUIStore((s) => s.setGridPattern);

  return (
    <Popover>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="hw-btn"
              data-active={gridPattern !== null}
            >
              <Grid3x3 className="size-3.5" />
            </button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>{gridPattern ? `Pattern: ${PATTERN_TOOLTIPS[gridPattern]}` : "Background pattern"}</TooltipContent>
      </Tooltip>
      <PopoverContent className="w-auto p-0 hw-module-panel" align="center" sideOffset={8}>
        <span className="hw-bolt hw-bolt-tl" />
        <span className="hw-bolt hw-bolt-tr" />
        <span className="hw-bolt hw-bolt-bl" />
        <span className="hw-bolt hw-bolt-br" />
        <div className="flex items-center gap-0.5 px-3 py-2.5">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => setGridPattern(null)}
                className="hw-btn hw-selector-btn"
                data-active={gridPattern === null}
                style={{ width: 30, height: 28, padding: 0, borderRadius: 5 }}
              >
                <Ban className="size-3.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent>None</TooltipContent>
          </Tooltip>
          {GRID_PATTERN_TYPES.map((p) => (
            <Tooltip key={p}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => setGridPattern(p as GridPatternType)}
                  className="hw-btn hw-selector-btn"
                  data-active={gridPattern === p}
                  style={{ width: 30, height: 28, padding: 0, borderRadius: 5 }}
                >
                  {PATTERN_ICONS[p]}
                </button>
              </TooltipTrigger>
              <TooltipContent>{PATTERN_TOOLTIPS[p]}</TooltipContent>
            </Tooltip>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

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
  const headingColor = useTypographyStore((s) => s.headingsGroup.color);
  const bodyColor = useTypographyStore((s) => s.bodyGroup.color);
  const backgroundColor = useTypographyStore((s) => s.backgroundColor);
  const setColors = useTypographyStore((s) => s.setColors);
  const resetConfig = useTypographyStore((s) => s.resetConfig);
  const loadConfig = useTypographyStore((s) => s.loadConfig);
  const autoBalance = useTypographyStore((s) => s.autoBalance);
  const setAutoBalance = useTypographyStore((s) => s.setAutoBalance);
  const updateHeadingsGroup = useTypographyStore((s) => s.updateHeadingsGroup);
  const updateBodyGroup = useTypographyStore((s) => s.updateBodyGroup);
  const setBackgroundColor = useTypographyStore((s) => s.setBackgroundColor);
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
    <header className="flex h-14 items-center justify-between border-b bg-background px-2 md:px-4 surface-noise">
      {/* Left: logo */}
      <div className="relative z-[2] flex items-center gap-2 shrink-0">
        <span className="text-lg font-bold tracking-tight">TypeStax</span>
        <button type="button" onClick={onBrowseStacks} className="hidden sm:inline text-xs text-muted-foreground hover:text-foreground transition-colors">
          Presets
        </button>
      </div>

      {/* Center: tabs, viewport, then action buttons */}
      <div className="relative z-[2] hidden lg:flex items-center gap-1.5">
        {/* Auto Balance + Random Stack */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={() => setAutoBalance(!autoBalance)}
              className="hw-btn"
              data-active={autoBalance}
            >
              <Wand2 className="size-3.5" />
            </button>
          </TooltipTrigger>
          <TooltipContent>Auto Balance</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <button type="button" onClick={handleRandomStack} className="hw-btn">
              <Dices className="size-3.5" />
            </button>
          </TooltipTrigger>
          <TooltipContent>Random preset</TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" className="mx-0.5 h-5" />

        {/* Template tabs */}
        <TemplateTabs />

        <Separator orientation="vertical" className="mx-0.5 h-5" />

        {/* Color controls — anchored popovers */}
        <ColorPickerButton
          color={headingColor}
          onChange={(color) => updateHeadingsGroup({ color })}
          label="H"
          tooltipText="Heading color"
        />
        <ColorPickerButton
          color={bodyColor}
          onChange={(color) => updateBodyGroup({ color })}
          label="B"
          tooltipText="Body color"
        />
        <ColorPickerButton
          color={backgroundColor}
          onChange={setBackgroundColor}
          label="BG"
          tooltipText="Background color"
        />
        <PatternSelector />
        <Tooltip>
          <TooltipTrigger asChild>
            <button type="button" onClick={handleRandom} className="hw-btn">
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
            <button type="button" onClick={handleReverse} className="hw-btn">
              <svg className="size-3.5" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="0.5" y="3" width="6" height="10" rx="1.5" fill={headingColor} stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.2" />
                <rect x="9.5" y="3" width="6" height="10" rx="1.5" fill={backgroundColor} stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.2" />
                <path d="M7.5 8L8.5 8M8.5 6.5L8.5 9.5" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" opacity="0.4" />
              </svg>
            </button>
          </TooltipTrigger>
          <TooltipContent>Swap foreground / background</TooltipContent>
        </Tooltip>
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
              <button type="button" onClick={() => setResetOpen(true)} className="hw-btn">
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
