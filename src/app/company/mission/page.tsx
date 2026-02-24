import { generateSchema } from "@/lib/schema";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Our Mission - Virezo",
    description: "Virezo's vision for the future of AI video generation.",
};

export default function MissionPage() {
    return (
        <main className="min-h-screen pt-32 pb-20 px-6">
            <div className="max-w-4xl mx-auto text-center mb-20">
                <h1 className="text-5xl font-black text-foreground mb-6">Defying Limits</h1>
                <p className="text-2xl text-muted-foreground font-medium">
                    We are building the engine for the next generation of storytelling.
                </p>
            </div>

            <div className="max-w-5xl mx-auto space-y-24">
                <section className="flex flex-col md:flex-row items-center gap-12">
                    <div className="flex-1">
                        <h2 className="text-3xl font-bold text-foreground mb-4">Empowering Creativity</h2>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                            We believe creativity is a human right. Traditional video production is gated by expensive equipment and steep learning curves. Virezo breaks down these walls, giving every creator a Hollywood studio in their browser.
                        </p>
                    </div>
                    <div className="flex-1 h-64 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-3xl flex items-center justify-center">
                        <span className="text-6xl">🎨</span>
                    </div>
                </section>

                <section className="flex flex-col md:flex-row-reverse items-center gap-12">
                    <div className="flex-1">
                        <h2 className="text-3xl font-bold text-foreground mb-4">Ethical AI</h2>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                            With great power comes great responsibility. We are committed to ethical AI development, ensuring our tools are used for positive expression. We label AI-generated content and strictly prohibit deepfakes or misinformation.
                        </p>
                    </div>
                    <div className="flex-1 h-64 bg-gradient-to-bl from-green-500/10 to-blue-500/10 rounded-3xl flex items-center justify-center">
                        <span className="text-6xl">⚖️</span>
                    </div>
                </section>
            </div>
        </main>
    );
}
