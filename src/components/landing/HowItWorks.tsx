"use client";

import { motion, Variants } from "framer-motion";

interface HowItWorksProps {
    itemVariants: Variants;
    staggerContainer: Variants;
}

const steps = [
    { step: 1, title: "Paste Product Link", text: "Link your store page or product listing." },
    { step: 2, title: "AI Generates Magic", text: "We write the script & animate the avatar." },
    { step: 3, title: "Download & Post", text: "Get your viral-ready video in seconds." }
];

export default function HowItWorks({ itemVariants, staggerContainer }: HowItWorksProps) {
    return (
        <section className="py-24 bg-muted border-y border-card-border">
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={staggerContainer}
                className="max-w-7xl mx-auto px-6 text-center"
            >
                <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold text-foreground mb-16">How It Works</motion.h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                    {/* Connector Line (Desktop) */}
                    <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        transition={{ delay: 0.8, duration: 1 }}
                        className="hidden md:block absolute top-[28px] left-[20%] right-[20%] h-[2px] bg-card-border -z-0 origin-left"
                    />

                    {steps.map((item) => (
                        <motion.div key={item.step} variants={itemVariants} className="relative z-10 flex flex-col items-center group">
                            <div className="w-14 h-14 rounded-full bg-card-bg border-2 border-primary text-primary font-bold text-xl flex items-center justify-center mb-6 shadow-md group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                {item.step}
                            </div>
                            <h3 className="text-xl font-bold text-foreground mb-3">{item.title}</h3>
                            <p className="text-muted-foreground max-w-xs">{item.text}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
}
