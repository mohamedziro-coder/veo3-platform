import { NextResponse } from 'next/server';
import { getGeminiModel, getImagenModel } from '@/lib/vertex';

export async function POST(request: Request) {
    try {
        const { topic } = await request.json();

        if (!topic) {
            return NextResponse.json({ error: "Topic is required" }, { status: 400 });
        }

        // 1. Generate Content with Gemini
        const geminiModel = await getGeminiModel('gemini-1.5-flash-001');
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
        const result = await geminiModel.generateContent(prompt);
        const response = await result.response;
        // Handle Vertex AI SDK response structure safely
        const text = response.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

        // Clean up markdown if present
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        let blogData;
        try {
            blogData = JSON.parse(jsonStr);
        } catch (e) {
            console.error("Failed to parse Gemini JSON:", text);
            return NextResponse.json({ error: "Failed to generate valid blog structure" }, { status: 500 });
        }

        // 2. Generate Image with Imagen
        let coverImage = null;
        if (blogData.image_prompt) {
            try {
                console.log(`[BLOG-GEN] Generating image with prompt: "${blogData.image_prompt}"`);
                const imagenModel = await getImagenModel("imagen-3.0-generate-001");

                const imageResult = await imagenModel.generateContent({
                    contents: [{ role: 'user', parts: [{ text: blogData.image_prompt }] }],
                });

                const imgResponse = imageResult.response;

                // Extract image (Base64)
                if (imgResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData) {
                    const imgData = imgResponse.candidates[0].content.parts[0].inlineData;
                    coverImage = `data:${imgData.mimeType};base64,${imgData.data}`;
                } else if (imgResponse.candidates?.[0]?.content?.parts?.[0]?.fileData?.fileUri) {
                    // If it returns a URI (less likely for this model config but possible), we might pass it directly
                    // typically need to read it, but let's assume base64 or client handles URI 
                    coverImage = imgResponse.candidates[0].content.parts[0].fileData.fileUri;
                }
            } catch (imgError) {
                console.error("Imagen generation failed:", imgError);
                // We don't fail the whole request, just return without image
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
