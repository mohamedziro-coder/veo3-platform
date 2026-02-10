"use client";

import { motion } from "framer-motion";
import { Loader2, Play } from "lucide-react";

interface VideoPlayerProps {
    videoUrl: string | null;
    isLoading: boolean;
}

export default function VideoPlayer({ videoUrl, isLoading }: VideoPlayerProps) {
    if (!videoUrl && !isLoading) return null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl aspect-video bg-black rounded-xl overflow-hidden flex items-center justify-center border border-gray-200 shadow-2xl backdrop-blur-md"
        >
            {isLoading ? (
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                    <p className="text-gray-400 text-sm animate-pulse">Key9ad lvideo dyalek...</p>
                </div>
            ) : videoUrl ? (
                <video
                    src={videoUrl}
                    controls
                    autoPlay
                    loop
                    className="w-full h-full object-cover"
                />
            ) : null}
        </motion.div>
    );
}
