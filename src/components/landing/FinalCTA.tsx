"use client";

import { motion, Variants } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";

interface FinalCTAProps {
    itemVariants: Variants;
    staggerContainer: Variants;
}

const boxes = [
    { label2: "Creative Studio", label1: "AI" },
    { label2: "Auto-Optimization", label1: "24/7" },
    { label2: "Faster Scaling", label1: "10x" },
    { label2: "Tech Skills Needed", label1: "0%" }
];

const guarantees = [
    "No credit card required",
    "14-Day Free Trial",
    "24/7 Support"
];

export default function FinalCTA({ itemVariants, staggerContainer }: FinalCTAProps) {
    return (
        <section className="relative py-48 px-6 overflow-hidden">
            {/* Radial Glow Background */}
            <div className="absolute inset-0 bg-[#0A0A0B] -z-20" />
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[800px] bg-primary/20 blur-[150px] rounded-full -z-10 opacity-60"
                style={{ background: 'radial-gradient(circle, var(--color-primary) 0%, transparent 70%)' }}
            />
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-accent/10 blur-[120px] rounded-full -z-10 opacity-30"
                style={{ background: 'radial-gradient(circle, var(--color-accent) 0%, transparent 70%)' }}
            />

            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
                className="max-w-[1400px] mx-auto text-center"
            >
                <motion.div variants={itemVariants} className="inline-flex px-6 py-3 rounded-full bg-white/5 border border-white/10 text-primary font-bold text-sm uppercase tracking-[0.25em] mb-12 backdrop-blur-md">
                    Join the top 1%
                </motion.div>

                <motion.h2
                    variants={itemVariants}
                    className="text-6xl md:text-8xl lg:text-[8.5rem] font-black text-white mb-10 tracking-[0.02em] md:tracking-[-0.03em] leading-[0.9]"
                >
                    Ready to <span className="text-primary italic">10x</span> Your ROI?
                </motion.h2>

                <motion.p
                    variants={itemVariants}
                    className="text-xl md:text-3xl text-gray-400 mb-16 max-w-4xl mx-auto leading-relaxed font-medium"
                >
                    Stop manual testing. Start automating your creative strategy today.
                </motion.p>

                <motion.div variants={itemVariants} className="flex flex-col items-center gap-14">
                    <Link
                        href="/signup"
                        className="relative group flex items-center gap-4 px-16 py-8 rounded-[2.5rem] bg-primary text-white font-black text-3xl transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_60px_-10px_var(--color-primary)] overflow-hidden"
                    >
                        {/* Dynamic Pulse Shadow */}
                        <motion.div
                            className="absolute inset-0 bg-white/20 rounded-full"
                            animate={{ scale: [1, 1.2, 1], opacity: [0, 0.4, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        />
                        <span className="relative z-10">Get Started for Free</span>
                        <ArrowRight className="w-8 h-8 relative z-10 group-hover:translate-x-3 transition-transform" />
                    </Link>

                    <div className="flex flex-wrap justify-center gap-x-12 gap-y-6">
                        {guarantees.map((item, i) => (
                            <div key={i} className="flex items-center gap-3 text-gray-400 font-bold text-lg">
                                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <Check className="w-4 h-4 stroke-[4px]" />
                                </div>
                                {item}
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Mini-Boxes Grid (Scaled Up) */}
                <div className="mt-32 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto border-t border-white/5 pt-20">
                    {boxes.map((box, i) => (
                        <motion.div
                            key={i}
                            variants={itemVariants}
                            whileHover={{ y: -5, borderColor: 'var(--color-primary)', backgroundColor: 'rgba(255,255,255,0.03)' }}
                            className="p-8 rounded-3xl border border-white/10 bg-transparent transition-all duration-400 group cursor-default"
                        >
                            <div className="text-3xl font-black text-white mb-2 group-hover:text-primary transition-colors">{box.label1}</div>
                            <div className="text-xs text-gray-500 font-black uppercase tracking-[0.2em]">{box.label2}</div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
}
