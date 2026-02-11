"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

interface ProgressDisplayProps {
    isProcessing: boolean;
    message: string;
    startTime: number;
}

export default function ProgressDisplay({ isProcessing, message, startTime }: ProgressDisplayProps) {
    const [elapsed, setElapsed] = useState(0);

    useEffect(() => {
        if (!isProcessing || startTime === 0) {
            setElapsed(0);
            return;
        }

        // Update elapsed time every second
        const interval = setInterval(() => {
            setElapsed(Math.floor((Date.now() - startTime) / 1000));
        }, 1000);

        return () => clearInterval(interval);
    }, [isProcessing, startTime]);

    if (!isProcessing) return null;

    return (
        <div className="flex flex-col items-center gap-2 w-full">
            <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                <span className="tracking-wide text-sm font-medium">{message}</span>
            </div>
            {elapsed > 0 && (
                <span className="text-xs opacity-70 font-mono bg-gray-100 px-2 py-0.5 rounded-full">
                    {Math.floor(elapsed / 60)}:{(elapsed % 60).toString().padStart(2, '0')} elapsed
                </span>
            )}
        </div>
    );
}
