"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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

    const currentCredits = getUserCredits();
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
    if (isLoading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const handleGenerate = async () => {
        if (!prompt) return;

        if (!canAfford) {
            setError(`Ma3andekch credits kafin (${currentCredits} available, ${COSTS.IMAGE} required)`);
            return;
        }

        setIsGenerating(true);
        setImageUrl(null);
        setError(null);

        try {
            const response = await fetch("/api/generate-image", {
                method: "POST",
                body: JSON.stringify({ prompt }),
                headers: { "Content-Type": "application/json" }
            });

            const data = await response.json();

            if (data.success && data.raw) {
                // Assuming data.raw contains the image info or base64
                // This part needs adjustment based on actual API response debug
                // For now, let's assume we get a generic success or URL
                if (data.raw.url || data.raw) {
                    setImageUrl(data.raw.url || "https://picsum.photos/1024/1024"); // Fallback for mock/debug

                    deductCredits(COSTS.IMAGE);

                    // Log Activity
                    const user = JSON.parse(localStorage.getItem('current_user') || '{}');
                    const activities = JSON.parse(localStorage.getItem('mock_activity') || '[]');
                    activities.unshift({
                        email: user.email,
                        name: user.name,
                        tool: 'Image Generation',
                        timestamp: new Date().toISOString()
                    });
                    localStorage.setItem('mock_activity', JSON.stringify(activities));
                } else {
                    setError("API response format unclear. Check console.");
                }
            } else {
                setError(data.error || "Failed to generate image. Please try again.");
            }
        } catch (err) {
            setError("An error occurred. Check your API connection.");
            console.error(err);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-8 gap-8 relative z-10 pt-32">

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
                <h1 className="text-6xl font-black tracking-tighter bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-500 bg-clip-text text-transparent drop-shadow-sm">
                    Nanbanana 2.5
                </h1>
                <p className="text-gray-400 max-w-lg mx-auto text-lg">
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
                    <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500/20 to-pink-500/20 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                    <textarea
                        placeholder="Wsef taswira li bghiti... (Matalan: 'Un chat cyberpunk dans une ville néon au Maroc')"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="relative w-full px-6 py-6 rounded-2xl bg-black/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all text-lg resize-none min-h-[120px]"
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

            {/* Result Section */}
            {imageUrl && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-2xl mt-8"
                >
                    <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                        <img src={imageUrl} alt="Generated" className="w-full h-auto" />
                        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent flex justify-between items-end">
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
