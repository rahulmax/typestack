"use client";

import { PreviewIframe } from "./preview-iframe";
import { BrowserChrome } from "./browser-chrome";
import { MobileChrome } from "./mobile-chrome";
import { TypeScaleView } from "./type-scale-view";
import { useUIStore } from "@/store/ui-store";
import { getTemplateHTML } from "./templates/template-registry";

export function PreviewContainer() {
  const activeTab = useUIStore((s) => s.activeTab);
  const viewport = useUIStore((s) => s.viewport);

  if (viewport === "scale") {
    return (
      <div className="flex h-full flex-col">
        <div className="flex-1 overflow-auto bg-muted p-4">
          <BrowserChrome>
            <TypeScaleView />
          </BrowserChrome>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-hidden bg-muted">
        {viewport === "mobile" ? (
          <MobileChrome>
            <PreviewIframe bodyHTML={getTemplateHTML(activeTab)} mobile />
          </MobileChrome>
        ) : (
          <div className="h-full overflow-auto p-4">
            <BrowserChrome tablet={viewport === "tablet"}>
              <PreviewIframe bodyHTML={getTemplateHTML(activeTab)} />
            </BrowserChrome>
          </div>
        )}
      </div>
    </div>
  );
}
