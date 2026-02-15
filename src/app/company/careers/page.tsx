import { Metadata } from "next";
import EditableText from "@/components/cms/EditableText";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
    title: "Careers - Virezo",
    description: "Join the team building the future of AI video generation.",
};

export default function CareersPage() {
    return (
        <main className="min-h-screen pt-32 pb-20 px-6">
            <div className="max-w-4xl mx-auto text-center mb-24">
                <EditableText
                    slug="careers"
                    id="hero-title"
                    defaultContent="Build the Future With Us"
                    as="h1"
                    className="text-5xl md:text-6xl font-black text-foreground mb-8 text-primary"
                />
                <EditableText
                    slug="careers"
                    id="hero-desc"
                    defaultContent="We're a remote-first team of engineers, designers, and dreamers."
                    as="p"
                    className="text-xl text-muted-foreground"
                />
            </div>

            <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-foreground">Open Positions</h2>
                    <span className="text-muted-foreground text-sm">3 Roles Available</span>
                </div>

                <div className="space-y-4">
                    {[
                        { role: "Senior Frontend Engineer", dept: "Engineering", loc: "Remote (EU/US)", type: "Full-time" },
                        { role: "AI Research Scientist", dept: "Research", loc: "Remote (Global)", type: "Full-time" },
                        { role: "Product Designer", dept: "Design", loc: "New York, NY", type: "Hybrid" }
                    ].map((job, i) => (
                        <div key={i} className="group flex items-center justify-between p-6 bg-card-bg border border-card-border rounded-2xl hover:border-primary/50 transition-all cursor-pointer">
                            <div>
                                <EditableText
                                    slug="careers"
                                    id={`job-role-${i}`}
                                    defaultContent={job.role}
                                    as="h3"
                                    className="text-lg font-bold text-foreground group-hover:text-primary transition-colors"
                                />
                                <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                                    <EditableText slug="careers" id={`job-dept-${i}`} defaultContent={job.dept} as="span" />
                                    <span>•</span>
                                    <EditableText slug="careers" id={`job-loc-${i}`} defaultContent={job.loc} as="span" />
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm font-bold text-foreground group-hover:translate-x-1 transition-transform">
                                Apply <ArrowRight className="w-4 h-4" />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center p-8 rounded-2xl bg-secondary/10 border border-secondary/20">
                    <EditableText
                        slug="careers"
                        id="cta-title"
                        defaultContent="Don't see your role?"
                        as="h3"
                        className="text-xl font-bold text-foreground mb-2"
                    />
                    <EditableText
                        slug="careers"
                        id="cta-desc"
                        defaultContent="We are always looking for exceptional talent."
                        as="p"
                        className="text-muted-foreground mb-4"
                    />
                    <button className="text-primary font-bold hover:underline">
                        Send Open Application
                    </button>
                </div>
            </div>
        </main>
    );
}
