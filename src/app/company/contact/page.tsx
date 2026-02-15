import { generateSchema } from "@/lib/schema";
import EditableText from "@/components/cms/EditableText";
import { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";

export const metadata: Metadata = {
    title: "Contact Us - Virezo",
    description: "Get in touch with the Virezo team for support, sales, or partnerships.",
};

export default function ContactPage() {
    const schema = generateSchema.organization();

    return (
        <main className="min-h-screen pt-32 pb-20 px-6">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
            />

            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
                <div>
                    <EditableText
                        slug="contact"
                        id="hero-title"
                        defaultContent="Get in Touch"
                        as="h1"
                        className="text-5xl font-black text-foreground mb-8"
                    />
                    <EditableText
                        slug="contact"
                        id="hero-desc"
                        defaultContent="Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible."
                        as="p"
                        className="text-xl text-muted-foreground mb-12"
                    />

                    <div className="space-y-8">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                <Mail className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-foreground">Email</h3>
                                <EditableText
                                    slug="contact"
                                    id="email-1"
                                    defaultContent="support@virezo.com"
                                    as="p"
                                    className="text-muted-foreground"
                                />
                                <EditableText
                                    slug="contact"
                                    id="email-2"
                                    defaultContent="sales@virezo.com"
                                    as="p"
                                    className="text-muted-foreground"
                                />
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                <MapPin className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-foreground">Office</h3>
                                <EditableText
                                    slug="contact"
                                    id="office-addr-1"
                                    defaultContent="123 AI Boulevard"
                                    as="p"
                                    className="text-muted-foreground"
                                />
                                <EditableText
                                    slug="contact"
                                    id="office-addr-2"
                                    defaultContent="San Francisco, CA 94105"
                                    as="p"
                                    className="text-muted-foreground"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-card-bg p-8 md:p-12 rounded-[2.5rem] border border-card-border shadow-xl">
                    <form className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-foreground mb-2">Name</label>
                            <input type="text" className="w-full px-4 py-3 rounded-xl bg-background border border-card-border focus:border-primary focus:outline-none transition-colors" placeholder="John Doe" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-foreground mb-2">Email</label>
                            <input type="email" className="w-full px-4 py-3 rounded-xl bg-background border border-card-border focus:border-primary focus:outline-none transition-colors" placeholder="john@example.com" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-foreground mb-2">Message</label>
                            <textarea className="w-full px-4 py-3 rounded-xl bg-background border border-card-border focus:border-primary focus:outline-none transition-colors h-32" placeholder="How can we help?" />
                        </div>
                        <button className="w-full py-4 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                            Send Message
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}
