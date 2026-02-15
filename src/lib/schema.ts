export const generateSchema = {
    organization: () => ({
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Virezo",
        "url": "https://virezo.com",
        "logo": "https://virezo.com/logo.png",
        "sameAs": [
            "https://twitter.com/virezo",
            "https://linkedin.com/company/virezo",
            "https://instagram.com/virezo"
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
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        }
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
            "name": "Virezo"
        },
        "areaServed": "Global"
    })
};
