"use client";

import { useEffect } from "react";
import { PreviewIframe } from "./preview-iframe";
import { BrowserChrome } from "./browser-chrome";
import { MobileChrome } from "./mobile-chrome";
import { TypeScaleView } from "./type-scale-view";
import { StyleCards } from "./style-cards";
import { useUIStore } from "@/store/ui-store";
import { useTypographyStore } from "@/store/typography-store";
import { getTemplateHTML, templates } from "./templates/template-registry";
import { COPY_SETS, pickCopyIndex } from "@/data/copy-sets";

// How far the phone reaches in from the frame's right edge, plus a gap
const PHONE_CLEARANCE = 400;

export function PreviewContainer() {
  const activeTab = useUIStore((s) => s.activeTab);
  const phone = useUIStore((s) => s.phone);
  const zoom = useUIStore((s) => s.zoom);
  const copyIndex = useUIStore((s) => s.copyIndex);
  const backgroundColor = useTypographyStore((s) => s.backgroundColor);

  // Start each visit in a random copy set. After mount, so the server render stays deterministic.
  useEffect(() => {
    useUIStore.setState({ copyIndex: pickCopyIndex() });
  }, []);

  const isReact = activeTab === "scale" || activeTab === "specimen";
  const html = isReact ? "" : getTemplateHTML(activeTab, COPY_SETS[copyIndex] ?? COPY_SETS[0]);
  const phoneRoom = phone && !isReact ? (templates[activeTab]?.phoneRoom ?? null) : null;

  const reactView = (mobile?: boolean) =>
    activeTab === "scale" ? <TypeScaleView mobile={mobile} /> : <StyleCards mobile={mobile} />;

  return (
    <div className="flex h-full flex-col">
      <div className="relative flex-1 overflow-hidden bg-background">
        <div className="h-full overflow-auto p-4">
          <BrowserChrome>
            {isReact ? (
              // The React views make room for the phone by narrowing; both reflow to their width
              <div
                className="transition-[padding] duration-300"
                style={{ backgroundColor, paddingRight: phone ? PHONE_CLEARANCE : 0 }}
              >
                {reactView()}
              </div>
            ) : (
              <PreviewIframe bodyHTML={html} phoneRoom={phoneRoom} zoom={zoom} />
            )}
          </BrowserChrome>
        </div>
        {phone && (
          // Anchored bottom-right; the bottom ~9% of the phone runs off the container and is clipped
          <div
            className="pointer-events-none absolute bottom-0 right-8 z-20 w-[375px] max-w-[calc(100%-2rem)]"
            style={{ height: "min(780px, 88%)", transform: "translateY(9%)" }}
          >
            <div className="pointer-events-auto h-full">
              <MobileChrome>
                {isReact ? (
                  <div className="h-full overflow-y-auto overflow-x-hidden">{reactView(true)}</div>
                ) : (
                  <PreviewIframe bodyHTML={html} mobile />
                )}
              </MobileChrome>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
