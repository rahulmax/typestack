'use client'

import { Monitor } from 'lucide-react'

export function MobileNotice() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[oklch(0.22_0.005_60)] p-6 lg:hidden">
      <div className="flex max-w-sm flex-col items-center gap-6 text-center">
        {/* Icon with hardware styling */}
        <div
          className="relative flex h-20 w-20 items-center justify-center rounded-full"
          style={{
            background: 'linear-gradient(135deg, oklch(0.28 0.01 60), oklch(0.24 0.008 60))',
            boxShadow:
              'inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -2px 4px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.5)',
          }}
        >
          <Monitor
            className="h-9 w-9"
            style={{
              color: 'oklch(0.72 0.12 65)',
              filter: 'drop-shadow(0 0 8px oklch(0.72 0.12 65 / 0.6))',
            }}
            strokeWidth={1.5}
          />
        </div>

        {/* Text content */}
        <div className="space-y-3">
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{
              fontFamily: 'var(--font-host-grotesk), system-ui, sans-serif',
              color: 'oklch(0.72 0.12 65)',
              textShadow: '0 0 12px oklch(0.72 0.12 65 / 0.4)',
            }}
          >
            Desktop Only
          </h1>
          <p
            className="text-sm leading-relaxed"
            style={{
              color: 'oklch(0.65 0.02 60)',
            }}
          >
            TypeStax is a precision typography tool designed for desktop screens.
            Please visit on a larger display to access the full interface.
          </p>
        </div>

        {/* Brand mark */}
        <div className="mt-4">
          <span
            className="text-xs font-semibold uppercase tracking-[0.2em]"
            style={{
              fontFamily: 'var(--font-host-grotesk), system-ui, sans-serif',
              color: 'oklch(0.35 0.01 60)',
            }}
          >
            TypeStax
          </span>
        </div>
      </div>
    </div>
  )
}
