import { generateSchema } from "@/lib/schema";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Creative Testing - Virezo Solutions",
    description: "Data-driven creative testing methodology powered by AI.",
    alternates: {
        canonical: "/solutions/creative-testing",
    },
};

export default function CreativeTestingPage() {
    const schema = generateSchema.service(
        "AI Creative Testing",
        "Automated A/B testing for video creatives."
    );

    return (
        <main className="min-h-screen pt-32 pb-20 px-6">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
            />

            <div className="max-w-5xl mx-auto">
                <h1 className="text-5xl md:text-6xl font-black text-foreground mb-12">
                    The Scientific Method for Viral Videos
                </h1>

                <div className="space-y-20">
                    {[
                        { step: "01", title: "Hypothesize", desc: "Identify a new angle or pain point." },
                        { step: "02", title: "Generate", desc: "Create 5 video variations with AI." },
                        { step: "03", title: "Validate", desc: "Run controlled tests on TikTok/Meta." },
                        { step: "04", title: "Scale", desc: "Doubledown on the winner." }
                    ].map((s, i) => (
                        <div key={i} className="flex items-start gap-8">
                            <div className="text-6xl font-black text-primary/20">{s.step}</div>
                            <div>
                                <h3 className="text-3xl font-bold text-foreground mb-2">{s.title}</h3>
                                <p className="text-xl text-muted-foreground">{s.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
