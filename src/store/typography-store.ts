"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { temporal } from "zundo";
import type {
  TypographyConfig,
  TypographyElement,
  GroupProperties,
  MobileConfig,
} from "@/types/typography";
import { HEADING_ELEMENTS, DISPLAY_ELEMENTS, OPTIONAL_ELEMENTS } from "@/types/typography";
import { DEFAULT_CONFIG } from "@/data/default-config";
import { findPresetByValue } from "@/data/scale-ratios";

interface TypographyStore extends TypographyConfig {
  // Base settings
  setBaseFontSize: (size: number) => void;
  setScaleRatio: (ratio: number) => void;
  setScaleRatioPreset: (preset: string) => void;
  setSampleText: (text: string) => void;
  setBackgroundColor: (color: string) => void;

  // Group updates
  updateHeadingsGroup: (props: Partial<GroupProperties>) => void;
  updateBodyGroup: (props: Partial<GroupProperties>) => void;

  // Per-element overrides
  setElementOverride: (
    element: TypographyElement,
    props: Partial<GroupProperties>
  ) => void;
  clearElementOverride: (element: TypographyElement) => void;

  // Mobile settings
  updateMobile: (props: Partial<MobileConfig>) => void;

  // Element visibility
  enabledElements: Record<string, boolean>;
  toggleElement: (element: TypographyElement) => void;

  // Auto-balance
  autoBalance: boolean;
  setAutoBalance: (enabled: boolean) => void;

  // Batch color updates (single undo step)
  setColors: (headingColor: string, bodyColor: string, bg: string) => void;
  setFonts: (headingFont: string, headingWeight: number, bodyFont: string, bodyWeight: number) => void;

  // Bulk
  loadConfig: (config: TypographyConfig) => void;
  resetConfig: () => void;
}

export const useTypographyStore = create<TypographyStore>()(
  temporal(
  persist(
    (set) => ({
      ...DEFAULT_CONFIG,
      enabledElements: Object.fromEntries(OPTIONAL_ELEMENTS.map((el) => [el, false])),
      autoBalance: false,

      setBaseFontSize: (size) => set({ baseFontSize: size }),

      setScaleRatio: (ratio) => {
        const preset = findPresetByValue(ratio);
        set({
          scaleRatio: ratio,
          scaleRatioPreset: preset ? preset.name : "Custom",
        });
      },

      setScaleRatioPreset: (preset) => set({ scaleRatioPreset: preset }),

      setSampleText: (text) => set({ sampleText: text }),

      setBackgroundColor: (color) => set({ backgroundColor: color }),

      updateHeadingsGroup: (props) =>
        set((state) => ({
          headingsGroup: { ...state.headingsGroup, ...props },
        })),

      updateBodyGroup: (props) =>
        set((state) => ({
          bodyGroup: { ...state.bodyGroup, ...props },
        })),

      setElementOverride: (element, props) =>
        set((state) => {
          const current = state.overrides[element];
          return {
            overrides: {
              ...state.overrides,
              [element]: {
                ...current,
                ...props,
                isOverridden: true,
              },
            },
          };
        }),

      clearElementOverride: (element) =>
        set((state) => ({
          overrides: {
            ...state.overrides,
            [element]: { isOverridden: false },
          },
        })),

      updateMobile: (props) =>
        set((state) => ({
          mobile: { ...state.mobile, ...props },
        })),

      toggleElement: (element) =>
        set((state) => ({
          enabledElements: {
            ...state.enabledElements,
            [element]: !state.enabledElements[element],
          },
        })),

      setColors: (headingColor, bodyColor, bg) =>
        set((state) => ({
          headingsGroup: { ...state.headingsGroup, color: headingColor },
          bodyGroup: { ...state.bodyGroup, color: bodyColor },
          backgroundColor: bg,
        })),

      setFonts: (headingFont, headingWeight, bodyFont, bodyWeight) =>
        set((state) => ({
          headingsGroup: { ...state.headingsGroup, fontFamily: headingFont, fontWeight: headingWeight },
          bodyGroup: { ...state.bodyGroup, fontFamily: bodyFont, fontWeight: bodyWeight },
        })),

      setAutoBalance: (enabled) => set({ autoBalance: enabled }),

      loadConfig: (config) =>
        set((state) => {
          // Strip colors from loaded config — user controls colors independently
          const { backgroundColor: _bg, ...rest } = config;
          return {
            ...rest,
            autoBalance: false,
            headingsGroup: { ...config.headingsGroup, color: state.headingsGroup.color },
            bodyGroup: { ...config.bodyGroup, color: state.bodyGroup.color },
          };
        }),

      resetConfig: () => set({ ...DEFAULT_CONFIG }),
    }),
    {
      name: "typestack-typography",
      partialize: (state) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { autoBalance, enabledElements, ...rest } = state;
        return rest;
      },
    }
  ),
  {
    limit: 50,
    equality: (pastState, currentState) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { autoBalance: _a, enabledElements: _c, ...past } = pastState as unknown as Record<string, unknown>;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { autoBalance: _b, enabledElements: _d, ...curr } = currentState as unknown as Record<string, unknown>;
      return JSON.stringify(past) === JSON.stringify(curr);
    },
  },
  )
);

export function isHeadingElement(element: TypographyElement): boolean {
  return HEADING_ELEMENTS.includes(element) || DISPLAY_ELEMENTS.includes(element);
}
