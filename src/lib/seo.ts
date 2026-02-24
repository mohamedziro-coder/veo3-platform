import { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://virezo.pro';

export const siteConfig = {
    name: 'Virezo.pro',
    description: 'AI Video Generation SaaS for B2B teams. Create realistic talking avatars, UGC ads, and text-to-video campaigns in minutes.',
    url: siteUrl,
    ogImage: `${siteUrl}/og-image.png`,
    links: {
        twitter: 'https://x.com/virezo_pro',
        github: 'https://github.com/virezo-ai',
    },
};

export function constructMetadata({
    title = siteConfig.name,
    description = siteConfig.description,
    image = siteConfig.ogImage,
    icons = '/favicon.ico',
    canonical,
    noIndex = false,
}: {
    title?: string;
    description?: string;
    image?: string;
    icons?: string;
    canonical?: string;
    noIndex?: boolean;
} = {}): Metadata {
    const canonicalUrl = canonical
        ? (canonical.startsWith('http')
            ? canonical
            : new URL(canonical, siteConfig.url).toString())
        : undefined;

    return {
        title: {
            default: title,
            template: `%s | ${siteConfig.name}`,
        },
        description,
        metadataBase: new URL(siteConfig.url),
        ...(canonicalUrl && {
            alternates: {
                canonical: canonicalUrl,
            },
        }),
        openGraph: {
            title: {
                default: title,
                template: `%s | ${siteConfig.name}`,
            },
            description,
            ...(canonicalUrl && { url: canonicalUrl }),
            images: [
                {
                    url: image,
                    width: 1200,
                    height: 630,
                    alt: 'Virezo.pro AI Video Generation Platform',
                },
            ],
            type: 'website',
            siteName: siteConfig.name,
            locale: 'en_US',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [image],
            creator: '@virezo_pro',
            site: '@virezo_pro',
        },
        icons,
        applicationName: siteConfig.name,
        category: 'technology',
        ...(noIndex && {
            robots: {
                index: false,
                follow: false,
            },
        }),
        ...(!noIndex && {
            robots: {
                index: true,
                follow: true,
                googleBot: {
                    index: true,
                    follow: true,
                    'max-snippet': -1,
                    'max-image-preview': 'large',
                    'max-video-preview': -1,
                },
            },
        }),
    };
}
