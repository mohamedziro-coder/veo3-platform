import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { useState } from 'react';

interface FAQItem {
    question: string;
    answer: string;
}

interface FAQSectionProps {
    items: FAQItem[];
    title?: string;
    subtitle?: string;
}

export default function FAQSection({ items, title = "Frequently Asked Questions", subtitle = "Everything you need to know about this feature." }: FAQSectionProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    // Schema Markup
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": items.map(item => ({
            "@type": "Question",
            "name": item.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": item.answer
            }
        }))
    };

    return (
        <div className="py-20 px-6">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4">{title}</h2>
                    <p className="text-xl text-muted-foreground">{subtitle}</p>
                </div>

                <div className="space-y-4">
                    {items.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={false}
                            className={`border border-card-border rounded-2xl bg-card-bg overflow-hidden transition-all ${openIndex === i ? 'border-primary/50 shadow-lg' : 'hover:border-primary/20'}`}
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                className="w-full flex items-center justify-between p-6 text-left"
                            >
                                <span className="text-lg font-bold text-foreground pr-8">{item.question}</span>
                                <span className={`p-2 rounded-full transition-colors ${openIndex === i ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                                    {openIndex === i ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                                </span>
                            </button>

                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{
                                    height: openIndex === i ? "auto" : 0,
                                    opacity: openIndex === i ? 1 : 0
                                }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="px-6 pb-6 text-muted-foreground leading-relaxed">
                                    {item.answer}
                                </div>
                            </motion.div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
