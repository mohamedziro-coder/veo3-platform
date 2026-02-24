import type { MetadataRoute } from "next";
import { getBlogs } from "@/lib/db";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://virezo.pro";

export const revalidate = 3600;

type ChangeFreq = "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const now = new Date();

    const staticRoutes: Array<{
        path: string;
        priority: number;
        changeFrequency: ChangeFreq;
    }> = [
            { path: "/", priority: 1.0, changeFrequency: "daily" },
            { path: "/pricing", priority: 0.9, changeFrequency: "weekly" },
            { path: "/blogs", priority: 0.9, changeFrequency: "daily" },
            { path: "/products/creative-studio", priority: 0.8, changeFrequency: "weekly" },
            { path: "/products/ugc-generator", priority: 0.8, changeFrequency: "weekly" },
            { path: "/products/talking-avatars", priority: 0.8, changeFrequency: "weekly" },
            { path: "/products/ai-voiceovers", priority: 0.8, changeFrequency: "weekly" },
            { path: "/solutions/for-agencies", priority: 0.8, changeFrequency: "weekly" },
            { path: "/solutions/for-brands", priority: 0.8, changeFrequency: "weekly" },
            { path: "/solutions/media-buyers", priority: 0.8, changeFrequency: "weekly" },
            { path: "/solutions/creative-testing", priority: 0.8, changeFrequency: "weekly" },
            { path: "/company/about", priority: 0.7, changeFrequency: "monthly" },
            { path: "/company/mission", priority: 0.7, changeFrequency: "monthly" },
            { path: "/company/careers", priority: 0.6, changeFrequency: "monthly" },
            { path: "/company/contact", priority: 0.7, changeFrequency: "monthly" },
            { path: "/resources/getting-started", priority: 0.7, changeFrequency: "weekly" },
            { path: "/resources/help-center", priority: 0.7, changeFrequency: "weekly" },
            { path: "/resources/glossary", priority: 0.7, changeFrequency: "weekly" },
            { path: "/resources/affiliate", priority: 0.6, changeFrequency: "monthly" },
            { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
            { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
        ];

    const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
        url: new URL(route.path, siteUrl).toString(),
        lastModified: now,
        changeFrequency: route.changeFrequency,
        priority: route.priority,
    }));

    let blogEntries: MetadataRoute.Sitemap = [];
    try {
        if (process.env.POSTGRES_URL) {
            const blogs = await getBlogs(true);
            blogEntries = blogs
                .filter((blog) => Boolean(blog.slug))
                .map((blog) => ({
                    url: new URL(`/blogs/${blog.slug}`, siteUrl).toString(),
                    lastModified: blog.updated_at ? new Date(blog.updated_at) : now,
                    changeFrequency: "weekly" as const,
                    priority: 0.7,
                }));
        }
    } catch (error) {
        console.error("Failed to fetch blogs for sitemap", error);
    }

    return [...staticEntries, ...blogEntries];
}
