"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { StackCard } from "@/components/stacks/stack-card";
import { Button } from "@/components/ui/button";
import {
  fetchStacks,
  toggleLike,
  toggleSave,
  type Stack,
} from "@/lib/stacks-api";
import { useTypographyStore } from "@/store/typography-store";
import { useUIStore } from "@/store/ui-store";
import { useFontLoader } from "@/components/stacks/use-gallery-fonts";
import { ArrowLeft, Plus } from "lucide-react";

type Filter = "all" | "presets" | "community" | "mine" | "saved";

const FILTER_LABELS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "presets", label: "Presets" },
  { value: "community", label: "Community" },
  { value: "mine", label: "My Stacks" },
  { value: "saved", label: "Saved" },
];

export default function StacksPage() {
  const [stacks, setStacks] = useState<Stack[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const loadConfig = useTypographyStore((s) => s.loadConfig);
  const setCurrentStack = useUIStore((s) => s.setCurrentStack);
  const resetConfig = useTypographyStore((s) => s.resetConfig);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchStacks(filter);
      setStacks(data);
    } catch (err) {
      console.error("Failed to load stacks", err);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    load();
  }, [load]);

  useFontLoader(stacks);

  const handleSelect = (stack: Stack) => {
    loadConfig(stack.config);
    setCurrentStack(stack.id, stack.name);
    router.push("/");
  };

  const handleLike = async (stack: Stack) => {
    const { liked } = await toggleLike(stack.id);
    setStacks((prev) =>
      prev.map((s) =>
        s.id === stack.id
          ? {
              ...s,
              isLiked: liked,
              likesCount: s.likesCount + (liked ? 1 : -1),
            }
          : s
      )
    );
  };

  const handleSave = async (stack: Stack) => {
    const { saved } = await toggleSave(stack.id);
    setStacks((prev) =>
      prev.map((s) =>
        s.id === stack.id
          ? {
              ...s,
              isSaved: saved,
              savesCount: s.savesCount + (saved ? 1 : -1),
            }
          : s
      )
    );
  };

  const handleNew = () => {
    resetConfig();
    setCurrentStack(null, null);
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/")}
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Editor
            </Button>
            <div>
              <h1 className="text-lg font-semibold">Stacks</h1>
              <p className="text-xs text-muted-foreground">
                Browse typography presets and community stacks
              </p>
            </div>
          </div>
          <Button size="sm" onClick={handleNew}>
            <Plus className="mr-1 h-4 w-4" />
            New Stack
          </Button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-6">
        {/* Filters */}
        <div className="mb-6 flex gap-1">
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

        {/* Grid */}
        {loading ? (
          <div className="py-20 text-center text-sm text-muted-foreground">
            Loading stacks...
          </div>
        ) : stacks.length === 0 ? (
          <div className="py-20 text-center text-sm text-muted-foreground">
            No stacks found.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {stacks.map((stack) => (
              <StackCard
                key={stack.id}
                stack={stack}
                onSelect={handleSelect}
                onLike={handleLike}
                onSave={handleSave}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
