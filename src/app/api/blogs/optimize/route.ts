import { NextResponse } from 'next/server';

// ── Gemini text generation via REST (requires GEMINI_API_KEY in env) ──────────
async function geminiGenerateText(prompt: string): Promise<string> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error('GEMINI_API_KEY env variable not set. Add it to .env.local to use blog SEO optimization.');

    const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        }
    );
    if (!res.ok) throw new Error(`Gemini API error: ${res.status} ${await res.text()}`);
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
}

export async function POST(request: Request) {
    try {
        const { content, title } = await request.json();

        if (!content) {
            return NextResponse.json({ error: "Content is required" }, { status: 400 });
        }

        const prompt = `
            You are an SEO expert. Analyze the following blog post content and generate:
            1. An engaging, SEO-friendly Title (max 60 chars).
            2. A URL-friendly Slug (kebab-case).
            3. A compelling Excerpt/Meta Description (max 160 chars).

            Current Title (if any): "${title || ''}"
            
            Blog Content:
            "${content.substring(0, 5000)}..." (truncated if too long)

            Return the response in strictly valid JSON format with keys: "title", "slug", "excerpt".
            Do not include markdown formatting (like \`\`\`json) in the response.
        `;

        const text = await geminiGenerateText(prompt);
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const seoData = JSON.parse(jsonStr);

        return NextResponse.json({ success: true, ...seoData });

    } catch (error: any) {
        console.error("SEO Optimization Error:", error);
        return NextResponse.json({ error: error.message || "Failed to generate SEO data" }, { status: 500 });
    }
}
