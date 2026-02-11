import Link from 'next/link';
import { getBlogs } from '@/lib/db';
import { Calendar, User } from 'lucide-react';

// Force dynamic rendering to ensure we always get latest blogs
export const dynamic = 'force-dynamic';

export default async function BlogsPage() {
    const blogs = await getBlogs(true); // Get published only

    return (
        <main className="min-h-screen bg-gray-50 text-gray-900 pt-24 px-6 relative overflow-hidden">
            {/* Background elements */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10 px-4 sm:px-6 mb-20">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        Latest Updates
                    </h1>
                    <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                        Discover the latest news, tutorials, and updates from the Virezo team.
                    </p>
                </div>

                {blogs.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                        <p className="text-gray-400 text-lg">No posts yet. Stay tuned!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {blogs.map((blog) => (
                            <Link
                                href={`/blogs/${blog.slug}`}
                                key={blog.id}
                                className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-purple-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
                            >
                                <div className="aspect-video bg-gray-100 relative overflow-hidden">
                                    {blog.cover_image ? (
                                        <img
                                            src={blog.cover_image}
                                            alt={blog.title}
                                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 text-gray-300">
                                            No Image
                                        </div>
                                    )}
                                </div>
                                <div className="p-6 flex flex-col flex-1">
                                    <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(blog.created_at).toLocaleDateString()}
                                        </span>
                                        {/* <span className="flex items-center gap-1">
                                            <User className="w-3 h-3" />
                                            Virezo Team
                                        </span> */}
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors line-clamp-2">
                                        {blog.title}
                                    </h2>
                                    <p className="text-gray-500 text-sm line-clamp-3 mb-4 flex-1">
                                        {blog.excerpt || "Click to read more..."}
                                    </p>
                                    <span className="text-purple-600 text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                                        Read Article →
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
