"use client";

import { motion } from "framer-motion";
import { Check, Sparkles, Shield, Zap, Star, CreditCard } from "lucide-react";
import { useEffect, useState } from "react";

type Plan = {
    id: string;
    name: string;
    price: string;
    credits: number;
    description: string;
    features: string[];
    cta: string;
    popular: boolean;
};

const PLANS: Plan[] = [
    {
        id: "free_credits",
        name: "Free Welcome Pack",
        price: "Free",
        credits: 50,
        description: "New users can activate 50 free credits via support.",
        features: [
            "50 Free One-Time Credits",
            "For newly registered users",
            "Activation via WhatsApp support",
            "Send your account email to activate",
            "No payment required",
        ],
        cta: "Activate Free 50 Credits",
        popular: false,
    },
    {
        id: "starter_credits",
        name: "Starter Pack",
        price: "$9",
        credits: 200,
        description: "Best for testing and short creative runs.",
        features: [
            "200 One-Time Credits",
            "Full Video, Image, Voice Tools",
            "No monthly subscription",
            "Credits never expire",
            "WhatsApp support for activation",
        ],
        cta: "Buy 200 Credits",
        popular: false,
    },
    {
        id: "pro_credits",
        name: "Pro Pack",
        price: "$29",
        credits: 1000,
        description: "Most popular value for active creators.",
        features: [
            "1000 One-Time Credits",
            "Full Video, Image, Voice Tools",
            "No monthly subscription",
            "Credits never expire",
            "Priority WhatsApp support",
        ],
        cta: "Buy 1000 Credits",
        popular: true,
    },
    {
        id: "scale_credits",
        name: "Scale Pack",
        price: "$99",
        credits: 4000,
        description: "For teams and heavy production workflows.",
        features: [
            "4000 One-Time Credits",
            "Full Video, Image, Voice Tools",
            "No monthly subscription",
            "Credits never expire",
            "Priority support",
        ],
        cta: "Buy 4000 Credits",
        popular: false,
    },
];

const SUPPORT_PHONE = "212718502063";

export default function PricingPage() {
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
    const [userEmail, setUserEmail] = useState<string>("");

    useEffect(() => {
        const raw = localStorage.getItem("current_user");
        if (!raw) return;
        try {
            const user = JSON.parse(raw);
            if (user?.email) setUserEmail(String(user.email));
        } catch {
            // no-op
        }
    }, []);

    const getWhatsappMessage = (plan: Plan) => {
        return [
            "Hello Virezo Support,",
            "",
            "I want to buy a credits pack:",
            `- Pack: ${plan.name}`,
            `- Credits: ${plan.credits}`,
            `- Price: ${plan.price}`,
            userEmail ? `- My account email: ${userEmail}` : "",
            "",
            "Please help me complete the payment and activate credits.",
        ]
            .filter(Boolean)
            .join("\n");
    };

    const openWhatsapp = (plan: Plan) => {
        const message = encodeURIComponent(getWhatsappMessage(plan));
        const url = `https://wa.me/${SUPPORT_PHONE}?text=${message}`;
        window.open(url, "_blank", "noopener,noreferrer");
    };

    return (
        <main className="min-h-screen pt-48 pb-32 px-4 md:px-12 bg-[#FAFAFB] dark:bg-background relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[1000px] h-[1000px] rounded-full bg-primary/10 blur-[150px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[1000px] h-[1000px] rounded-full bg-accent/5 blur-[150px]" />
            </div>

            <div className="max-w-[1400px] mx-auto px-6 relative z-10">
                <div className="text-center mb-32 space-y-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-primary/10 text-primary text-sm font-black uppercase tracking-[0.25em]"
                    >
                        <Sparkles className="w-5 h-5" />
                        <span>Simple Pricing</span>
                    </motion.div>

                    <h1 className="text-5xl md:text-8xl lg:text-[7.5rem] font-black tracking-tight leading-[0.95] mb-8 text-foreground italic md:not-italic">
                        Buy Credits, <br className="hidden md:block" /> No Subscription
                    </h1>
                    <p className="text-xl md:text-3xl text-muted-foreground max-w-4xl mx-auto leading-relaxed font-medium">
                        Choose your credits pack. You can also activate a free 50-credit welcome pack via WhatsApp support.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {PLANS.map((plan) => (
                        <div
                            key={plan.id}
                            className={`relative rounded-[3.5rem] p-14 border transition-all duration-500 flex flex-col h-full ${plan.popular
                                    ? "bg-white dark:bg-card-bg border-primary/40 shadow-[0_40px_80px_-20px_rgba(74,144,226,0.25)] scale-[1.05] z-10"
                                    : "bg-white/60 dark:bg-card-bg/60 border-card-border hover:border-primary/30 hover:bg-white dark:hover:bg-card-bg hover:shadow-2xl"
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-2 rounded-full text-base font-black shadow-xl tracking-widest uppercase">
                                    Most Popular
                                </div>
                            )}

                            <div className="mb-12">
                                <h3 className={`text-2xl font-black mb-4 uppercase tracking-[0.1em] ${plan.popular ? "text-primary" : "text-foreground"}`}>{plan.name}</h3>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-5xl md:text-7xl font-black text-foreground tracking-tighter">{plan.price}</span>
                                    <span className="text-xl text-muted-foreground font-bold">one-time</span>
                                </div>
                                <p className="text-muted-foreground mt-8 text-lg md:text-xl font-medium leading-relaxed">{plan.description}</p>
                                <p className="mt-4 inline-flex rounded-full bg-primary/10 px-4 py-1.5 text-sm font-black text-primary tracking-wide">
                                    {plan.credits} Credits
                                </p>
                            </div>

                            <ul className="space-y-6 mb-12 flex-grow">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-4 text-lg md:text-xl font-medium">
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${plan.popular ? "bg-primary/10 text-primary" : "bg-gray-200 dark:bg-white/10 text-gray-400"}`}>
                                            <Check className="w-4 h-4 stroke-[4px]" />
                                        </div>
                                        <span className="text-muted-foreground">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                type="button"
                                onClick={() => setSelectedPlan(plan)}
                                className={`w-full py-6 rounded-2xl font-black text-xl transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 ${plan.popular
                                        ? "bg-primary text-white hover:bg-primary/90 shadow-primary/30"
                                        : "bg-white dark:bg-card-bg border border-card-border text-foreground hover:bg-gray-50 dark:hover:bg-muted/50 hover:border-gray-300"
                                    }`}
                            >
                                <span>{plan.cta}</span>
                                {plan.popular && <Sparkles className="w-5 h-5 fill-white" />}
                            </button>
                        </div>
                    ))}
                </div>

                <div className="max-w-[1400px] mx-auto mt-48 text-center relative z-10 border-t border-card-border pt-24">
                    <p className="text-sm md:text-base font-black text-muted-foreground uppercase tracking-[0.3em] mb-12">Trusted by Creators from</p>
                    <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-40 grayscale hover:grayscale-0 transition-all duration-1000">
                        <div className="flex items-center gap-3 text-2xl md:text-4xl font-black text-foreground"><Shield className="w-8 h-8 md:w-10 md:h-10 text-primary" /> Google</div>
                        <div className="flex items-center gap-3 text-2xl md:text-4xl font-black text-foreground"><Zap className="w-8 h-8 md:w-10 md:h-10 text-yellow-500" /> OpenAI</div>
                        <div className="flex items-center gap-3 text-2xl md:text-4xl font-black text-foreground"><Star className="w-8 h-8 md:w-10 md:h-10 text-orange-500" /> Anthropic</div>
                        <div className="flex items-center gap-3 text-2xl md:text-4xl font-black text-foreground"><CreditCard className="w-8 h-8 md:w-10 md:h-10 text-blue-600" /> Stripe</div>
                    </div>
                </div>
            </div>

            {selectedPlan && (
                <div className="fixed inset-0 z-[12000] flex items-center justify-center p-4 bg-black/55 backdrop-blur-sm">
                    <div className="w-full max-w-lg rounded-3xl border border-card-border bg-card-bg p-7 md:p-8 shadow-2xl">
                        <h3 className="text-2xl font-black text-foreground mb-2">Contact Support on WhatsApp</h3>
                        <p className="text-muted-foreground mb-5">
                            Pack selected: <span className="font-bold text-foreground">{selectedPlan.name}</span> ({selectedPlan.credits} credits - {selectedPlan.price})
                        </p>

                        <div className="rounded-2xl border border-card-border bg-muted/50 p-4 mb-6">
                            <p className="text-sm text-muted-foreground mb-2">Support Number</p>
                            <p className="text-lg font-black text-foreground">+212 718 502 063</p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                type="button"
                                onClick={() => openWhatsapp(selectedPlan)}
                                className="flex-1 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold py-3"
                            >
                                Open WhatsApp
                            </button>
                            <button
                                type="button"
                                onClick={() => setSelectedPlan(null)}
                                className="flex-1 rounded-xl border border-card-border text-foreground font-bold py-3 hover:bg-muted"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
