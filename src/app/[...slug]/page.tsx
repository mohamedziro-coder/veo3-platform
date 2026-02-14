"use client";

import { notFound } from "next/navigation";
import { motion, Variants } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { pagesData } from "@/lib/pagesData";
import { use } from "react";

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
};

const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

export default function DynamicAntigravityPage({ params }: { params: Promise<{ slug: string[] }> }) {
    const resolvedParams = use(params);
    const path = resolvedParams.slug.join("/");

    // Try to find content by full path or the last segment
    const content = pagesData[path] || pagesData[resolvedParams.slug[resolvedParams.slug.length - 1]];

    if (!content) {
        notFound();
    }

    const VisualIcon = content.features[0].icon;

    return (
        <main className="min-h-screen bg-[#0A0A0B] text-foreground font-sans overflow-hidden selection:bg-primary/20 selection:text-primary relative">
            {/* 1. ANTIGRAVITY ATMOSPHERE (Pulsing Glow Orbs) */}
            <div className="fixed inset-0 pointer-events-none -z-10">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.15, 0.3, 0.15],
                        x: ["-10%", "10%", "-10%"],
                        y: ["-10%", "10%", "-10%"],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full blur-[120px]"
                    style={{ background: 'radial-gradient(circle, var(--color-primary) 0%, transparent 70%)' }}
                />
                <motion.div
                    animate={{
                        scale: [1.2, 1, 1.2],
                        opacity: [0.1, 0.2, 0.1],
                        x: ["10%", "-10%", "10%"],
                        y: ["10%", "-10%", "10%"],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    className="absolute -bottom-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full blur-[100px]"
                    style={{ background: 'radial-gradient(circle, var(--color-secondary) 0%, transparent 70%)' }}
                />
            </div>

            <div className="max-w-7xl mx-auto px-6 pt-32 pb-24 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* 2. TEXT CONTENT (Staggered Slide Up) */}
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                        className="space-y-8"
                    >
                        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-primary font-bold text-xs uppercase tracking-widest backdrop-blur-md">
                            <Sparkles className="w-4 h-4 fill-current" />
                            <span>Virezo {path.split('/')[0]}</span>
                        </motion.div>

                        <motion.h1
                            variants={itemVariants}
                            className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1] text-white"
                        >
                            {content.title}
                        </motion.h1>

                        <motion.p
                            variants={itemVariants}
                            className="text-xl text-gray-400 max-w-xl leading-relaxed font-medium"
                        >
                            {content.subtitle}
                        </motion.p>

                        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Link
                                href="/signup"
                                className="px-10 py-5 rounded-2xl bg-primary text-white font-black text-lg hover:bg-primary/90 transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_30px_-5px_var(--color-primary)] flex items-center justify-center gap-2"
                            >
                                {content.cta}
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                            <Link
                                href="/contact"
                                className="px-10 py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-lg hover:bg-white/10 transition-all flex items-center justify-center backdrop-blur-md"
                            >
                                Book a Demo
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* 3. HERO VISUAL (Infinite Zero-G Float) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="relative h-[500px] flex items-center justify-center"
                    >
                        <motion.div
                            animate={{
                                y: [0, -30, 0],
                                rotate: [-2, 2, -2],
                            }}
                            transition={{
                                duration: 5,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                            className="relative z-10 w-64 h-64 md:w-80 md:h-80 rounded-[3rem] bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] border border-white/20"
                        >
                            <VisualIcon className="w-32 h-32 md:w-40 md:h-40 text-white stroke-[1.5px] drop-shadow-2xl" />

                            {/* Floating Decorative Elements */}
                            <motion.div
                                animate={{ y: [0, 20, 0], x: [0, 10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-white/10 backdrop-blur-md border border-white/10"
                            />
                            <motion.div
                                animate={{ y: [0, -25, 0], x: [0, -15, 0] }}
                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -bottom-12 -left-8 w-32 h-32 rounded-3xl bg-primary/20 backdrop-blur-md border border-white/5"
                            />
                        </motion.div>

                        {/* Background Glow behind Visual */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/30 blur-[100px] rounded-full -z-10" />
                    </motion.div>
                </div>

                {/* 4. CONTENT GRID (Physics Reveal) */}
                <div className="mt-40">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={staggerContainer}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                    >
                        {content.features.map((feature, i) => (
                            <motion.div
                                key={i}
                                variants={{
                                    hidden: { opacity: 0, y: 50, rotateX: 15, scale: 0.9 },
                                    visible: {
                                        opacity: 1,
                                        y: 0,
                                        rotateX: 0,
                                        scale: 1,
                                        transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
                                    }
                                }}
                                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                                className="group p-10 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 hover:border-primary/20 transition-all duration-500 relative overflow-hidden"
                            >
                                {/* Subtle Hover Glow */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[50px] group-hover:bg-primary/20 transition-all rounded-full -mr-16 -mt-16" />

                                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform duration-500">
                                    <feature.icon className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">{feature.title}</h3>
                                <p className="text-gray-400 leading-relaxed font-medium">{feature.description}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </main>
    );
}
