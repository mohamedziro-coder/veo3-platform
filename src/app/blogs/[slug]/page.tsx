import Link from 'next/link';
import { getBlogBySlug } from '@/lib/db';
import { ArrowLeft, Calendar, Share2 } from 'lucide-react';
import { notFound } from 'next/navigation';
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
        <main className="min-h-screen bg-[#FAFAFB] dark:bg-background pt-48 pb-32 relative">
            <div className="fixed inset-0 pointer-events-none -z-10">
                <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-primary/5 to-transparent" />
            </div>

            <article className="max-w-4xl mx-auto px-6 relative z-10">
                <div className="mb-12">
                    <Link
                        href="/blogs"
                        className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group font-bold uppercase tracking-widest text-sm"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-2 transition-transform" />
                        Back to Blog
                    </Link>
                </div>

                <header className="mb-16 text-center space-y-8">
                    <div className="flex items-center justify-center gap-3 text-sm font-black text-primary uppercase tracking-[0.25em]">
                        <Calendar className="w-4 h-4" />
                        {new Date(blog.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </div>
                    <h1 className="text-4xl md:text-7xl font-black text-foreground mb-8 leading-[1.1] tracking-tight">
                        {blog.title}
                    </h1>
                    {blog.excerpt && (
                        <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto font-medium">
                            {blog.excerpt}
                        </p>
                    )}
                </header>

                {blog.cover_image && (
                    <div className="rounded-[3rem] overflow-hidden shadow-2xl mb-20 border border-card-border aspect-[21/9] relative scale-[1.05]">
                        <img
                            src={blog.cover_image}
                            alt={blog.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                <div
                    className="prose prose-xl dark:prose-invert prose-purple max-w-none prose-img:rounded-[2.5rem] prose-headings:font-black prose-headings:tracking-tight prose-a:text-primary prose-h1:text-5xl prose-h2:text-4xl prose-h3:text-3xl prose-p:text-muted-foreground prose-p:leading-[1.8] prose-li:text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                />

                <hr className="my-24 border-card-border" />
            </article>
        </main>
    );
}
