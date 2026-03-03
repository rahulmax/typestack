"use client";

import { useState, useCallback, useEffect } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { BaseSettings } from "@/components/controls/base-settings";
import { GroupControls } from "@/components/controls/group-controls";
import { ElementOverridePanel } from "@/components/controls/element-override";
import { MobileSettings } from "@/components/controls/mobile-settings";
import { FontPicker } from "@/components/controls/font-picker/font-picker";
import { ColorPicker } from "@/components/controls/color-picker/color-picker";
import { PreviewContainer } from "@/components/preview/preview-container";
import { ExportDialog } from "@/components/export/export-dialog";
import { Separator } from "@/components/ui/separator";
import { useTypographyStore } from "@/store/typography-store";
import { useURLSync } from "@/store/middleware/url-sync";
import { setConfigToURL } from "@/lib/url-codec";
import { useActiveFontLoader } from "@/hooks/use-font-loader";
import { useUIStore } from "@/store/ui-store";
import { StackPicker } from "@/components/stacks/stack-picker";
import { toast } from "sonner";

export default function Home() {
  const store = useTypographyStore();
  useActiveFontLoader();
  const headingsGroup = store.headingsGroup;
  const bodyGroup = store.bodyGroup;
  const backgroundColor = store.backgroundColor;
  const updateHeadingsGroup = store.updateHeadingsGroup;
  const updateBodyGroup = store.updateBodyGroup;
  const setBackgroundColor = store.setBackgroundColor;

  useURLSync();

  const setDirty = useUIStore((s) => s.setDirty);

  const [fontPickerTarget, setFontPickerTarget] = useState<"headings" | "body" | null>(null);
  const [colorPickerTarget, setColorPickerTarget] = useState<"headings" | "body" | "background" | null>(null);
  const [exportOpen, setExportOpen] = useState(false);

  const handleExportClick = useCallback(() => {
    setExportOpen(true);
  }, []);

  const handleShareClick = useCallback(() => {
    const config = useTypographyStore.getState();
    const url = setConfigToURL({
      baseFontSize: config.baseFontSize,
      scaleRatioPreset: config.scaleRatioPreset,
      scaleRatio: config.scaleRatio,
      headingsGroup: config.headingsGroup,
      bodyGroup: config.bodyGroup,
      overrides: config.overrides,
      mobile: config.mobile,
      backgroundColor: config.backgroundColor,
      sampleText: config.sampleText,
    });
    navigator.clipboard.writeText(url);
    window.history.replaceState(null, "", url);
    toast.success("Share URL copied to clipboard");
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        if (e.key === "e") {
          e.preventDefault();
          setExportOpen(true);
        } else if (e.key === "s") {
          e.preventDefault();
          handleShareClick();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleShareClick]);

  useEffect(() => {
    const unsub = useTypographyStore.subscribe(() => {
      if (!useUIStore.getState().isDirty) {
        setDirty(true);
      }
    });
    return unsub;
  }, [setDirty]);

  const currentFontForPicker =
    fontPickerTarget === "headings"
      ? headingsGroup.fontFamily
      : fontPickerTarget === "body"
        ? bodyGroup.fontFamily
        : "";

  const handleFontSelect = (family: string) => {
    if (fontPickerTarget === "headings") {
      updateHeadingsGroup({ fontFamily: family });
    } else if (fontPickerTarget === "body") {
      updateBodyGroup({ fontFamily: family });
    }
  };

  const currentColorForPicker =
    colorPickerTarget === "headings"
      ? headingsGroup.color
      : colorPickerTarget === "body"
        ? bodyGroup.color
        : colorPickerTarget === "background"
          ? backgroundColor
          : "#000000";

  const handleColorChange = (color: string) => {
    if (colorPickerTarget === "headings") {
      updateHeadingsGroup({ color });
    } else if (colorPickerTarget === "body") {
      updateBodyGroup({ color });
    } else if (colorPickerTarget === "background") {
      setBackgroundColor(color);
    }
  };

  const colorPickerTitle =
    colorPickerTarget === "headings"
      ? "Heading Color"
      : colorPickerTarget === "body"
        ? "Body Color"
        : "Background Color";

  return (
    <>
      <AppShell
        header={
          <Header
            onExportClick={handleExportClick}
            onShareClick={handleShareClick}
            onHeadingColorClick={() => setColorPickerTarget("headings")}
            onBodyColorClick={() => setColorPickerTarget("body")}
            onBackgroundColorClick={() => setColorPickerTarget("background")}
          />
        }
        sidebar={
          <Sidebar>
            <StackPicker />
            <Separator />
            <BaseSettings />
            <Separator />
            <GroupControls
              title="Headings"
              group={headingsGroup}
              onUpdate={updateHeadingsGroup}
              onFontClick={() => setFontPickerTarget("headings")}
            />
            <Separator />
            <GroupControls
              title="Body"
              group={bodyGroup}
              onUpdate={updateBodyGroup}
              onFontClick={() => setFontPickerTarget("body")}
            />
            <Separator />
            <ElementOverridePanel />
            <Separator />
            <MobileSettings />
          </Sidebar>
        }
        preview={<PreviewContainer />}
      />

      <ExportDialog open={exportOpen} onOpenChange={setExportOpen} />

      <FontPicker
        open={fontPickerTarget !== null}
        onOpenChange={(open) => {
          if (!open) setFontPickerTarget(null);
        }}
        currentFont={currentFontForPicker}
        onSelectFont={handleFontSelect}
      />

      <ColorPicker
        open={colorPickerTarget !== null}
        onOpenChange={(open) => {
          if (!open) setColorPickerTarget(null);
        }}
        title={colorPickerTitle}
        color={currentColorForPicker}
        onChange={handleColorChange}
      />
    </>
  );
}
