"use client";

import { create } from "zustand";
import { pickCopyIndex } from "@/data/copy-sets";

// The first two tabs are rendered by React; the rest are HTML pages in an iframe.
export type PreviewTab =
  | "scale"
  | "specimen"
  | "website"
  | "blog"
  | "magazine"
  | "docs"
  | "swiss"
  | "newsletter";

export const GRID_PATTERN_TYPES = ["square", "dots", "plus", "tallrect", "diagonal", "crosshatch", "hlines", "diamond"] as const;
export type GridPatternType = (typeof GRID_PATTERN_TYPES)[number] | null;

/** Zoom steps for the page tabs */
export const ZOOM_LEVELS = [0.5, 0.67, 0.75, 0.9, 1, 1.1, 1.25, 1.5, 2] as const;

interface UIStore {
  activeTab: PreviewTab;
  /** The phone preview, shown over any tab */
  phone: boolean;
  /** Magnification of the page tabs; the page keeps its layout width */
  zoom: number;
  expandedElement: string | null;
  currentStackId: string | null;
  currentStackName: string | null;
  isDirty: boolean;
  scalePanelCollapsed: boolean;
  gridPattern: GridPatternType;
  patternRotation: number;
  patternScale: number;
  patternOpacity: number;
  patternSpacing: number;
  /** Which copy set the previews are written in; rerolled with colours and stacks. */
  copyIndex: number;

  togglePhone: () => void;
  stepZoom: (dir: 1 | -1) => void;
  resetZoom: () => void;
  setActiveTab: (tab: PreviewTab) => void;
  setExpandedElement: (element: string | null) => void;
  setCurrentStack: (id: string | null, name: string | null) => void;
  setDirty: (dirty: boolean) => void;
  setScalePanelCollapsed: (collapsed: boolean) => void;
  setGridPattern: (pattern: GridPatternType) => void;
  setPatternRotation: (rotation: number) => void;
  setPatternScale: (scale: number) => void;
  setPatternOpacity: (opacity: number) => void;
  setPatternSpacing: (spacing: number) => void;
  cycleGridPattern: () => void;
  rollCopy: () => void;
}

export const useUIStore = create<UIStore>()((set) => ({
  activeTab: "scale",
  phone: false,
  zoom: 1,
  expandedElement: null,
  currentStackId: null,
  currentStackName: null,
  isDirty: false,
  scalePanelCollapsed: false,
  gridPattern: null,
  patternRotation: 0,
  patternScale: 1,
  patternOpacity: 100,
  patternSpacing: 0,
  copyIndex: 0,

  togglePhone: () => set((state) => ({ phone: !state.phone })),
  stepZoom: (dir) =>
    set((state) => {
      const i = ZOOM_LEVELS.findIndex((z) => z >= state.zoom - 0.001);
      const next = ZOOM_LEVELS[Math.min(ZOOM_LEVELS.length - 1, Math.max(0, (i === -1 ? ZOOM_LEVELS.length - 1 : i) + dir))];
      return { zoom: next };
    }),
  resetZoom: () => set({ zoom: 1 }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setExpandedElement: (element) => set({ expandedElement: element }),
  setCurrentStack: (id, name) => set({ currentStackId: id, currentStackName: name, isDirty: false }),
  setDirty: (dirty) => set({ isDirty: dirty }),
  setScalePanelCollapsed: (collapsed) => set({ scalePanelCollapsed: collapsed }),
  setGridPattern: (pattern) => set({ gridPattern: pattern }),
  setPatternRotation: (rotation) => set({ patternRotation: rotation }),
  setPatternScale: (scale) => set({ patternScale: scale }),
  setPatternOpacity: (opacity) => set({ patternOpacity: opacity }),
  setPatternSpacing: (spacing) => set({ patternSpacing: spacing }),
  rollCopy: () => set((state) => ({ copyIndex: pickCopyIndex(state.copyIndex) })),
  cycleGridPattern: () =>
    set((state) => {
      const all: GridPatternType[] = [null, ...GRID_PATTERN_TYPES];
      const idx = all.indexOf(state.gridPattern);
      return { gridPattern: all[(idx + 1) % all.length] };
    }),
}));
