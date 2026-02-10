import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function POST(req: NextRequest) {
    try {
        const { minimumCredits } = await req.json();
        const minCredits = minimumCredits || 1000; // Default 1000

        const sql = neon(process.env.POSTGRES_URL!);

        // Force minimum credits for ALL users (except those who already have more)
        // Admin users will keep their current credits (we don't touch them)
        const result = await sql`
            UPDATE users 
            SET credits = ${minCredits}
            WHERE credits < ${minCredits} AND role != 'admin'
            RETURNING id, email, name, credits
        `;

        return NextResponse.json({
            success: true,
            message: `Forced ${minCredits} credits for ${result.length} users`,
            usersUpdated: result.length,
            users: result
        });

    } catch (error: any) {
        console.error('Error forcing credits:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to force credits' },
            { status: 500 }
        );
    }
}

// GET endpoint to preview who would be affected
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const threshold = Number(searchParams.get('threshold')) || 1000;

        const sql = neon(process.env.POSTGRES_URL!);

        const result = await sql`
            SELECT id, email, name, role, credits
            FROM users
            WHERE credits < ${threshold} AND role != 'admin'
            ORDER BY credits ASC
        `;

        return NextResponse.json({
            success: true,
            threshold: threshold,
            usersAffected: result.length,
            users: result
        });

    } catch (error: any) {
        console.error('Error checking users:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to check users' },
            { status: 500 }
        );
    }
}
