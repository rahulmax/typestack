"use client";

import { useUIStore, type PreviewTab } from "@/store/ui-store";

const TABS: { value: PreviewTab; label: string }[] = [
  { value: "website", label: "Website" },
  { value: "blog", label: "Blog" },
];

export function TemplateTabs() {
  const activeTab = useUIStore((s) => s.activeTab);
  const setActiveTab = useUIStore((s) => s.setActiveTab);
  const viewport = useUIStore((s) => s.viewport);
  const isScale = viewport === "scale";

  return (
    <div className={`flex gap-1.5 ${isScale ? "opacity-40 pointer-events-none" : ""}`}>
      {TABS.map(({ value, label }) => {
        const isActive = activeTab === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => setActiveTab(value)}
            disabled={isScale}
            className="hw-btn hw-selector-btn"
            data-active={isActive}
            style={{ height: 32, paddingLeft: 10, paddingRight: 10, paddingTop: 4, paddingBottom: 3 }}
          >
            {isActive && <span className="hw-selector-led" />}
            <span className="relative text-[11px]">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
