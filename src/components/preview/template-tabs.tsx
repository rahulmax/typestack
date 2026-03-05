"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUIStore, type PreviewTab } from "@/store/ui-store";

const TABS: { value: PreviewTab; label: string }[] = [
  { value: "website", label: "Website" },
  { value: "dashboard", label: "Dashboard" },
  { value: "blog", label: "Blog" },
];

export function TemplateTabs() {
  const activeTab = useUIStore((s) => s.activeTab);
  const setActiveTab = useUIStore((s) => s.setActiveTab);

  return (
    <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as PreviewTab)}>
      <TabsList className="h-8">
        {TABS.map(({ value, label }) => (
          <TabsTrigger key={value} value={value} className="text-xs">
            {label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
