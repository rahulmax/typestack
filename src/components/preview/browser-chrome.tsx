import { Lock } from "lucide-react";

interface BrowserChromeProps {
  children: React.ReactNode;
  width: string;
}

export function BrowserChrome({ children, width }: BrowserChromeProps) {
  return (
    <div
      className="mx-auto transition-all duration-300"
      style={{ width, maxWidth: "100%" }}
    >
      <div className="overflow-hidden rounded-lg shadow-md border border-neutral-200 dark:border-neutral-700">
        {/* Title bar */}
        <div className="flex items-center gap-2 bg-neutral-100 dark:bg-neutral-800 px-3 py-2">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <div className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <div className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          </div>
          {/* Address bar */}
          <div className="mx-auto flex max-w-xs flex-1 items-center justify-center gap-1.5 rounded-md bg-white dark:bg-neutral-700 px-3 py-1 text-xs text-muted-foreground">
            <Lock className="h-2.5 w-2.5" />
            <span>yoursite.com</span>
          </div>
          {/* Spacer to balance the dots */}
          <div className="w-[42px]" />
        </div>
        {/* Content area */}
        <div className="bg-white dark:bg-neutral-900">{children}</div>
      </div>
    </div>
  );
}
