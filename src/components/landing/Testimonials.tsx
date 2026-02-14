"use client";

import { motion, Variants } from "framer-motion";
import { Quote, Star, ArrowRight } from "lucide-react";
import Link from "next/link";

interface TestimonialsProps {
    itemVariants: Variants;
    staggerContainer: Variants;
}

const testimonials = [
    {
        text: "We wasted budget for months on testing. With this platform, we found winning hooks in 24 hours. Our ROAS went from 1.5x to 4.2x instantly.",
        name: "David R.",
        role: "E-com Founder",
        initials: "DR"
    },
    {
        text: "The speed is insane. I used to spend weekends managing creative briefs. Now, the AI does the heavy lifting while I focus on strategy.",
        name: "Sarah L.",
        role: "Head of Growth",
        initials: "SL"
    },
    {
        text: "Allowed us to onboard 5 new clients without hiring extra staff. The automation paid for itself in the first week. Absolute game changer.",
        name: "Karim B.",
        role: "Agency Owner",
        initials: "KB"
    }
];

export default function Testimonials({ itemVariants, staggerContainer }: TestimonialsProps) {
    return (
        <section className="py-48 px-6 bg-background overflow-hidden">
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                variants={staggerContainer}
                className="max-w-[1400px] mx-auto space-y-32"
            >
                <motion.div variants={itemVariants} className="text-center space-y-8">
                    <h2 className="text-5xl md:text-7xl font-black text-foreground tracking-tight leading-[1]">Loved by High-Growth Brands</h2>
                    <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto font-medium">Real results from marketers scaling past 7-figures.</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {testimonials.map((testimonial, i) => (
                        <motion.div
                            key={i}
                            variants={itemVariants}
                            whileHover={{ y: -15, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }}
                            className="group p-14 rounded-[3.5rem] bg-card-bg border border-card-border shadow-[0_10px_40px_-5px_rgba(0,0,0,0.03)] hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] hover:border-primary/20 transition-all duration-500 relative flex flex-col justify-between"
                        >
                            <div>
                                <div className="flex justify-between items-start mb-10">
                                    <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                                        <Quote className="w-8 h-8 fill-current" />
                                    </div>
                                    <div className="flex gap-1.5">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <Star key={s} className="w-5 h-5 text-accent fill-current" />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-medium mb-12 italic">"{testimonial.text}"</p>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/10 flex items-center justify-center text-primary font-black text-xl">
                                    {testimonial.initials}
                                </div>
                                <div>
                                    <div className="text-xl font-bold text-foreground">{testimonial.name}</div>
                                    <div className="text-base text-muted-foreground font-medium">{testimonial.role}</div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    variants={itemVariants}
                    className="pt-16 text-center space-y-12"
                >
                    <div className="flex flex-col items-center gap-4">
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-12 h-12 rounded-full border-2 border-background bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground backdrop-blur-sm">
                                    U{i}
                                </div>
                            ))}
                            <div className="w-12 h-12 rounded-full border-2 border-background bg-primary flex items-center justify-center text-xs font-black text-white">
                                +5k
                            </div>
                        </div>
                        <p className="text-xl text-muted-foreground font-black tracking-tight uppercase tracking-[0.2em]">Join 5,000+ happy customers</p>
                    </div>

                    <Link
                        href="/signup"
                        className="inline-flex items-center gap-3 px-14 py-7 rounded-[2rem] bg-primary text-white font-black text-xl hover:bg-primary/90 transition-all transform hover:scale-105 active:scale-95 shadow-2xl shadow-primary/30"
                    >
                        <span>Start Scaling Now</span>
                        <ArrowRight className="w-6 h-6" />
                    </Link>
                </motion.div>
            </motion.div>
        </section>
    );
}
