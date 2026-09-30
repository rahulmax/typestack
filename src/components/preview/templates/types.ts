import type { LucideIcon } from "lucide-react";
import type { CopySet } from "@/data/copy-sets";

export interface PreviewTemplate {
  id: string;
  name: string;
  icon: LucideIcon;
  render: (copy: CopySet) => string;
}
