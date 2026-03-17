"use client"

interface AnimateExpandProps {
  open: boolean
  children: React.ReactNode
  className?: string
}

export function AnimateExpand({ open, children, className }: AnimateExpandProps) {
  return (
    <div
      className={className}
      style={{
        display: "grid",
        gridTemplateRows: open ? "1fr" : "0fr",
        opacity: open ? 1 : 0,
        transition: "grid-template-rows 0.25s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease",
      }}
    >
      <div style={{ minHeight: 0, clipPath: 'inset(0 -100px 0 0)' }}>
        {children}
      </div>
    </div>
  )
}
