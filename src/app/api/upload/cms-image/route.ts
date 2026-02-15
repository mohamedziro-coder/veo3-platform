import { NextRequest, NextResponse } from 'next/server';
import { getUploadUrl } from '@/lib/gcs-upload';
import { getUserByEmail } from '@/lib/db';

export async function POST(req: NextRequest) {
    try {
        const { filename, contentType, email } = await req.json();

        if (!filename || !email) {
            return NextResponse.json({ error: 'Missing filename or email' }, { status: 400 });
        }

        // Verify user is admin
        const user = await getUserByEmail(email);
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { uploadUrl, publicUrl } = await getUploadUrl(filename, contentType || 'image/jpeg');

        return NextResponse.json({ uploadUrl, publicUrl });
    } catch (error: any) {
        console.error('[CMS Upload] Sign Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
