"use client";

import { ReactNode } from "react";

interface AppShellProps {
  header: ReactNode;
  sidebar: ReactNode;
  preview: ReactNode;
}

export function AppShell({ header, sidebar, preview }: AppShellProps) {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {header}
      <div className="relative flex flex-1 overflow-hidden gap-6">
        {sidebar}
        <main className="flex-1 overflow-hidden">{preview}</main>
      </div>
    </div>
  );
}
