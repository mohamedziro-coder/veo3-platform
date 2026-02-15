import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";

const inter = Inter({ subsets: ["latin"] });

import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "Virezo 3 - #1 AI Video Generator Platform",
  description: "Create viral UGC videos, realistic avatars, and professional voiceovers in seconds. The most advanced AI video platform for creators and businesses.",
  image: "/og-image.png", // Ensure this image exists in public folder
});

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

import Providers from "@/components/Providers";
import JsonLd from "@/components/seo/JsonLd";
import ScrollProgress from "@/components/ScrollProgress";

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
          <JsonLd />
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
