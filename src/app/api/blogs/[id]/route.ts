import { NextResponse } from 'next/server';
import { updateBlog, deleteBlog } from '@/lib/db';

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> } // Updated for Next.js 15+
) {
    try {
        const { id } = await params;
        const blogId = parseInt(id);
        const body = await request.json();

        if (isNaN(blogId)) {
            return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
        }

        const updatedBlog = await updateBlog(blogId, body);

        if (!updatedBlog) {
            return NextResponse.json({ error: "Failed to update blog" }, { status: 500 });
        }

        return NextResponse.json({ success: true, blog: updatedBlog });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> } // Updated for Next.js 15+
) {
    try {
        const { id } = await params;
        const blogId = parseInt(id);

        if (isNaN(blogId)) {
            return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
        }

        const success = await deleteBlog(blogId);

        if (!success) {
            return NextResponse.json({ error: "Failed to delete blog" }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
