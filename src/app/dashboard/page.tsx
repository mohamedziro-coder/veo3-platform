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

    // Download handler function
    const handleDownload = async (url: string, filename: string) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Clean up
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error('Download failed:', error);
            // Fallback: create direct link click (better than window.open for downloads)
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

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
                    // Normalize field names (database returns result_url, we want resultUrl)
                    const userActivities = activityData.activities.map((act: any) => ({
                        ...act,
                        resultUrl: act.result_url || act.resultUrl
                    }));
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
            desc: "Transform images into cinematic videos using Virezo AI.",
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
                <motion.div
                    animate={{
                        x: [0, 50, 0],
                        y: [0, 30, 0],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{
                        x: [0, -40, 0],
                        y: [0, 50, 0],
                        scale: [1, 1.2, 1]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px]"
                />
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
                        <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", delay: 0.5 }}
                            className="ml-4 text-sm bg-white border border-gray-200 px-3 py-1 rounded-full text-gray-500 font-normal inline-block"
                        >
                            {generationCount} Generations
                        </motion.span>
                    </h1>
                    <p className="text-gray-500 text-lg">Select a tool to start generating content.</p>
                </motion.div>

                {/* Tools Grid */}
                <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {displayTools.map((tool, i) => (
                        <Link key={i} href={tool.href} className="group">
                            <motion.div
                                variants={itemVariants}
                                whileHover={{ scale: 1.02, y: -5 }}
                                whileTap={{ scale: 0.98 }}
                                className={`h-full glass-panel p-8 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:border-${tool.color}-500/30 transition-all duration-300 relative overflow-hidden`}
                            >
                                <div className={`absolute top-0 right-0 p-32 bg-${tool.color}-500/10 blur-[80px] group-hover:bg-${tool.color}-500/20 transition-colors opacity-0 group-hover:opacity-100 duration-500`} />
                                <div className="relative z-10 space-y-6">
                                    <div className={`w-14 h-14 rounded-2xl bg-${tool.color}-500/10 flex items-center justify-center text-${tool.color}-600 group-hover:bg-${tool.color}-500 group-hover:text-white transition-all duration-300`}>
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

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {activities.length > 0 ? (
                            activities.map((act, i) => (
                                <div
                                    key={i}
                                    onClick={() => setSelectedActivity(act)}
                                    className="group relative aspect-square rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 cursor-pointer hover:shadow-lg transition-all"
                                >
                                    {/* Media Preview */}
                                    {act.resultUrl ? (
                                        act.tool === 'Video' ? (
                                            <video src={act.resultUrl} className="w-full h-full object-cover" muted loop playsInline />
                                        ) : (
                                            <Image
                                                src={act.resultUrl}
                                                alt="Generated Content"
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                sizes="(max-width: 768px) 50vw, 33vw"
                                            />
                                        )
                                    ) : (
                                        <div className={`w-full h-full flex flex-col items-center justify-center p-4 text-center gap-2 ${act.tool === 'Video' ? 'bg-purple-50 text-purple-500' :
                                            act.tool === 'Image Generation' ? 'bg-yellow-50 text-yellow-500' : 'bg-blue-50 text-blue-500'
                                            }`}>
                                            <Sparkles className="w-8 h-8 opacity-50" />
                                            <span className="text-xs font-medium opacity-70 line-clamp-2">{act.details}</span>
                                        </div>
                                    )}

                                    {/* Overlay Info */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                                        <p className="text-white text-xs font-medium line-clamp-2 mb-1">{act.details}</p>
                                        <div className="flex items-center justify-between text-white/70 text-[10px]">
                                            <span>{act.tool}</span>
                                            <span>{new Date(act.timestamp).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    {/* Type Badge */}
                                    <div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-black/50 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider">
                                        {act.tool === 'Image Generation' ? 'IMG' : act.tool === 'Video' ? 'VID' : 'AUD'}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full h-40 flex flex-col items-center justify-center text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200 gap-3">
                                <Sparkles className="w-8 h-8 opacity-20" />
                                <p>No creations yet. Start generating!</p>
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
                        {/* Media Preview */}
                        {(selectedActivity.resultUrl || selectedActivity.result_url) && (
                            <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                                {selectedActivity.tool === 'Video' ? (
                                    <video
                                        src={selectedActivity.resultUrl || selectedActivity.result_url}
                                        controls
                                        className="w-full"
                                        playsInline
                                    />
                                ) : (
                                    <div className="relative w-full aspect-video">
                                        <Image
                                            src={selectedActivity.resultUrl || selectedActivity.result_url}
                                            alt="Generated content"
                                            fill
                                            className="object-contain"
                                            sizes="(max-width: 768px) 100vw, 700px"
                                        />
                                    </div>
                                )}
                            </div>
                        )}

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

                        {/* Download Button */}
                        {(selectedActivity.resultUrl || selectedActivity.result_url) && (
                            <button
                                onClick={() => {
                                    const url = selectedActivity.resultUrl || selectedActivity.result_url;
                                    const ext = selectedActivity.tool === 'Video' ? 'mp4' : 'jpg';
                                    const filename = `${selectedActivity.tool.toLowerCase()}_${Date.now()}.${ext}`;
                                    handleDownload(url, filename);
                                }}
                                className="block w-full bg-primary text-white font-bold py-3 rounded-xl text-center hover:bg-primary/90 transition-colors cursor-pointer"
                            >
                                Download {selectedActivity.tool}
                            </button>
                        )}
                    </div>
                )}
            </Modal>
        </main>
    );
}
