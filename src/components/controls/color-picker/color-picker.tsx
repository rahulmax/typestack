"use client";

import { HexColorPicker } from "react-colorful";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { HexRgbInput } from "./hex-rgb-input";
import { TailwindPalette } from "./tailwind-palette";

interface ColorPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  color: string;
  onChange: (color: string) => void;
}

export function ColorPicker({
  open,
  onOpenChange,
  title,
  color,
  onChange,
}: ColorPickerProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>Pick a color using the picker, hex/RGB input, or Tailwind palette.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <HexColorPicker
            color={color}
            onChange={onChange}
            style={{ width: "100%" }}
          />
          <HexRgbInput color={color} onChange={onChange} />
          <TailwindPalette onSelect={onChange} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
