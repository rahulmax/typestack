"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CSSExport } from "./css-export";
import { TailwindExport } from "./tailwind-export";
import { CopyElementCSS } from "./copy-element-css";
import { FigmaJSONExport } from "./figma-json-export";
import { FigmaAPIExport } from "./figma-api-export";

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TABS = [
  { value: "css", label: "CSS" },
  { value: "tailwind", label: "Tailwind" },
  { value: "figma-json", label: "Figma JSON" },
  { value: "figma-api", label: "Figma API" },
] as const;

type TabValue = (typeof TABS)[number]["value"];

export function ExportDialog({ open, onOpenChange }: ExportDialogProps) {
  const [tab, setTab] = useState<TabValue>("css");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Export Typography</DialogTitle>
          <DialogDescription>Copy CSS, download Figma tokens, or push variables to Figma.</DialogDescription>
        </DialogHeader>
        <div className="hw-btn-group flex">
          {TABS.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setTab(t.value)}
              className="hw-btn hw-selector-btn flex-1"
              data-active={tab === t.value}
              style={{ height: 34, padding: '0 16px', fontSize: 13 }}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="pt-2">
          {tab === "css" && (
            <div className="flex flex-col gap-4">
              <CSSExport />
              <CopyElementCSS />
            </div>
          )}
          {tab === "tailwind" && <TailwindExport />}
          {tab === "figma-json" && <FigmaJSONExport />}
          {tab === "figma-api" && <FigmaAPIExport />}
        </div>
      </DialogContent>
    </Dialog>
  );
}
