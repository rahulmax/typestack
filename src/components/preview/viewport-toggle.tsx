"use client";

import { Button } from "@/components/ui/button";
import { useUIStore, type ViewportSize } from "@/store/ui-store";

const VIEWPORTS: { value: ViewportSize; label: string }[] = [
  { value: "desktop", label: "Desktop" },
  { value: "laptop", label: "Laptop" },
  { value: "tablet", label: "Tablet" },
  { value: "mobile", label: "Mobile" },
];

export function ViewportToggle() {
  const viewport = useUIStore((s) => s.viewport);
  const setViewport = useUIStore((s) => s.setViewport);

  return (
    <div className="flex gap-1">
      {VIEWPORTS.map(({ value, label }) => (
        <Button
          key={value}
          variant={viewport === value ? "secondary" : "ghost"}
          size="sm"
          className="h-7 text-xs"
          onClick={() => setViewport(value)}
        >
          {label}
        </Button>
      ))}
    </div>
  );
}
