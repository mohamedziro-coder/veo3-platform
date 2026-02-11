import { NextResponse } from 'next/server';
import { getGeminiModel } from '@/lib/vertex';

export async function POST(request: Request) {
    try {
        const { content, title } = await request.json();

        if (!content) {
            return NextResponse.json({ error: "Content is required" }, { status: 400 });
        }

        const model = await getGeminiModel('gemini-1.5-flash-001');

        const prompt = `
            You are an SEO expert. Analyze the following blog post content and generate:
            1. An engaging, SEO-friendly Title (max 60 chars).
            2. A URL-friendly Slug (kebab-case).
            3. A compelling Excerpt/Meta Description (max 160 chars).
            4. Detailed SEO analysis/suggestions (optional, keep it brief).

            Current Title (if any): "${title || ''}"
            
            Blog Content:
            "${content.substring(0, 5000)}..." (truncated if too long)

            Return the response in strictly valid JSON format with keys: "title", "slug", "excerpt".
            Do not include markdown formatting (like \`\`\`json) in the response.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        // Vertex AI SDK response structure
        const text = response.candidates?.[0].content.parts?.[0].text || "{}";

        // Clean up markdown code blocks if Gemini returns them
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();

        const seoData = JSON.parse(jsonStr);

        return NextResponse.json({ success: true, ...seoData });

    } catch (error: any) {
        console.error("SEO Optimization Error:", error);
        return NextResponse.json({ error: error.message || "Failed to generate SEO data" }, { status: 500 });
    }
}
