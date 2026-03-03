"use client";

import { useEffect } from "react";
import { useTypographyStore } from "@/store/typography-store";
import { getConfigFromURL } from "@/lib/url-codec";

export function useURLSync() {
  const loadConfig = useTypographyStore((s) => s.loadConfig);

  useEffect(() => {
    const config = getConfigFromURL();
    if (config) {
      loadConfig(config);
    }
  }, [loadConfig]);
}
