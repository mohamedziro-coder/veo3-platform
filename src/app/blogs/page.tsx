"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getBlogs } from '@/lib/db';
import { Calendar, User, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BlogsPage() {
    const [blogs, setBlogs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await fetch('/api/blogs');
                const data = await response.json();
                if (data.success) {
                    setBlogs(data.blogs.filter((b: any) => b.published));
                }
            } catch (error) {
                console.error("Error fetching blogs:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchBlogs();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: "easeOut" as const }
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#FAFAFB] dark:bg-background text-foreground pt-48 px-6 relative overflow-hidden">
            {/* Animated Background elements (Grand Scale) */}
            <div className="fixed inset-0 pointer-events-none">
                <motion.div
                    animate={{
                        x: [0, 40, 0],
                        y: [0, 60, 0],
                        scale: [1, 1.2, 1]
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px]"
                />
                <motion.div
                    animate={{
                        x: [0, -60, 0],
                        y: [0, 40, 0],
                        scale: [1, 1.3, 1]
                    }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-accent/10 rounded-full blur-[150px]"
                />
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-[1400px] mx-auto relative z-10 px-4 sm:px-6 mb-32"
            >
                <div className="text-center mb-32 space-y-8">
                    <motion.h1
                        variants={itemVariants}
                        className="text-5xl md:text-8xl lg:text-[7.5rem] font-black tracking-tight leading-[0.95] mb-8 text-foreground"
                    >
                        Latest Updates
                    </motion.h1>
                    <motion.p
                        variants={itemVariants}
                        className="text-xl md:text-3xl text-muted-foreground max-w-4xl mx-auto leading-relaxed font-medium"
                    >
                        Discover the latest news, tutorials, and updates from the Virezo team.
                    </motion.p>
                </div>

                {blogs.length === 0 ? (
                    <motion.div
                        variants={itemVariants}
                        className="text-center py-48 bg-card-bg rounded-[3rem] border border-card-border shadow-sm"
                    >
                        <Sparkles className="w-20 h-20 text-primary/20 mx-auto mb-8" />
                        <p className="text-muted-foreground text-2xl font-black uppercase tracking-widest">No posts yet. Stay tuned!</p>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {blogs.map((blog) => (
                            <motion.div key={blog.id} variants={itemVariants}>
                                <Link
                                    href={`/blogs/${blog.slug}`}
                                    className="group bg-card-bg rounded-[2.5rem] overflow-hidden border border-card-border hover:border-primary/40 shadow-sm hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] hover:-translate-y-4 transition-all duration-500 flex flex-col h-full active:scale-95"
                                >
                                    <div className="aspect-[16/10] bg-muted relative overflow-hidden">
                                        {blog.cover_image ? (
                                            <img
                                                src={blog.cover_image}
                                                alt={blog.title}
                                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5 text-gray-300">
                                                <Sparkles className="w-12 h-12 opacity-20" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                                    </div>
                                    <div className="p-10 flex flex-col flex-1">
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6 font-bold uppercase tracking-widest">
                                            <span className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-primary" />
                                                {new Date(blog.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <h3 className="text-2xl font-black text-foreground mb-4 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                                            {blog.title}
                                        </h3>
                                        <p className="text-muted-foreground text-lg line-clamp-3 mb-8 flex-1 font-medium leading-relaxed">
                                            {blog.excerpt || "Click to read more..."}
                                        </p>
                                        <div className="text-primary text-base font-black flex items-center gap-2 group-hover:gap-4 transition-all uppercase tracking-widest">
                                            Read Article <ArrowRight className="w-5 h-5" />
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>
        </main>
    );
}
