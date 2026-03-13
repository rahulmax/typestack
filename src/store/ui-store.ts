"use client";

import { create } from "zustand";

export type ViewportSize = "scale" | "laptop" | "tablet" | "mobile";
export type PreviewTab = "website" | "blog";

export const GRID_PATTERN_TYPES = ["square", "dots", "plus", "tallrect", "diagonal", "crosshatch", "hlines", "diamond"] as const;
export type GridPatternType = (typeof GRID_PATTERN_TYPES)[number] | null;

interface UIStore {
  viewport: ViewportSize;
  activeTab: PreviewTab;
  expandedElement: string | null;
  currentStackId: string | null;
  currentStackName: string | null;
  isDirty: boolean;
  scalePanelCollapsed: boolean;
  gridPattern: GridPatternType;

  setViewport: (viewport: ViewportSize) => void;
  setActiveTab: (tab: PreviewTab) => void;
  setExpandedElement: (element: string | null) => void;
  setCurrentStack: (id: string | null, name: string | null) => void;
  setDirty: (dirty: boolean) => void;
  setScalePanelCollapsed: (collapsed: boolean) => void;
  setGridPattern: (pattern: GridPatternType) => void;
  cycleGridPattern: () => void;
}

export const VIEWPORT_WIDTHS: Record<ViewportSize, string> = {
  scale: "100%",
  laptop: "1440px",
  tablet: "768px",
  mobile: "375px",
};

export const useUIStore = create<UIStore>()((set) => ({
  viewport: "scale",
  activeTab: "website",
  expandedElement: null,
  currentStackId: null,
  currentStackName: null,
  isDirty: false,
  scalePanelCollapsed: false,
  gridPattern: null,

  setViewport: (viewport) => set({ viewport }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setExpandedElement: (element) => set({ expandedElement: element }),
  setCurrentStack: (id, name) => set({ currentStackId: id, currentStackName: name, isDirty: false }),
  setDirty: (dirty) => set({ isDirty: dirty }),
  setScalePanelCollapsed: (collapsed) => set({ scalePanelCollapsed: collapsed }),
  setGridPattern: (pattern) => set({ gridPattern: pattern }),
  cycleGridPattern: () =>
    set((state) => {
      const all: GridPatternType[] = [null, ...GRID_PATTERN_TYPES];
      const idx = all.indexOf(state.gridPattern);
      return { gridPattern: all[(idx + 1) % all.length] };
    }),
}));
