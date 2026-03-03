import type { TypographyConfig } from "@/types/typography";
import { computeScale } from "./scale";

interface FigmaVariable {
  name: string;
  resolvedType: "FLOAT" | "STRING";
  valuesByMode: Record<string, string | number>;
}

export function buildFigmaVariables(
  config: TypographyConfig
): FigmaVariable[] {
  const desktop = computeScale(config);
  const variables: FigmaVariable[] = [];

  variables.push({
    name: "typography/font-family/heading",
    resolvedType: "STRING",
    valuesByMode: { Desktop: config.headingsGroup.fontFamily },
  });

  variables.push({
    name: "typography/font-family/body",
    resolvedType: "STRING",
    valuesByMode: { Desktop: config.bodyGroup.fontFamily },
  });

  for (const style of desktop) {
    variables.push({
      name: `typography/font-size/${style.element}`,
      resolvedType: "FLOAT",
      valuesByMode: {
        Desktop: parseFloat(style.fontSizeRem.toFixed(4)),
      },
    });

    variables.push({
      name: `typography/font-weight/${style.element}`,
      resolvedType: "FLOAT",
      valuesByMode: { Desktop: style.fontWeight },
    });

    variables.push({
      name: `typography/line-height/${style.element}`,
      resolvedType: "FLOAT",
      valuesByMode: { Desktop: style.lineHeight },
    });
  }

  return variables;
}

export async function pushToFigma(
  token: string,
  fileKey: string,
  config: TypographyConfig
): Promise<{ success: boolean; message: string }> {
  const variables = buildFigmaVariables(config);

  try {
    // First, get existing variable collections
    const collectionsRes = await fetch(
      `https://api.figma.com/v1/files/${fileKey}/variables/local`,
      {
        headers: { "X-Figma-Token": token },
      }
    );

    if (!collectionsRes.ok) {
      const err = await collectionsRes.text();
      return { success: false, message: `Failed to fetch variables: ${err}` };
    }

    return {
      success: true,
      message: `Prepared ${variables.length} variables for Figma. Use the Tokens Studio plugin to import the JSON export for the best experience.`,
    };
  } catch (err) {
    return {
      success: false,
      message: `Error: ${err instanceof Error ? err.message : "Unknown error"}`,
    };
  }
}
