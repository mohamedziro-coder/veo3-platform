import { generateSchema } from "@/lib/schema";
import EditableText from "@/components/cms/EditableText";
import EditableImage from "@/components/cms/EditableImage";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "AI Video for Brands - Virezo Solutions",
    description: "Consistent brand messaging at scale with AI avatars and voice cloning.",
};

export default function BrandsPage() {
    const schema = generateSchema.service(
        "Brand Video Solutions",
        "Maintain brand consistency with custom AI avatars and voices."
    );

    return (
        <main className="min-h-screen pt-32 pb-20 px-6">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
            />

            <div className="max-w-6xl mx-auto">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <EditableText
                        slug="for-brands"
                        id="hero-label"
                        defaultContent="For Brands"
                        as="span"
                        className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block"
                    />
                    <EditableText
                        slug="for-brands"
                        id="hero-title"
                        defaultContent="Your Brand's Voice, Everywhere."
                        as="h1"
                        className="text-5xl md:text-7xl font-black text-foreground mb-6"
                        multiline
                    />
                    <EditableText
                        slug="for-brands"
                        id="hero-desc"
                        defaultContent="Ensure every piece of content aligns with your guidelines. Train custom AI models on your brand's look and tone."
                        as="p"
                        className="text-xl text-muted-foreground"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-32 items-center">
                    <div className="order-2 md:order-1 space-y-8">
                        <div className="bg-card-bg p-8 rounded-3xl border border-card-border">
                            <EditableText
                                slug="for-brands"
                                id="feat-1-title"
                                defaultContent="Custom Avatar"
                                as="h3"
                                className="text-2xl font-bold text-foreground mb-2"
                            />
                            <EditableText
                                slug="for-brands"
                                id="feat-1-desc"
                                defaultContent="Clone your CEO or spokesperson for authentic updates."
                                as="p"
                                className="text-muted-foreground"
                            />
                        </div>
                        <div className="bg-card-bg p-8 rounded-3xl border border-card-border">
                            <EditableText
                                slug="for-brands"
                                id="feat-2-title"
                                defaultContent="Tone Guard"
                                as="h3"
                                className="text-2xl font-bold text-foreground mb-2"
                            />
                            <EditableText
                                slug="for-brands"
                                id="feat-2-desc"
                                defaultContent="AI automatically checks scripts against your brand guidelines."
                                as="p"
                                className="text-muted-foreground"
                            />
                        </div>
                    </div>
                    <div className="order-1 md:order-2 h-[500px] bg-gradient-to-tr from-secondary/20 to-primary/20 rounded-[3rem] flex items-center justify-center overflow-hidden relative">
                        <EditableImage
                            slug="for-brands"
                            id="preview-image"
                            src="https://placehold.co/600x600/333/fff?text=Brand+Preview"
                            alt="Brand Preview"
                            width={600}
                            height={600}
                            className="w-full h-full object-cover opacity-80"
                        />
                    </div>
                </div>
            </div>
        </main>
    );
}
