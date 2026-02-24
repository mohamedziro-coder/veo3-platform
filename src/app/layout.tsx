import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";

const inter = Inter({ subsets: ["latin"] });

import { constructMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...constructMetadata({
    title: "Virezo.pro | AI Avatar Video Generator & UGC Video Creation Platform",
    description: "Generate broadcast-quality AI avatar videos in 30+ languages for under $5. The GDPR-compliant, EU-hosted AI video software for B2B marketing teams, agencies, and e-commerce brands. No cameras. No editors. No waiting.",
    image: "/og-image.png",
  }),
  verification: {
    google: "oF9KhROMYa0WscVAQxJez07wpLoLOKdt7IrrBgY6UfI",
  },
  keywords: [
    "AI avatar video generator",
    "UGC video creation",
    "text to video AI",
    "AI video software",
    "AI video generation",
    "GDPR compliant AI video",
    "multilingual AI video",
    "B2B video generation",
    "AI UGC ads",
    "European AI video platform"
  ],
};


export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

import Providers from "@/components/Providers";
import JsonLd from "@/components/seo/JsonLd";
import ScrollProgress from "@/components/ScrollProgress";
import { getVirezoSchemaGraph } from "@/lib/structured-data";

import Footer from "@/components/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  var supportDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches === true;
                  if (!theme && supportDarkMode) theme = 'dark';
                  if (!theme) theme = 'light';
                  document.documentElement.setAttribute('data-theme', theme);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${inter.className} bg-background text-foreground antialiased min-h-screen`}>
        <Providers>
          <JsonLd id="virezo-schema-graph" data={getVirezoSchemaGraph()} />
          <ScrollProgress />
          <div className="fixed inset-0 -z-10 h-full w-full bg-background"></div>
          <Navigation />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
