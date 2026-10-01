"use client";

import { create } from "zustand";
import { pickCopyIndex } from "@/data/copy-sets";
import type { CycleMemory } from "@/lib/color-utils";
import type { TypographyElement } from "@/types/typography";

// The first two tabs are rendered by React; the rest are HTML pages in an iframe.
export type PreviewTab =
  | "scale"
  | "specimen"
  | "website"
  | "personal"
  | "blog"
  | "magazine"
  | "docs"
  | "swiss"
  | "newsletter"
  | "book"
  | "newspaper"
  | "poem"
  | "posters"
  | "sleeve"
  | "menu"
  | "credits";

export const GRID_PATTERN_TYPES = ["square", "dots", "plus", "tallrect", "diagonal", "crosshatch", "hlines", "diamond"] as const;
export type GridPatternType = (typeof GRID_PATTERN_TYPES)[number] | null;

/** Zoom steps for the page tabs */
export const ZOOM_LEVELS = [0.5, 0.67, 0.75, 0.9, 1, 1.1, 1.25, 1.5, 2] as const;

/** Tabs that open zoomed out: a spread needs both of its pages in view. Each keeps a zoom of its own. */
export const TAB_ZOOM: Partial<Record<PreviewTab, number>> = { magazine: 0.5 };

interface UIStore {
  activeTab: PreviewTab;
  /** The phone preview, shown over any tab */
  phone: boolean;
  /** Magnification of the page tabs; the page keeps its layout width */
  zoom: number;
  /** Zoom of the tabs in TAB_ZOOM, once the user has moved them off their opening zoom */
  tabZoom: Partial<Record<PreviewTab, number>>;
  expandedElement: string | null;
  /** The scale elements the page tab on show is set in; null on the React tabs, which show them all */
  pageElements: TypographyElement[] | null;
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
  /** The ink the colour cycle is holding back, if its last turn had to; see cycleColors */
  cycleMemory: CycleMemory | null;

  setCycleMemory: (memory: CycleMemory | null) => void;
  togglePhone: () => void;
  stepZoom: (dir: 1 | -1) => void;
  resetZoom: () => void;
  setActiveTab: (tab: PreviewTab) => void;
  setExpandedElement: (element: string | null) => void;
  setPageElements: (elements: TypographyElement[] | null) => void;
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

/** The zoom of the tab on show */
export function selectZoom(state: Pick<UIStore, "activeTab" | "zoom" | "tabZoom">): number {
  const opening = TAB_ZOOM[state.activeTab];
  return opening === undefined ? state.zoom : (state.tabZoom[state.activeTab] ?? opening);
}

// A tab with its own zoom keeps the change to itself; the others share one
function zoomTo(state: UIStore, zoom: number): Partial<UIStore> {
  return state.activeTab in TAB_ZOOM ? { tabZoom: { ...state.tabZoom, [state.activeTab]: zoom } } : { zoom };
}

export const useUIStore = create<UIStore>()((set) => ({
  activeTab: "scale",
  phone: false,
  zoom: 1,
  tabZoom: {},
  expandedElement: null,
  pageElements: null,
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
  cycleMemory: null,

  setCycleMemory: (memory) => set({ cycleMemory: memory }),
  togglePhone: () => set((state) => ({ phone: !state.phone })),
  stepZoom: (dir) =>
    set((state) => {
      const i = ZOOM_LEVELS.findIndex((z) => z >= selectZoom(state) - 0.001);
      const next = ZOOM_LEVELS[Math.min(ZOOM_LEVELS.length - 1, Math.max(0, (i === -1 ? ZOOM_LEVELS.length - 1 : i) + dir))];
      return zoomTo(state, next);
    }),
  resetZoom: () => set((state) => zoomTo(state, 1)),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setExpandedElement: (element) => set({ expandedElement: element }),
  // Reported on every change to the page, so an unchanged list keeps the old array and nothing re-renders
  setPageElements: (elements) =>
    set((state) => (state.pageElements?.join() === elements?.join() ? state : { pageElements: elements })),
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
