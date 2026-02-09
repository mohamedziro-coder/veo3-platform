import { NextRequest, NextResponse } from 'next/server';
import { verifyUserEmail } from '@/lib/db';

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const token = searchParams.get('token');

    if (!token) {
        return NextResponse.redirect(new URL('/login?error=Invalid+token', req.url));
    }

    const user = await verifyUserEmail(token);

    if (user) {
        // Successful verification
        return NextResponse.redirect(new URL('/login?verified=true', req.url));
    } else {
        // Failed verification
        return NextResponse.redirect(new URL('/login?error=Verification+failed', req.url));
    }
}
