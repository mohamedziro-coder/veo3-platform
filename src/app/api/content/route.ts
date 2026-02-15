import { NextRequest, NextResponse } from 'next/server';
import { getPageContent, upsertPageContent, appendPageContent } from '@/lib/cms';
import { getUserByEmail } from '@/lib/db';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');

    if (!slug) {
        return NextResponse.json({ error: 'Slug required' }, { status: 400 });
    }

    const content = await getPageContent(slug);
    return NextResponse.json({ content });
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { slug, key, content, type, email, chunkIndex } = body;

        // Verify Admin
        if (!email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        const user = await getUserByEmail(email);
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        if (typeof chunkIndex === 'number' && chunkIndex > 0) {
            // Append chunk
            await appendPageContent(slug, key, content);
        } else {
            // New upload or first chunk (overwrite)
            await upsertPageContent(slug, key, content, type);
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error("CMS Save Error", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
