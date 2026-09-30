import type { LucideIcon } from "lucide-react";
import type { CopySet } from "@/data/copy-sets";

export interface PreviewTemplate {
  id: string;
  name: string;
  icon: LucideIcon;
  render: (copy: CopySet) => string;
  /**
   * The narrowest width (px) the page's content column needs. When set, the desktop page moves left
   * while the phone is showing, so the phone doesn't cover it, without squeezing it below this width.
   */
  phoneRoom?: number;
}
