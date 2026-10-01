"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { temporal } from "zundo";
import type {
  AutoBalanceValues,
  TypographyConfig,
  TypographyElement,
  GroupProperties,
  MobileConfig,
} from "@/types/typography";
import { ALL_ELEMENTS, HEADING_ELEMENTS, DISPLAY_ELEMENTS, OPTIONAL_ELEMENTS } from "@/types/typography";
import { DEFAULT_COLORS, DEFAULT_CONFIG, normalizeConfig } from "@/data/default-config";
import { pickRandomPangram } from "@/data/pangrams";
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
  /** Write a pass of auto balance in one update. Values claim an element for auto; null hands it back. */
  applyAutoBalance: (updates: Partial<Record<TypographyElement, AutoBalanceValues | null>>) => void;

  // Batch color updates (single undo step)
  setColors: (headingColor: string, bodyColor: string, bg: string) => void;
  setFonts: (headingFont: string, headingWeight: number, bodyFont: string, bodyWeight: number) => void;

  // Bulk
  loadConfig: (config: TypographyConfig, options?: { colors?: boolean }) => void;
  resetConfig: (dark?: boolean) => void;
}

export const useTypographyStore = create<TypographyStore>()(
  temporal(
  persist(
    (set) => ({
      ...DEFAULT_CONFIG,
      enabledElements: Object.fromEntries(OPTIONAL_ELEMENTS.map((el) => [el, false])),
      autoBalance: true,
      autoBalanceHeadings: true,
      autoBalanceBody: true,

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
          // A hand edit takes the element away from auto balance.
          const { auto, ...current } = state.overrides[element] ?? {};
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

      applyAutoBalance: (updates) =>
        set((state) => {
          const overrides = { ...state.overrides };
          for (const element of ALL_ELEMENTS) {
            const values = updates[element];
            if (values === undefined) continue;
            const { lineHeight, letterSpacing, wordSpacing, auto, ...rest } = overrides[element] ?? { isOverridden: false };
            overrides[element] = values
              ? { ...rest, ...values, auto: true, isOverridden: true }
              : { ...rest, isOverridden: Object.keys(rest).some((key) => key !== "isOverridden") };
          }
          return { overrides };
        }),

      loadConfig: (config, options) =>
        set((state) => {
          const safe = normalizeConfig(config as unknown as Record<string, unknown>);
          // A config made with auto balance on carries auto values, so it switches auto on
          // for that group. Anything else leaves the keys where the user had them.
          const madeWithAuto = (headings: boolean) =>
            ALL_ELEMENTS.some((el) => isHeadingElement(el) === headings && safe.overrides[el]?.auto);
          const autoBalanceHeadings = state.autoBalanceHeadings || madeWithAuto(true);
          const autoBalanceBody = state.autoBalanceBody || madeWithAuto(false);
          const auto = { autoBalance: autoBalanceHeadings && autoBalanceBody, autoBalanceHeadings, autoBalanceBody };
          if (options?.colors) return { ...safe, ...auto };
          return {
            ...safe,
            ...auto,
            backgroundColor: state.backgroundColor,
            headingsGroup: { ...safe.headingsGroup, color: state.headingsGroup.color },
            bodyGroup: { ...safe.bodyGroup, color: state.bodyGroup.color },
          };
        }),

      resetConfig: (dark) => set((state) => {
        const colors = DEFAULT_COLORS[dark ? "dark" : "light"];
        return {
          ...DEFAULT_CONFIG,
          sampleText: pickRandomPangram(state.sampleText),
          headingsGroup: { ...DEFAULT_CONFIG.headingsGroup, color: colors.heading },
          bodyGroup: { ...DEFAULT_CONFIG.bodyGroup, color: colors.body },
          backgroundColor: colors.background,
        };
      }),
    }),
    {
      name: "typestack-typography",
      partialize: (state) => {
        const { enabledElements, ...rest } = state;
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
