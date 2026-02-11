"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Save, Globe, Image as ImageIcon } from "lucide-react";

function BlogEditor() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const blogId = searchParams.get('id');

    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(!!blogId);

    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        cover_image: "",
        published: false,
        author_email: ""
    });

    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem('current_user') || '{}');
        if (!currentUser || currentUser.role !== 'admin') {
            router.push('/dashboard');
            return;
        }
        setFormData(prev => ({ ...prev, author_email: currentUser.email }));

        if (blogId) {
            fetchBlog(blogId);
        }
    }, [blogId, router]);

    const fetchBlog = async (id: string) => {
        try {
            // We can reuse the public API, but filtering might be tricky if not published.
            // Actually, querying by ID is not in my public getBlogBySlug helper, but strictly speaking 
            // I implemented GET /api/blogs but NOT GET /api/blogs/[id] (Wait, I DID implement [id] route).
            // But my helper functions: 
            // getBlogBySlug (public use mostly)
            // But verify: /api/blogs/[id] uses updateBlog / deleteBlog. It DOES NOT have a GET handler in my previous step!
            // Mistake detected: I forgot to add GET to src/app/api/blogs/[id]/route.ts
            // I need to add that. 
            // For now, I'll fetch ALL blogs and find the one I need, as a temporary workaround 
            // OR I will fix the API route in the next step.
            // Let's assume I fix it. 
            // Actually, I should probably just implement GET in [id] route now or in next step.
            // Let's rely on fetching all for now to avoid breaking flow (it's admin, listing is cheap).

            const res = await fetch('/api/blogs?admin=true');
            const data = await res.json();
            if (data.success) {
                const blog = data.blogs.find((b: any) => b.id === parseInt(id));
                if (blog) {
                    setFormData({
                        title: blog.title,
                        slug: blog.slug,
                        excerpt: blog.excerpt || "",
                        content: blog.content,
                        cover_image: blog.cover_image || "",
                        published: blog.published,
                        author_email: blog.author_email
                    });
                }
            }
            setIsFetching(false);
        } catch (error) {
            console.error("Error fetching blog:", error);
            setIsFetching(false);
        }
    };

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value;
        setFormData(prev => ({
            ...prev,
            title,
            slug: !blogId && !prev.slug ? generateSlug(title) : prev.slug // Auto-generate slug only for new posts if empty
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const url = blogId ? `/api/blogs/${blogId}` : '/api/blogs';
            const method = blogId ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (data.success) {
                alert(blogId ? "Blog updated successfully!" : "Blog created successfully!");
                router.push('/admin/blogs');
            } else {
                alert(`Error: ${data.error}`);
            }
        } catch (error) {
            console.error("Error saving blog:", error);
            alert("Error saving blog");
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) return <div className="min-h-screen flex items-center justify-center">Loading editor...</div>;

    return (
        <main className="min-h-screen bg-gray-50 text-gray-900 pt-24 px-6 relative">
            <div className="max-w-4xl mx-auto pb-20">
                <button
                    onClick={() => router.push('/admin/blogs')}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-6"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to List</span>
                </button>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
                    <h1 className="text-2xl font-bold mb-6">{blogId ? 'Edit Post' : 'Create New Post'}</h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Title & Slug */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={handleTitleChange}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                                    placeholder="Enter post title"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Slug (URL)</label>
                                <input
                                    type="text"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 bg-gray-50 text-gray-600"
                                    placeholder="post-url-slug"
                                    required
                                />
                            </div>
                        </div>

                        {/* Details */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Excerpt (Short Description)</label>
                            <textarea
                                value={formData.excerpt}
                                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 h-24"
                                placeholder="Brief summary for list view..."
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                <ImageIcon className="w-4 h-4" />
                                Cover Image URL
                            </label>
                            <input
                                type="text"
                                value={formData.cover_image}
                                onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                                placeholder="https://..."
                            />
                            {formData.cover_image && (
                                <img src={formData.cover_image} alt="Preview" className="h-40 w-full object-cover rounded-xl mt-2 border border-gray-100" />
                            )}
                        </div>

                        {/* Content */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Content (Markdown supported)</label>
                            <textarea
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 font-mono text-sm h-[400px]"
                                placeholder="# Hello World..."
                                required
                            />
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                            <label className="flex items-center gap-3 cursor-pointer select-none bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
                                <input
                                    type="checkbox"
                                    checked={formData.published}
                                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                                    className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                                />
                                <span className="font-bold text-gray-700">Publish Immediately</span>
                            </label>

                            <div className="flex-1"></div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-8 py-3 rounded-xl transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Save className="w-5 h-5" />
                                {isLoading ? 'Saving...' : 'Save Post'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}

export default function BlogEditorPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <BlogEditor />
        </Suspense>
    );
}
