import { generateSchema } from "@/lib/schema";
import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
    title: "Creative Studio - Virezo Products",
    description: "The all-in-one AI video editor for modern creators.",
    alternates: {
        canonical: "/products/creative-studio",
    },
};

export default function CreativeStudioPage() {
    const schema = generateSchema.product(
        "Virezo Creative Studio",
        "A powerful AI-driven video editor in the browser.",
        "https://virezo.pro/shots/editor-ui.png"
    );

    return (
        <main className="min-h-screen pt-32 pb-20 px-6">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
            />

            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <span className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block">Creative Studio</span>
                    <h1 className="text-5xl md:text-7xl font-black text-foreground mb-6">The Editor That Thinks Like You</h1>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                        Drag, drop, and dream. Our timeline-based editor is infused with generative AI tools to speed up your workflow by 10x.
                    </p>
                </div>

                <div className="bg-card-bg border border-card-border rounded-3xl p-4 md:p-8 mb-20">
                    <Image
                        src="/shots/editor-ui.png"
                        alt="Editor UI Preview"
                        width={1200}
                        height={800}
                        className="w-full h-auto rounded-2xl border border-white/10"
                        priority
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { title: "AI B-Roll", desc: "Auto-generate relevant stock footage based on your script." },
                        { title: "Smart Captions", desc: "Transcribe and animate subtitles in one click." },
                        { title: "Audio Clean", desc: "Remove background noise and enhance speech instantly." }
                    ].map((feat, i) => (
                        <div key={i} className="p-8 rounded-3xl bg-card-bg/50 border border-card-border">
                            <h3 className="text-xl font-bold text-foreground mb-2">{feat.title}</h3>
                            <p className="text-muted-foreground">{feat.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
