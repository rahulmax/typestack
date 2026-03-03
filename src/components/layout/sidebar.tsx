"use client";

import { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  children: ReactNode;
}

export function Sidebar({ children }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <aside
        className={`h-full shrink-0 overflow-y-auto border-r bg-background transition-all duration-200 ${
          collapsed ? "w-0 overflow-hidden border-r-0" : "w-[360px]"
        }`}
      >
        <div className="flex flex-col gap-6 p-4">{children}</div>
      </aside>
      <Button
        variant="ghost"
        size="sm"
        className="absolute left-0 top-16 z-10 h-8 w-6 rounded-l-none rounded-r-md border border-l-0 bg-background"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? ">" : "<"}
      </Button>
    </>
  );
}
