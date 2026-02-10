import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function POST(req: NextRequest) {
    try {
        const { amount } = await req.json();
        const creditsToGive = amount || 50; // Default 50 credits

        const sql = neon(process.env.POSTGRES_URL!);

        // Add credits to ALL users
        const result = await sql`
            UPDATE users 
            SET credits = credits + ${creditsToGive}
            RETURNING id, email, name, credits
        `;

        return NextResponse.json({
            success: true,
            message: `Added ${creditsToGive} credits to ${result.length} users`,
            usersUpdated: result.length,
            users: result
        });

    } catch (error: any) {
        console.error('Error adding credits to all users:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to add credits' },
            { status: 500 }
        );
    }
}

// GET endpoint to see all users and their credits
export async function GET(req: NextRequest) {
    try {
        const sql = neon(process.env.POSTGRES_URL!);

        const result = await sql`
            SELECT id, email, name, role, credits, created_at
            FROM users
            ORDER BY created_at DESC
        `;

        return NextResponse.json({
            success: true,
            totalUsers: result.length,
            users: result
        });

    } catch (error: any) {
        console.error('Error fetching users:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to fetch users' },
            { status: 500 }
        );
    }
}
