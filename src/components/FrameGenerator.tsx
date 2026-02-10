"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Wand2, Check, Upload, Image as ImageIcon } from "lucide-react";

interface FrameGeneratorProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (imageUrl: string) => void;
    contextImage?: string | null; // URL of the Start Frame (for consistency)
}

export default function FrameGenerator({ isOpen, onClose, onSelect, contextImage }: FrameGeneratorProps) {
    const [prompt, setPrompt] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [internalProductImage, setInternalProductImage] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleGenerate = async () => {
        if (!prompt) return;
        setIsGenerating(true);
        setGeneratedImage(null);

        try {
            // Determine reference image
            let referenceImageBase64 = null;

            if (contextImage) {
                // Context mode (End Frame generation using Start Frame)
                if (contextImage.startsWith('data:')) {
                    referenceImageBase64 = contextImage;
                } else {
                    const response = await fetch(contextImage);
                    const blob = await response.blob();
                    referenceImageBase64 = await new Promise<string>((resolve) => {
                        const reader = new FileReader();
                        reader.onload = (e) => resolve(e.target?.result as string);
                        reader.readAsDataURL(blob);
                    });
                }
            } else if (internalProductImage) {
                // Product mode (Start Frame generation using Uploaded Product)
                referenceImageBase64 = await new Promise<string>((resolve) => {
                    const reader = new FileReader();
                    reader.onload = (e) => resolve(e.target?.result as string);
                    reader.readAsDataURL(internalProductImage);
                });
            }

            const response = await fetch("/api/generate-image", {
                method: "POST",
                body: JSON.stringify({
                    prompt,
                    image: referenceImageBase64
                }),
                headers: { "Content-Type": "application/json" }
            });

            const data = await response.json();

            if (data.success && data.raw?.url) {
                setGeneratedImage(data.raw.url);
            } else {
                alert("Generation failed: " + (data.error || "Unknown error"));
            }
        } catch (e) {
            alert("Failed to connect to Generator API");
        } finally {
            setIsGenerating(false);
        }
    };

    // Reset state when closing
    const handleClose = () => {
        setGeneratedImage(null);
        onClose();
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 max-w-4xl w-full flex flex-col gap-6 shadow-2xl relative overflow-hidden"
                    >
                        {/* Product Context Glow */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-[80px] pointer-events-none" />

                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-2xl font-bold flex items-center gap-2">
                                    <Wand2 className="w-6 h-6 text-yellow-500" />
                                    AI Frame Generator
                                </h3>
                                <p className="text-sm text-gray-500">
                                    {contextImage
                                        ? "Creating End Frame (Consistent with Start Frame)"
                                        : "Creating Start Frame (Upload Product to Start)"}
                                </p>
                            </div>
                            <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="flex flex-col md:flex-row gap-6">
                            {/* Left Column: Reference & Input */}
                            <div className="flex-1 space-y-4">

                                {/* Reference Image Section */}
                                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-3">
                                        Reference Image
                                    </label>

                                    {contextImage ? (
                                        // Case 1: Context Image (Locked)
                                        <div className="relative aspect-video rounded-lg overflow-hidden border border-accent/30">
                                            <img src={contextImage} alt="Context" className="w-full h-full object-cover opacity-80" />
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                                <span className="text-xs font-bold text-black bg-accent px-3 py-1 rounded-full border border-yellow-500/20">
                                                    Start Frame Locked
                                                </span>
                                            </div>
                                        </div>
                                    ) : (
                                        // Case 2: Product Upload (Mutable)
                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            className="relative aspect-video rounded-lg border-2 border-dashed border-gray-200 hover:border-accent/50 hover:bg-white/50 transition-all cursor-pointer flex flex-col items-center justify-center gap-2 group"
                                        >
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                className="hidden"
                                                accept="image/*"
                                                onChange={(e) => e.target.files && setInternalProductImage(e.target.files[0])}
                                            />
                                            {internalProductImage ? (
                                                <>
                                                    <img
                                                        src={URL.createObjectURL(internalProductImage)}
                                                        alt="Product"
                                                        className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity"
                                                    />
                                                    <div className="z-10 bg-black/60 px-3 py-1 rounded-full flex items-center gap-2">
                                                        <Check className="w-3 h-3 text-green-400" />
                                                        <span className="text-xs text-white">Product Loaded</span>
                                                    </div>
                                                    <p className="z-10 text-[10px] text-gray-400">Click to change</p>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="p-3 bg-white/10 rounded-full group-hover:bg-yellow-500/20 transition-colors">
                                                        <Upload className="w-5 h-5 text-gray-400 group-hover:text-yellow-500" />
                                                    </div>
                                                    <span className="text-sm text-gray-400 font-medium">Upload Product</span>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Prompt Input */}
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Prompt</label>
                                    <textarea
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                        className="w-full h-24 bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-900 focus:outline-none focus:border-accent/50 resize-none transition-colors"
                                        placeholder={contextImage
                                            ? "Describe how the scene transforms... (e.g. 'Camera zooms out, waves splashing')"
                                            : "Describe the scene with your product... (e.g. 'Product on a wooden table, sunlight')"}
                                    />
                                </div>

                                <button
                                    onClick={handleGenerate}
                                    disabled={!prompt || isGenerating}
                                    className="w-full py-3 bg-gradient-to-r from-accent to-yellow-500 text-black font-bold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-accent/20"
                                >
                                    {isGenerating ? "Generating..." : "Generate Frame"}
                                </button>
                            </div>

                            {/* Right Column: Preview */}
                            <div className="flex-1 flex flex-col gap-4">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Result</label>
                                <div className="aspect-video bg-gray-50 rounded-xl border border-gray-200 overflow-hidden relative group">
                                    {generatedImage ? (
                                        <img src={generatedImage} alt="Generated" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-600 gap-2">
                                            <ImageIcon className="w-8 h-8 opacity-20" />
                                            <span className="text-sm">Preview will appear here</span>
                                        </div>
                                    )}
                                    {isGenerating && (
                                        <div className="absolute inset-0 bg-white/60 flex items-center justify-center backdrop-blur-sm">
                                            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={() => {
                                        if (generatedImage) {
                                            onSelect(generatedImage);
                                            handleClose();
                                        }
                                    }}
                                    disabled={!generatedImage}
                                    className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <Check className="w-4 h-4" />
                                    Use This Frame
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
