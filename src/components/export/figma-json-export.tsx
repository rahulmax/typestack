"use client";

import { useMemo } from "react";
import { useTypographyStore } from "@/store/typography-store";
import { generateTokensStudioJSON } from "@/lib/figma-tokens";
import { toast } from "sonner";

export function FigmaJSONExport() {
  const store = useTypographyStore();
  const json = useMemo(
    () =>
      generateTokensStudioJSON({
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
    navigator.clipboard.writeText(json);
    toast.success("Figma tokens JSON copied to clipboard");
  };

  const handleDownload = () => {
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "typestack-tokens.json";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Tokens file downloaded");
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Tokens Studio Format</span>
        <div className="flex gap-2">
          <button type="button" className="hw-btn" onClick={handleCopy}>
            Copy
          </button>
          <button type="button" className="hw-btn" onClick={handleDownload}>
            Download
          </button>
        </div>
      </div>
      <pre className="max-h-[400px] overflow-auto rounded-md border bg-muted p-4 text-xs">
        <code>{json}</code>
      </pre>
    </div>
  );
}
