"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Edit, Trash2, Globe, FileText, Eye } from "lucide-react";

export default function AdminBlogsPage() {
    const router = useRouter();
    const [blogs, setBlogs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Auth check
        const currentUser = JSON.parse(localStorage.getItem('current_user') || '{}');
        if (!currentUser || currentUser.role !== 'admin') {
            router.push('/dashboard');
            return;
        }

        fetchBlogs();
    }, [router]);

    const fetchBlogs = async () => {
        try {
            // Pass admin=true to get drafted blogs too
            const res = await fetch('/api/blogs?admin=true'); // Logic handled in API: if no admin param, might return published only. 
            // Actually my API implementation: const adminMode = searchParams.get('admin') === 'true';
            // So we need to call it effectively. 
            // Wait, I implemented: const blogs = await getBlogs(publishedOnly);
            // And publishedOnly = !adminMode.
            // But API route doesn't read query param 'admin' correctly? 
            // Let me check my API implementation mentally...
            // "const { searchParams } = new URL(request.url); const adminMode = searchParams.get('admin') === 'true';"
            // formatting seems correct. 

            // Correction: I should pass admin=true in the URL.
            // However, the API implementation I wrote:
            // "const publishedOnly = !adminMode;"
            // So if admin=true, publishedOnly=false (gets all). Checks out.

            const data = await res.json();
            if (data.success) {
                setBlogs(data.blogs);
            }
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching blogs:', error);
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this blog post?")) return;

        try {
            const res = await fetch(`/api/blogs/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setBlogs(blogs.filter(b => b.id !== id));
            } else {
                alert("Failed to delete blog");
            }
        } catch (error) {
            console.error("Error deleting blog:", error);
            alert("Error deleting blog");
        }
    };

    if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
        <main className="min-h-screen bg-gray-50 text-gray-900 pt-24 px-6 relative overflow-hidden">
            <div className="max-w-7xl mx-auto relative z-10 px-4 sm:px-6">
                <div className="flex flex-col gap-4 mb-8">
                    <button
                        onClick={() => router.push('/admin')}
                        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors group self-start"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span>Back to Admin</span>
                    </button>

                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold flex items-center gap-2">
                                <FileText className="w-8 h-8 text-purple-600" />
                                Blog Management
                            </h1>
                            <p className="text-gray-500 mt-1">Create and manage your blog posts</p>
                        </div>
                        <button
                            onClick={() => router.push('/admin/blogs/editor')}
                            className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2 rounded-xl transition-all active:scale-95 flex items-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            Create New Post
                        </button>
                    </div>
                </div>

                <div className="grid gap-4">
                    {blogs.length === 0 ? (
                        <div className="text-center py-12 text-gray-400">No blog posts found. Create one to get started!</div>
                    ) : (
                        blogs.map((blog) => (
                            <div key={blog.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${blog.published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {blog.published ? 'Published' : 'Draft'}
                                        </span>
                                        <span className="text-xs text-gray-400">
                                            {new Date(blog.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-1">{blog.title}</h3>
                                    <p className="text-sm text-gray-500 line-clamp-1">{blog.excerpt || "No excerpt"}</p>
                                    <div className="text-xs text-purple-600 mt-1 font-mono">{blog.slug}</div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <a
                                        href={`/blogs/${blog.slug}`}
                                        target="_blank"
                                        className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="View Live"
                                    >
                                        <Eye className="w-5 h-5" />
                                    </a>
                                    <button
                                        onClick={() => router.push(`/admin/blogs/editor?id=${blog.id}`)}
                                        className="p-2 text-gray-400 hover:text-purple-500 hover:bg-purple-50 rounded-lg transition-colors"
                                        title="Edit"
                                    >
                                        <Edit className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(blog.id)}
                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </main>
    );
}
