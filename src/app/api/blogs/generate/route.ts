import { NextResponse } from 'next/server';
import { generateImage } from '@/lib/runway';

// ── Gemini text generation via REST (requires GEMINI_API_KEY in env) ──────────
async function geminiGenerateText(prompt: string): Promise<string> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error('GEMINI_API_KEY env variable not set. Add it to .env.local to use blog generation.');

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
        const { topic } = await request.json();

        if (!topic) {
            return NextResponse.json({ error: "Topic is required" }, { status: 400 });
        }

        // 1. Generate Content with Gemini
        const prompt = `
            You are an expert blog writer. Write a comprehensive, engaging blog post about: "${topic}".
            
            Return a strictly valid JSON object (no markdown formatting, no code blocks) with the following fields:
            - title: A catchy title.
            - slug: URL-friendly slug (kebab-case).
            - excerpt: A short summary (max 160 chars).
            - content: The full blog post content in HTML format (use <h2>, <p>, <ul>, <li>, <strong>, etc. for formatting). Do not include <h1> or <html> tags.
            - image_prompt: A detailed, artistic, photorealistic prompt to generate a high-quality cover image for this blog post.
        `;

        console.log(`[BLOG-GEN] Generating content for topic: "${topic}"`);
        const text = await geminiGenerateText(prompt);

        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        let blogData: any;
        try {
            blogData = JSON.parse(jsonStr);
        } catch (e) {
            console.error("Failed to parse Gemini JSON:", text);
            return NextResponse.json({ error: "Failed to generate valid blog structure" }, { status: 500 });
        }

        // 2. Generate Cover Image with Runway Gen4
        let coverImage: string | null = null;
        if (blogData.image_prompt) {
            try {
                console.log(`[BLOG-GEN] Generating image via Runway for prompt: "${blogData.image_prompt}"`);
                coverImage = await generateImage(blogData.image_prompt, undefined, '1360:768');
            } catch (imgError) {
                console.error("Runway image generation failed:", imgError);
                // Don't fail the whole request — return without image
            }
        }

        return NextResponse.json({
            success: true,
            data: {
                ...blogData,
                cover_image: coverImage
            }
        });

    } catch (error: any) {
        console.error("Blog Generation Error:", error);
        return NextResponse.json({ error: error.message || "Failed to generate blog" }, { status: 500 });
    }
}
