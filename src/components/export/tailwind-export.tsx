"use client";

import { useMemo, useState } from "react";
import { useTypographyStore } from "@/store/typography-store";
import { generateTailwindCSS, generateTailwindConfig } from "@/lib/tailwind-export";
import { toast } from "sonner";

export function TailwindExport() {
  const store = useTypographyStore();
  const [format, setFormat] = useState<"v4" | "v3">("v4");

  const config = useMemo(
    () => ({
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
  );

  const output = useMemo(
    () => (format === "v4" ? generateTailwindCSS(config) : generateTailwindConfig(config)),
    [config, format]
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    toast.success("Tailwind config copied to clipboard");
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-medium">Tailwind</span>
          <div className="hw-btn-group flex">
            <button
              type="button"
              onClick={() => setFormat("v4")}
              className="hw-btn hw-selector-btn"
              data-active={format === "v4"}
              style={{ height: 28, padding: '0 10px', fontSize: 11 }}
            >
              v4 CSS
            </button>
            <button
              type="button"
              onClick={() => setFormat("v3")}
              className="hw-btn hw-selector-btn"
              data-active={format === "v3"}
              style={{ height: 28, padding: '0 10px', fontSize: 11 }}
            >
              v3 Config
            </button>
          </div>
        </div>
        <button type="button" className="hw-btn" onClick={handleCopy}>
          Copy
        </button>
      </div>
      <pre className="max-h-[400px] overflow-auto rounded-md border bg-muted p-4 text-xs whitespace-pre-wrap break-all">
        <code>{output}</code>
      </pre>
    </div>
  );
}
