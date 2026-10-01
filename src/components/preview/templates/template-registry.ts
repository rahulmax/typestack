import type { PreviewTemplate } from "./types";
import type { PreviewTab } from "@/store/ui-store";
import type { CopySet } from "@/data/copy-sets";
import { websiteTemplate } from "./website-template";
import { personalTemplate } from "./personal-template";
import { blogTemplate } from "./blog-template";
import { magazineTemplate } from "./magazine-template";
import { docsTemplate } from "./docs-template";
import { swissTemplate } from "./swiss-template";
import { newsletterTemplate } from "./newsletter-template";
import { bookTemplate } from "./book-template";
import { newspaperTemplate } from "./newspaper-template";
import { postersTemplate } from "./posters-template";
import { sleeveTemplate } from "./sleeve-template";
import { menuTemplate } from "./menu-template";
import { creditsTemplate } from "./credits-template";
import { poemTemplate } from "./poem-template";

// Display order of the browser tabs: web pages, then long-form writing, then print
export const templateList: (PreviewTemplate & { id: PreviewTab })[] = [
  { ...websiteTemplate, id: "website" },
  { ...personalTemplate, id: "personal" },
  { ...docsTemplate, id: "docs" },
  { ...blogTemplate, id: "blog" },
  { ...newsletterTemplate, id: "newsletter" },
  { ...magazineTemplate, id: "magazine" },
  { ...newspaperTemplate, id: "newspaper" },
  { ...bookTemplate, id: "book" },
  { ...poemTemplate, id: "poem" },
  { ...swissTemplate, id: "swiss" },
  { ...postersTemplate, id: "posters" },
  { ...sleeveTemplate, id: "sleeve" },
  { ...menuTemplate, id: "menu" },
  { ...creditsTemplate, id: "credits" },
];

export const templates: Record<string, PreviewTemplate> = Object.fromEntries(
  templateList.map((t) => [t.id, t]),
);

export function getTemplateHTML(id: string, copy: CopySet): string {
  return templates[id]?.render(copy) ?? "";
}
