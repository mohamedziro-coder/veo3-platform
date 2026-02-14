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
        <section className="py-48 px-6 bg-[#FAFAFB] dark:bg-background border-y border-card-border" id="faq">
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={staggerContainer}
                className="max-w-4xl mx-auto"
            >
                <motion.div variants={itemVariants} className="text-center mb-24 space-y-6">
                    <h2 className="text-5xl md:text-7xl font-black text-foreground tracking-tight leading-[1]">Frequently Asked Questions</h2>
                    <p className="text-xl md:text-2xl text-muted-foreground font-medium">Everything you need to know about Virezo AI.</p>
                </motion.div>

                <div className="space-y-6">
                    {faqs.map((faq, i) => (
                        <motion.div
                            key={i}
                            variants={itemVariants}
                            className="bg-card-bg rounded-[2rem] border border-card-border overflow-hidden shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300"
                        >
                            <button
                                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                className="w-full px-10 py-8 flex items-center justify-between text-left hover:bg-muted/50 transition-colors"
                            >
                                <span className="font-black text-foreground text-xl md:text-2xl tracking-tight">{faq.question}</span>
                                <motion.span
                                    animate={{ rotate: openFaq === i ? 45 : 0 }}
                                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                    className="flex-shrink-0 ml-6"
                                >
                                    <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
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
                                        <div className="px-10 pb-10 text-xl text-muted-foreground leading-relaxed border-t border-card-border pt-6 font-medium">
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
