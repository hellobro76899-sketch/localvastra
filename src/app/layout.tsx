import type { Metadata } from "next";
import { Inter, Lora, Righteous } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const lora = Lora({ subsets: ["latin"], variable: "--font-lora" });
const righteous = Righteous({ weight: "400", subsets: ["latin"], variable: "--font-righteous" });
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "LocalVastra - Discover Local Fashion, Buy Offline",
  description: "Apni Gali Ki Dukaan, Ab Aapke Phone Par. Discover local fashion from verified shops near you.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${lora.variable} ${righteous.variable} font-sans antialiased text-foreground bg-background`}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
