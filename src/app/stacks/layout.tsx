import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stacks — TypeStack",
  description: "Browse and discover typography presets and font pairings.",
};

export default function StacksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
