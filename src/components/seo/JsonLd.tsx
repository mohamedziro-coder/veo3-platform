import Script from 'next/script';

export default function JsonLd() {
    const organizationSchema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Virezo 3',
        url: 'https://virezo.com',
        logo: 'https://virezo.com/logo.png',
        sameAs: [
            'https://twitter.com/virezo_ai',
            'https://github.com/virezo-ai',
        ],
    };

    const softwareSchema = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'Virezo 3 Video Generator',
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'Web',
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
        },
    };

    return (
        <>
            <Script
                id="json-ld-org"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
                strategy="afterInteractive"
            />
            <Script
                id="json-ld-app"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
                strategy="afterInteractive"
            />
        </>
    );
}
