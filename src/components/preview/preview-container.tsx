"use client";

import { PreviewIframe } from "./preview-iframe";
import { BrowserChrome } from "./browser-chrome";
import { MobileChrome } from "./mobile-chrome";
import { TypeScaleView } from "./type-scale-view";
import { StyleCards } from "./style-cards";
import { useUIStore } from "@/store/ui-store";
import { getTemplateHTML } from "./templates/template-registry";

export function PreviewContainer() {
  const activeTab = useUIStore((s) => s.activeTab);
  const viewport = useUIStore((s) => s.viewport);

  if (viewport === "scale") {
    return (
      <div className="flex h-full flex-col">
        <div className="flex-1 overflow-auto bg-background p-2 md:p-4">
          <div className="hidden md:block">
            <BrowserChrome>
              <TypeScaleView />
            </BrowserChrome>
          </div>
          <div className="md:hidden">
            <TypeScaleView />
          </div>
        </div>
      </div>
    );
  }

  if (viewport === "style") {
    return (
      <div className="flex h-full flex-col">
        <div className="flex-1 overflow-auto bg-background p-2 md:p-4">
          <div className="hidden md:block">
            <BrowserChrome>
              <StyleCards />
            </BrowserChrome>
          </div>
          <div className="md:hidden">
            <StyleCards />
          </div>
        </div>
      </div>
    );
  }

  // laptop and mobile share the same desktop base; mobile adds a phone overlay
  const html = getTemplateHTML(activeTab);
  return (
    <div className="flex h-full flex-col">
      <div className="relative flex-1 overflow-hidden bg-background">
        <div className="h-full overflow-auto p-4">
          <BrowserChrome>
            <PreviewIframe bodyHTML={html} />
          </BrowserChrome>
        </div>
        {viewport === "mobile" && (
          // Anchored bottom-right; the bottom 20% of the phone runs off the container and is clipped
          <div
            className="pointer-events-none absolute bottom-0 right-8 z-20 w-[375px] max-w-[calc(100%-2rem)]"
            style={{ height: "min(780px, 88%)", transform: "translateY(20%)" }}
          >
            <div className="pointer-events-auto h-full">
              <MobileChrome>
                <PreviewIframe bodyHTML={html} mobile />
              </MobileChrome>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
