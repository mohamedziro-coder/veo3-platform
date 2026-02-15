"use client";

import { useState, useEffect } from "react";
import { useAdmin } from "./AdminProvider";
import { Save, Loader2, X } from "lucide-react";

interface EditableTextProps {
    slug: string;
    id: string; // content key
    defaultContent: string;
    className?: string; // used for text styling
    as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";
    multiline?: boolean;
}

export default function EditableText({
    slug,
    id,
    defaultContent,
    className,
    as: Component = "p",
    multiline = false
}: EditableTextProps) {
    const { isEditMode } = useAdmin();
    const [content, setContent] = useState(defaultContent);
    const [originalContent, setOriginalContent] = useState(content);
    const [isSaving, setIsSaving] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    // Fetch live content on mount
    useEffect(() => {
        fetch(`/api/content?slug=${slug}`)
            .then(res => res.json())
            .then(data => {
                if (data.content && data.content[id]) {
                    setContent(data.content[id]);
                    setOriginalContent(data.content[id]);
                }
            })
            .catch(err => console.error("CMS Load Error", err));
    }, [slug, id]);

    const handleSave = async () => {
        if (content === originalContent) {
            setIsFocused(false);
            return;
        }

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
                    content,
                    type: 'text',
                    email: user.email
                })
            });

            if (res.ok) {
                setOriginalContent(content);
                setIsFocused(false);
            } else {
                alert("Failed to save content");
            }
        } catch (e) {
            console.error(e);
            alert("Error saving content");
        } finally {
            setIsSaving(false);
        }
    };

    if (isEditMode) {
        return (
            <div className={`relative group ${className} min-w-[20px] min-h-[20px] rounded hover:ring-2 hover:ring-primary/50 transition-all cursor-text`} onClick={() => setIsFocused(true)}>
                {isFocused ? (
                    <div className="relative">
                        {multiline ? (
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full bg-card-bg border border-primary rounded p-2 focus:outline-none min-h-[100px]"
                                autoFocus
                            />
                        ) : (
                            <input
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full bg-card-bg border border-primary rounded p-1 focus:outline-none"
                                autoFocus
                            />
                        )}
                        <div className="absolute top-full left-0 mt-2 z-50 flex gap-2 bg-card-bg p-1 rounded shadow-xl border border-card-border">
                            <button
                                onClick={(e) => { e.stopPropagation(); handleSave(); }}
                                className="p-1.5 bg-green-500/10 text-green-500 rounded hover:bg-green-500/20"
                                title="Save"
                            >
                                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setContent(originalContent);
                                    setIsFocused(false);
                                }}
                                className="p-1.5 bg-red-500/10 text-red-500 rounded hover:bg-red-500/20"
                                title="Cancel"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ) : (
                    <Component className="border border-transparent border-dashed hover:border-primary/30">
                        {content}
                    </Component>
                )}
            </div>
        );
    }

    return <Component className={className}>{content}</Component>;
}
