"use client";

import { useEffect } from "react";
import { useTypographyStore } from "@/store/typography-store";
import { getConfigFromURL } from "@/lib/url-codec";
import { isStockPangram, pickRandomPangram } from "@/data/pangrams";

export function useURLSync() {
  const loadConfig = useTypographyStore((s) => s.loadConfig);

  useEffect(() => {
    const config = getConfigFromURL();
    if (config) {
      loadConfig(config);
      return;
    }

    // No shared link: rotate stock pangrams on each load, but leave anything
    // the user typed alone. Runs in an effect so server and client markup agree.
    const { sampleText } = useTypographyStore.getState();
    if (isStockPangram(sampleText)) {
      const { pause, resume } = useTypographyStore.temporal.getState();
      pause();
      useTypographyStore.getState().setSampleText(pickRandomPangram());
      resume();
    }
  }, [loadConfig]);
}
