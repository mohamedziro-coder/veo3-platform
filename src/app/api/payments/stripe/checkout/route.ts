import { NextRequest, NextResponse } from 'next/server';

type CreditPack = {
    id: string;
    name: string;
    credits: number;
    amountCents: number;
};

const CREDIT_PACKS: CreditPack[] = [
    { id: 'starter_credits', name: 'Starter Credits Pack', credits: 200, amountCents: 900 },
    { id: 'pro_credits', name: 'Pro Credits Pack', credits: 1000, amountCents: 2900 },
    { id: 'scale_credits', name: 'Scale Credits Pack', credits: 4000, amountCents: 9900 },
];

export async function POST(req: NextRequest) {
    try {
        const secretKey = process.env.STRIPE_SECRET_KEY;
        if (!secretKey) {
            return NextResponse.json({ error: 'STRIPE_SECRET_KEY is not configured' }, { status: 500 });
        }

        const body = await req.json();
        const packId = String(body?.packId || '').trim();
        const userEmail = String(body?.userEmail || '').trim().toLowerCase();

        if (!packId || !userEmail) {
            return NextResponse.json({ error: 'packId and userEmail are required' }, { status: 400 });
        }

        const pack = CREDIT_PACKS.find((p) => p.id === packId);
        if (!pack) {
            return NextResponse.json({ error: 'Invalid credit pack' }, { status: 400 });
        }

        const origin = req.nextUrl.origin;
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || origin;

        const payload = new URLSearchParams();
        payload.append('mode', 'payment');
        payload.append('success_url', `${appUrl}/pricing/success?session_id={CHECKOUT_SESSION_ID}`);
        payload.append('cancel_url', `${appUrl}/pricing?canceled=1`);
        payload.append('customer_email', userEmail);
        payload.append('line_items[0][quantity]', '1');
        payload.append('line_items[0][price_data][currency]', 'usd');
        payload.append('line_items[0][price_data][unit_amount]', String(pack.amountCents));
        payload.append('line_items[0][price_data][product_data][name]', pack.name);
        payload.append('line_items[0][price_data][product_data][description]', `${pack.credits} credits for Virezo platform`);
        payload.append('metadata[userEmail]', userEmail);
        payload.append('metadata[packId]', pack.id);
        payload.append('metadata[credits]', String(pack.credits));

        const stripeRes = await fetch('https://api.stripe.com/v1/checkout/sessions', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${secretKey}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: payload.toString(),
        });

        const stripeData = await stripeRes.json();
        if (!stripeRes.ok) {
            const msg = stripeData?.error?.message || 'Stripe checkout session creation failed';
            return NextResponse.json({ error: msg }, { status: 502 });
        }

        return NextResponse.json({ url: stripeData.url, sessionId: stripeData.id });
    } catch (error: any) {
        console.error('Stripe checkout error:', error);
        return NextResponse.json({ error: error.message || 'Checkout failed' }, { status: 500 });
    }
}

