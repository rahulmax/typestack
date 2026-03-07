"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CSSExport } from "./css-export";
import { TailwindExport } from "./tailwind-export";
import { CopyElementCSS } from "./copy-element-css";
import { FigmaJSONExport } from "./figma-json-export";
import { FigmaAPIExport } from "./figma-api-export";

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExportDialog({ open, onOpenChange }: ExportDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Export Typography</DialogTitle>
          <DialogDescription>Copy CSS, download Figma tokens, or push variables to Figma.</DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="css" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="css" className="flex-1">CSS</TabsTrigger>
            <TabsTrigger value="tailwind" className="flex-1">Tailwind</TabsTrigger>
            <TabsTrigger value="figma-json" className="flex-1">Figma JSON</TabsTrigger>
            <TabsTrigger value="figma-api" className="flex-1">Figma API</TabsTrigger>
          </TabsList>
          <TabsContent value="css" className="flex flex-col gap-4 pt-4">
            <CSSExport />
            <CopyElementCSS />
          </TabsContent>
          <TabsContent value="tailwind" className="pt-4">
            <TailwindExport />
          </TabsContent>
          <TabsContent value="figma-json" className="pt-4">
            <FigmaJSONExport />
          </TabsContent>
          <TabsContent value="figma-api" className="pt-4">
            <FigmaAPIExport />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
