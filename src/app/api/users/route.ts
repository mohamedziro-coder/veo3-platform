import { NextRequest, NextResponse } from 'next/server';
import { getAllUsers, deleteUser } from '@/lib/db';

// GET all users (admin only in the future)
export async function GET(req: NextRequest) {
    try {
        const users = await getAllUsers();
        return NextResponse.json({ success: true, users });
    } catch (error: any) {
        console.error('Error fetching users:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to fetch users' },
            { status: 500 }
        );
    }
}

// DELETE user (admin only in the future)
export async function DELETE(req: NextRequest) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            );
        }

        const success = await deleteUser(email);

        if (!success) {
            return NextResponse.json(
                { error: 'Failed to delete user' },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('Error deleting user:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to delete user' },
            { status: 500 }
        );
    }
}
