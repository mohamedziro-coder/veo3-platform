import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function POST(req: NextRequest) {
    try {
        const secretKey = process.env.STRIPE_SECRET_KEY;
        const dbUrl = process.env.POSTGRES_URL;
        if (!secretKey) {
            return NextResponse.json({ error: 'STRIPE_SECRET_KEY is not configured' }, { status: 500 });
        }
        if (!dbUrl) {
            return NextResponse.json({ error: 'POSTGRES_URL is not configured' }, { status: 500 });
        }

        const { sessionId } = await req.json();
        const sid = String(sessionId || '').trim();
        if (!sid) {
            return NextResponse.json({ error: 'sessionId is required' }, { status: 400 });
        }

        const stripeRes = await fetch(`https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sid)}`, {
            headers: {
                Authorization: `Bearer ${secretKey}`,
            },
        });

        const session = await stripeRes.json();
        if (!stripeRes.ok) {
            const msg = session?.error?.message || 'Failed to fetch Stripe session';
            return NextResponse.json({ error: msg }, { status: 502 });
        }

        if (session.payment_status !== 'paid') {
            return NextResponse.json({ error: 'Payment is not completed yet' }, { status: 400 });
        }

        const userEmail = String(session?.metadata?.userEmail || '').trim().toLowerCase();
        const credits = Number(session?.metadata?.credits || 0);
        if (!userEmail || !Number.isFinite(credits) || credits <= 0) {
            return NextResponse.json({ error: 'Invalid payment metadata' }, { status: 400 });
        }

        const sql = neon(dbUrl);

        await sql`
            CREATE TABLE IF NOT EXISTS stripe_payments (
                session_id TEXT PRIMARY KEY,
                user_email TEXT NOT NULL,
                credits INTEGER NOT NULL,
                amount_total INTEGER,
                currency TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        `;

        const insert = await sql`
            INSERT INTO stripe_payments (session_id, user_email, credits, amount_total, currency)
            VALUES (${sid}, ${userEmail}, ${credits}, ${session.amount_total || null}, ${session.currency || null})
            ON CONFLICT (session_id) DO NOTHING
            RETURNING session_id
        `;

        // Already processed -> return success idempotently
        if (insert.length === 0) {
            const userRes = await sql`
                SELECT credits FROM users WHERE LOWER(email) = ${userEmail}
            `;
            return NextResponse.json({
                success: true,
                alreadyProcessed: true,
                credits: userRes[0]?.credits ?? null,
            });
        }

        const updated = await sql`
            UPDATE users
            SET credits = COALESCE(credits::integer, 0) + ${credits}
            WHERE LOWER(email) = ${userEmail}
            RETURNING credits
        `;

        if (updated.length === 0) {
            return NextResponse.json({ error: 'User not found for credit top-up' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            addedCredits: credits,
            credits: updated[0].credits,
        });
    } catch (error: any) {
        console.error('Stripe confirm error:', error);
        return NextResponse.json({ error: error.message || 'Payment confirmation failed' }, { status: 500 });
    }
}

