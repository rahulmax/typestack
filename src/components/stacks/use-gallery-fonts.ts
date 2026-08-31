import { useEffect, useRef } from "react";
import type { Stack } from "@/lib/stacks-api";
import { loadFontFull } from "@/lib/fonts";

export function useFontLoader(stacks: Stack[]) {
  const loadedRef = useRef(new Set<string>());

  useEffect(() => {
    const families = new Set<string>();
    for (const s of stacks) {
      if (s.config?.headingsGroup?.fontFamily) families.add(s.config.headingsGroup.fontFamily);
      if (s.config?.bodyGroup?.fontFamily) families.add(s.config.bodyGroup.fontFamily);
    }

    for (const family of families) {
      if (loadedRef.current.has(family)) continue;
      loadedRef.current.add(family);
      loadFontFull(family, [400, 700]);
    }
  }, [stacks]);
}
