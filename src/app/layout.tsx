import type { Metadata } from "next";
import { Geist, Geist_Mono, Host_Grotesk, Oswald } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ADOBE_KIT_ELEMENT_ID, getKitCssUrl } from "@/lib/adobe-fonts";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const hostGrotesk = Host_Grotesk({
  variable: "--font-host-grotesk",
  subsets: ["latin"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  weight: "200",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TypeStax: A type scale generator that feels like vintage audio hardware",
  description:
    "Build harmonious type scales on a skeuomorphic analog control panel. Per-element editing, Google Fonts, live previews, and Figma export.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Rendered server-side so kit fonts are painted with the first frame, in the
  // app, the gallery and the showcase alike -- no client resolution step.
  const adobeKitCss = getKitCssUrl();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {adobeKitCss && (
          <link id={ADOBE_KIT_ELEMENT_ID} rel="stylesheet" href={adobeKitCss} />
        )}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${hostGrotesk.variable} ${oswald.variable} antialiased`}
      >
        <ClerkProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <TooltipProvider>{children}</TooltipProvider>
            <Toaster />
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
