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
        <section className="py-48 bg-[#FAFAFB] dark:bg-[#09090B] border-y border-card-border overflow-hidden">
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={staggerContainer}
                className="max-w-[1400px] mx-auto px-6 text-center"
            >
                <motion.h2 variants={itemVariants} className="text-5xl md:text-7xl font-black text-foreground mb-40 tracking-tight">How It Works</motion.h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-20 relative">
                    {/* Connector Line (Desktop - Optimized for new scale) */}
                    <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        transition={{ delay: 0.8, duration: 1 }}
                        className="hidden md:block absolute top-[40px] left-[15%] right-[15%] h-[2px] bg-card-border -z-0 origin-left opacity-30"
                    />

                    {steps.map((item) => (
                        <motion.div key={item.step} variants={itemVariants} className="relative z-10 flex flex-col items-center group">
                            <div className="w-20 h-20 rounded-full bg-card-bg border-[3px] border-primary text-primary font-black text-3xl flex items-center justify-center mb-10 shadow-xl group-hover:bg-primary group-hover:text-white transition-all duration-500 scale-110">
                                {item.step}
                            </div>
                            <h3 className="text-2xl md:text-4xl font-black text-foreground mb-6 tracking-tight">{item.title}</h3>
                            <p className="text-xl text-muted-foreground max-w-sm leading-relaxed font-medium">{item.text}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
}
