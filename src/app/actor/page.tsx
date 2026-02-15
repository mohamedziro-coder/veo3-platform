"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ShieldCheck, ArrowLeft, Film, Users, Wand2 } from "lucide-react";
import Link from "next/link";
import ActorLibrary from "@/components/ActorLibrary";

export default function ActorStudioPage() {
    const router = useRouter();

    // All hooks must be declared BEFORE any conditional return
    const [isPageLoading, setIsPageLoading] = useState(true);

    useEffect(() => {
        const user = localStorage.getItem('current_user');
        if (!user) {
            router.push('/login');
        } else {
            setIsPageLoading(false);
        }
    }, [router]);

    // Show loading while checking auth (AFTER all hooks)
    if (isPageLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-background text-foreground pt-24 px-6 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-green-900/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">

                {/* Header */}
                <div className="flex items-center gap-6 mb-12">
                    <Link href="/dashboard" className="p-3 rounded-full bg-card-bg/70 hover:bg-muted transition-colors text-muted-foreground hover:text-foreground border border-card-border">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold flex items-center gap-3">
                            <ShieldCheck className="w-10 h-10 text-secondary" />
                            Actor Studio
                        </h1>
                        <p className="text-muted-foreground text-lg mt-2">Manage your consistent AI personas and upload custom characters.</p>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10"
                >
                    <div className="rounded-2xl border border-card-border bg-card-bg/70 p-5">
                        <div className="inline-flex items-center gap-2 text-primary font-semibold text-sm mb-2">
                            <Users className="w-4 h-4" />
                            Consistent Characters
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Keep the same face and style across multiple videos so your brand looks stable.
                        </p>
                    </div>
                    <div className="rounded-2xl border border-card-border bg-card-bg/70 p-5">
                        <div className="inline-flex items-center gap-2 text-primary font-semibold text-sm mb-2">
                            <Film className="w-4 h-4" />
                            Faster Production
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Save actors once, then reuse them in future projects without re-uploading each time.
                        </p>
                    </div>
                    <div className="rounded-2xl border border-card-border bg-card-bg/70 p-5">
                        <div className="inline-flex items-center gap-2 text-primary font-semibold text-sm mb-2">
                            <Wand2 className="w-4 h-4" />
                            Better Storytelling
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Match each script with the right persona to improve trust and content performance.
                        </p>
                    </div>
                </motion.div>

                {/* Inline Actor Library */}
                <ActorLibrary
                    isOpen={true}
                    onClose={() => { }}
                    onSelect={(actor) => {
                        // In studio mode, selection might just confirm, or edit details (future).
                        // For now, maybe just an alert or nothing.
                        alert(`Selected ${actor.name} (ID: ${actor.id})`);
                    }}
                    isInline={true}
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10 pb-16">
                    <div className="rounded-2xl border border-card-border bg-card-bg/70 p-6">
                        <h3 className="text-lg font-semibold text-foreground mb-3">How To Use Actor Studio</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>1. Upload a clear portrait with good lighting.</li>
                            <li>2. Name your actor by niche (fitness, beauty, tech...).</li>
                            <li>3. Reuse that actor in video pages for visual consistency.</li>
                            <li>4. Keep 2-3 actor variants for different target audiences.</li>
                        </ul>
                    </div>
                    <div className="rounded-2xl border border-card-border bg-card-bg/70 p-6">
                        <h3 className="text-lg font-semibold text-foreground mb-3">Best Practices</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>Use close-up images with neutral background.</li>
                            <li>Avoid sunglasses or heavy filters in source photos.</li>
                            <li>Use the same actor per campaign to improve recognition.</li>
                            <li>Refresh actor set every few months for new creatives.</li>
                        </ul>
                    </div>
                </div>

                {/* --- NEW CONTENT SECTIONS --- */}

                <div className="mt-32 w-full max-w-6xl mx-auto pb-20">

                    {/* Consistency Section */}
                    <div className="flex flex-col md:flex-row items-center gap-16 mb-32">
                        <div className="flex-1">
                            <h2 className="text-4xl md:text-5xl font-black text-foreground mb-6">
                                Build a Consistent <br /> <span className="text-secondary">Brand Identity</span>
                            </h2>
                            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                                Trust is built on recognition. Use the same AI actor across all your marketing channels—Instagram Stories, TikTok ads, and website explainers.
                            </p>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="bg-card-bg border border-card-border p-5 rounded-2xl">
                                    <div className="text-3xl mb-2">📸</div>
                                    <h4 className="font-bold text-foreground">Same Face</h4>
                                    <p className="text-xs text-muted-foreground">Maintains facial features in every shot.</p>
                                </div>
                                <div className="bg-card-bg border border-card-border p-5 rounded-2xl">
                                    <div className="text-3xl mb-2">👔</div>
                                    <h4 className="font-bold text-foreground">Style Match</h4>
                                    <p className="text-xs text-muted-foreground">Consistent clothing and vibe.</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 relative">
                            {/* Visual representation of consistency */}
                            <div className="grid grid-cols-2 gap-4">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="aspect-[3/4] rounded-2xl bg-card-bg border border-card-border overflow-hidden relative group">
                                        <div className="absolute inset-0 bg-secondary/10 group-hover:bg-secondary/20 transition-colors" />
                                        <div className="absolute bottom-3 left-3 right-3 text-center bg-background/80 backdrop-blur-sm py-1 rounded-lg text-xs font-mono border border-white/10">
                                            Video {i}
                                        </div>
                                        <div className="w-full h-full flex items-center justify-center text-secondary/30">
                                            <Users className="w-12 h-12" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Use Cases */}
                    <div className="text-center mb-32">
                        <h2 className="text-4xl font-black text-foreground mb-16">Who Needs AI Actors?</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { title: "E-commerce Brands", desc: "Showcase products with a relatable face without hiring models.", icon: "🛍️" },
                                { title: "News Channels", desc: "Deliver 24/7 updates with a dedicated AI news anchor.", icon: "📰" },
                                { title: "Educators", desc: "Create engaging course content with a friendly virtual tutor.", icon: "🎓" },
                            ].map((item, i) => (
                                <div key={i} className="bg-card-bg p-8 rounded-[2rem] border border-card-border hover:border-secondary/40 transition-colors group">
                                    <div className="text-5xl mb-6 group-hover:scale-110 transition-transform">{item.icon}</div>
                                    <h3 className="text-2xl font-bold text-foreground mb-4">{item.title}</h3>
                                    <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* FAQ */}
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-black text-foreground">Actor Studio FAQ</h2>
                        </div>
                        <div className="space-y-4">
                            {[
                                { q: "Can I upload my own photo?", a: "Yes! You can upload a photo of yourself or a team member to create a custom digital avatar." },
                                { q: "Is it legal to use these faces?", a: "Absolutely. Our stock actors are AI-generated or licensed, so you have full commercial rights." },
                                { q: "Can I change the actor's clothes?", a: "With our advanced prompt mode, you can specify attire, but keeping it consistent is usually better for branding." },
                                { q: "Does the lip-sync work automatically?", a: "Yes, our Video Generator automatically syncs the actor's lips to your audio or text script." }
                            ].map((item, i) => (
                                <div key={i} className="bg-card-bg border border-card-border p-6 rounded-2xl">
                                    <h4 className="font-bold text-foreground text-lg mb-2">{item.q}</h4>
                                    <p className="text-muted-foreground">{item.a}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
