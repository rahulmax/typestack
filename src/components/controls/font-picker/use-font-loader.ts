"use client";

import { useEffect, useRef, useCallback } from "react";
import { loadFontPreview } from "@/lib/google-fonts";

export function useFontLoader() {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const family = entry.target.getAttribute("data-font-family");
            if (family && !loadedRef.current.has(family)) {
              loadedRef.current.add(family);
              loadFontPreview(family);
            }
          }
        }
      },
      { rootMargin: "200px" }
    );

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  const observe = useCallback((el: HTMLElement | null) => {
    if (el && observerRef.current) {
      observerRef.current.observe(el);
    }
  }, []);

  return { observe };
}
