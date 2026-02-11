import { NextResponse } from 'next/server';
import { getBlogs, createBlog } from '@/lib/db';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const adminMode = searchParams.get('admin') === 'true'; // simple check, real auth should happen in middleware or here

        // In a real app, verify admin session here.
        // For now, if admin=true, return all. If not, return published only.
        const publishedOnly = !adminMode;

        const blogs = await getBlogs(publishedOnly);
        return NextResponse.json({ success: true, blogs });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { title, slug, content, excerpt, cover_image, author_email, published } = body;

        // Validation
        if (!title || !slug || !content) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const newBlog = await createBlog(title, slug, content, excerpt, cover_image, author_email, published);

        if (!newBlog) {
            return NextResponse.json({ error: "Failed to create blog" }, { status: 500 });
        }

        return NextResponse.json({ success: true, blog: newBlog });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
