"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
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
        const loadUserData = async () => {
            const userStr = localStorage.getItem('current_user');
            if (!userStr) {
                router.push('/login');
                return;
            }

            try {
                const user = JSON.parse(userStr);
                setUserName(user.name || "Creator");
                setIsAdmin(user.role === 'admin');

                // Fetch User Activity from Database
                const activityResponse = await fetch(`/api/activity?email=${encodeURIComponent(user.email)}`);
                const activityData = await activityResponse.json();

                if (activityData.success && activityData.activities) {
                    const userActivities = activityData.activities;
                    setActivities(userActivities.slice(0, 5));
                    setGenerationCount(userActivities.length);
                } else {
                    // Fallback to empty if API fails
                    setActivities([]);
                    setGenerationCount(0);
                }
            } catch (e) {
                console.error("Error loading user data", e);
                setActivities([]);
                setGenerationCount(0);
            }
            setIsLoading(false);
        };

        loadUserData();

        // Listen for storage updates (triggered by Navigation sync)
        window.addEventListener('storage', loadUserData);
        // Custom event if we want to force update
        window.addEventListener('user-updated', loadUserData);
        window.addEventListener('activity-updated', loadUserData);

        return () => {
            window.removeEventListener('storage', loadUserData);
            window.removeEventListener('user-updated', loadUserData);
            window.removeEventListener('activity-updated', loadUserData);
        };
    }, [router]);

    // Show loading state while checking auth (AFTER all hooks)
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
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
        <main className="min-h-screen bg-gray-50 text-gray-900 pt-24 px-6 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[100px]" />
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
                        Welcome back, <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">{userName}</span>
                        <span className="ml-4 text-sm bg-white border border-gray-200 px-3 py-1 rounded-full text-gray-500 font-normal">
                            {generationCount} Generations
                        </span>
                    </h1>
                    <p className="text-gray-500 text-lg">Select a tool to start generating content.</p>
                </motion.div>

                {/* Tools Grid */}
                <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {displayTools.map((tool, i) => (
                        <Link key={i} href={tool.href} className="group">
                            <motion.div
                                variants={itemVariants}
                                className={`h-full glass-panel p-8 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-${tool.color}-500/30 transition-all duration-300 relative overflow-hidden`}
                            >
                                <div className={`absolute top-0 right-0 p-32 bg-${tool.color}-500/5 blur-[80px] group-hover:bg-${tool.color}-500/10 transition-colors opacity-0 group-hover:opacity-100 duration-500`} />
                                <div className="relative z-10 space-y-6">
                                    <div className={`w-14 h-14 rounded-2xl bg-${tool.color}-500/10 flex items-center justify-center text-${tool.color}-600 group-hover:scale-110 transition-transform`}>
                                        <tool.icon className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold mb-2 text-gray-900 group-hover:text-primary transition-colors">{tool.title}</h3>
                                        <p className="text-gray-500 leading-relaxed text-sm">{tool.desc}</p>
                                    </div>
                                    <div className={`flex items-center text-${tool.color}-600 font-medium group-hover:gap-2 transition-all`}>
                                        <span>Launch App</span>
                                        <ArrowRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </motion.div>

                <motion.div variants={itemVariants} className="mt-12 glass-panel p-6 rounded-3xl border border-gray-100 bg-white shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold flex items-center gap-2 text-gray-900">
                            <Sparkles className="w-5 h-5 text-accent" />
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
                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-primary/20 hover:bg-white hover:shadow-md transition-all cursor-pointer group"
                                >
                                    <div className="flex items-center gap-4">
                                        {/* Thumbnail or Icon */}
                                        {act.resultUrl ? (
                                            <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-200 relative">
                                                {act.tool === 'Video' ? (
                                                    <video src={act.resultUrl} className="w-full h-full object-cover" muted playsInline />
                                                ) : (
                                                    <Image
                                                        src={act.resultUrl}
                                                        alt="Thumbnail"
                                                        fill
                                                        className="object-cover"
                                                        sizes="48px"
                                                    />
                                                )}
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                            </div>
                                        ) : (
                                            <div className={`w-12 h-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center ${act.tool === 'Video' ? 'text-purple-500' :
                                                act.tool === 'Image Generation' ? 'text-yellow-500' : 'text-blue-500'
                                                }`}>
                                                <Sparkles className="w-5 h-5" />
                                            </div>
                                        )}

                                        <div>
                                            <p className="text-sm font-medium text-gray-900 group-hover:text-primary transition-colors line-clamp-1">{act.details || act.prompt}</p>
                                            <p className="text-xs text-gray-500">{act.tool} • {new Date(act.timestamp).toLocaleTimeString()}</p>
                                        </div>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                </div>
                            ))
                        ) : (
                            <div className="h-32 flex items-center justify-center text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
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
                title={selectedActivity?.tool || 'Activity Details'}
            >
                {selectedActivity && (
                    <div className="space-y-4">
                        {/* Activity Info */}
                        <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                            <div className="flex items-center gap-2">
                                <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-lg ${selectedActivity.tool === 'Video' ? 'bg-purple-100 text-purple-700' :
                                    selectedActivity.tool === 'Image' ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-blue-100 text-blue-700'
                                    }`}>
                                    {selectedActivity.tool}
                                </span>
                                <span className="text-xs text-gray-400">
                                    {new Date(selectedActivity.timestamp).toLocaleString()}
                                </span>
                            </div>

                            <div>
                                <h4 className="text-sm font-semibold text-gray-700 mb-1">Details</h4>
                                <p className="text-sm text-gray-900">{selectedActivity.details}</p>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </main>
    );
}
