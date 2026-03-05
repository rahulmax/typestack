"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Laptop, Tablet, Smartphone } from "lucide-react";
import { useUIStore, type ViewportSize } from "@/store/ui-store";
import type { LucideIcon } from "lucide-react";

const VIEWPORTS: { value: ViewportSize; label: string; icon: LucideIcon }[] = [
  { value: "laptop", label: "Laptop", icon: Laptop },
  { value: "tablet", label: "Tablet", icon: Tablet },
  { value: "mobile", label: "Mobile", icon: Smartphone },
];

export function ViewportToggle() {
  const viewport = useUIStore((s) => s.viewport);
  const setViewport = useUIStore((s) => s.setViewport);

  return (
    <div className="flex gap-1">
      {VIEWPORTS.map(({ value, label, icon: Icon }) => (
        <Tooltip key={value}>
          <TooltipTrigger asChild>
            <Button
              variant={viewport === value ? "secondary" : "ghost"}
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => setViewport(value)}
            >
              <Icon className="size-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{label}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}
