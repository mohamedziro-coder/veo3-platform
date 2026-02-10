import { NextRequest, NextResponse } from 'next/server';
import { getAllActivity, getUserActivity, logActivity } from '@/lib/db';

// GET activity
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const email = searchParams.get('email');

        let activities;
        if (email) {
            // Get specific user activity
            activities = await getUserActivity(email);
        } else {
            // Get all activity
            activities = await getAllActivity();
        }

        return NextResponse.json({ success: true, activities });
    } catch (error: any) {
        console.error('Error fetching activity:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to fetch activity' },
            { status: 500 }
        );
    }
}

// POST log new activity
export async function POST(req: NextRequest) {
    try {
        const { userEmail, userName, tool, details, resultUrl } = await req.json();

        if (!userEmail || !userName || !tool || !details) {
            return NextResponse.json(
                { error: 'All fields are required' },
                { status: 400 }
            );
        }

        const success = await logActivity(userEmail, userName, tool, details, resultUrl);

        if (!success) {
            return NextResponse.json(
                { error: 'Failed to log activity' },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('Error logging activity:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to log activity' },
            { status: 500 }
        );
    }
}
