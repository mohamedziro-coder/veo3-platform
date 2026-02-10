"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles, Download, Wand2 } from "lucide-react";
import { COSTS, deductCredits, getUserCredits } from "@/lib/credits";

export default function NanbananaPage() {
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

        // Re-check credits at moment of generation to be safe
        const freshCredits = getUserCredits();
        if (freshCredits < COSTS.IMAGE) {
            setError(`Ma3andekch credits kafin (${freshCredits} available, ${COSTS.IMAGE} required)`);
            return;
        }

        setIsGenerating(true);
        // ... (rest of function) ...
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
                    Nanbanana 2.5
                </h1>
                <p className="text-gray-500 max-w-lg mx-auto text-base md:text-lg">
                    Sawb tsawar khayaliya b jowda 3aliya.
                    <br />
                    <span className="text-sm opacity-60">(Powered by Gemini 2.0 Flash)</span>
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
                        placeholder="Wsef taswira li bghiti... (Matalan: 'Un chat cyberpunk dans une ville néon au Maroc')"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="relative w-full px-6 py-6 rounded-2xl bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-lg resize-none min-h-[120px] shadow-sm"
                    />
                </div>

                <button
                    onClick={handleGenerate}
                    disabled={!prompt || isLoading}
                    className="w-full py-5 rounded-2xl bg-gradient-to-r from-yellow-600 to-orange-600 font-bold text-white text-xl shadow-xl shadow-orange-900/20 hover:shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-3"
                >
                    {isLoading ? (
                        "Keyrsem..."
                    ) : (
                        <>
                            <Wand2 className="w-6 h-6" />
                            Générer (Sawb) - {COSTS.IMAGE} Credits
                        </>
                    )}
                </button>

                {error && (
                    <div className="text-red-400 bg-red-900/20 border border-red-500/20 p-4 rounded-xl text-center">
                        {error}
                    </div>
                )}
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
                        <p className="text-gray-900 font-bold text-lg animate-pulse relative z-10">Keyrsem f'tasswira dyalk...</p>
                        <p className="text-gray-500 text-sm relative z-10">Katakhod ta9riban 5-10 tawani</p>
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
                            <button className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-md px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors">
                                <Download className="w-4 h-4" />
                                Telecharger
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}

        </main>
    );
}
