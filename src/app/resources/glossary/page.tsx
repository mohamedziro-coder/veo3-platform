import { generateSchema } from "@/lib/schema";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Marketing Glossary - Virezo Resources",
    description: "Definitions of key terms in AI video production and digital marketing.",
};

const terms = [
    { term: "Avatar", def: "A digital representation of a person, powered by AI to speak and move realistically." },
    { term: "Generative AI", def: "Artificial intelligence capable of generating text, images, or other media in response to prompts." },
    { term: "Text-to-Speech (TTS)", def: "Technology that converts written text into spoken voice output." },
    { term: "Lip Sync", def: "The process of matching a character's lip movements to spoken audio." },
    { term: "UGC (User Generated Content)", def: "Content created by individuals rather than brands, often feeling more authentic." }
];

export default function GlossaryPage() {
    const schema = generateSchema.article(
        "AI Video Marketing Glossary",
        "Key terms you need to know about AI video generation.",
        "2024-01-01",
        "Virezo Team",
        "https://virezo.com/og-glossary.jpg"
    );

    return (
        <main className="min-h-screen pt-32 pb-20 px-6">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
            />

            <div className="max-w-4xl mx-auto">
                <h1 className="text-5xl font-black text-foreground mb-4">Marketing Glossary</h1>
                <p className="text-xl text-muted-foreground mb-12">Demystifying the jargon of AI video production.</p>

                <div className="space-y-8">
                    {terms.map((item, i) => (
                        <div key={i} className="border-b border-card-border pb-8 last:border-0">
                            <h3 className="text-2xl font-bold text-primary mb-3">{item.term}</h3>
                            <p className="text-lg text-foreground/80 leading-relaxed">{item.def}</p>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
