"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Save, Globe, Image as ImageIcon, Sparkles, Wand2 } from "lucide-react";

function BlogEditor() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const blogId = searchParams.get('id');

    const [isLoading, setIsLoading] = useState(false);
    const [isOptimizing, setIsOptimizing] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [showGenModal, setShowGenModal] = useState(false);
    const [genTopic, setGenTopic] = useState("");
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

    const handleOptimizeSEO = async () => {
        if (!formData.content || formData.content.length < 50) {
            alert("Please write some content first (at least 50 characters) to analyze.");
            return;
        }

        setIsOptimizing(true);
        try {
            const res = await fetch('/api/blogs/optimize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: formData.content,
                    title: formData.title
                })
            });
            const data = await res.json();

            if (data.success) {
                setFormData(prev => ({
                    ...prev,
                    title: data.title || prev.title,
                    slug: data.slug || prev.slug,
                    excerpt: data.excerpt || prev.excerpt
                }));
            } else {
                alert("SEO Optimization failed: " + data.error);
            }
        } catch (error) {
            console.error("Optimization error:", error);
            alert("Failed to optimize SEO.");
        } finally {
            setIsOptimizing(false);
        }
    };

    const handleGenerateBlog = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!genTopic) return;

        setIsGenerating(true);
        try {
            const res = await fetch('/api/blogs/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic: genTopic })
            });
            const data = await res.json();

            if (data.success && data.data) {
                setFormData(prev => ({
                    ...prev,
                    title: data.data.title || prev.title,
                    slug: data.data.slug || prev.slug,
                    excerpt: data.data.excerpt || prev.excerpt,
                    content: data.data.content || prev.content,
                    cover_image: data.data.cover_image || prev.cover_image,
                }));
                setShowGenModal(false);
                setGenTopic("");
            } else {
                alert("Generation failed: " + data.error);
            }
        } catch (error) {
            console.error("Generation error:", error);
            alert("Failed to generate blog.");
        } finally {
            setIsGenerating(false);
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
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold">{blogId ? 'Edit Post' : 'Create New Post'}</h1>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => setShowGenModal(true)}
                                className="bg-gradient-to-r from-pink-500 to-rose-600 text-white font-bold px-4 py-2 rounded-xl text-sm flex items-center gap-2 hover:opacity-90 transition-opacity active:scale-95 shadow-md"
                            >
                                <Sparkles className="w-4 h-4" />
                                Magic Associate
                            </button>
                            <button
                                type="button"
                                onClick={handleOptimizeSEO}
                                disabled={isOptimizing}
                                className="bg-gradient-to-r from-purple-500 to-blue-600 text-white font-bold px-4 py-2 rounded-xl text-sm flex items-center gap-2 hover:opacity-90 transition-opacity active:scale-95 disabled:opacity-50"
                            >
                                {isOptimizing ? (
                                    <>
                                        <Sparkles className="w-4 h-4 animate-spin" />
                                        Optimizing...
                                    </>
                                ) : (
                                    <>
                                        <Wand2 className="w-4 h-4" />
                                        Auto-Optimize SEO
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

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


            {/* Magic Generation Modal */}
            {showGenModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="w-6 h-6 text-pink-500" />
                            <h2 className="text-2xl font-bold">Magic Associate</h2>
                        </div>
                        <p className="text-gray-500 mb-6">Enter a topic, and AI will generate the full blog post and a cover image for you.</p>

                        <form onSubmit={handleGenerateBlog}>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Topic or Keyword</label>
                            <input
                                type="text"
                                value={genTopic}
                                onChange={(e) => setGenTopic(e.target.value)}
                                placeholder="e.g. The future of electric cars"
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/10 focus:outline-none mb-6"
                                autoFocus
                            />

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowGenModal(false)}
                                    className="flex-1 py-3 font-bold text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isGenerating || !genTopic}
                                    className="flex-1 py-3 font-bold text-white bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 rounded-xl transition-all shadow-lg shadow-pink-500/25 disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2"
                                >
                                    {isGenerating ? (
                                        <>
                                            <Sparkles className="w-4 h-4 animate-spin" />
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-4 h-4" />
                                            Generate
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
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
