"use client";

import { useMemo, useState } from "react";
import { useTypographyStore } from "@/store/typography-store";
import { generateFigmaVariables, type FigmaVariablesMode } from "@/lib/figma-variables";
import { toast } from "sonner";

const MODES: FigmaVariablesMode[] = ["Desktop", "Mobile"];

export function FigmaVariablesExport() {
  const store = useTypographyStore();
  const [mode, setMode] = useState<FigmaVariablesMode>("Desktop");

  const files = useMemo(() => {
    const config = {
      baseFontSize: store.baseFontSize,
      scaleRatioPreset: store.scaleRatioPreset,
      scaleRatio: store.scaleRatio,
      headingsGroup: store.headingsGroup,
      bodyGroup: store.bodyGroup,
      overrides: store.overrides,
      mobile: store.mobile,
      backgroundColor: store.backgroundColor,
      sampleText: store.sampleText,
    };
    return Object.fromEntries(
      MODES.map((m) => [m, generateFigmaVariables(config, m, store.enabledElements)])
    ) as Record<FigmaVariablesMode, string>;
  }, [store.baseFontSize, store.scaleRatio, store.scaleRatioPreset, store.headingsGroup, store.bodyGroup, store.overrides, store.mobile, store.backgroundColor, store.sampleText, store.enabledElements]);

  const handleCopy = () => {
    navigator.clipboard.writeText(files[mode]);
    toast.success(`${mode} variables copied to clipboard`);
  };

  // Figma names each mode after its file, so the file names are the mode names.
  const handleDownload = () => {
    for (const m of MODES) {
      const blob = new Blob([files[m]], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${m}.tokens.json`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url));
    }
    toast.success("Desktop and Mobile files downloaded");
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-medium">Figma Variables</span>
          <div className="hw-btn-group flex">
            {MODES.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className="hw-btn hw-selector-btn"
                data-active={mode === m}
                style={{ height: 28, padding: '0 10px', fontSize: 11 }}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
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
        <code>{files[mode]}</code>
      </pre>
      <p className="text-xs text-muted-foreground">
        Downloads two files. Import both into Figma&apos;s local variables to get one
        collection with a Desktop and a Mobile mode.
      </p>
    </div>
  );
}
