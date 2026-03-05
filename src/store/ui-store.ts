"use client";

import { create } from "zustand";

export type ViewportSize = "laptop" | "tablet" | "mobile";
export type PreviewTab = "website" | "dashboard" | "blog";

interface UIStore {
  viewport: ViewportSize;
  activeTab: PreviewTab;
  expandedElement: string | null;
  currentStackId: string | null;
  currentStackName: string | null;
  isDirty: boolean;
  scalePanelCollapsed: boolean;

  setViewport: (viewport: ViewportSize) => void;
  setActiveTab: (tab: PreviewTab) => void;
  setExpandedElement: (element: string | null) => void;
  setCurrentStack: (id: string | null, name: string | null) => void;
  setDirty: (dirty: boolean) => void;
  setScalePanelCollapsed: (collapsed: boolean) => void;
}

export const VIEWPORT_WIDTHS: Record<ViewportSize, string> = {
  laptop: "1440px",
  tablet: "768px",
  mobile: "375px",
};

export const useUIStore = create<UIStore>()((set) => ({
  viewport: "laptop",
  activeTab: "website",
  expandedElement: null,
  currentStackId: null,
  currentStackName: null,
  isDirty: false,
  scalePanelCollapsed: false,

  setViewport: (viewport) => set({ viewport }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setExpandedElement: (element) => set({ expandedElement: element }),
  setCurrentStack: (id, name) => set({ currentStackId: id, currentStackName: name, isDirty: false }),
  setDirty: (dirty) => set({ isDirty: dirty }),
  setScalePanelCollapsed: (collapsed) => set({ scalePanelCollapsed: collapsed }),
}));
