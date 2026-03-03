"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTypographyStore } from "@/store/typography-store";
import { pushToFigma } from "@/lib/figma-api";
import { toast } from "sonner";

export function FigmaAPIExport() {
  const store = useTypographyStore();
  const [token, setToken] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePush = async () => {
    const fileKeyMatch = fileUrl.match(/figma\.com\/(?:file|design)\/([a-zA-Z0-9]+)/);
    if (!fileKeyMatch) {
      toast.error("Invalid Figma file URL");
      return;
    }
    if (!token) {
      toast.error("Please enter your Figma access token");
      return;
    }

    setLoading(true);
    const result = await pushToFigma(token, fileKeyMatch[1], {
      baseFontSize: store.baseFontSize,
      scaleRatioPreset: store.scaleRatioPreset,
      scaleRatio: store.scaleRatio,
      headingsGroup: store.headingsGroup,
      bodyGroup: store.bodyGroup,
      overrides: store.overrides,
      mobile: store.mobile,
      backgroundColor: store.backgroundColor,
      sampleText: store.sampleText,
    });
    setLoading(false);

    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <span className="text-sm font-medium">Push to Figma (API)</span>
      <div className="flex flex-col gap-2">
        <Label className="text-xs text-muted-foreground">
          Figma Access Token
        </Label>
        <Input
          type="password"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="figd_..."
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label className="text-xs text-muted-foreground">
          Figma File URL
        </Label>
        <Input
          value={fileUrl}
          onChange={(e) => setFileUrl(e.target.value)}
          placeholder="https://figma.com/design/..."
        />
      </div>
      <Button onClick={handlePush} disabled={loading || !token || !fileUrl}>
        {loading ? "Pushing..." : "Push Variables"}
      </Button>
      <p className="text-xs text-muted-foreground">
        For best results, use the Tokens Studio plugin with the JSON export
        above.
      </p>
    </div>
  );
}
