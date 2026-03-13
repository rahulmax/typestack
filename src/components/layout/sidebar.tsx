"use client"

import { createContext, ReactNode, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { PanelLeftOpen, X } from "lucide-react"

interface SidebarOverflowCtx {
  portalRef: React.RefObject<HTMLDivElement | null>
  scrollRef: React.RefObject<HTMLDivElement | null>
}

export const SidebarOverflowContext = createContext<SidebarOverflowCtx | null>(null)

interface SidebarProps {
  children: ReactNode
}

export function Sidebar({ children }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const portalRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  return (
    <SidebarOverflowContext.Provider value={{ portalRef, scrollRef }}>
      {/* Desktop sidebar */}
      <div className="relative z-10 shrink-0 hidden md:block">
        <aside
          style={{ "--sidebar-width": "360px" } as React.CSSProperties}
          className="relative h-full w-[360px] bg-background surface-noise overflow-x-visible"
        >
          {/* Border drawn as absolute div so scrollbar can sit outside it */}
          <div className="absolute top-0 right-0 bottom-0 w-px bg-border z-[1]" />
          <div
            ref={scrollRef}
            className="relative z-[2] h-full overflow-y-auto flex flex-col -mr-3 pr-3 sidebar-scroll"
          >{children}</div>
          {/* Portal target — outside scroll container, overflow visible */}
          <div
            ref={portalRef}
            className="pointer-events-none absolute top-0 left-0 w-full z-[3]"
            style={{ overflow: 'visible' }}
          />
        </aside>
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
    </SidebarOverflowContext.Provider>
  )
}
