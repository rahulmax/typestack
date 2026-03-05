"use client";

import { Button } from "@/components/ui/button";
import { PanelLeftOpen, PanelLeftClose } from "lucide-react";
import { useUIStore } from "@/store/ui-store";
import { TypeScaleView } from "@/components/preview/type-scale-view";

export function ScalePanel() {
  const collapsed = useUIStore((s) => s.scalePanelCollapsed);
  const setCollapsed = useUIStore((s) => s.setScalePanelCollapsed);

  return (
    <div className="relative shrink-0">
      <div
        className={`h-full overflow-y-auto border-r transition-all duration-200 ${
          collapsed ? "w-0 overflow-hidden border-r-0" : "w-[480px]"
        }`}
      >
        <TypeScaleView />
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="absolute -right-8 top-2 z-10 h-7 w-7 rounded-sm border bg-background p-0 text-muted-foreground hover:text-foreground"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? (
          <PanelLeftOpen className="size-3.5" />
        ) : (
          <PanelLeftClose className="size-3.5" />
        )}
      </Button>
    </div>
  );
}
