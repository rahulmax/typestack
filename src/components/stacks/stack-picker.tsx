"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import {
  fetchStacks,
  createStack,
  type Stack,
} from "@/lib/stacks-api";
import { useTypographyStore } from "@/store/typography-store";
import { useUIStore } from "@/store/ui-store";
import {
  Library,
  Plus,
  Save,
  Shuffle,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTheme } from "next-themes";
import { toast } from "sonner";

export function StackPicker({ onBrowseStacks }: { onBrowseStacks: () => void }) {
  const [open, setOpen] = useState(false);
  const [stacks, setStacks] = useState<Stack[]>([]);
  const [saving, setSaving] = useState(false);
  const [newName, setNewName] = useState("");
  const [showNameInput, setShowNameInput] = useState(false);

  const currentStackId = useUIStore((s) => s.currentStackId);
  const currentStackName = useUIStore((s) => s.currentStackName);
  const isDirty = useUIStore((s) => s.isDirty);
  const setCurrentStack = useUIStore((s) => s.setCurrentStack);
  const loadConfig = useTypographyStore((s) => s.loadConfig);
  const resetConfig = useTypographyStore((s) => s.resetConfig);
  const headingFont = useTypographyStore((s) => s.headingsGroup.fontFamily);
  const bodyFont = useTypographyStore((s) => s.bodyGroup.fontFamily);
  const { resolvedTheme } = useTheme();

  const getConfig = useCallback(() => {
    const s = useTypographyStore.getState();
    return {
      baseFontSize: s.baseFontSize,
      scaleRatioPreset: s.scaleRatioPreset,
      scaleRatio: s.scaleRatio,
      headingsGroup: { ...s.headingsGroup, color: "#1a1a1a" },
      bodyGroup: { ...s.bodyGroup, color: "#1a1a1a" },
      overrides: s.overrides,
      mobile: s.mobile,
      backgroundColor: "#ffffff",
      sampleText: s.sampleText,
    };
  }, []);

  const load = useCallback(async () => {
    try {
      const data = await fetchStacks("saved");
      setStacks(data.slice(0, 8));
    } catch {
      // Silently fail
    }
  }, []);

  useEffect(() => {
    if (open) load();
  }, [open, load]);

  const handleSaveAs = async () => {
    if (!newName.trim()) return;
    setSaving(true);
    try {
      const config = getConfig();
      const stack = await createStack(newName.trim(), config);
      setCurrentStack(stack.id, stack.name);
      setShowNameInput(false);
      setNewName("");
      setOpen(false);
      toast.success("Preset saved");
    } catch {
      toast.error("Failed to save preset");
    } finally {
      setSaving(false);
    }
  };

  const handleSelect = (stack: Stack) => {
    loadConfig(stack.config);
    setCurrentStack(stack.id, stack.name);
    setOpen(false);
  };

  const handleNew = () => {
    resetConfig(resolvedTheme === 'dark');
    setCurrentStack(null, null);
    setOpen(false);
  };

  const hasCustomName = !!currentStackName;

  const handleRandomStack = useCallback(async () => {
    try {
      const data = await fetchStacks("all")
      if (data.length === 0) return
      const stack = data[Math.floor(Math.random() * data.length)]
      loadConfig(stack.config)
      setCurrentStack(stack.id, stack.name)
    } catch {
      // Silently fail
    }
  }, [loadConfig, setCurrentStack])

  return (
    <div className="flex gap-1.5">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="hw-btn flex !h-12 flex-1 min-w-0 items-center !justify-between !rounded-[4px] px-3 !text-base text-left"
          >
            <span className="truncate">
              {hasCustomName ? (
                <>{currentStackName}{isDirty && " *"}</>
              ) : (
                <>
                  <span style={{ fontFamily: headingFont }}>{headingFont}</span>
                  <span className="text-muted-foreground/50"> + </span>
                  <span style={{ fontFamily: bodyFont }}>{bodyFont}</span>
                  {isDirty && " *"}
                </>
              )}
            </span>
            <svg viewBox="0 0 16 16" fill="currentColor" className="ml-2 size-3 shrink-0 opacity-50">
              <polygon points="8 3 14 10 2 10" />
              <rect x="2" y="12" width="12" height="1.5" rx="0.5" />
            </svg>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 surface-noise hw-module-panel" align="start">
          <span className="hw-bolt hw-bolt-tl" />
          <span className="hw-bolt hw-bolt-tr" />
          <span className="hw-bolt hw-bolt-bl" />
          <span className="hw-bolt hw-bolt-br" />
          <div className="flex flex-col gap-1.5 px-3 py-3">
            {showNameInput ? (
              <div className="flex gap-1">
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Preset name..."
                  className="h-8 text-xs"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveAs();
                    if (e.key === "Escape") setShowNameInput(false);
                  }}
                />
                <button
                  type="button"
                  className="hw-btn hw-btn-primary !h-8 text-xs"
                  disabled={saving || !newName.trim()}
                  onClick={handleSaveAs}
                >
                  Save
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="hw-btn !justify-start text-xs"
                onClick={() => setShowNameInput(true)}
              >
                <Save className="mr-2 h-3.5 w-3.5" />
                Save As...
              </button>
            )}

            <button
              type="button"
              className="hw-btn !justify-start text-xs"
              onClick={handleNew}
            >
              <Plus className="mr-2 h-3.5 w-3.5" />
              New Preset
            </button>

            <button
              type="button"
              className="hw-btn !justify-start text-xs"
              onClick={() => {
                setOpen(false);
                onBrowseStacks();
              }}
            >
              <Library className="mr-2 h-3.5 w-3.5" />
              Browse All Presets
            </button>

            {stacks.length > 0 && (
              <>
                <div className="my-1 border-t" />
                <span className="px-2 py-1 text-[10px] font-medium text-muted-foreground uppercase">
                  Saved
                </span>
                {stacks.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    className={`hw-btn !justify-start text-xs w-full ${
                      s.id === currentStackId ? "hw-btn-active" : ""
                    }`}
                    data-active={s.id === currentStackId}
                    onClick={() => handleSelect(s)}
                  >
                    <span className="truncate">{s.name}</span>
                  </button>
                ))}
              </>
            )}
          </div>
        </PopoverContent>
      </Popover>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={handleRandomStack}
            className="hw-btn !h-12 !w-12 shrink-0 !rounded-[4px]"
          >
            <Shuffle className="size-4" />
          </button>
        </TooltipTrigger>
        <TooltipContent>Random preset</TooltipContent>
      </Tooltip>
    </div>
  );
}
