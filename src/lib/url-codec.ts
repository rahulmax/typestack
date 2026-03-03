import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from "lz-string";
import type { TypographyConfig } from "@/types/typography";

export function encodeConfig(config: TypographyConfig): string {
  const json = JSON.stringify(config);
  return compressToEncodedURIComponent(json);
}

export function decodeConfig(encoded: string): TypographyConfig | null {
  try {
    const json = decompressFromEncodedURIComponent(encoded);
    if (!json) return null;
    return JSON.parse(json) as TypographyConfig;
  } catch {
    return null;
  }
}

export function getConfigFromURL(): TypographyConfig | null {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  const encoded = params.get("c");
  if (!encoded) return null;
  return decodeConfig(encoded);
}

export function setConfigToURL(config: TypographyConfig): string {
  const encoded = encodeConfig(config);
  const url = new URL(window.location.href);
  url.searchParams.set("c", encoded);
  return url.toString();
}
