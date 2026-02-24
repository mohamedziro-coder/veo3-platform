export const generateSchema = {
    organization: () => ({
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Virezo.pro",
        "url": "https://virezo.pro",
        "logo": "https://virezo.pro/logo.png",
        "disambiguatingDescription": "Virezo.pro is an AI video generation software platform and is not affiliated with Verizon or telecom services.",
        "sameAs": [
            "https://virezo.pro"
        ],
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+1-555-555-5555",
            "contactType": "Customer Support",
            "areaServed": "Global"
        }
    }),

    product: (name: string, description: string, image: string) => ({
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": name,
        "description": description,
        "applicationCategory": "MultimediaApplication",
        "operatingSystem": "Web",
        "image": image,
        "offers": {
            "@type": "AggregateOffer",
            "priceCurrency": "USD",
            "lowPrice": "0",
            "highPrice": "5",
            "description": "Pricing starts free and is typically under $5 per generated video depending on plan and usage."
        },
        "disambiguatingDescription": "AI Video Generation software for B2B teams, not a telecom service."
    }),

    faq: (faqs: { question: string; answer: string }[]) => ({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    }),

    article: (title: string, description: string, datePublished: string, author: string, image: string) => ({
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": title,
        "description": description,
        "datePublished": datePublished,
        "author": {
            "@type": "Person",
            "name": author
        },
        "image": image
    }),

    service: (name: string, description: string) => ({
        "@context": "https://schema.org",
        "@type": "Service",
        "name": name,
        "description": description,
        "provider": {
            "@type": "Organization",
            "name": "Virezo.pro"
        },
        "areaServed": "Global"
    })
};
