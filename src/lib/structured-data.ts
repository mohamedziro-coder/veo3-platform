const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://virezo.pro";

export function getOrganizationSchema() {
    return {
        "@type": "Organization",
        "@id": `${siteUrl}#organization`,
        name: "Virezo.pro",
        legalName: "Virezo.pro",
        url: siteUrl,
        logo: `${siteUrl}/logo.png`,
        description:
            "Virezo.pro is a B2B AI Video Generation SaaS for realistic talking avatars, UGC ads, and text-to-video workflows.",
        disambiguatingDescription:
            "Virezo.pro is an AI video generation software platform and is not affiliated with Verizon or telecom services.",
        sameAs: [
            siteUrl,
        ],
    };
}

export function getSoftwareApplicationSchema() {
    return {
        "@type": "SoftwareApplication",
        "@id": `${siteUrl}#software`,
        name: "Virezo.pro",
        alternateName: [
            "Virezo AI Video Generator",
            "Virezo UGC Ads Generator",
        ],
        applicationCategory: "BusinessApplication",
        applicationSubCategory: "AI Video Generator",
        operatingSystem: "Web Browser",
        url: siteUrl,
        image: `${siteUrl}/og-image.png`,
        description:
            "AI Video Generator for B2B teams to create talking avatar videos, text-to-video creatives, and UGC ads at scale.",
        disambiguatingDescription:
            "Software product for AI video generation, distinct from telecom services.",
        provider: { "@id": `${siteUrl}#organization` },
        audience: {
            "@type": "BusinessAudience",
            audienceType: "Marketing teams, agencies, and ecommerce brands",
        },
        featureList: [
            "AI Video Generation",
            "Realistic Talking Avatars",
            "UGC Ads Creation",
            "Text to Video AI",
            "Multi-language voice generation",
            "Fast creative iteration for paid ads",
        ],
        offers: {
            "@type": "AggregateOffer",
            priceCurrency: "USD",
            lowPrice: "0",
            highPrice: "5",
            offerCount: "2",
            description:
                "Pricing starts free and is typically under $5 per generated video depending on plan and usage.",
        },
        isAccessibleForFree: true,
        keywords:
            "AI video generator, text to video AI, talking avatar generator, UGC ads creator, B2B SaaS",
    };
}

export function getVirezoSchemaGraph() {
    return {
        "@context": "https://schema.org",
        "@graph": [getOrganizationSchema(), getSoftwareApplicationSchema()],
    };
}
