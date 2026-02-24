import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy - Virezo",
    description: "How we collect, use, and protect your data.",
    alternates: {
        canonical: "/privacy",
    },
};

export default function PrivacyPage() {
    return (
        <main className="min-h-screen pt-32 pb-20 px-6">
            <div className="max-w-4xl mx-auto prose prose-invert prose-lg">
                <h1 className="text-5xl font-black text-foreground mb-8">Privacy Policy</h1>
                <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>

                <h2>1. Introduction</h2>
                <p>
                    Virezo ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and share your personal information when you visit our website or use our services.
                </p>

                <h2>2. Data Collection</h2>
                <p>
                    We collect information you provide directly to us, such as when you create an account, subscribe to our newsletter, or contact support. This may include your name, email address, and payment information.
                </p>

                <h2>3. AI & Data Usage</h2>
                <p>
                    <strong>We do not use your private video data to train our public models without your explicit consent.</strong> Videos generated on our platform are private by default.
                </p>

                <h2>4. GDPR Compliance</h2>
                <p>
                    If you are a resident of the European Economic Area (EEA), you have certain data protection rights. Virezo aims to take reasonable steps to allow you to correct, amend, delete, or limit the use of your Personal Data.
                </p>

                <h2>5. Contact Us</h2>
                <p>
                    If you have any questions about this Privacy Policy, please contact us at privacy@virezo.com.
                </p>
            </div>
        </main>
    );
}
