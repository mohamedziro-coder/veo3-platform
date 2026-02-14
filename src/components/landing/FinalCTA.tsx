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
        <section className="relative py-32 px-6 overflow-hidden">
            {/* Radial Glow Background */}
            <div className="absolute inset-0 bg-[#0A0A0B] -z-20" />
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-primary/20 blur-[130px] rounded-full -z-10 opacity-60"
                style={{ background: 'radial-gradient(circle, var(--color-primary) 0%, transparent 70%)' }}
            />
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-accent/10 blur-[100px] rounded-full -z-10 opacity-30"
                style={{ background: 'radial-gradient(circle, var(--color-accent) 0%, transparent 70%)' }}
            />

            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
                className="max-w-5xl mx-auto text-center"
            >
                <motion.div variants={itemVariants} className="inline-flex px-4 py-2 rounded-full bg-white/5 border border-white/10 text-primary font-bold text-xs uppercase tracking-widest mb-8 backdrop-blur-md">
                    Join the top 1%
                </motion.div>

                <motion.h2
                    variants={itemVariants}
                    className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-[1.1]"
                >
                    Ready to <span className="text-primary italic">10x</span> Your ROI?
                </motion.h2>

                <motion.p
                    variants={itemVariants}
                    className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto font-medium"
                >
                    Stop manual testing. Start automating your creative strategy today.
                </motion.p>

                <motion.div variants={itemVariants} className="flex flex-col items-center gap-10">
                    <Link
                        href="/signup"
                        className="relative group flex items-center gap-3 px-12 py-6 rounded-[2rem] bg-primary text-white font-black text-2xl transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_40px_-5px_var(--color-primary)] overflow-hidden"
                    >
                        {/* Dynamic Pulse Shadow */}
                        <motion.div
                            className="absolute inset-0 bg-white/20 rounded-full"
                            animate={{ scale: [1, 1.2, 1], opacity: [0, 0.4, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        />
                        <span className="relative z-10">Get Started for Free</span>
                        <ArrowRight className="w-6 h-6 relative z-10 group-hover:translate-x-2 transition-transform" />
                    </Link>

                    <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
                        {guarantees.map((item, i) => (
                            <div key={i} className="flex items-center gap-2 text-gray-400 font-bold text-sm">
                                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <Check className="w-3 h-3 stroke-[4px]" />
                                </div>
                                {item}
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Mini-Boxes Grid */}
                <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto border-t border-white/5 pt-16">
                    {boxes.map((box, i) => (
                        <motion.div
                            key={i}
                            variants={itemVariants}
                            whileHover={{ y: -5, borderColor: 'var(--color-primary)', backgroundColor: 'rgba(255,255,255,0.03)' }}
                            className="p-6 rounded-2xl border border-white/10 bg-transparent transition-all duration-300 group cursor-default"
                        >
                            <div className="text-2xl font-black text-white mb-1 group-hover:text-primary transition-colors">{box.label1}</div>
                            <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{box.label2}</div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
}
