"use client";

import { create } from "zustand";

export type ViewportSize = "desktop" | "tablet" | "mobile";
export type PreviewTab = "scale" | "website" | "dashboard" | "blog";

interface UIStore {
  viewport: ViewportSize;
  activeTab: PreviewTab;
  expandedElement: string | null;
  currentStackId: string | null;
  currentStackName: string | null;
  isDirty: boolean;

  setViewport: (viewport: ViewportSize) => void;
  setActiveTab: (tab: PreviewTab) => void;
  setExpandedElement: (element: string | null) => void;
  setCurrentStack: (id: string | null, name: string | null) => void;
  setDirty: (dirty: boolean) => void;
}

export const VIEWPORT_WIDTHS: Record<ViewportSize, string> = {
  desktop: "100%",
  tablet: "768px",
  mobile: "375px",
};

export const useUIStore = create<UIStore>()((set) => ({
  viewport: "desktop",
  activeTab: "scale",
  expandedElement: null,
  currentStackId: null,
  currentStackName: null,
  isDirty: false,

  setViewport: (viewport) => set({ viewport }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setExpandedElement: (element) => set({ expandedElement: element }),
  setCurrentStack: (id, name) => set({ currentStackId: id, currentStackName: name, isDirty: false }),
  setDirty: (dirty) => set({ isDirty: dirty }),
}));
