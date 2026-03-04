"use client";

import { ViewportToggle } from "./viewport-toggle";
import { TemplateTabs } from "./template-tabs";
import { TypeScaleView } from "./type-scale-view";
import { PreviewIframe } from "./preview-iframe";
import { BrowserChrome } from "./browser-chrome";
import { MobileChrome } from "./mobile-chrome";
import { useUIStore, VIEWPORT_WIDTHS } from "@/store/ui-store";
import { getTemplateHTML } from "./templates/template-registry";

export function PreviewContainer() {
  const activeTab = useUIStore((s) => s.activeTab);
  const viewport = useUIStore((s) => s.viewport);
  const width = VIEWPORT_WIDTHS[viewport];

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b px-4 py-2">
        <TemplateTabs />
        {activeTab !== "scale" && <ViewportToggle />}
      </div>
      <div
        className={`flex-1 overflow-hidden ${
          activeTab === "scale"
            ? ""
            : "bg-neutral-200 dark:bg-neutral-800"
        }`}
      >
        {activeTab === "scale" ? (
          <TypeScaleView />
        ) : viewport === "mobile" ? (
          <MobileChrome>
            <PreviewIframe bodyHTML={getTemplateHTML(activeTab)} mobile />
          </MobileChrome>
        ) : (
          <div className="h-full overflow-auto p-4">
            <BrowserChrome width={width}>
              <PreviewIframe bodyHTML={getTemplateHTML(activeTab)} />
            </BrowserChrome>
          </div>
        )}
      </div>
    </div>
  );
}
