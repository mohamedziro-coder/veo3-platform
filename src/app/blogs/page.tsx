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
        <main className="min-h-screen bg-gray-50 text-gray-900 pt-24 px-6 relative overflow-hidden">
            {/* Animated Background elements */}
            <div className="fixed inset-0 pointer-events-none">
                <motion.div
                    animate={{
                        x: [0, 30, 0],
                        y: [0, 50, 0],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px]"
                />
                <motion.div
                    animate={{
                        x: [0, -50, 0],
                        y: [0, 30, 0],
                        scale: [1, 1.2, 1]
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px]"
                />
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-7xl mx-auto relative z-10 px-4 sm:px-6 mb-20"
            >
                <div className="text-center mb-16">
                    <motion.h1
                        variants={itemVariants}
                        className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"
                    >
                        Latest Updates
                    </motion.h1>
                    <motion.p
                        variants={itemVariants}
                        className="text-gray-500 text-lg max-w-2xl mx-auto"
                    >
                        Discover the latest news, tutorials, and updates from the Virezo team.
                    </motion.p>
                </div>

                {blogs.length === 0 ? (
                    <motion.div
                        variants={itemVariants}
                        className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm"
                    >
                        <Sparkles className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                        <p className="text-gray-400 text-lg">No posts yet. Stay tuned!</p>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {blogs.map((blog) => (
                            <motion.div key={blog.id} variants={itemVariants}>
                                <Link
                                    href={`/blogs/${blog.slug}`}
                                    className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-purple-200 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col h-full active:scale-95"
                                >
                                    <div className="aspect-video bg-gray-100 relative overflow-hidden">
                                        {blog.cover_image ? (
                                            <img
                                                src={blog.cover_image}
                                                alt={blog.title}
                                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 text-gray-300">
                                                No Image
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                                    </div>
                                    <div className="p-6 flex flex-col flex-1">
                                        <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(blog.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors line-clamp-2">
                                            {blog.title}
                                        </h3>
                                        <p className="text-gray-500 text-sm line-clamp-3 mb-4 flex-1">
                                            {blog.excerpt || "Click to read more..."}
                                        </p>
                                        <div className="text-purple-600 text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                                            Read Article <ArrowRight className="w-4 h-4" />
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
