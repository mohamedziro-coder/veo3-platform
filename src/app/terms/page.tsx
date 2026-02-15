import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms of Service - Virezo",
    description: "The rules and regulations for using Virezo's website and services.",
};

export default function TermsPage() {
    return (
        <main className="min-h-screen pt-32 pb-20 px-6">
            <div className="max-w-4xl mx-auto prose prose-invert prose-lg">
                <h1 className="text-5xl font-black text-foreground mb-8">Terms of Service</h1>
                <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>

                <h2>1. Acceptance of Terms</h2>
                <p>
                    By accessing or using Virezo, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service.
                </p>

                <h2>2. Usage Restrictions</h2>
                <p>
                    You agree not to use the Service to generate content that is illegal, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or otherwise objectionable. <strong>Deepfakes of real people without their consent are strictly prohibited.</strong>
                </p>

                <h2>3. Intellectual Property</h2>
                <p>
                    You retain all rights to the videos you generate using our Service, subject to the terms of your subscription plan.
                </p>

                <h2>4. Limitation of Liability</h2>
                <p>
                    In no event shall Virezo, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages.
                </p>
            </div>
        </main>
    );
}
