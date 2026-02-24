import { generateSchema } from "@/lib/schema";
import { Metadata } from "next";
import Link from "next/link";
import { PlayCircle, FileText, Zap } from "lucide-react";

export const metadata: Metadata = {
    title: "Getting Started with Virezo - Resources",
    description: "Learn how to create your first AI video in under 5 minutes.",
    alternates: {
        canonical: "/resources/getting-started",
    },
};

export default function GettingStartedPage() {
    const schema = generateSchema.article(
        "Getting Started with Virezo",
        "A step-by-step guide to generating your first AI video.",
        "2024-01-01",
        "Virezo Team",
        "https://virezo.com/og-image.jpg"
    );

    return (
        <main className="min-h-screen pt-32 pb-20 px-6">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
            />

            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-black text-foreground mb-6">Start Creating in Minutes</h1>
                    <p className="text-xl text-muted-foreground">
                        Master the basics of AI video generation with our quick-start guides.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="group bg-card-bg p-8 rounded-3xl border border-card-border hover:border-primary/50 transition-all cursor-pointer">
                        <PlayCircle className="w-12 h-12 text-primary mb-6 group-hover:scale-110 transition-transform" />
                        <h3 className="text-2xl font-bold text-foreground mb-2">Video Tutorial</h3>
                        <p className="text-muted-foreground mb-4">Watch a 2-minute walkthrough of the studio interface.</p>
                        <span className="text-primary font-bold group-hover:underline">Watch Now &rarr;</span>
                    </div>
                    <div className="group bg-card-bg p-8 rounded-3xl border border-card-border hover:border-primary/50 transition-all cursor-pointer">
                        <FileText className="w-12 h-12 text-blue-500 mb-6 group-hover:scale-110 transition-transform" />
                        <h3 className="text-2xl font-bold text-foreground mb-2">Documentation</h3>
                        <p className="text-muted-foreground mb-4">Read detailed guides on advanced features.</p>
                        <span className="text-primary font-bold group-hover:underline">Read Docs &rarr;</span>
                    </div>
                </div>

                <div className="mt-16 bg-secondary/10 rounded-3xl p-8 border border-secondary/20 flex items-center gap-6">
                    <Zap className="w-10 h-10 text-secondary shrink-0" />
                    <div>
                        <h3 className="text-xl font-bold text-foreground">Pro Tip</h3>
                        <p className="text-muted-foreground">
                            Use the <Link href="/solutions/creative-testing" className="text-secondary hover:underline">Creative Testing</Link> workflow to generate 5 variations of your first ad automatically.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
