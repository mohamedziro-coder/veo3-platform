"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/ImageUpload";
import VideoPlayer from "@/components/VideoPlayer";
import { Sparkles, PlayCircle, AlertCircle, ShoppingBag, Wand2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from 'next/dynamic';
import { COSTS, deductCredits, getUserCredits } from "@/lib/credits";
import ProgressDisplay from "@/components/ProgressDisplay";

const FrameGenerator = dynamic(() => import('@/components/FrameGenerator'), {
    loading: () => null,
    ssr: false
});

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
    const [aspectRatio, setAspectRatio] = useState<"9:16" | "16:9">("9:16");
    const [gravityIntensity, setGravityIntensity] = useState(0.5);
    const [isLoading, setIsLoading] = useState(false);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [progressMessage, setProgressMessage] = useState<string>("");
    const [generationStartTime, setGenerationStartTime] = useState<number | null>(null);

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
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
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
        setProgressMessage("Preparing images...");
        setGenerationStartTime(Date.now());

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

            const finalPrompt = prompt;
            const userEmail = JSON.parse(localStorage.getItem('current_user') || '{}').email;

            setProgressMessage("Starting video generation...");

            // Call API to start video generation
            const response = await fetch("/api/generate", {
                method: "POST",
                body: JSON.stringify({
                    startImage: startImageBase64,
                    endImage: endImageBase64,
                    prompt: finalPrompt,
                    userEmail: userEmail,
                    aspectRatio: aspectRatio
                }),
                headers: { "Content-Type": "application/json" }
            });

            const data = await response.json();

            if (data.status === "processing" && data.operationId) {
                // Start polling for status
                setProgressMessage("Video generation in progress...");
                await pollForCompletion(data.operationId, userEmail);
            } else if (data.error) {
                throw new Error(data.error);
            } else {
                throw new Error("Unexpected response from server");
            }

        } catch (error: any) {
            console.error("Generation failed", error);
            setError(error.message || "Network connection error. Try again.");
            setIsLoading(false);
            setGenerationStartTime(null);
        }
    };

    // Polling function to check video generation status
    const pollForCompletion = async (operationId: string, userEmail: string) => {
        const startTime = Date.now();
        const MAX_WAIT_TIME = 10 * 60 * 1000; // Increased to 10 minutes max
        const POLL_INTERVAL = 3000; // Poll every 3 seconds

        // No more setInterval here!

        const poll = async (): Promise<void> => {
            try {
                const elapsed = Date.now() - startTime;

                if (elapsed > MAX_WAIT_TIME) {
                    throw new Error("Video generation timed out. Please try again.");
                }

                const statusResponse = await fetch(
                    `/api/generate/status?operationId=${operationId}&userEmail=${encodeURIComponent(userEmail)}`
                );

                const statusData = await statusResponse.json();

                if (statusData.status === "complete" && statusData.videoUrl) {
                    setVideoUrl(statusData.videoUrl);
                    setProgressMessage("Video ready!");
                    setIsLoading(false);
                    setGenerationStartTime(null);

                    // Update credits
                    if (statusData.credits !== undefined) {
                        const user = JSON.parse(localStorage.getItem('current_user') || '{}');
                        user.credits = statusData.credits;
                        localStorage.setItem('current_user', JSON.stringify(user));
                        window.dispatchEvent(new Event('storage'));
                        window.dispatchEvent(new Event('credits-updated'));
                    } else {
                        deductCredits(COSTS.VIDEO);
                    }

                    // Log activity
                    try {
                        const user = JSON.parse(localStorage.getItem('current_user') || '{}');
                        await fetch('/api/activity', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                userEmail: user.email,
                                userName: user.name,
                                tool: 'Video',
                                details: `Generated video: "${prompt.substring(0, 50)}${prompt.length > 50 ? '...' : ''}"`,
                                resultUrl: statusData.videoUrl
                            })
                        });
                    } catch (activityError) {
                        console.error('Failed to log activity:', activityError);
                    }

                } else if (statusData.status === "failed") {
                    throw new Error(statusData.error || "Video generation failed");
                } else {
                    // Still processing, update message ONLY IF CHANGED to avoid re-renders
                    if (statusData.message && statusData.message !== progressMessage) {
                        setProgressMessage(statusData.message);
                    }
                    setTimeout(poll, POLL_INTERVAL);
                }

            } catch (error: any) {
                console.error("Polling error:", error);
                setError(error.message || "Failed to check video status");
                setIsLoading(false);
                setGenerationStartTime(null);
            }
        };

        // Start polling
        await poll();
    };

    // const ProgressDisplay = require('@/components/ProgressDisplay').default; // Removed


    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden pt-24 pb-32 bg-gray-50">

            {/* Background Ambience */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-purple-500/5 blur-[150px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-500/5 blur-[150px]" />
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="w-full max-w-5xl z-10 flex flex-col items-center gap-10"
            >

                {/* Header */}
                <motion.div variants={itemVariants} className="text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-gray-200 backdrop-blur-md text-xs font-medium text-purple-600 shadow-sm">
                        <Sparkles className="w-3 h-3" />
                        <span>Powered by Virezo AI</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-gray-900">
                        Product Video Ad
                    </h1>
                    <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
                        Upload your product, generate frames, and let AI animate it. <br />
                        <span className="text-gray-400 text-sm">Product-Centric Frame Generation.</span>
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
                <motion.div variants={itemVariants} className="w-full bg-white border border-gray-200 shadow-xl rounded-[2rem] p-6 md:p-10 relative overflow-hidden group">


                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 relative z-10">
                        {/* Start Slot */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-bold text-gray-500 uppercase">2. Start Frame</label>
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
                                <label className="text-xs font-bold text-gray-500 uppercase">3. End Frame</label>
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

                    {/* Aspect Ratio Selector */}
                    <div className="mt-8 space-y-4">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Aspect Ratio</label>
                        <div className="flex bg-gray-100 p-1 rounded-xl w-fit">
                            <button
                                onClick={() => setAspectRatio("9:16")}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${aspectRatio === "9:16" ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                            >
                                9:16 (Vertical)
                            </button>
                            <button
                                onClick={() => setAspectRatio("16:9")}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${aspectRatio === "16:9" ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                            >
                                16:9 (Landscape)
                            </button>
                        </div>
                    </div>

                    {/* Prompt Section */}
                    <div className="mt-8 space-y-4">
                        <div className="relative group/input">
                            <input
                                type="text"
                                placeholder="Describe the motion... (e.g., 'Cinematic slow zoom, product rotating')"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                className="relative w-full px-6 py-4 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-lg shadow-sm"
                            />
                        </div>
                    </div>

                    {/* Gravity Slider (Physics) */}
                    <div className="mt-6 bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                        <div className="flex justify-between items-center mb-3">
                            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-purple-600" />
                                Antigravity Intensity (Physics)
                            </label>
                            <span className="text-xs font-mono bg-purple-100 text-purple-700 px-2 py-1 rounded">
                                {(gravityIntensity * 100).toFixed(0)}%
                            </span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={gravityIntensity}
                            onChange={(e) => setGravityIntensity(parseFloat(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                        />
                        <div className="flex justify-between text-[10px] text-gray-400 mt-2 font-medium uppercase tracking-wider">
                            <span>Standard Gravity</span>
                            <span>Zero Gravity</span>
                        </div>
                    </div>

                    {/* Action Button */}
                    <div className="mt-8">
                        <button
                            onClick={handleGenerateVideo}
                            disabled={isLoading}
                            className="w-full py-5 rounded-xl bg-primary text-white font-bold text-xl shadow-lg hover:shadow-xl hover:bg-primary/90 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-3 relative overflow-hidden"
                        >
                            {/* Gradient Overlay on Hover */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-1000" />

                            {isLoading ? (
                                <ProgressDisplay
                                    isProcessing={isLoading}
                                    message={progressMessage || "Generating..."}
                                    startTime={generationStartTime || Date.now()}
                                />
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
