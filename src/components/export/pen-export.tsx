"use client"

import { useMemo } from "react"
import { useTypographyStore } from "@/store/typography-store"
import { generatePenFile } from "@/lib/pen-export"
import { toast } from "sonner"

export function PenExport() {
  const store = useTypographyStore()
  const pen = useMemo(
    () =>
      generatePenFile({
        baseFontSize: store.baseFontSize,
        scaleRatioPreset: store.scaleRatioPreset,
        scaleRatio: store.scaleRatio,
        headingsGroup: store.headingsGroup,
        bodyGroup: store.bodyGroup,
        overrides: store.overrides,
        mobile: store.mobile,
        backgroundColor: store.backgroundColor,
        sampleText: store.sampleText,
      }),
    [store.baseFontSize, store.scaleRatio, store.scaleRatioPreset, store.headingsGroup, store.bodyGroup, store.overrides, store.mobile, store.backgroundColor, store.sampleText]
  )

  const handleCopy = () => {
    navigator.clipboard.writeText(pen)
    toast.success("Pencil file copied to clipboard")
  }

  const handleDownload = () => {
    const heading = store.headingsGroup.fontFamily.replace(/\s+/g, '-')
    const body = store.bodyGroup.fontFamily.replace(/\s+/g, '-')
    const slug = heading === body ? heading : `${heading}+${body}`

    const blob = new Blob([pen], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${slug}.lib.pen`
    a.click()
    URL.revokeObjectURL(url)
    toast.success("Pencil file downloaded")
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Pencil Variables</span>
        <div className="flex gap-2">
          <button type="button" className="hw-btn" onClick={handleCopy}>
            Copy
          </button>
          <button type="button" className="hw-btn" onClick={handleDownload}>
            Download
          </button>
        </div>
      </div>
      <pre className="max-h-[400px] overflow-auto rounded-md border bg-muted p-4 text-xs whitespace-pre-wrap break-all">
        <code>{pen}</code>
      </pre>
    </div>
  )
}
