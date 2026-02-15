"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useAdmin } from "./AdminProvider";
import { Edit2, Loader2, Save, X } from "lucide-react";

interface EditableImageProps {
    slug: string;
    id: string; // content key
    src: string; // default src
    alt: string;
    width: number;
    height: number;
    className?: string;
    priority?: boolean;
}

export default function EditableImage({
    slug,
    id,
    src: defaultSrc,
    alt,
    width,
    height,
    className,
    priority = false
}: EditableImageProps) {
    const { isEditMode } = useAdmin();
    const [currentSrc, setCurrentSrc] = useState(defaultSrc);
    const [inputSrc, setInputSrc] = useState(defaultSrc);
    const [isSaving, setIsSaving] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    // Fetch live content
    useEffect(() => {
        fetch(`/api/content?slug=${slug}`)
            .then(res => res.json())
            .then(data => {
                if (data.content && data.content[id]) {
                    setCurrentSrc(data.content[id]);
                    setInputSrc(data.content[id]);
                }
            })
            .catch(err => console.error("CMS Load Error", err));
    }, [slug, id]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const userStr = localStorage.getItem('current_user');
            const user = userStr ? JSON.parse(userStr) : {};

            const res = await fetch('/api/content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    slug,
                    key: id,
                    content: inputSrc,
                    type: 'image',
                    email: user.email
                })
            });

            if (res.ok) {
                setCurrentSrc(inputSrc);
                setIsFocused(false);
            } else {
                alert("Failed to save image");
            }
        } catch (e) {
            console.error(e);
            alert("Error saving image");
        } finally {
            setIsSaving(false);
        }
    };

    if (isEditMode) {
        return (
            <div className={`relative group ${className} border-2 border-transparent border-dashed hover:border-primary/50 rounded-xl overflow-hidden transition-all`}>
                <Image
                    src={currentSrc}
                    alt={alt}
                    width={width}
                    height={height}
                    className={`${className} ${isFocused ? 'opacity-50 blur-sm' : ''}`}
                    priority={priority}
                />

                {/* Edit overlay */}
                <button
                    onClick={() => setIsFocused(true)}
                    className={`absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity ${isFocused ? 'hidden' : ''}`}
                >
                    <Edit2 className="w-8 h-8 text-white drop-shadow-lg" />
                </button>

                {isFocused && (
                    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                        <label className="text-white text-sm font-bold mb-2">Image URL or Upload</label>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;

                                setIsSaving(true);
                                try {
                                    const userStr = localStorage.getItem('current_user');
                                    const user = userStr ? JSON.parse(userStr) : {};

                                    const formData = new FormData();
                                    formData.append('file', file);
                                    formData.append('email', user.email);

                                    const res = await fetch('/api/upload', {
                                        method: 'POST',
                                        body: formData
                                    });

                                    if (!res.ok) {
                                        const errData = await res.json().catch(() => ({}));
                                        throw new Error(errData.error || `Upload failed with status ${res.status}`);
                                    }

                                    const data = await res.json();
                                    setInputSrc(data.url);
                                } catch (err: any) {
                                    console.error(err);
                                    alert(`Error: ${err.message}`);
                                } finally {
                                    setIsSaving(false);
                                }
                            }}
                            className="mb-4 text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
                        />

                        <div className="text-xs text-muted-foreground uppercase tracking-widest mb-2">OR PASTE URL</div>

                        <input
                            type="text"
                            value={inputSrc}
                            onChange={(e) => setInputSrc(e.target.value)}
                            className="w-full bg-card-bg/20 border border-white/20 rounded p-2 text-white text-sm mb-4 focus:outline-none focus:border-primary"
                            placeholder="https://..."
                        />
                        <div className="flex gap-4">
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="px-4 py-2 bg-primary text-white rounded font-bold hover:bg-primary/90 flex items-center gap-2"
                            >
                                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                Save
                            </button>
                            <button
                                onClick={() => { setIsFocused(false); setInputSrc(currentSrc); }}
                                className="px-4 py-2 bg-white/10 text-white rounded font-bold hover:bg-white/20 flex items-center gap-2"
                            >
                                <X className="w-4 h-4" />
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <Image
            src={currentSrc}
            alt={alt}
            width={width}
            height={height}
            className={className}
            priority={priority}
        />
    );
}
