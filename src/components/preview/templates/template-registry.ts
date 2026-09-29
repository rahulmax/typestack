import type { PreviewTemplate } from "./types";
import type { PreviewTab } from "@/store/ui-store";
import { websiteTemplate } from "./website-template";
import { blogTemplate } from "./blog-template";
import { editorialTemplate } from "./editorial-template";
import { docsTemplate } from "./docs-template";
import { swissTemplate } from "./swiss-template";
import { newsletterTemplate } from "./newsletter-template";

// Display order of the browser tabs
export const templateList: (PreviewTemplate & { id: PreviewTab })[] = [
  { ...websiteTemplate, id: "website" },
  { ...blogTemplate, id: "blog" },
  { ...editorialTemplate, id: "editorial" },
  { ...docsTemplate, id: "docs" },
  { ...swissTemplate, id: "swiss" },
  { ...newsletterTemplate, id: "newsletter" },
];

export const templates: Record<string, PreviewTemplate> = Object.fromEntries(
  templateList.map((t) => [t.id, t]),
);

export function getTemplateHTML(id: string): string {
  return templates[id]?.html ?? "";
}
