"use client";

import { motion } from "framer-motion";
import { Check, Sparkles, Zap, Shield, Globe, ArrowRight } from "lucide-react";
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
        <main className="min-h-screen bg-black text-white relative overflow-hidden pt-24 pb-20">
            {/* Ambient Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-purple-900/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-blue-900/10 rounded-full blur-[150px]" />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Header */}
                <div className="text-center mb-20 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-sm font-medium text-purple-300"
                    >
                        <Sparkles className="w-4 h-4" />
                        <span>Simple Pricing</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400"
                    >
                        Choose Your Power
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-gray-400 max-w-2xl mx-auto"
                    >
                        Unlock the full potential of Veo 3.0 with flexible plans designed for every stage of your creative journey.
                    </motion.p>
                </div>

                {/* Pricing Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {PLANS.map((plan, i) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + (i * 0.1) }}
                            className={`relative group rounded-3xl p-1 ${plan.popular ? 'ring-2 ring-purple-500/50 shadow-[0_0_50px_rgba(168,85,247,0.2)]' : 'border border-white/10'}`}
                        >
                            {/* Card Background & Glass Effect */}
                            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent rounded-3xl pointer-events-none" />
                            <div className="h-full bg-black/60 backdrop-blur-xl rounded-[1.4rem] p-8 flex flex-col relative overflow-hidden">

                                {/* Popular Badge */}
                                {plan.popular && (
                                    <div className="absolute top-0 right-0 bg-gradient-to-bl from-purple-600 to-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-bl-2xl">
                                        MOST POPULAR
                                    </div>
                                )}

                                {/* Plan Name & Description */}
                                <div className="mb-8">
                                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                                    <p className="text-gray-400 text-sm h-10">{plan.description}</p>
                                </div>

                                {/* Price */}
                                <div className="mb-8 flex items-baseline gap-1">
                                    <span className="text-4xl font-bold tracking-tight">{plan.price}</span>
                                    {plan.period && <span className="text-gray-500">{plan.period}</span>}
                                </div>

                                {/* Action Button */}
                                <Link
                                    href={plan.href}
                                    className={`w-full py-4 rounded-xl font-bold text-center transition-all mb-8 flex items-center justify-center gap-2 group/btn ${plan.popular
                                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-[1.02] shadow-lg shadow-purple-900/20'
                                            : 'bg-white/10 hover:bg-white/20'
                                        }`}
                                >
                                    {plan.cta}
                                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                </Link>

                                {/* Features List */}
                                <div className="space-y-4 flex-1">
                                    {plan.features.map((feature, fIndex) => (
                                        <div key={fIndex} className="flex items-start gap-3 text-sm text-gray-300">
                                            <div className={`mt-0.5 p-0.5 rounded-full ${plan.popular ? 'bg-purple-500/20 text-purple-300' : 'bg-gray-800 text-gray-400'}`}>
                                                <Check className="w-3 h-3" />
                                            </div>
                                            <span>{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Trust Badges */}
                <div className="mt-24 pt-12 border-t border-white/5 flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                    {/* Add dummy logs or trust text */}
                    <div className="flex items-center gap-2"><Globe className="w-5 h-5" /> Global Payment Support</div>
                    <div className="flex items-center gap-2"><Shield className="w-5 h-5" /> Secure SSL Encryption</div>
                    <div className="flex items-center gap-2"><Zap className="w-5 h-5" /> Instant Activation</div>
                </div>
            </div>
        </main>
    );
}
