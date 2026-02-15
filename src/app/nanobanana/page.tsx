"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles, Download, Wand2, Lightbulb, CheckCircle2 } from "lucide-react";
import { COSTS, deductCredits, getUserCredits } from "@/lib/credits";
const GENERATION_COST = 0; // Free for now or updated later

export default function NanobananaPage() {
    const router = useRouter();

    // All hooks must be declared BEFORE any conditional return
    const [isLoading, setIsLoading] = useState(true);
    const [prompt, setPrompt] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const [currentCredits, setCurrentCredits] = useState(0);

    useEffect(() => {
        // Initial load
        setCurrentCredits(getUserCredits());

        // Update on changes
        const handleCreditsChange = () => setCurrentCredits(getUserCredits());
        window.addEventListener('storage', handleCreditsChange);
        window.addEventListener('credits-updated', handleCreditsChange);
        return () => {
            window.removeEventListener('storage', handleCreditsChange);
            window.removeEventListener('credits-updated', handleCreditsChange);
        };
    }, []);

    const canAfford = currentCredits >= COSTS.IMAGE;
    const promptIdeas = [
        "Luxury perfume bottle on wet black stone, cinematic light, 8k product shot",
        "Streetwear model in Casablanca medina, golden hour, editorial fashion photo",
        "Minimalist tech desk setup, soft shadows, realistic texture, clean composition",
        "Moroccan dessert table, warm tones, shallow depth of field, premium food style",
    ];

    useEffect(() => {
        const user = localStorage.getItem('current_user');
        if (!user) {
            router.push('/login');
        } else {
            setIsLoading(false);
        }
    }, [router]);

    // Show loading while checking auth (AFTER all hooks)
    // ... (keep existing loading check) ...

    const handleGenerate = async () => {
        if (!prompt) return;

        // Get user for authentication
        const user = JSON.parse(localStorage.getItem('current_user') || '{}');
        if (!user.email) {
            setError("Authentication required. Please login.");
            return;
        }

        // Re-check credits at moment of generation to be safe
        const freshCredits = getUserCredits();
        if (freshCredits < COSTS.IMAGE) {
            setError(`Insufficient credits (${freshCredits} available, ${COSTS.IMAGE} required)`);
            return;
        }

        setIsGenerating(true);
        setError(null);
        setImageUrl(null);

        try {
            const response = await fetch("/api/generate-image", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    prompt: prompt,
                    userEmail: user.email // Send email for credit deduction
                })
            });

            const data = await response.json();

            if (data.success && data.raw?.url) {
                setImageUrl(data.raw.url);

                // Update credits from server response (DATABASE is source of truth)
                if (data.credits !== undefined) {
                    user.credits = data.credits;
                    localStorage.setItem('current_user', JSON.stringify(user));
                    window.dispatchEvent(new Event('storage'));
                    window.dispatchEvent(new Event('credits-updated'));
                } else {
                    // Fallback to client-side deduction (shouldn't happen now)
                    deductCredits(COSTS.IMAGE);
                }

                // Log Activity to Database
                try {
                    await fetch('/api/activity', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            userEmail: user.email,
                            userName: user.name,
                            tool: 'Image',
                            details: `Generated image: "${prompt.substring(0, 50)}${prompt.length > 50 ? '...' : ''}"`,
                            resultUrl: data.raw.url // Save image URL
                        })
                    });
                } catch (activityError) {
                    console.error('Failed to log activity:', activityError);
                }
            } else {
                setError(data.error || "Image generation failed. Please try again.");
            }
        } catch (err) {
            console.error("Image generation error:", err);
            setError("Network error. Please check your connection.");
        } finally {
            setIsGenerating(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-6 md:p-8 gap-8 relative z-10 pt-24 md:pt-32 pb-24 md:pb-32 bg-gray-50">

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-4"
            >
                <div className="flex items-center justify-center gap-3 mb-2">
                    <span className="bg-yellow-500/20 text-yellow-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-yellow-500/30">
                        Experimental
                    </span>
                </div>
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-gray-900 drop-shadow-sm">
                    Nanobanana 2.5
                </h1>
                <p className="text-gray-500 max-w-lg mx-auto text-base md:text-lg">
                    Generate high-quality creative images in seconds.
                    <br />
                    <span className="text-sm opacity-60">(Powered by Imagen 3 - Vertex AI)</span>
                </p>
            </motion.div>

            {/* Input Section */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="w-full max-w-2xl space-y-6"
            >
                <div className="relative group">
                    <textarea
                        placeholder="Describe the image you want... (e.g., 'A cyberpunk cat in a neon city in Morocco')"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="relative w-full px-6 py-6 rounded-2xl bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-lg resize-none min-h-[120px] shadow-sm"
                    />
                </div>

                <button
                    onClick={handleGenerate}
                    disabled={!prompt || isGenerating}
                    className="w-full py-5 rounded-2xl bg-gradient-to-r from-yellow-600 to-orange-600 font-bold text-white text-xl shadow-xl shadow-orange-900/20 hover:shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-3"
                >
                    {isGenerating ? (
                        "Generating..."
                    ) : (
                        <>
                            <Wand2 className="w-6 h-6" />
                            Generate Image - {COSTS.IMAGE} Credits
                        </>
                    )}
                </button>

                {error && (
                    <div className="text-red-400 bg-red-900/20 border border-red-500/20 p-4 rounded-xl text-center">
                        {error}
                    </div>
                )}
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="w-full max-w-2xl rounded-2xl border border-gray-200 bg-white p-5 md:p-6"
            >
                <div className="flex items-center gap-2 mb-4 text-gray-900">
                    <Lightbulb className="w-4 h-4 text-amber-500" />
                    <h3 className="text-sm font-bold uppercase tracking-wider">Prompt Ideas</h3>
                </div>
                <div className="grid grid-cols-1 gap-2">
                    {promptIdeas.map((idea, idx) => (
                        <button
                            key={idx}
                            type="button"
                            onClick={() => setPrompt(idea)}
                            className="text-left rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-600 hover:border-primary/40 hover:bg-blue-50/50 transition-colors"
                        >
                            {idea}
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* Loading State */}
            {isGenerating && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-2xl mt-8"
                >
                    <div className="relative rounded-3xl overflow-hidden border border-gray-200 shadow-xl bg-white aspect-[4/3] flex flex-col items-center justify-center gap-4">
                        <div className="absolute inset-0 bg-gray-50 animate-pulse" />
                        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin relative z-10" />
                        <p className="text-gray-900 font-bold text-lg animate-pulse relative z-10">Generating your image...</p>
                        <p className="text-gray-500 text-sm relative z-10">This usually takes around 5-10 seconds</p>
                    </div>
                </motion.div>
            )}

            {/* Result Section */}
            {!isGenerating && imageUrl && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-2xl mt-8"
                >
                    <div className="relative rounded-3xl overflow-hidden border border-gray-200 shadow-xl bg-white">
                        <div className="relative w-full h-auto aspect-square md:aspect-video">
                            {/* Fallback for external URLs that might not be in config, though we added unsplash/google */}
                            {/* Using unoptimized for arbitrary generation URLs if they come from unknown sources, 
                                but best effort to use Image if possible. 
                                Since generated URLs are dynamic, we might need unoptimized=true if domain isn't in config.
                                But we added generativelanguage.googleapis.com
                            */}
                            <Image
                                src={imageUrl}
                                alt="Generated"
                                fill
                                className="object-contain"
                                sizes="(max-width: 768px) 100vw, 800px"
                                unoptimized={!imageUrl.startsWith('https://images.unsplash.com') && !imageUrl.startsWith('https://generativelanguage.googleapis.com')}
                            />
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent flex justify-between items-end z-10">
                            <button
                                onClick={() => {
                                    if (!imageUrl) return;
                                    // Use same robust download logic as dashboard
                                    const link = document.createElement('a');
                                    link.href = imageUrl;
                                    link.download = `generated-image-${Date.now()}.png`;
                                    link.target = '_blank';
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                }}
                                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-md px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors"
                            >
                                <Download className="w-4 h-4" />
                                Download
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}

            <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-gray-200 bg-white p-5">
                    <h4 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">For Better Results</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 mt-0.5 text-green-600" />Mention camera style (close-up, wide, portrait).</li>
                        <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 mt-0.5 text-green-600" />Add lighting (soft light, sunset, studio).</li>
                        <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 mt-0.5 text-green-600" />Specify quality keywords (realistic, ultra-detailed).</li>
                    </ul>
                </div>
                <div className="rounded-2xl border border-gray-200 bg-white p-5">
                    <h4 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Workflow</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                        <li>1. Write a precise prompt with subject + style.</li>
                        <li>2. Generate 2-3 variants and compare quickly.</li>
                        <li>3. Download best frame and use it in video flow.</li>
                        <li>4. Reuse top prompts for campaign consistency.</li>
                    </ul>
                </div>
            </div>

        </main>
    );
}
