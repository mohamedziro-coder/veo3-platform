"use client";

import { motion, Variants } from "framer-motion";
import { Zap, Rocket, ShieldCheck, Layers, Library, BarChart3 } from "lucide-react";

interface FeaturesProps {
    itemVariants: Variants;
    staggerContainer: Variants;
}

const features = [
    {
        icon: <Zap className="w-8 h-8" />,
        title: "Generative Ad Engine",
        desc: "Turn product URLs into winning video scripts and visuals instantly. Zero editing skills required."
    },
    {
        icon: <Rocket className="w-8 h-8" />,
        title: "Mass Campaign Launcher",
        desc: "Deploy hundreds of ad sets in a single click. Skip the manual grind and focus on strategy."
    },
    {
        icon: <ShieldCheck className="w-8 h-8" />,
        title: "Automated Budget Protection",
        desc: "Our algorithms cut wasting ads and double down on profits 24/7. No more babysitting dashboards."
    },
    {
        icon: <Layers className="w-8 h-8" />,
        title: "Centralized Agency Hub",
        desc: "One command center for all your brands. Toggle between ad accounts without friction."
    },
    {
        icon: <Library className="w-8 h-8" />,
        title: "Winning Strategy Library",
        desc: "Don't reinvent the wheel. Save your best structures and deploy them instantly across new accounts."
    },
    {
        icon: <BarChart3 className="w-8 h-8" />,
        title: "Real-Time Profit Vision",
        desc: "Aggregated data streams giving you the pulse of your ROI instantly. Spot trends before your competitors."
    }
];

export default function Features({ itemVariants, staggerContainer }: FeaturesProps) {
    return (
        <section className="py-48 px-6 bg-background">
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15 }}
                variants={staggerContainer}
                className="max-w-[1400px] mx-auto space-y-32"
            >
                <motion.div variants={itemVariants} className="text-center space-y-8">
                    <h2 className="text-5xl md:text-7xl lg:text-[5.5rem] font-black text-foreground tracking-tight leading-[1]">Why Top Media Buyers Scale With Us</h2>
                    <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto font-medium">Unfair advantage through AI automation. Launch faster, test smarter, and scale harder.</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
                    {features.map((feature, i) => (
                        <motion.div
                            key={i}
                            variants={itemVariants}
                            whileHover={{
                                y: -15,
                                transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
                            }}
                            className="group p-14 rounded-[3.5rem] bg-card-bg border border-card-border shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_40px_80px_-20px_rgba(74,144,226,0.15)] hover:border-primary/20 transition-all duration-300 flex flex-col items-start text-left"
                        >
                            <div className="w-20 h-20 rounded-2xl bg-primary/5 flex items-center justify-center text-primary mb-12 group-hover:bg-primary group-hover:text-white group-hover:scale-110 transition-all duration-500">
                                {feature.icon}
                            </div>
                            <h3 className="text-3xl font-bold text-foreground mb-6 tracking-tight">{feature.title}</h3>
                            <p className="text-xl text-muted-foreground leading-relaxed font-medium">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
}
