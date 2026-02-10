import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function POST(req: NextRequest) {
    try {
        const { email, credits } = await req.json();

        if (!email || credits === undefined) {
            return NextResponse.json(
                { error: 'Email and credits amount required' },
                { status: 400 }
            );
        }

        const sql = neon(process.env.POSTGRES_URL!);

        // Update user credits
        const result = await sql`
            UPDATE users 
            SET credits = credits + ${credits}
            WHERE email = ${email}
            RETURNING id, email, name, credits
        `;

        if (result.length === 0) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            user: result[0],
            message: `Added ${credits} credits to ${email}`
        });

    } catch (error: any) {
        console.error('Error adding credits:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to add credits' },
            { status: 500 }
        );
    }
}

// GET endpoint to check current credits
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const email = searchParams.get('email');

        if (!email) {
            return NextResponse.json(
                { error: 'Email required' },
                { status: 400 }
            );
        }

        const sql = neon(process.env.POSTGRES_URL!);
        const result = await sql`
            SELECT id, email, name, role, credits
            FROM users
            WHERE email = ${email}
        `;

        if (result.length === 0) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            user: result[0]
        });

    } catch (error: any) {
        console.error('Error fetching user:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to fetch user' },
            { status: 500 }
        );
    }
}
