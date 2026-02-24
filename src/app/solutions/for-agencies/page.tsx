import { generateSchema } from "@/lib/schema";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "AI Video for Agencies - Virezo Solutions",
    description: "Scale your creative production 10x with Virezo's AI tools built for agencies.",
};

export default function AgenciesPage() {
    const schema = generateSchema.service(
        "AI Video Production for Agencies",
        "Scale your agency's creative output with automated video generation."
    );

    return (
        <main className="min-h-screen pt-32 pb-20 px-6">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
            />

            <div className="max-w-6xl mx-auto mb-24">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <span className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block">For Agencies</span>
                    <h1 className="text-5xl md:text-7xl font-black text-foreground mb-6">Scale Creative Without Headcount</h1>
                    <p className="text-xl text-muted-foreground">Deliver high-performing video ads for all your clients in minutes. White-label options and team collaboration included.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
                    {[
                        { icon: "⚡", title: "Rapid Iteration", desc: "Test 50+ ad variations in the time it takes to edit one." },
                        { icon: "🤝", title: "Client Approval", desc: "Share preview links instantly to get client sign-off faster." },
                        { icon: "💰", title: "Higher Margins", desc: "Reduce production costs by 90% and keep the difference." }
                    ].map((feat, i) => (
                        <div key={i} className="bg-card-bg p-8 rounded-3xl border border-card-border hover:border-primary/50 transition-colors">
                            <div className="text-4xl mb-4">{feat.icon}</div>
                            <h3 className="text-2xl font-bold text-foreground mb-2">{feat.title}</h3>
                            <p className="text-muted-foreground">{feat.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="bg-gradient-to-r from-primary to-blue-600 rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-5xl font-black mb-6">Ready to scale your agency?</h2>
                        <button className="px-12 py-4 rounded-xl bg-white text-primary font-black text-lg hover:bg-white/90 transition-colors">
                            Book a Demo
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}
