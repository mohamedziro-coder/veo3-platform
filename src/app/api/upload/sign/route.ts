import { NextRequest, NextResponse } from 'next/server';
import { getUploadUrl } from '@/lib/gcs-upload';
import { getUserByEmail } from '@/lib/db';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { filename, contentType, email } = body;

        if (!filename || !contentType || !email) {
            return NextResponse.json({ error: 'Filename, contentType, and email required' }, { status: 400 });
        }

        // Verify Admin
        const user = await getUserByEmail(email);
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { uploadUrl, publicUrl } = await getUploadUrl(filename, contentType);

        return NextResponse.json({ uploadUrl, publicUrl });
    } catch (error: any) {
        console.error("Sign URL Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
