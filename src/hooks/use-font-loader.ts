"use client";

import { useEffect } from "react";
import { useTypographyStore } from "@/store/typography-store";
import { loadFontFull } from "@/lib/google-fonts";

export function useActiveFontLoader() {
  const headingFont = useTypographyStore((s) => s.headingsGroup.fontFamily);
  const bodyFont = useTypographyStore((s) => s.bodyGroup.fontFamily);

  useEffect(() => {
    loadFontFull(headingFont, [100, 200, 300, 400, 500, 600, 700, 800, 900]);
  }, [headingFont]);

  useEffect(() => {
    loadFontFull(bodyFont, [100, 200, 300, 400, 500, 600, 700, 800, 900]);
  }, [bodyFont]);
}
