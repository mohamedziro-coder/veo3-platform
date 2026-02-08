"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";
import ActorLibrary from "@/components/ActorLibrary";

export default function ActorStudioPage() {
    const router = useRouter();

    useEffect(() => {
        const user = localStorage.getItem('current_user');
        if (!user) {
            router.push('/login');
        }
    }, [router]);

    return (
        <main className="min-h-screen bg-black text-white pt-24 px-6 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-green-900/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">

                {/* Header */}
                <div className="flex items-center gap-6 mb-12">
                    <Link href="/dashboard" className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-gray-400 hover:text-white">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold flex items-center gap-3">
                            <ShieldCheck className="w-10 h-10 text-green-400" />
                            Actor Studio
                        </h1>
                        <p className="text-gray-400 text-lg mt-2">Manage your consistent AI personas and upload custom characters.</p>
                    </div>
                </div>

                {/* Inline Actor Library */}
                <ActorLibrary
                    isOpen={true}
                    onClose={() => { }}
                    onSelect={(actor) => {
                        // In studio mode, selection might just confirm, or edit details (future).
                        // For now, maybe just an alert or nothing.
                        alert(`Selected ${actor.name} (ID: ${actor.id})`);
                    }}
                    isInline={true}
                />

            </div>
        </main>
    );
}
