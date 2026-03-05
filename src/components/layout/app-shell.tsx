"use client";

import { ReactNode } from "react";

interface AppShellProps {
  header: ReactNode;
  sidebar: ReactNode;
  scalePanel: ReactNode;
  preview: ReactNode;
}

export function AppShell({ header, sidebar, scalePanel, preview }: AppShellProps) {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {header}
      <div className="relative flex flex-1 overflow-hidden">
        {sidebar}
        {scalePanel}
        <main className="flex-1 overflow-hidden">{preview}</main>
      </div>
    </div>
  );
}
