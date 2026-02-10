import { NextResponse } from 'next/server';

export async function GET() {
    const results: any[] = [];
    const targets = [
        { name: 'Google Main', url: 'https://www.google.com' },
        { name: 'Vertex AI us-central1', url: 'https://us-central1-aiplatform.googleapis.com/v1beta1/projects' },
        { name: 'HTTPBin (External Test)', url: 'https://httpbin.org/get' }
    ];

    for (const target of targets) {
        const start = Date.now();
        try {
            const res = await fetch(target.url, { method: 'GET' });
            results.push({
                name: target.name,
                status: res.status,
                ok: res.ok,
                time: `${Date.now() - start}ms`,
                type: 'Success'
            });
        } catch (error: any) {
            results.push({
                name: target.name,
                error: error.message,
                stack: error.stack,
                cause: error.cause,
                time: `${Date.now() - start}ms`,
                type: 'Failure'
            });
        }
    }

    return NextResponse.json({
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        results
    });
}
