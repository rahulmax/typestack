import { useEffect, useRef } from "react";
import type { Stack } from "@/lib/stacks-api";

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

      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@400;700&display=swap`;
      document.head.appendChild(link);
    }
  }, [stacks]);
}
