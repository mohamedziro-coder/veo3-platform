import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";

const inter = Inter({ subsets: ["latin"] });

import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "Virezo.pro | AI Video Generation SaaS",
  description: "Create realistic talking avatars, UGC ads, and text-to-video campaigns in minutes. Built for agencies, ecommerce brands, and performance teams.",
  image: "/og-image.png",
});

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
