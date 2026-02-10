"use client";

import { motion } from "framer-motion";
import { ArrowRight, Check, Sparkles, Globe, Shield, Zap, Star, CreditCard } from 'lucide-react';
import Link from "next/link";

const PLANS = [
    {
        name: "Starter",
        price: "Free",
        description: "Perfect for exploring AI content creation.",
        features: [
            "50 Credits per month",
            "720p Video Resolution",
            "Standard Image Generation",
            "Basic Voice Cloning",
            "Community Support"
        ],
        cta: "Get Started",
        href: "/signup",
        popular: false,
        gradient: "from-gray-500 to-gray-700"
    },
    {
        name: "Pro",
        price: "$29",
        period: "/month",
        description: "For creators who need professional tools.",
        features: [
            "1000 Credits per month",
            "4K Video Resolution",
            "Ultra-HD Image Generation",
            "Premium Voice Models",
            "Priority Processing",
            "Commercial License"
        ],
        cta: "Upgrade to Pro",
        href: "/signup?plan=pro",
        popular: true,
        gradient: "from-blue-500 to-purple-600"
    },
    {
        name: "Enterprise",
        price: "Custom",
        description: "Scalable solutions for teams and businesses.",
        features: [
            "Unlimited Credits",
            "Custom AI Models",
            "API Access",
            "Dedicated Support Manager",
            "SSO & Security",
            "SLA Guarantee"
        ],
        cta: "Contact Sales",
        href: "mailto:sales@veoplatform.com",
        popular: false,
        gradient: "from-pink-500 to-orange-500"
    }
];

export default function PricingPage() {
    return (
        <main className="min-h-screen pt-24 pb-20 px-4 md:px-8 bg-gray-50 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-blue-500/5 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-purple-500/5 blur-[120px]" />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Header */}
                <div className="text-center mb-20 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-700 text-sm font-medium"
                    >
                        <Sparkles className="w-4 h-4" />
                        <span>Simple Pricing</span>
                    </motion.div>

                    <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6 text-gray-900">
                        Simple, Transparent Pricing
                    </h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
                        Choose the plan that fits your creative needs. Unlock the full potential of Veo 3.0.
                    </p>
                </div>

                {/* Pricing Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {PLANS.map((plan, i) => (
                        <div
                            key={plan.name}
                            className={`relative rounded-3xl p-8 border transition-all duration-300 flex flex-col h-full ${plan.popular
                                ? 'bg-white border-primary/20 shadow-xl scale-[1.02] z-10'
                                : 'bg-white/60 border-gray-200 hover:border-primary/20 hover:bg-white hover:shadow-lg'
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                                    Most Popular
                                </div>
                            )}

                            <div className="mb-8">
                                <h3 className={`text-xl font-bold mb-2 ${plan.popular ? 'text-primary' : 'text-gray-900'}`}>{plan.name}</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl md:text-5xl font-black text-gray-900">{plan.price}</span>
                                    {plan.period && <span className="text-gray-500">{plan.period}</span>}
                                </div>
                                <p className="text-gray-500 mt-4 text-sm leading-relaxed">{plan.description}</p>
                            </div>

                            <ul className="space-y-4 mb-8 flex-grow">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm">
                                        <Check className={`w-5 h-5 flex-shrink-0 ${plan.popular ? 'text-primary' : 'text-gray-400'}`} />
                                        <span className="text-gray-600">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button className={`w-full py-4 rounded-xl font-bold transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 ${plan.popular
                                ? 'bg-primary text-white hover:bg-primary/90 shadow-primary/20'
                                : 'bg-white border border-gray-200 text-gray-900 hover:bg-gray-50 hover:border-gray-300'
                                }`}>
                                <span>{plan.cta}</span>
                                {plan.popular && <Sparkles className="w-4 h-4" />}
                            </button>
                        </div>
                    ))}
                </div>

                {/* Trust Badges */}
                <div className="max-w-7xl mx-auto mt-20 text-center relative z-10">
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-8">Trusted by Creators from</p>
                    <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        {/* Placeholder logos */}
                        <div className="flex items-center gap-2 text-xl font-black text-gray-900"><Shield className="w-6 h-6" /> Google</div>
                        <div className="flex items-center gap-2 text-xl font-black text-gray-900"><Zap className="w-6 h-6" /> OpenAI</div>
                        <div className="flex items-center gap-2 text-xl font-black text-gray-900"><Star className="w-6 h-6" /> Anthropic</div>
                        <div className="flex items-center gap-2 text-xl font-black text-gray-900"><CreditCard className="w-6 h-6" /> Stripe</div>
                    </div>
                </div>
            </div>
        </main>
    );
}
