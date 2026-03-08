"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
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
  ChevronDown,
  Library,
  Plus,
  Save,
} from "lucide-react";
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
    resetConfig();
    setCurrentStack(null, null);
    setOpen(false);
  };

  const displayName = currentStackName || "Unsaved Preset";

  return (
    <div className="flex flex-col gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between text-sm font-normal"
          >
            <span className="truncate">
              {displayName}
              {isDirty && " *"}
            </span>
            <ChevronDown className="ml-2 h-3.5 w-3.5 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[320px] p-2" align="start">
          <div className="flex flex-col gap-1">
            {showNameInput ? (
              <div className="flex gap-1 p-1">
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
                <Button
                  size="sm"
                  className="h-8 text-xs"
                  disabled={saving || !newName.trim()}
                  onClick={handleSaveAs}
                >
                  Save
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="justify-start text-xs"
                onClick={() => setShowNameInput(true)}
              >
                <Save className="mr-2 h-3.5 w-3.5" />
                Save As...
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              className="justify-start text-xs"
              onClick={handleNew}
            >
              <Plus className="mr-2 h-3.5 w-3.5" />
              New Preset
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="justify-start text-xs"
              onClick={() => {
                setOpen(false);
                onBrowseStacks();
              }}
            >
              <Library className="mr-2 h-3.5 w-3.5" />
              Browse All Presets
            </Button>

            {stacks.length > 0 && (
              <>
                <div className="my-1 border-t" />
                <span className="px-2 py-1 text-[10px] font-medium text-muted-foreground uppercase">
                  Saved
                </span>
                {stacks.map((s) => (
                  <Button
                    key={s.id}
                    variant="ghost"
                    size="sm"
                    className={`justify-start text-xs ${
                      s.id === currentStackId ? "bg-accent" : ""
                    }`}
                    onClick={() => handleSelect(s)}
                  >
                    <span className="truncate">{s.name}</span>
                  </Button>
                ))}
              </>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
