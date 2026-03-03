import type { PreviewTemplate } from "./types";
import { websiteTemplate } from "./website-template";
import { dashboardTemplate } from "./dashboard-template";
import { blogTemplate } from "./blog-template";

export const templates: Record<string, PreviewTemplate> = {
  website: websiteTemplate,
  dashboard: dashboardTemplate,
  blog: blogTemplate,
};

export function getTemplateHTML(id: string): string {
  return templates[id]?.html ?? "";
}
