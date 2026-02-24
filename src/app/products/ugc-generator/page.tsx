import { generateSchema } from "@/lib/schema";
import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
    title: "UGC Video Generator - Virezo Products",
    description: "Generate authentic User Generated Content videos with AI avatars.",
};

export default function UGCPage() {
    const schema = generateSchema.product(
        "Virezo UGC Generator",
        "Create authentic-looking UGC videos without hiring creators.",
        "https://virezo.com/shots/ugc.png"
    );

    return (
        <main className="min-h-screen pt-32 pb-20 px-6">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
            />

            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <span className="text-secondary font-bold tracking-widest uppercase text-sm mb-4 block">UGC Generator</span>
                    <h1 className="text-5xl md:text-7xl font-black text-foreground mb-6">Scale Authenticity</h1>
                    <p className="text-xl text-muted-foreground">
                        The performance of UGC without the headache of shipping products or managing creators.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
                    <div className="order-2 md:order-1">
                        <ul className="space-y-8">
                            {[
                                { title: "Diverse Avatars", desc: "Choose from 100+ AI creators of different ages and ethnicities." },
                                { title: "Natural Voice", desc: "Prosody-aware TTS that sounds like a real person talking into a phone." },
                                { title: "Phone Aspect Ratio", desc: "Vertical-first generation optimized for Reels and TikTok." }
                            ].map((feat, i) => (
                                <li key={i} className="flex items-start gap-4">
                                    <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center text-secondary font-bold mt-1">✓</div>
                                    <div>
                                        <h3 className="text-xl font-bold text-foreground">{feat.title}</h3>
                                        <p className="text-muted-foreground">{feat.desc}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="order-1 md:order-2 h-[600px] bg-card-bg rounded-[3rem] border border-card-border flex items-center justify-center relative overflow-hidden">
                        <Image
                            src="https://placehold.co/400x800/222/999?text=Phone+Preview"
                            alt="Phone Preview"
                            width={400}
                            height={800}
                            className="w-full h-full object-cover opacity-80"
                        />
                    </div>
                </div>
            </div>
        </main>
    );
}
