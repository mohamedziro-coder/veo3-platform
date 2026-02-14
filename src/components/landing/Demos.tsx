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
        <section className="py-24 px-6 max-w-7xl mx-auto" id="demos">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Made with Virezo</h2>
                <p className="text-xl text-muted-foreground">See what others are building right now.</p>
            </div>

            <div className="relative overflow-hidden py-10 -mx-6 md:-mx-12 cursor-grab active:cursor-grabbing">
                {/* Faded edges for premium feel */}
                <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

                <motion.div
                    className="flex gap-6 w-max px-6"
                    animate={{
                        x: ["0%", "-50%"]
                    }}
                    transition={{
                        duration: 30,
                        ease: "linear",
                        repeat: Infinity
                    }}
                    style={{ willChange: "transform" }}
                    whileHover={{ transition: { duration: 60 } }} // Slow down on hover
                >
                    {[...demos, ...demos].map((demo, index) => (
                        <motion.div
                            key={`${demo.id}-${index}`}
                            whileHover={{ y: -10, scale: 1.02 }}
                            onClick={() => setSelectedVideo(demo.video)}
                            className="w-[280px] aspect-[9/16] bg-muted rounded-2xl relative group overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl transition-all border border-card-border"
                        >
                            {/* Video Preview */}
                            <video
                                src={demo.video}
                                poster={demo.thumbnail}
                                muted
                                autoPlay
                                loop
                                playsInline
                                className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                            />

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black/5 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                                <div className="w-14 h-14 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
                                    <Play className="w-6 h-6 text-primary ml-1 fill-current" />
                                </div>
                            </div>
                            <div className="absolute bottom-6 left-6 right-6 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                <span className="bg-white/95 backdrop-blur text-[10px] font-extrabold tracking-widest uppercase px-4 py-2 rounded-full text-gray-800 shadow-sm block text-center">
                                    {demo.title}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            <div className="text-center mt-12">
                <Link href="/signup" className="inline-flex px-8 py-4 rounded-xl bg-primary/5 text-primary border border-primary/20 font-bold hover:bg-primary hover:text-white transition-all transform hover:-translate-y-1">
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
