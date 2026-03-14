"use client";

import { useMemo } from "react";
import { useTypographyStore } from "@/store/typography-store";
import { generateCSS } from "@/lib/css-generator";
import { toast } from "sonner";

export function CSSExport() {
  const store = useTypographyStore();
  const css = useMemo(
    () =>
      generateCSS({
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

  const handleCopy = () => {
    navigator.clipboard.writeText(css);
    toast.success("CSS copied to clipboard");
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">CSS Custom Properties</span>
        <button type="button" className="hw-btn" onClick={handleCopy}>
          Copy
        </button>
      </div>
      <pre className="max-h-[400px] overflow-auto rounded-md border bg-muted p-4 text-xs whitespace-pre-wrap break-all">
        <code>{css}</code>
      </pre>
    </div>
  );
}
