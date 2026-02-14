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
        <section className="py-24 px-6 bg-background overflow-hidden">
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                variants={staggerContainer}
                className="max-w-7xl mx-auto space-y-20"
            >
                <motion.div variants={itemVariants} className="text-center space-y-4">
                    <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">Loved by High-Growth Brands</h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">Real results from marketers scaling past 7-figures.</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, i) => (
                        <motion.div
                            key={i}
                            variants={itemVariants}
                            whileHover={{ y: -10, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }}
                            className="group p-10 rounded-[2.5rem] bg-card-bg border border-card-border shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] hover:border-primary/20 transition-all duration-500 relative flex flex-col justify-between"
                        >
                            <div>
                                <div className="flex justify-between items-start mb-8">
                                    <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                                        <Quote className="w-6 h-6 fill-current" />
                                    </div>
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <Star key={s} className="w-4 h-4 text-accent fill-current" />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-lg text-muted-foreground leading-relaxed font-medium mb-10 italic">"{testimonial.text}"</p>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/10 flex items-center justify-center text-primary font-bold">
                                    {testimonial.initials}
                                </div>
                                <div>
                                    <div className="font-bold text-foreground">{testimonial.name}</div>
                                    <div className="text-sm text-muted-foreground font-medium">{testimonial.role}</div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    variants={itemVariants}
                    className="pt-10 text-center space-y-8"
                >
                    <div className="flex flex-col items-center gap-2">
                        <div className="flex -space-x-2">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground">
                                    U{i}
                                </div>
                            ))}
                            <div className="w-10 h-10 rounded-full border-2 border-background bg-primary flex items-center justify-center text-[10px] font-bold text-white">
                                +5k
                            </div>
                        </div>
                        <p className="text-muted-foreground font-bold tracking-tight">Join 5,000+ happy customers</p>
                    </div>

                    <Link
                        href="/signup"
                        className="inline-flex items-center gap-2 px-10 py-5 rounded-2xl bg-primary text-white font-bold text-lg hover:bg-primary/90 transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-primary/20"
                    >
                        <span>Start Scaling Now</span>
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </motion.div>
            </motion.div>
        </section>
    );
}
