"use client";

import { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import { PanelLeftClose, PanelLeftOpen, X } from "lucide-react";

interface SidebarProps {
  children: ReactNode;
}

export function Sidebar({ children }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <div className="relative shrink-0 hidden md:block">
        <aside
          style={{ "--sidebar-width": "360px" } as React.CSSProperties}
          className={`relative h-full border-r bg-background surface-noise transition-all duration-200 ${
            collapsed ? "w-0 border-r-0 overflow-hidden" : "w-[360px] overflow-y-clip"
          }`}
        >
          <div
            className="relative z-[2] h-full overflow-y-auto flex flex-col"
            style={{ overflowX: 'clip', overflowClipMargin: 20 } as React.CSSProperties}
          >{children}</div>
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

      {/* Mobile toggle */}
      <Button
        variant="outline"
        size="sm"
        className="fixed bottom-4 left-4 z-40 md:hidden h-10 w-10 rounded-full p-0 shadow-lg"
        onClick={() => setMobileOpen(true)}
      >
        <PanelLeftOpen className="size-4" />
      </Button>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-[85vw] max-w-[400px] overflow-y-auto bg-background surface-noise shadow-xl">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <span className="text-sm font-semibold">Settings</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => setMobileOpen(false)}
              >
                <X className="size-4" />
              </Button>
            </div>
            <div className="flex flex-col">{children}</div>
          </aside>
        </div>
      )}
    </>
  );
}
