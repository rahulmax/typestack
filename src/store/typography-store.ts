"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  TypographyConfig,
  TypographyElement,
  GroupProperties,
  MobileConfig,
} from "@/types/typography";
import { HEADING_ELEMENTS, DISPLAY_ELEMENTS } from "@/types/typography";
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

  // Bulk
  loadConfig: (config: TypographyConfig) => void;
  resetConfig: () => void;
}

export const useTypographyStore = create<TypographyStore>()(
  persist(
    (set) => ({
      ...DEFAULT_CONFIG,

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

      loadConfig: (config) => set({ ...config }),

      resetConfig: () => set({ ...DEFAULT_CONFIG }),
    }),
    {
      name: "typestack-typography",
    }
  )
);

export function isHeadingElement(element: TypographyElement): boolean {
  return HEADING_ELEMENTS.includes(element) || DISPLAY_ELEMENTS.includes(element);
}
