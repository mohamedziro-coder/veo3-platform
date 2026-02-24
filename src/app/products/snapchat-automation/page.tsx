import { generateSchema } from "@/lib/schema";
import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
    title: "Snapchat Ads Automation - Virezo Products",
    description: "Generate high-converting Snapchat ads at scale.",
};

export default function SnapchatPage() {
    const schema = generateSchema.product(
        "Snapchat Ads Automation",
        "Automated vertical video generation for Snapchat Ads.",
        "https://virezo.com/shots/snapchat.png"
    );

    return (
        <main className="min-h-screen pt-32 pb-20 px-6">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
            />

            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
                <div className="flex-1">
                    <span className="text-[#FFFC00] font-bold tracking-widest uppercase text-sm mb-4 block">Snapchat Partner</span>
                    <h1 className="text-5xl md:text-6xl font-black text-foreground mb-6">Stop Scroll. Start Converting.</h1>
                    <p className="text-xl text-muted-foreground mb-8">
                        Native-feeling UGC style ads designed specifically for the Snapchat demographic. Hit your ROAS targets on day one.
                    </p>
                    <button className="bg-[#FFFC00] text-black font-black px-8 py-4 rounded-xl text-lg hover:brightness-110 transition-all">
                        Create Snap Ads
                    </button>
                </div>

                <div className="flex-1 grid grid-cols-2 gap-4">
                    <div className="aspect-[9/16] bg-card-bg rounded-2xl border border-card-border rotate-[-6deg] translate-y-8 overflow-hidden relative">
                        <Image
                            src="https://placehold.co/400x700/yellow/black?text=Snap+Ad+1"
                            alt="Snap Ad 1"
                            width={400}
                            height={700}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="aspect-[9/16] bg-card-bg rounded-2xl border border-card-border rotate-[6deg] overflow-hidden relative">
                        <Image
                            src="https://placehold.co/400x700/black/yellow?text=Snap+Ad+2"
                            alt="Snap Ad 2"
                            width={400}
                            height={700}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </div>
        </main>
    );
}
