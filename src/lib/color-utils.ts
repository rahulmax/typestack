function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const sNorm = s / 100;
  const lNorm = l / 100;
  const c = (1 - Math.abs(2 * lNorm - 1)) * sNorm;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = lNorm - c / 2;
  let r1 = 0,
    g1 = 0,
    b1 = 0;
  if (h < 60) {
    r1 = c;
    g1 = x;
  } else if (h < 120) {
    r1 = x;
    g1 = c;
  } else if (h < 180) {
    g1 = c;
    b1 = x;
  } else if (h < 240) {
    g1 = x;
    b1 = c;
  } else if (h < 300) {
    r1 = x;
    b1 = c;
  } else {
    r1 = c;
    b1 = x;
  }
  return [
    Math.round((r1 + m) * 255),
    Math.round((g1 + m) * 255),
    Math.round((b1 + m) * 255),
  ];
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")
  );
}

function relativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const sRGB = c / 255;
    return sRGB <= 0.03928 ? sRGB / 12.92 : ((sRGB + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function contrastRatio(
  rgb1: [number, number, number],
  rgb2: [number, number, number]
): number {
  const l1 = relativeLuminance(...rgb1);
  const l2 = relativeLuminance(...rgb2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export function generateRandomColorPair(): { fg: string; bg: string } {
  const MAX_ATTEMPTS = 50;

  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    const hue = Math.floor(Math.random() * 360);
    const hue2 = (hue + Math.floor(Math.random() * 30) - 15 + 360) % 360;

    const satLight = 30 + Math.floor(Math.random() * 40);
    const lightLight = 85 + Math.floor(Math.random() * 12);

    const satDark = 30 + Math.floor(Math.random() * 50);
    const lightDark = 5 + Math.floor(Math.random() * 20);

    const lightRgb = hslToRgb(hue, satLight, lightLight);
    const darkRgb = hslToRgb(hue2, satDark, lightDark);

    const ratio = contrastRatio(lightRgb, darkRgb);
    if (ratio >= 4.5) {
      const lightHex = rgbToHex(...lightRgb);
      const darkHex = rgbToHex(...darkRgb);

      if (Math.random() > 0.5) {
        return { fg: darkHex, bg: lightHex };
      } else {
        return { fg: lightHex, bg: darkHex };
      }
    }
  }

  return { fg: "#1a1a2e", bg: "#e8e8f0" };
}
