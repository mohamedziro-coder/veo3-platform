"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface ImageUploadProps {
    label: string;
    onImageSelect: (file: File | null) => void;
    selectedImage: File | null;
    externalImageUrl?: string | null;
}

export default function ImageUpload({ label, onImageSelect, selectedImage, externalImageUrl }: ImageUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            onImageSelect(e.dataTransfer.files[0]);
        }
    };

    const handleClick = () => {
        inputRef.current?.click();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onImageSelect(e.target.files[0]);
        }
    };

    const removeImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        onImageSelect(null);
        // Reset input value to allow selecting same file again
        if (inputRef.current) inputRef.current.value = "";
    };

    return (
        <div className="flex flex-col gap-3 w-full group/upload">
            <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-gray-300 ml-1 tracking-wide uppercase text-xs">{label}</label>
                {selectedImage && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                        Ready
                    </span>
                )}
            </div>

            <motion.div
                whileHover={{ scale: 1.01, borderColor: "rgba(168, 85, 247, 0.4)" }}
                whileTap={{ scale: 0.99 }}
                onClick={handleClick}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                    "relative h-56 w-full cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300 flex items-center justify-center overflow-hidden bg-black/20 backdrop-blur-sm",
                    isDragging ? "border-purple-500 bg-purple-500/10 shadow-[0_0_30px_rgba(168,85,247,0.2)]" : "border-white/10 hover:bg-white/5",
                    selectedImage ? "border-transparent" : ""
                )}
            >
                <input
                    type="file"
                    ref={inputRef}
                    onChange={handleChange}
                    accept="image/*"
                    className="hidden"
                />

                <AnimatePresence mode="wait">
                    {(selectedImage || externalImageUrl) ? (
                        <motion.div
                            key="preview"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="relative w-full h-full"
                        >
                            <Image
                                src={selectedImage ? URL.createObjectURL(selectedImage) : (externalImageUrl || "")}
                                alt="Selected"
                                fill
                                className="object-cover transition-transform duration-700 group-hover/upload:scale-110"
                                unoptimized={!!externalImageUrl}
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover/upload:bg-black/20 transition-colors duration-300" />

                            <motion.button
                                whileHover={{ scale: 1.1, backgroundColor: "rgba(0,0,0,0.8)" }}
                                whileTap={{ scale: 0.9 }}
                                onClick={removeImage}
                                className="absolute top-3 right-3 p-2 bg-black/50 rounded-full transition-colors border border-white/20 z-10"
                            >
                                <X className="w-4 h-4 text-white" />
                            </motion.button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="placeholder"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center gap-4 text-gray-500 group-hover/upload:text-purple-300 transition-colors"
                        >
                            <div className="p-4 rounded-full bg-white/5 border border-white/5 group-hover/upload:border-purple-500/30 group-hover/upload:bg-purple-500/10 transition-all duration-300">
                                <Upload className="w-8 h-8" />
                            </div>
                            <div className="text-center space-y-1">
                                <p className="text-sm font-medium text-gray-300">Click to upload</p>
                                <p className="text-xs text-gray-600">JPG, PNG (Max 5MB)</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
