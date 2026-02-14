"use client";

import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";

interface FAQItem {
    question: string;
    answer: string;
}

interface FAQProps {
    faqs: FAQItem[];
    itemVariants: Variants;
    staggerContainer: Variants;
}

export default function FAQ({ faqs, itemVariants, staggerContainer }: FAQProps) {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    return (
        <section className="py-24 px-6 bg-muted border-y border-card-border" id="faq">
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={staggerContainer}
                className="max-w-3xl mx-auto"
            >
                <motion.div variants={itemVariants} className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
                    <p className="text-xl text-muted-foreground">Everything you need to know about Virezo AI.</p>
                </motion.div>

                <div className="space-y-4">
                    {faqs.map((faq, i) => (
                        <motion.div
                            key={i}
                            variants={itemVariants}
                            className="bg-card-bg rounded-2xl border border-card-border overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                        >
                            <button
                                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-muted/50 transition-colors"
                            >
                                <span className="font-bold text-foreground md:text-lg">{faq.question}</span>
                                <motion.span
                                    animate={{ rotate: openFaq === i ? 45 : 0 }}
                                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                    className="flex-shrink-0 ml-4"
                                >
                                    <svg className="w-6 h-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                </motion.span>
                            </button>
                            <AnimatePresence>
                                {openFaq === i && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                    >
                                        <div className="px-8 pb-6 text-muted-foreground leading-relaxed border-t border-card-border pt-4">
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
}
