"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Video, Image as ImageIcon, Mic, ArrowRight, Sparkles, ShieldCheck } from "lucide-react";

import Modal from "@/components/Modal";

export default function Dashboard() {
    const router = useRouter();

    // All hooks must be declared BEFORE any conditional return
    const [isAdmin, setIsAdmin] = useState(false);
    const [userName, setUserName] = useState("Creator");
    const [activities, setActivities] = useState<any[]>([]);
    const [generationCount, setGenerationCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedActivity, setSelectedActivity] = useState<any>(null);

    useEffect(() => {
        const userStr = localStorage.getItem('current_user');
        if (!userStr) {
            router.push('/login');
            return;
        }

        const user = JSON.parse(userStr);
        // ... existing auth logic ...
        setUserName(user.name || "Creator");
        setIsAdmin(user.role === 'admin');

        // Fetch User Activity
        const allActivities = JSON.parse(localStorage.getItem('mock_activity') || '[]');
        const userActivities = allActivities.filter((a: any) => a.email === user.email);
        setActivities(userActivities.slice(0, 5)); // Show last 5
        setGenerationCount(userActivities.length);

        setIsLoading(false);
    }, [router]);

    // Show loading state while checking auth (AFTER all hooks)
    if (isLoading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
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

    // ... existing variants and tools definitions ...

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring" as const,
                bounce: 0.3
            }
        }
    };

    const tools = [
        {
            title: "Video Generator",
            desc: "Transform images into cinematic videos using Veo 3.0 AI.",
            href: "/video",
            icon: Video,
            color: "purple"
        },
        {
            title: "Nanbanana Image",
            desc: "Generate ultra-realistic images with Gemini 2.5 Flash.",
            href: "/nanbanana",
            icon: ImageIcon,
            color: "yellow"
        },
        {
            title: "Voice Studio",
            desc: "Professional Text-to-Speech in multiple languages.",
            href: "/voice",
            icon: Mic,
            color: "blue"
        },
        {
            title: "Actor Studio",
            desc: "Manage consistent AI characters & personas.",
            href: "/actor",
            icon: ShieldCheck,
            color: "green"
        }
    ];

    const adminTool = {
        title: "Admin Panel",
        desc: "Manage platform users and view usage statistics.",
        href: "/admin",
        icon: Sparkles,
        color: "red"
    };

    const displayTools = isAdmin ? [...tools, adminTool] : tools;

    return (
        <main className="min-h-screen bg-black text-white pt-24 px-6 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[100px]" />
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-7xl mx-auto relative z-10"
            >
                {/* Welcome Header */}
                <motion.div variants={itemVariants} className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-2">
                        Welcome back, <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">{userName}</span>
                        <span className="ml-4 text-sm bg-white/5 border border-white/10 px-3 py-1 rounded-full text-gray-400 font-normal">
                            {generationCount} Generations
                        </span>
                    </h1>
                    <p className="text-gray-400 text-lg">Select a tool to start generating content.</p>
                </motion.div>

                {/* Tools Grid */}
                <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {displayTools.map((tool, i) => (
                        <Link key={i} href={tool.href} className="group">
                            <motion.div
                                variants={itemVariants}
                                className={`h-full glass-panel p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-${tool.color}-500/50 transition-all duration-300 relative overflow-hidden`}
                            >
                                <div className={`absolute top-0 right-0 p-32 bg-${tool.color}-500/10 blur-[80px] group-hover:bg-${tool.color}-500/20 transition-colors opacity-0 group-hover:opacity-100 duration-500`} />
                                <div className="relative z-10 space-y-6">
                                    <div className={`w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-${tool.color}-300 group-hover:scale-110 transition-transform`}>
                                        <tool.icon className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold mb-2 group-hover:text-white transition-colors">{tool.title}</h3>
                                        <p className="text-gray-400 leading-relaxed text-sm">{tool.desc}</p>
                                    </div>
                                    <div className={`flex items-center text-${tool.color}-400 font-medium group-hover:gap-2 transition-all`}>
                                        <span>Launch App</span>
                                        <ArrowRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </motion.div>

                <motion.div variants={itemVariants} className="mt-12 glass-panel p-6 rounded-3xl border border-white/10">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-yellow-400" />
                            Recent Activity
                        </h3>
                        <span className="text-xs text-gray-500 uppercase tracking-wider">Your Latest Actions</span>
                    </div>

                    <div className="space-y-3">
                        {activities.length > 0 ? (
                            activities.map((act, i) => (
                                <div
                                    key={i}
                                    onClick={() => setSelectedActivity(act)}
                                    className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/20 hover:bg-white/10 transition-all cursor-pointer group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${act.tool === 'Video' ? 'text-purple-400' :
                                            act.tool === 'Image Generation' ? 'text-yellow-400' : 'text-blue-400'
                                            }`}>
                                            <Sparkles className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-white group-hover:text-purple-300 transition-colors">{act.details}</p>
                                            <p className="text-xs text-gray-500">{act.tool} • {new Date(act.timestamp).toLocaleTimeString()}</p>
                                        </div>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
                                </div>
                            ))
                        ) : (
                            <div className="h-32 flex items-center justify-center text-gray-500 bg-white/5 rounded-2xl border border-dashed border-white/10">
                                No recent generations found. Start creating!
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>

            {/* Activity Details Modal */}
            <Modal
                isOpen={!!selectedActivity}
                onClose={() => setSelectedActivity(null)}
                title={selectedActivity?.tool === 'Video' ? 'Video Details' : 'Image Details'}
            >
                {selectedActivity && (
                    <div className="space-y-6">
                        {/* Media Preview */}
                        <div className="rounded-xl overflow-hidden border border-white/10 bg-black/50 aspect-video flex items-center justify-center">
                            {selectedActivity.tool === 'Video' && selectedActivity.resultUrl ? (
                                <video
                                    src={selectedActivity.resultUrl}
                                    controls
                                    className="w-full h-full object-contain"
                                    autoPlay
                                    loop
                                />
                            ) : selectedActivity.resultUrl ? (
                                <img
                                    src={selectedActivity.resultUrl}
                                    alt="Generated"
                                    className="w-full h-full object-contain"
                                />
                            ) : (
                                <div className="text-gray-500 flex flex-col items-center gap-2">
                                    <Sparkles className="w-8 h-8 opacity-20" />
                                    <span>Preview not available</span>
                                </div>
                            )}
                        </div>

                        {/* Details */}
                        <div className="space-y-4">
                            <div>
                                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Prompt</h4>
                                <p className="text-white bg-white/5 p-4 rounded-xl border border-white/10 text-sm leading-relaxed">
                                    {selectedActivity.prompt || selectedActivity.details}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Date</h4>
                                    <p className="text-white text-sm">{new Date(selectedActivity.timestamp).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Time</h4>
                                    <p className="text-white text-sm">{new Date(selectedActivity.timestamp).toLocaleTimeString()}</p>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-4">
                            {selectedActivity.resultUrl && (
                                <a
                                    href={selectedActivity.resultUrl}
                                    download
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 bg-white text-black font-bold py-3 rounded-xl text-center hover:bg-gray-200 transition-colors"
                                >
                                    Download
                                </a>
                            )}
                            <button
                                onClick={() => setSelectedActivity(null)}
                                className="flex-1 bg-white/10 text-white font-bold py-3 rounded-xl hover:bg-white/20 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </main>
    );
}
