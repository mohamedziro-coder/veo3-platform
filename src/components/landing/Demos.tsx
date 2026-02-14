"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play } from "lucide-react";
import Link from "next/link";

interface Demo {
    id: number;
    title: string;
    video: string;
    thumbnail: string;
}

interface DemosProps {
    demos: Demo[];
}

export default function Demos({ demos }: DemosProps) {
    const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

    return (
        <section className="py-48 px-6 max-w-[1400px] mx-auto" id="demos">
            <div className="text-center mb-24 space-y-6">
                <h2 className="text-5xl md:text-7xl font-black text-foreground mb-8 tracking-tight leading-[1]">Made with Virezo</h2>
                <p className="text-xl md:text-2xl text-muted-foreground font-medium">See what others are building right now.</p>
            </div>

            <div className="relative overflow-hidden py-16 -mx-6 md:-mx-12 cursor-grab active:cursor-grabbing">
                {/* Faded edges (Grand Scale) */}
                <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

                <motion.div
                    className="flex gap-8 w-max px-6"
                    animate={{
                        x: ["0%", "-50%"]
                    }}
                    transition={{
                        duration: 35,
                        ease: "linear",
                        repeat: Infinity
                    }}
                    style={{ willChange: "transform" }}
                    whileHover={{ transition: { duration: 70 } }} // Slow down on hover
                >
                    {[...demos, ...demos].map((demo, index) => (
                        <motion.div
                            key={`${demo.id}-${index}`}
                            whileHover={{ y: -15, scale: 1.05 }}
                            onClick={() => setSelectedVideo(demo.video)}
                            className="w-[320px] aspect-[9/16] bg-muted rounded-[2.5rem] relative group overflow-hidden cursor-pointer shadow-xl hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.4)] transition-all duration-500 border border-card-border"
                        >
                            {/* Video Preview */}
                            <video
                                src={demo.video}
                                poster={demo.thumbnail}
                                muted
                                autoPlay
                                loop
                                playsInline
                                className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000"
                            />

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black/5 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                                <div className="w-20 h-20 bg-white/95 backdrop-blur rounded-full flex items-center justify-center shadow-2xl transform scale-90 group-hover:scale-100 transition-transform duration-500">
                                    <Play className="w-8 h-8 text-primary ml-1.5 fill-current" />
                                </div>
                            </div>
                            <div className="absolute bottom-8 left-8 right-8 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                <span className="bg-white/95 backdrop-blur text-xs font-black tracking-[0.2em] uppercase px-6 py-3 rounded-full text-gray-900 shadow-xl block text-center">
                                    {demo.title}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            <div className="text-center mt-20">
                <Link href="/signup" className="inline-flex px-12 py-6 rounded-2xl bg-primary/5 text-primary border border-primary/20 font-black text-xl hover:bg-primary hover:text-white transition-all transform hover:-translate-y-1 shadow-lg active:scale-95">
                    Generate Yours Now
                </Link>
            </div>

            {/* Video Modal */}
            <AnimatePresence>
                {selectedVideo && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
                        onClick={() => setSelectedVideo(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="relative w-full max-w-sm aspect-[9/16] bg-black rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10"
                            onClick={(e: React.MouseEvent) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setSelectedVideo(null)}
                                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/70 transition-colors border border-white/10"
                            >
                                <span className="sr-only">Close</span>
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            <video
                                src={selectedVideo}
                                controls
                                autoPlay
                                loop
                                className="w-full h-full object-contain"
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
