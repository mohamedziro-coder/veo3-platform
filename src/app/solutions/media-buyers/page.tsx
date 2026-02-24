import { generateSchema } from "@/lib/schema";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Media Buyer Tools - Virezo Solutions",
    description: "Lower your CPA with high-converting AI video creatives.",
    alternates: {
        canonical: "/solutions/media-buyers",
    },
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
                <h1 className="text-5xl md:text-7xl font-black text-foreground mb-6">Stop Burning Budget On Bad Creatives</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-20">
                    Creative is the new targeting. Generate winning hooks and CTAs in seconds to find your next unicorn ad.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-20">
                    {['Hooks', 'Bodies', 'CTAs'].map((part, i) => (
                        <div key={part} className="p-8 rounded-2xl bg-card-bg border border-card-border">
                            <h3 className="text-2xl font-black text-foreground mb-2">Test {part}</h3>
                            <p className="text-sm text-muted-foreground">Generate 10 variants instantly.</p>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
