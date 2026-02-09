"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/ImageUpload";
import VideoPlayer from "@/components/VideoPlayer";
import { Sparkles, PlayCircle, AlertCircle, ShoppingBag, Wand2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import FrameGenerator from "@/components/FrameGenerator";
import { COSTS, deductCredits, getUserCredits } from "@/lib/credits";

export default function VideoPage() {
    const router = useRouter();

    // All hooks must be declared BEFORE any conditional return
    const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
    const [targetSlot, setTargetSlot] = useState<'start' | 'end' | null>(null);
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [startImage, setStartImage] = useState<File | null>(null);
    const [endImage, setEndImage] = useState<File | null>(null);
    const [startImageUrl, setStartImageUrl] = useState<string | null>(null);
    const [endImageUrl, setEndImageUrl] = useState<string | null>(null);
    const [prompt, setPrompt] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Credit usage state
    const currentCredits = getUserCredits();
    const canAfford = currentCredits >= COSTS.VIDEO;

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
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const handleOpenGenerator = (slot: 'start' | 'end') => {
        setTargetSlot(slot);
        setIsGeneratorOpen(true);
    }

    const handleFrameGenerated = (url: string) => {
        if (targetSlot === 'start') {
            setStartImageUrl(url);
            setStartImage(null); // Clear file input if generated
        } else if (targetSlot === 'end') {
            setEndImageUrl(url);
            setEndImage(null); // Clear file input if generated
        }
    }

    const handleGenerateVideo = async () => {
        // 1. Credit Check
        if (!canAfford) {
            setError(`Insufficient credits. Required: ${COSTS.VIDEO}, Available: ${currentCredits}. Please upgrade.`);
            return;
        }

        // Validate inputs: We need Start AND End images (either File or URL)
        const hasStart = startImage || startImageUrl;
        const hasEnd = endImage || endImageUrl;

        if (!hasStart || !hasEnd) {
            setError("Please provide both Start and End frames.");
            return;
        }

        setIsLoading(true);
        setVideoUrl(null);
        setError(null);

        try {
            const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = error => reject(error);
            });

            // Helper to get base64 from URL if needed
            const urlToBase64 = async (url: string) => {
                const response = await fetch(url);
                const blob = await response.blob();
                return toBase64(new File([blob], "generated.jpg", { type: "image/jpeg" }));
            };

            let startImageBase64: string;
            if (startImage) {
                startImageBase64 = await toBase64(startImage);
            } else if (startImageUrl) {
                // Check if it's already data URI (Nanbanana usually returns base64 data URI sometimes, or URL)
                // Our API returns base64 usually or a blob URL if handled client side. 
                // Wait, FrameGenerator sets generatedImage from data.raw.url which is data:image... in our API.
                if (startImageUrl.startsWith('data:')) {
                    startImageBase64 = startImageUrl;
                } else {
                    startImageBase64 = await urlToBase64(startImageUrl);
                }
            } else {
                throw new Error("Start frame missing");
            }

            let endImageBase64: string;
            if (endImage) {
                endImageBase64 = await toBase64(endImage);
            } else if (endImageUrl) {
                if (endImageUrl.startsWith('data:')) {
                    endImageBase64 = endImageUrl;
                } else {
                    endImageBase64 = await urlToBase64(endImageUrl);
                }
            } else {
                throw new Error("End frame missing");
            }

            // Construct prompt with product context if available (optional)
            const finalPrompt = prompt;

            const response = await fetch("/api/generate", {
                method: "POST",
                body: JSON.stringify({
                    startImage: startImageBase64,
                    endImage: endImageBase64,
                    prompt: finalPrompt
                }),
                headers: { "Content-Type": "application/json" }
            });

            const data = await response.json();

            if (data.status === "success" && data.videoUrl) {
                setVideoUrl(data.videoUrl);

                // Deduct Credits
                deductCredits(COSTS.VIDEO);

                // Log Activity
                const user = JSON.parse(localStorage.getItem('current_user') || '{}');
                const activities = JSON.parse(localStorage.getItem('mock_activity') || '[]');
                activities.unshift({
                    email: user.email,
                    name: user.name,
                    tool: "Video",
                    timestamp: new Date().toISOString(),
                    details: `Generated product video: "${prompt.substring(0, 30)}${prompt.length > 30 ? '...' : ''}"`,
                    resultUrl: data.videoUrl, // Save the video URL
                    prompt: prompt // Save the full prompt
                });
                localStorage.setItem('mock_activity', JSON.stringify(activities.slice(0, 50)));
            } else {
                setError(data.error || "Failed to generate video. Please checks credits/API.");
            }

        } catch (error) {
            console.error("Generation failed", error);
            setError("Network connection error. Try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden pt-24 pb-32">

            {/* Background Ambience */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-purple-900/10 blur-[150px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-900/10 blur-[150px]" />
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="w-full max-w-5xl z-10 flex flex-col items-center gap-10"
            >

                {/* Header */}
                <motion.div variants={itemVariants} className="text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-xs font-medium text-purple-300">
                        <Sparkles className="w-3 h-3" />
                        <span>Powered by Veo 3.0</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter bg-gradient-to-br from-white via-purple-100 to-purple-400 bg-clip-text text-transparent neon-glow">
                        Product Video Ad
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
                        Upload your product, generate frames, and let AI animate it. <br />
                        <span className="text-white/50 text-sm">Product-Centric Frame Generation.</span>
                    </p>
                </motion.div>

                {/* Error Alert */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="w-full max-w-lg"
                        >
                            <div className="bg-red-500/10 border border-red-500/20 text-red-200 px-6 py-4 rounded-2xl flex items-center gap-3 backdrop-blur-md">
                                <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500" />
                                <p className="text-sm font-medium">{error}</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Main Interface Card */}
                <motion.div variants={itemVariants} className="w-full glass-panel rounded-[2rem] p-6 md:p-10 relative overflow-hidden group">


                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 relative z-10">
                        {/* Start Slot */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-bold text-gray-400 uppercase">2. Start Frame</label>
                                <button
                                    onClick={() => handleOpenGenerator('start')}
                                    className="text-xs flex items-center gap-1 text-yellow-500 hover:text-yellow-400 transition-colors"
                                >
                                    <Wand2 className="w-3 h-3" />
                                    Generate
                                </button>
                            </div>
                            <ImageUpload
                                label="Start Frame"
                                selectedImage={startImage}
                                onImageSelect={(file) => {
                                    setStartImage(file);
                                    setStartImageUrl(null); // Clear URL if manual upload
                                }}
                                externalImageUrl={startImageUrl}
                            />
                        </div>

                        {/* End Slot */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-bold text-gray-400 uppercase">3. End Frame</label>
                                <button
                                    onClick={() => handleOpenGenerator('end')}
                                    className="text-xs flex items-center gap-1 text-yellow-500 hover:text-yellow-400 transition-colors"
                                >
                                    <Wand2 className="w-3 h-3" />
                                    Generate
                                </button>
                            </div>
                            <ImageUpload
                                label="End Frame"
                                selectedImage={endImage}
                                onImageSelect={(file) => {
                                    setEndImage(file);
                                    setEndImageUrl(null); // Clear URL if manual upload
                                }}
                                externalImageUrl={endImageUrl}
                            />
                        </div>
                    </div>

                    <FrameGenerator
                        isOpen={isGeneratorOpen}
                        onClose={() => setIsGeneratorOpen(false)}
                        onSelect={handleFrameGenerated}
                        contextImage={targetSlot === 'end' ? startImageUrl : null}
                    />

                    {/* Prompt Section */}
                    <div className="mt-8 space-y-4">
                        <div className="relative group/input">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl blur opacity-0 group-focus-within/input:opacity-50 transition duration-500"></div>
                            <input
                                type="text"
                                placeholder="Describe the motion... (e.g., 'Cinematic slow zoom, product rotating')"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                className="relative w-full px-6 py-4 rounded-xl bg-[#0a0a0a] border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all text-lg shadow-inner"
                            />
                        </div>
                    </div>

                    {/* Action Button */}
                    <div className="mt-8">
                        <button
                            onClick={handleGenerateVideo}
                            disabled={isLoading}
                            className="w-full py-5 rounded-xl bg-white text-black font-bold text-xl shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-3 relative overflow-hidden"
                        >
                            {/* Gradient Overlay on Hover */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-1000" />

                            {isLoading ? (
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                    <span className="tracking-wide">Generating...</span>
                                </div>
                            ) : (
                                <>
                                    <PlayCircle className="w-6 h-6" />
                                    <span>Generate Video ({COSTS.VIDEO} Credits)</span>
                                </>
                            )}
                        </button>
                    </div>
                </motion.div>

                {/* Result Section */}
                <AnimatePresence>
                    {(videoUrl || isLoading) && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full"
                        >
                            <VideoPlayer videoUrl={videoUrl} isLoading={isLoading} />
                        </motion.div>
                    )}
                </AnimatePresence>

            </motion.div>
        </main>
    );
}
