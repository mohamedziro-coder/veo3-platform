import { generateSchema } from "@/lib/schema";
import EditableText from "@/components/cms/EditableText";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Media Buyer Tools - Virezo Solutions",
    description: "Lower your CPA with high-converting AI video creatives.",
};

export default function MediaBuyersPage() {
    const schema = generateSchema.service(
        "Media Buyer Creative Tools",
        "Creative testing tools for performance marketing."
    );

    return (
        <main className="min-h-screen pt-32 pb-20 px-6">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
            />

            <div className="max-w-6xl mx-auto text-center">
                <EditableText
                    slug="media-buyers"
                    id="hero-title"
                    defaultContent="Stop Burning Budget On Bad Creatives"
                    as="h1"
                    className="text-5xl md:text-7xl font-black text-foreground mb-6"
                    multiline
                />
                <EditableText
                    slug="media-buyers"
                    id="hero-desc"
                    defaultContent="Creative is the new targeting. Generate winning hooks and CTAs in seconds to find your next unicorn ad."
                    as="p"
                    className="text-xl text-muted-foreground max-w-2xl mx-auto mb-20"
                />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-20">
                    {['Hooks', 'Bodies', 'CTAs'].map((part, i) => (
                        <div key={part} className="p-8 rounded-2xl bg-card-bg border border-card-border">
                            <h3 className="text-2xl font-black text-foreground mb-2">
                                <EditableText slug="media-buyers" id={`card-title-${i}`} defaultContent={`Test ${part}`} as="span" />
                            </h3>
                            <EditableText
                                slug="media-buyers"
                                id={`card-desc-${i}`}
                                defaultContent="Generate 10 variants instantly."
                                as="p"
                                className="text-sm text-muted-foreground"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
