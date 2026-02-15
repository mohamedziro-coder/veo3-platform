import { NextRequest, NextResponse } from 'next/server';
import { uploadBase64ToGCS, gcsUriToHttps } from '@/lib/gcs-upload';
import { getUserByEmail } from '@/lib/db';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;
        const email = formData.get('email') as string;

        if (!file || !email) {
            return NextResponse.json({ error: 'File and email required' }, { status: 400 });
        }

        // Verify Admin
        const user = await getUserByEmail(email);
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const buffer = await file.arrayBuffer();
        const base64 = Buffer.from(buffer).toString('base64');

        // Upload
        const gcsUri = await uploadBase64ToGCS(base64, file.name);
        const publicUrl = gcsUriToHttps(gcsUri);

        return NextResponse.json({ url: publicUrl });
    } catch (error: any) {
        console.error("Upload Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
