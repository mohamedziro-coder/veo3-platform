import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Virezo 3 Video Generator",
  description: "Generate premium UGC videos with Virezo 3 and Gemini",
};

import Providers from "@/components/Providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-background text-foreground antialiased min-h-screen`}>
        <Providers>
          <div className="fixed inset-0 -z-10 h-full w-full bg-background"></div>
          <Navigation />
          {children}
        </Providers>
      </body>
    </html>
  );
}
