import { generateSchema } from "@/lib/schema";
import EditableText from "@/components/cms/EditableText";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "About Us - Virezo",
    description: "Learn about Virezo's mission to democratize video creation with AI.",
};

export default function AboutPage() {
    const schema = generateSchema.organization();

    return (
        <main className="min-h-screen pt-32 pb-20 px-6">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
            />

            <div className="max-w-4xl mx-auto text-center mb-24">
                <EditableText
                    slug="about"
                    id="hero-title"
                    defaultContent="We Are Virezo"
                    as="h1"
                    className="text-5xl md:text-7xl font-black text-foreground mb-8 text-primary"
                />
                <EditableText
                    slug="about"
                    id="hero-desc"
                    defaultContent="Virezo is on a mission to democratize video production. We believe that everyone has a story to tell, and cost or technical skills shouldn't be a barrier. Our AI-powered platform empowers creators, brands, and agencies to produce broadcast-quality video content in minutes, not days."
                    as="p"
                    className="text-xl text-muted-foreground leading-relaxed"
                />
            </div>

            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 mb-32">
                {[
                    { title: "Innovation", desc: "Pushing the boundaries of generative AI." },
                    { title: "Accessibility", desc: "Making pro-tools available to everyone." },
                    { title: "Quality", desc: "Broadcast-ready results, every time." }
                ].map((val, i) => (
                    <div key={i} className="bg-card-bg p-8 rounded-3xl border border-card-border">
                        <EditableText
                            slug="about"
                            id={`value-title-${i}`}
                            defaultContent={val.title}
                            as="h3"
                            className="text-2xl font-bold text-foreground mb-4"
                        />
                        <EditableText
                            slug="about"
                            id={`value-desc-${i}`}
                            defaultContent={val.desc}
                            as="p"
                            className="text-muted-foreground"
                        />
                    </div>
                ))}
            </div>

            <div className="max-w-4xl mx-auto text-center">
                <EditableText
                    slug="about"
                    id="journey-title"
                    defaultContent="Our Journey"
                    as="h2"
                    className="text-4xl font-bold text-foreground mb-12"
                />
                <div className="space-y-12 relative border-l-2 border-card-border ml-6 md:ml-0 md:pl-0">
                    {[
                        { year: "2023", title: "Inception", desc: "Virezo was founded with a simple idea: fix UGC creation." },
                        { year: "2024", title: "Launch", desc: "Released V1 of our AI Video Generator." },
                        { year: "2025", title: "Scale", desc: "Reached 100k+ users and 1M+ videos generated." },
                    ].map((item, i) => (
                        <div key={i} className="relative pl-8 md:pl-0">
                            <div className="md:flex items-center justify-center gap-8">
                                <div className="text-3xl font-black text-primary opacity-50">{item.year}</div>
                                <div className="text-left md:w-96">
                                    <EditableText
                                        slug="about"
                                        id={`journey-title-${i}`}
                                        defaultContent={item.title}
                                        as="h4"
                                        className="text-xl font-bold text-foreground"
                                    />
                                    <EditableText
                                        slug="about"
                                        id={`journey-desc-${i}`}
                                        defaultContent={item.desc}
                                        as="p"
                                        className="text-muted-foreground"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
