"use client";

import { useState, useRef, memo } from "react";
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

function ImageUpload({ label, onImageSelect, selectedImage, externalImageUrl }: ImageUploadProps) {
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
                <label className="text-sm font-semibold text-gray-600 ml-1 tracking-wide uppercase text-xs">{label}</label>
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
                    "relative h-56 w-full cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300 flex items-center justify-center overflow-hidden bg-gray-50/50 backdrop-blur-sm",
                    isDragging ? "border-primary bg-primary/5 shadow-[0_0_30px_rgba(74,144,226,0.1)]" : "border-gray-200 hover:bg-gray-100",
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
                                whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,1)" }}
                                whileTap={{ scale: 0.9 }}
                                onClick={removeImage}
                                className="absolute top-3 right-3 p-2 bg-white/80 rounded-full transition-colors border border-gray-200 z-10 shadow-sm"
                            >
                                <X className="w-4 h-4 text-gray-900" />
                            </motion.button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="placeholder"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center gap-4 text-gray-400 group-hover/upload:text-primary transition-colors"
                        >
                            <div className="p-4 rounded-full bg-white border border-gray-100 group-hover/upload:border-primary/30 group-hover/upload:bg-primary/5 transition-all duration-300 shadow-sm">
                                <Upload className="w-8 h-8" />
                            </div>
                            <div className="text-center space-y-1">
                                <p className="text-sm font-medium text-gray-600">Click to upload</p>
                                <p className="text-xs text-gray-400">JPG, PNG (Max 5MB)</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}

export default memo(ImageUpload);
