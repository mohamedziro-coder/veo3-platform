import { Metadata } from 'next';

export const siteConfig = {
    name: 'Virezo 3 Video Generator',
    description: 'Generate premium UGC videos with Virezo 3 and Gemini. Turn ideas into broadcast-quality content in seconds using realistic avatars and native multi-language voiceovers.',
    url: 'https://virezo.com', // Replace with actual domain if known, or localhost for now
    ogImage: 'https://virezo.com/og-image.jpg', // Replace with actual OG image URL
    links: {
        twitter: 'https://twitter.com/virezo_ai',
        github: 'https://github.com/virezo-ai',
    },
};

export function constructMetadata({
    title = siteConfig.name,
    description = siteConfig.description,
    image = siteConfig.ogImage,
    icons = '/favicon.ico',
    noIndex = false,
}: {
    title?: string;
    description?: string;
    image?: string;
    icons?: string;
    noIndex?: boolean;
} = {}): Metadata {
    return {
        title: {
            default: title,
            template: `%s | ${siteConfig.name}`,
        },
        description,
        openGraph: {
            title: {
                default: title,
                template: `%s | ${siteConfig.name}`,
            },
            description,
            images: [
                {
                    url: image,
                },
            ],
            type: 'website',
            siteName: siteConfig.name,
            locale: 'en_US',
            url: siteConfig.url,
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [image],
            creator: '@virezo_ai',
        },
        icons,
        metadataBase: new URL(siteConfig.url),
        ...(noIndex && {
            robots: {
                index: false,
                follow: false,
            },
        }),
    };
}
