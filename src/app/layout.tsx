import type { Metadata, Viewport } from "next";
import { Inter, Lora, Righteous } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { RootLayoutClient } from "@/components/layout/RootLayoutClient";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const lora = Lora({ subsets: ["latin"], variable: "--font-lora" });
const righteous = Righteous({ weight: "400", subsets: ["latin"], variable: "--font-righteous" });

export const metadata: Metadata = {
  title: "LocalVastra - Discover Local Fashion, Buy Offline",
  description: "Apni Gali Ki Dukaan, Ab Aapke Phone Par. Discover local fashion from verified shops near you.",
};

export const viewport: Viewport = {
  themeColor: "hsl(15 55% 42%)",
  userScalable: true,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${lora.variable} ${righteous.variable} font-sans antialiased text-foreground bg-background`}
      >
        <RootLayoutClient>
          {children}
        </RootLayoutClient>
        <Toaster />
      </body>
    </html>
  );
}
