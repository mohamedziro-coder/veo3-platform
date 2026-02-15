import { generateSchema } from "@/lib/schema";
import { Metadata } from "next";
import EditableImage from "@/components/cms/EditableImage";
import EditableText from "@/components/cms/EditableText";

export const metadata: Metadata = {
    title: "Creative Studio - Virezo Products",
    description: "The all-in-one AI video editor for modern creators.",
};

export default function CreativeStudioPage() {
    const schema = generateSchema.product(
        "Virezo Creative Studio",
        "A powerful AI-driven video editor in the browser.",
        "https://virezo.com/shots/editor-ui.png"
    );

    return (
        <main className="min-h-screen pt-32 pb-20 px-6">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
            />

            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <EditableText
                        slug="creative-studio"
                        id="hero-label"
                        defaultContent="Creative Studio"
                        as="span"
                        className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block"
                    />
                    <EditableText
                        slug="creative-studio"
                        id="hero-title"
                        defaultContent="The Editor That Thinks Like You"
                        as="h1"
                        className="text-5xl md:text-7xl font-black text-foreground mb-6"
                        multiline
                    />
                    <EditableText
                        slug="creative-studio"
                        id="hero-desc"
                        defaultContent="Drag, drop, and dream. Our timeline-based editor is infused with generative AI tools to speed up your workflow by 10x."
                        as="p"
                        className="text-xl text-muted-foreground max-w-3xl mx-auto"
                    />
                </div>

                <div className="bg-card-bg border border-card-border rounded-3xl p-4 md:p-8 mb-20">
                    <EditableImage
                        slug="creative-studio"
                        id="editor-preview"
                        src="https://placehold.co/1200x800/1a1a1a/666666?text=Click+to+Upload+Editor+Preview"
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
                            <EditableText
                                slug="creative-studio"
                                id={`feat-title-${i}`}
                                defaultContent={feat.title}
                                as="h3"
                                className="text-xl font-bold text-foreground mb-2"
                            />
                            <EditableText
                                slug="creative-studio"
                                id={`feat-desc-${i}`}
                                defaultContent={feat.desc}
                                as="p"
                                className="text-muted-foreground"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
