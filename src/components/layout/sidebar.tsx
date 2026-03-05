"use client";

import { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

interface SidebarProps {
  children: ReactNode;
}

export function Sidebar({ children }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="relative shrink-0">
      <aside
        className={`h-full overflow-y-auto border-r bg-background transition-all duration-200 ${
          collapsed ? "w-0 overflow-hidden border-r-0" : "w-[360px]"
        }`}
      >
        <div className="flex flex-col gap-6 p-4">{children}</div>
      </aside>
      <Button
        variant="ghost"
        size="sm"
        className="absolute -right-8 top-2 z-10 h-7 w-7 rounded-sm border bg-background p-0 text-muted-foreground hover:text-foreground"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <PanelLeftOpen className="size-3.5" /> : <PanelLeftClose className="size-3.5" />}
      </Button>
    </div>
  );
}
