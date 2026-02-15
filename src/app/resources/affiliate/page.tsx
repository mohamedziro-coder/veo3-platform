import { generateSchema } from "@/lib/schema";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Affiliate Program - Earn with Virezo",
    description: "Join the Virezo affiliate program and earn 30% recurring commission.",
};

export default function AffiliatePage() {
    return (
        <main className="min-h-screen pt-32 pb-20 px-6">
            <div className="max-w-5xl mx-auto text-center">
                <span className="text-secondary font-bold tracking-widest uppercase text-sm mb-4 block">Partner Program</span>
                <h1 className="text-5xl md:text-7xl font-black text-foreground mb-8">
                    Earn 30% Recurring <br /> Commission
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-16">
                    Refer creators and agencies to Virezo and build a passive income stream.
                    We provide all the assets you need to succeed.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 text-left">
                    <div className="bg-card-bg p-8 rounded-3xl border border-card-border">
                        <div className="text-4xl mb-4">💸</div>
                        <h3 className="text-xl font-bold text-foreground mb-2">High Commission</h3>
                        <p className="text-muted-foreground">Get 30% of every payment for the first 12 months.</p>
                    </div>
                    <div className="bg-card-bg p-8 rounded-3xl border border-card-border">
                        <div className="text-4xl mb-4">🍪</div>
                        <h3 className="text-xl font-bold text-foreground mb-2">60-Day Cookie</h3>
                        <p className="text-muted-foreground">Get credit even if they sign up months later.</p>
                    </div>
                    <div className="bg-card-bg p-8 rounded-3xl border border-card-border">
                        <div className="text-4xl mb-4">📈</div>
                        <h3 className="text-xl font-bold text-foreground mb-2">Real-time Dashboard</h3>
                        <p className="text-muted-foreground">Track clicks, conversions, and payouts instantly.</p>
                    </div>
                </div>

                <button className="px-12 py-5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-black text-xl hover:shadow-2xl hover:shadow-primary/20 transition-all transform hover:-translate-y-1">
                    Apply Now
                </button>
            </div>
        </main>
    );
}
