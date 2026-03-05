interface MobileChromeProps {
  children: React.ReactNode;
}

export function MobileChrome({ children }: MobileChromeProps) {
  return (
    <div className="flex h-full items-start justify-center pt-2">
      <div
        className="flex flex-col overflow-hidden rounded-t-[40px] border-[3px] border-b-0 border-border shadow-lg"
        style={{ width: 375, maxWidth: "100%", height: "calc(100% - 0.5rem)", background: "rgba(0,0,0,0.03)" }}
      >
        <div className="min-h-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
