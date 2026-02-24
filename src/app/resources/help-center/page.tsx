import { generateSchema } from "@/lib/schema";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Help Center - Virezo Support",
    description: "Find answers to common questions about billing, features, and troubleshooting.",
    alternates: {
        canonical: "/resources/help-center",
    },
};

export default function HelpCenterPage() {
    const questions = [
        { question: "How do I cancel my subscription?", answer: "You can cancel anytime from your dashboard settings." },
        { question: "Can I use my own voice?", answer: "Yes, our Pro plan includes voice cloning features." },
        { question: "Is the content copyright-free?", answer: "Yes, you own 100% of the commercial rights to videos you generate." },
        { question: "Do you offer API access?", answer: "API access is available for Enterprise customers." }
    ];

    const schema = generateSchema.faq(questions);

    return (
        <main className="min-h-screen pt-32 pb-20 px-6">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
            />

            <div className="max-w-4xl mx-auto">
                <h1 className="text-5xl font-black text-foreground text-center mb-16">Help Center</h1>

                <div className="mb-12 relative">
                    <input
                        type="text"
                        placeholder="Search for answers..."
                        className="w-full px-6 py-4 rounded-2xl bg-card-bg border border-card-border focus:border-primary focus:outline-none text-lg"
                    />
                </div>

                <div className="space-y-6">
                    {questions.map((q, i) => (
                        <div key={i} className="bg-card-bg p-6 rounded-2xl border border-card-border">
                            <h3 className="text-lg font-bold text-foreground mb-2">{q.question}</h3>
                            <p className="text-muted-foreground">{q.answer}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <p className="text-muted-foreground mb-4">Still need help?</p>
                    <a href="/company/contact" className="inline-block px-8 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-colors">
                        Contact Support
                    </a>
                </div>
            </div>
        </main>
    );
}
