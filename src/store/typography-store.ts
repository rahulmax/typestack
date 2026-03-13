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
import { DEFAULT_CONFIG, normalizeConfig } from "@/data/default-config";
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

  // Auto-balance (per-group)
  autoBalance: boolean;
  autoBalanceHeadings: boolean;
  autoBalanceBody: boolean;
  setAutoBalance: (enabled: boolean) => void;
  setAutoBalanceHeadings: (enabled: boolean) => void;
  setAutoBalanceBody: (enabled: boolean) => void;

  // Batch color updates (single undo step)
  setColors: (headingColor: string, bodyColor: string, bg: string) => void;
  setFonts: (headingFont: string, headingWeight: number, bodyFont: string, bodyWeight: number) => void;

  // Bulk
  loadConfig: (config: TypographyConfig) => void;
  resetConfig: (dark?: boolean) => void;
}

export const useTypographyStore = create<TypographyStore>()(
  temporal(
  persist(
    (set) => ({
      ...DEFAULT_CONFIG,
      enabledElements: Object.fromEntries(OPTIONAL_ELEMENTS.map((el) => [el, false])),
      autoBalance: false,
      autoBalanceHeadings: false,
      autoBalanceBody: false,

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

      setAutoBalance: (enabled) => set({ autoBalance: enabled, autoBalanceHeadings: enabled, autoBalanceBody: enabled }),
      setAutoBalanceHeadings: (enabled) => set((s) => ({ autoBalanceHeadings: enabled, autoBalance: enabled && s.autoBalanceBody })),
      setAutoBalanceBody: (enabled) => set((s) => ({ autoBalanceBody: enabled, autoBalance: enabled && s.autoBalanceHeadings })),

      loadConfig: (config) =>
        set((state) => {
          const safe = normalizeConfig(config as unknown as Record<string, unknown>);
          return {
            ...safe,
            backgroundColor: state.backgroundColor,
            autoBalance: false,
            autoBalanceHeadings: false,
            autoBalanceBody: false,
            headingsGroup: { ...safe.headingsGroup, color: state.headingsGroup.color },
            bodyGroup: { ...safe.bodyGroup, color: state.bodyGroup.color },
          };
        }),

      resetConfig: (dark) => set({
        ...DEFAULT_CONFIG,
        ...(dark ? {
          headingsGroup: { ...DEFAULT_CONFIG.headingsGroup, color: '#e5e5e5' },
          bodyGroup: { ...DEFAULT_CONFIG.bodyGroup, color: '#d4d4d4' },
          backgroundColor: '#171717',
        } : {
          headingsGroup: { ...DEFAULT_CONFIG.headingsGroup, color: '#2e2e2e' },
          bodyGroup: { ...DEFAULT_CONFIG.bodyGroup, color: '#3a3a3a' },
          backgroundColor: '#f5f5f5',
        }),
      }),
    }),
    {
      name: "typestack-typography",
      partialize: (state) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { autoBalance, autoBalanceHeadings, autoBalanceBody, enabledElements, ...rest } = state;
        return rest;
      },
      merge: (persisted, current) => {
        const p = persisted as Record<string, unknown> | undefined;
        if (!p) return current;
        return {
          ...current,
          ...normalizeConfig(p),
        };
      },
    }
  ),
  {
    limit: 50,
    equality: (pastState, currentState) => {
      const past = pastState as unknown as Record<string, unknown>
      const curr = currentState as unknown as Record<string, unknown>
      const keys = Object.keys(curr)
      for (const key of keys) {
        if (key === 'autoBalance' || key === 'autoBalanceHeadings' || key === 'autoBalanceBody' || key === 'enabledElements') continue
        if (past[key] !== curr[key]) return false
      }
      return true
    },
  },
  )
);

export function isHeadingElement(element: TypographyElement): boolean {
  return HEADING_ELEMENTS.includes(element) || DISPLAY_ELEMENTS.includes(element);
}
