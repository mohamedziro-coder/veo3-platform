"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, ShieldCheck, X, Sparkles, UserPlus, Edit2, Download, Save, RefreshCw } from "lucide-react";
import actorsData from "../data/actors.json";

interface Actor {
    id: string;
    name: string;
    role: string;
    bio: string;
    age: number;
    accent: string;
    mannerisms: string;
    masterFrame: string;
    systemPrompt: string;
}

interface ActorLibraryProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (actor: Actor) => void;
    isInline?: boolean; // New prop for inline mode
}

export default function ActorLibrary({ isOpen, onClose, onSelect, isInline = false }: ActorLibraryProps) {
    const [localCustomActors, setLocalCustomActors] = useState<Actor[]>([]); // Changed type to Actor[]
    const customFileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const saved = localStorage.getItem('custom_actors');
        if (saved) setLocalCustomActors(JSON.parse(saved));
    }, []);

    const [editingActor, setEditingActor] = useState<Actor | null>(null);
    const [editPrompt, setEditPrompt] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);

    const handleEditClick = (actor: Actor, e: React.MouseEvent) => {
        e.stopPropagation();
        setEditingActor(actor);
        setEditPrompt(`Keep the same face. Change context to: standing in a futuristic city, neon lights, cyberpunk style.`);
        setGeneratedImage(null);
    };

    const handleGenerateVariation = async () => {
        if (!editPrompt || !editingActor) return;
        setIsGenerating(true);
        setGeneratedImage(null);

        try {
            const response = await fetch("/api/generate-image", {
                method: "POST",
                body: JSON.stringify({
                    prompt: editPrompt,
                    image: editingActor.masterFrame // Send original image for consistency
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
            alert("Failed to connect to Nanbanana API");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSaveVariation = () => {
        if (!generatedImage || !editingActor) return;

        const newActor: Actor = {
            id: `custom-remix-${Date.now()}`,
            name: `${editingActor.name} (Remix)`,
            role: editingActor.role,
            bio: `Remixed version of ${editingActor.name}.`,
            age: editingActor.age,
            accent: editingActor.accent,
            mannerisms: editingActor.mannerisms,
            masterFrame: generatedImage,
            systemPrompt: editingActor.systemPrompt
        };

        const updated = [...localCustomActors, newActor];
        setLocalCustomActors(updated);
        localStorage.setItem('custom_actors', JSON.stringify(updated));
        setEditingActor(null);
        alert("Saved to My Actors!");
    };

    const handleDownload = () => {
        if (!generatedImage) return;
        const link = document.createElement('a');
        link.href = generatedImage;
        link.download = `nanbanana-remix-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleCustomUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });

        const base64 = await toBase64(file);
        const name = prompt("Enter Actor Name:") || "Custom Actor";

        const newActor: Actor = { // Explicitly typed newActor
            id: `custom-${Date.now()}`,
            name: name,
            role: "User Custom",
            bio: "Permanently stored custom consistent actor.",
            age: 0,
            accent: "Custom",
            mannerisms: "Custom",
            masterFrame: base64,
            systemPrompt: `${name}, a consistent character. Natural skin textures, high realism.`
        };

        const updated = [...localCustomActors, newActor];
        setLocalCustomActors(updated);
        localStorage.setItem('custom_actors', JSON.stringify(updated));
    };

    const allActors = [...actorsData, ...localCustomActors];

    const content = (
        <motion.div
            initial={isInline ? { opacity: 0, y: 20 } : { opacity: 0, scale: 0.9, y: 20 }}
            animate={isInline ? { opacity: 1, y: 0 } : { opacity: 1, scale: 1, y: 0 }}
            exit={isInline ? { opacity: 0, y: -20 } : { opacity: 0, scale: 0.9, y: 20 }}
            className={`relative w-full ${isInline ? '' : 'max-w-6xl bg-[#0f0f0f] border border-white/10 rounded-[2.5rem] shadow-2xl max-h-[90vh]'} flex flex-col overflow-hidden bg-[#0f0f0f] border border-white/10 rounded-[2.5rem]`}
        >
            {/* Header */}
            {!isInline && (
                <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                    <div>
                        <h2 className="text-3xl font-bold flex items-center gap-3">
                            <ShieldCheck className="w-8 h-8 text-blue-400" />
                            Consistency Actor Library
                        </h2>
                        <p className="text-gray-400 mt-1">Select a pre-defined persona for perfect face consistency.</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-3 rounded-full hover:bg-white/5 text-gray-400 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>
            )}

            {/* Gallery */}
            <div className={`flex-1 overflow-y-auto p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 scrollbar-hide ${isInline ? 'min-h-[60vh]' : ''}`}>
                {allActors.map((actor) => (
                    <motion.div
                        key={actor.id}
                        whileHover={{ y: -5 }}
                        className="group relative bg-white/[0.03] border border-white/10 rounded-3xl overflow-hidden hover:border-blue-500/50 transition-all"
                    >
                        <div className="aspect-square relative overflow-hidden">
                            <img
                                src={actor.masterFrame}
                                alt={actor.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                            <div className="absolute bottom-4 left-4">
                                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md text-white shadow-lg ${actor.id.startsWith('custom') ? 'bg-purple-600' : 'bg-blue-600'}`}>
                                    {actor.role}
                                </span>
                            </div>
                        </div>

                        <div className="p-5 space-y-4">
                            <div>
                                <h3 className="text-xl font-bold text-white">{actor.name}</h3>
                                <p className="text-xs text-gray-500 italic mt-1 line-clamp-1">{actor.bio}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                                    <p className="text-[10px] text-gray-500 uppercase font-bold">Accent</p>
                                    <p className="text-xs text-blue-300">{actor.accent}</p>
                                </div>
                                <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                                    <p className="text-[10px] text-gray-500 uppercase font-bold">Age</p>
                                    <p className="text-xs text-blue-300">{actor.age > 0 ? `${actor.age} yrs` : 'N/A'}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => onSelect(actor as any)}
                                    className={`flex-1 py-3 rounded-xl ${isInline ? 'bg-white/10 text-gray-300' : 'bg-white text-black'} font-bold text-sm hover:bg-blue-500 hover:text-white transition-all transform active:scale-95 flex items-center justify-center gap-2`}
                                >
                                    <Sparkles className="w-4 h-4" />
                                    {isInline ? 'Select' : 'Select'}
                                </button>
                                <button
                                    onClick={(e) => handleEditClick(actor, e)}
                                    className="p-3 rounded-xl bg-white/10 text-white hover:bg-yellow-500 hover:text-black transition-all"
                                    title="Remix with Nanbanana"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}

                {/* EDITING OVERLAY */}
                <AnimatePresence>
                    {editingActor && (
                        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="bg-[#111] border border-white/10 rounded-3xl p-6 md:p-8 max-w-4xl w-full flex flex-col md:flex-row gap-8"
                            >
                                {/* Left: Preview */}
                                <div className="flex-1 space-y-4">
                                    <h3 className="text-2xl font-bold flex items-center gap-2">
                                        <span className="text-yellow-400">Nanbanana</span> Studio
                                    </h3>
                                    <div className="aspect-square rounded-2xl overflow-hidden bg-black border border-white/10 relative group">
                                        <img
                                            src={generatedImage || editingActor.masterFrame}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                        {isGenerating && (
                                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
                                            </div>
                                        )}
                                        {generatedImage && (
                                            <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={handleDownload} className="p-2 bg-black/50 text-white rounded-lg hover:bg-white hover:text-black transition-colors">
                                                    <Download className="w-5 h-5" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Right: Controls */}
                                <div className="flex-1 flex flex-col gap-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="text-lg font-bold">{editingActor.name}</h4>
                                            <p className="text-xs text-gray-500">Editing Master Frame</p>
                                        </div>
                                        <button onClick={() => setEditingActor(null)} className="p-2 hover:bg-white/10 rounded-full">
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <div className="flex-1">
                                        <label className="text-xs text-gray-500 uppercase font-bold tracking-wider">Prompt</label>
                                        <textarea
                                            value={editPrompt}
                                            onChange={(e) => setEditPrompt(e.target.value)}
                                            className="w-full h-32 mt-2 bg-white/5 border border-white/10 rounded-xl p-4 text-sm focus:outline-none focus:border-yellow-500/50 transition-colors resize-none"
                                            placeholder="Describe the new look..."
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 mt-auto">
                                        <button
                                            onClick={handleGenerateVariation}
                                            disabled={isGenerating}
                                            className="py-4 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                                        >
                                            {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                                            {generatedImage ? "Regenerate" : "Generate"}
                                        </button>
                                        <button
                                            onClick={handleSaveVariation}
                                            disabled={!generatedImage}
                                            className="py-4 bg-white/10 hover:bg-white hover:text-black text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <Save className="w-4 h-4" />
                                            Save as Actor
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Add Custom Slot */}
                <div
                    onClick={() => customFileInputRef.current?.click()}
                    className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-3xl bg-white/[0.01] p-8 text-center gap-4 hover:border-blue-500/30 transition-colors cursor-pointer group min-h-[300px]"
                >
                    <input
                        type="file"
                        ref={customFileInputRef}
                        onChange={handleCustomUpload}
                        className="hidden"
                        accept="image/*"
                    />
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-gray-500 group-hover:text-blue-400 group-hover:bg-blue-500/10 transition-all">
                        <UserPlus className="w-8 h-8" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-400 group-hover:text-white transition-colors">Custom Actor</h3>
                        <p className="text-xs text-gray-600 mt-1">Upload your own Master Frame</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );

    if (isInline) {
        return content;
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-xl"
                    />
                    {content}
                </div>
            )}
        </AnimatePresence>
    );
}
