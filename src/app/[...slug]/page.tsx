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

            <div className="max-w-[1400px] mx-auto px-6 pt-48 pb-32 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-center min-h-[70vh]">

                    {/* 2. TEXT CONTENT (Scaled Up) */}
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                        className="space-y-12 lg:col-span-7"
                    >
                        <motion.div variants={itemVariants} className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-primary font-bold text-sm uppercase tracking-[0.2em] backdrop-blur-md">
                            <Sparkles className="w-5 h-5 fill-current" />
                            <span>Virezo {path.split('/')[0]}</span>
                        </motion.div>

                        <motion.h1
                            variants={itemVariants}
                            className="text-6xl md:text-8xl lg:text-[7.5rem] font-black tracking-tight leading-[0.95] text-white"
                        >
                            {content.title}
                        </motion.h1>

                        <motion.p
                            variants={itemVariants}
                            className="text-xl md:text-2xl text-gray-400 max-w-2xl leading-relaxed font-medium"
                        >
                            {content.subtitle}
                        </motion.p>

                        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-6 pt-6">
                            <Link
                                href="/signup"
                                className="px-12 py-6 rounded-2xl bg-primary text-white font-black text-xl hover:bg-primary/90 transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_40px_-10px_var(--color-primary)] flex items-center justify-center gap-3"
                            >
                                {content.cta}
                                <ArrowRight className="w-6 h-6" />
                            </Link>
                            <Link
                                href="/contact"
                                className="px-12 py-6 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-xl hover:bg-white/10 transition-all flex items-center justify-center backdrop-blur-md"
                            >
                                Book a Demo
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* 3. HERO VISUAL (Scaled Up) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="relative lg:col-span-5 h-[500px] lg:h-[700px] flex items-center justify-center"
                    >
                        <motion.div
                            animate={{
                                y: [0, -40, 0],
                                rotate: [-3, 3, -3],
                            }}
                            transition={{
                                duration: 6,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                            className="relative z-10 w-72 h-72 md:w-96 md:h-96 lg:w-[450px] lg:h-[450px] rounded-[4rem] bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)] border border-white/20"
                        >
                            <VisualIcon className="w-40 h-40 md:w-56 md:h-56 lg:w-64 lg:h-64 text-white stroke-[1.5px] drop-shadow-2xl" />

                            <motion.div
                                animate={{ y: [0, 30, 0], x: [0, 20, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -top-16 -right-16 w-32 h-32 rounded-full bg-white/10 backdrop-blur-md border border-white/10"
                            />
                            <motion.div
                                animate={{ y: [0, -35, 0], x: [0, -25, 0] }}
                                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -bottom-20 -left-12 w-48 h-48 rounded-[3rem] bg-primary/20 backdrop-blur-md border border-white/5"
                            />
                        </motion.div>

                        {/* Background Glow behind Visual */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/30 blur-[150px] rounded-full -z-10" />
                    </motion.div>
                </div>

                {/* 4. CONTENT GRID (Expanded Spacing) */}
                <div className="mt-64">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.1 }}
                        variants={staggerContainer}
                        className="grid grid-cols-1 md:grid-cols-3 gap-12"
                    >
                        {content.features.map((feature, i) => (
                            <motion.div
                                key={i}
                                variants={{
                                    hidden: { opacity: 0, y: 70, rotateX: 15, scale: 0.9 },
                                    visible: {
                                        opacity: 1,
                                        y: 0,
                                        rotateX: 0,
                                        scale: 1,
                                        transition: { duration: 1, ease: [0.16, 1, 0.3, 1] }
                                    }
                                }}
                                whileHover={{ y: -15, transition: { duration: 0.4 } }}
                                className="group p-12 rounded-[3rem] bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 hover:border-primary/20 transition-all duration-500 relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 blur-[70px] group-hover:bg-primary/25 transition-all rounded-full -mr-24 -mt-24" />

                                <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-10 group-hover:scale-110 transition-transform duration-500">
                                    <feature.icon className="w-10 h-10" />
                                </div>
                                <h3 className="text-3xl font-bold text-white mb-6 tracking-tight">{feature.title}</h3>
                                <p className="text-xl text-gray-400 leading-relaxed font-medium">{feature.description}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </main>
    );
}
