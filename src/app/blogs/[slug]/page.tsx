import Link from 'next/link';
import { getBlogBySlug } from '@/lib/db';
import { ArrowLeft, Calendar, Share2 } from 'lucide-react';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';

export default async function BlogPostPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const blog = await getBlogBySlug(slug);

    if (!blog || !blog.published) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-white pt-24 pb-20 relative">
            <div className="fixed inset-0 pointer-events-none -z-10">
                <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-gray-50 to-white" />
            </div>

            <article className="max-w-3xl mx-auto px-6 relative z-10">
                <div className="mb-8">
                    <Link
                        href="/blogs"
                        className="inline-flex items-center gap-2 text-gray-500 hover:text-purple-600 transition-colors group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Blog
                    </Link>
                </div>

                <header className="mb-10 text-center">
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-400 mb-4">
                        <Calendar className="w-4 h-4" />
                        {new Date(blog.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </div>
                    <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
                        {blog.title}
                    </h1>
                    {blog.excerpt && (
                        <p className="text-xl text-gray-500 leading-relaxed max-w-2xl mx-auto">
                            {blog.excerpt}
                        </p>
                    )}
                </header>

                {blog.cover_image && (
                    <div className="rounded-3xl overflow-hidden shadow-lg mb-12 border border-gray-100 aspect-video relative">
                        <img
                            src={blog.cover_image}
                            alt={blog.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                <div className="prose prose-lg prose-purple max-w-none prose-img:rounded-2xl prose-headings:font-bold prose-a:text-purple-600 prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:text-gray-700 prose-li:text-gray-700">
                    <ReactMarkdown>{blog.content}</ReactMarkdown>
                </div>

                <hr className="my-12 border-gray-100" />
            </article>
        </main>
    );
}
