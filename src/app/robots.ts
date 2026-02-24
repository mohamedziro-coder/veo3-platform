import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://virezo.pro";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: ["/api/", "/admin", "/dashboard", "/login", "/signup"],
            },
            {
                userAgent: "OAI-SearchBot",
                allow: "/",
                disallow: ["/api/", "/admin", "/dashboard"],
            },
            {
                userAgent: "GPTBot",
                allow: "/",
                disallow: ["/api/", "/admin", "/dashboard"],
            },
            {
                userAgent: "PerplexityBot",
                allow: "/",
                disallow: ["/api/", "/admin", "/dashboard"],
            },
            {
                userAgent: "Google-Extended",
                allow: "/",
            },
        ],
        sitemap: `${siteUrl}/sitemap.xml`,
        host: siteUrl,
    };
}
