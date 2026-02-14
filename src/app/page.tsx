"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { Sparkles, Play, ArrowRight } from "lucide-react";
import Counter from "@/components/Counter";

// Lazy-load heavy components
const Features = dynamic(() => import("@/components/landing/Features"), { ssr: false });
const HowItWorks = dynamic(() => import("@/components/landing/HowItWorks"), { ssr: false });
const Demos = dynamic(() => import("@/components/landing/Demos"), { ssr: false });
const Testimonials = dynamic(() => import("@/components/landing/Testimonials"), { ssr: false });
const FAQ = dynamic(() => import("@/components/landing/FAQ"), { ssr: false });
const FinalCTA = dynamic(() => import("@/components/landing/FinalCTA"), { ssr: false });

export default function HomePage() {
  const faqs = [
    {
      question: "What is Virezo AI Video Platform?",
      answer: "Virezo is an advanced AI-powered video generation platform. We help creators, marketers, and businesses turn ideas into viral, broadcast-quality content in seconds using realistic avatars and native multi-language voiceovers."
    },
    {
      question: "How does the AI UGC Generator work?",
      answer: "It's simple: just paste your product link. Our AI analyzes the page, identifies key selling points, writes a high-conversion script, and generates a polished video with a lifelike avatar—all in under a minute."
    },
    {
      question: "Do I have commercial rights to the videos?",
      answer: "Absolutely. Every video you generate on the Virezo platform comes with full commercial usage rights. You can use them for TikTok ads, Instagram Reels, YouTube, or your own website without any restrictions."
    },
    {
      question: "Which languages does Virezo support?",
      answer: "We support over 30 languages with native-level pronunciation and local dialects. This includes English, Spanish, French, German, Arabic, Japanese, and many more, allowing you to reach a global audience effortlessly."
    },
    {
      question: "Do I need any technical or video editing skills?",
      answer: "None at all. Virezo is designed for everyone. Our cloud-based AI handles the scriptwriting, voiceover, and video editing. You just provide the link or idea, and we deliver the final viral-ready video."
    }
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const demos = [
    { id: 1, title: "Product Promo", video: "/videos/demo1.mp4", thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&fit=crop" },
    { id: 2, title: "Social Reel", video: "/videos/demo2.mp4", thumbnail: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&fit=crop" },
    { id: 3, title: "E-com UGC", video: "/videos/demo3.mp4", thumbnail: "https://images.unsplash.com/photo-1536240478700-b869070f9279?w=400&fit=crop" },
    { id: 4, title: "News Update", video: "/videos/demo4.mp4", thumbnail: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400&fit=crop" },
    { id: 5, title: "Travel Blog", video: "/videos/demo5.mp4", thumbnail: "https://images.unsplash.com/photo-1502444330042-d1a1ddf9bb5b?w=400&fit=crop" },
    { id: 6, title: "Style Guide", video: "/videos/demo6.mp4", thumbnail: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&fit=crop" }
  ];

  return (
    <main className="min-h-screen bg-background text-foreground font-sans overflow-x-hidden selection:bg-primary/20 selection:text-primary">
      {/* FAQ Schema for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-20 px-6 md:px-12 overflow-hidden">
        {/* Subtle Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
          <div className="absolute -top-[20%] -right-[10%] w-[50vw] h-[50vw] bg-secondary/5 rounded-full blur-[100px]" />
          <div className="absolute top-[20%] -left-[10%] w-[40vw] h-[40vw] bg-primary/5 rounded-full blur-[100px]" />
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-5xl mx-auto text-center space-y-8"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="flex justify-center">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 text-sm font-medium text-primary cursor-default hover:bg-primary/10 transition-colors">
              <Sparkles className="w-4 h-4 fill-current animate-pulse" />
              <span>The Next Gen of AI Video</span>
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] text-foreground"
          >
            Create <span className="text-primary relative inline-block">
              Viral Videos
              <motion.svg
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="absolute w-full h-3 -bottom-1 left-0 text-secondary opacity-40" viewBox="0 0 100 10" preserveAspectRatio="none"
              >
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
              </motion.svg>
            </span> <br />
            With Artificial Intelligence.
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            Turn ideas into broadcast-quality content in seconds.
            Realistic avatars, native multi-language voiceovers, and endless creativity.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Link
              href="/signup"
              className="px-8 py-4 rounded-xl bg-primary text-white font-bold text-lg hover:bg-blue-600 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transform hover:-translate-y-1 hover:scale-105"
            >
              Start Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <button className="px-8 py-4 rounded-xl bg-card-bg border border-card-border text-foreground font-bold text-lg hover:bg-muted transition-all flex items-center justify-center gap-2 shadow-sm transform hover:-translate-y-1">
              <Play className="w-5 h-5 text-primary" />
              Watch Demo
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* 2. STATS SECTION (LCP Critical - Kept Static for now) */}
      <section className="py-20 px-6 bg-background overflow-hidden border-t border-card-border">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
          className="max-w-7xl mx-auto"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { label: "Active users", value: "5,000+" },
              { label: "Creatives generated", value: "50,000+" },
              { label: "Campaigns launched", value: "100,000+" },
              { label: "Saved weekly per user", value: "15 hrs" }
            ].map((stat, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="p-8 rounded-3xl bg-muted/50 border border-card-border flex flex-col items-center justify-center text-center group transition-all hover:bg-card-bg hover:shadow-xl hover:border-primary/20"
              >
                <span className="text-4xl md:text-5xl font-black text-primary mb-3">
                  <Counter value={stat.value} />
                </span>
                <span className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Lazy Loaded Sections */}
      <Features itemVariants={itemVariants} staggerContainer={staggerContainer} />
      <HowItWorks itemVariants={itemVariants} staggerContainer={staggerContainer} />
      <Demos demos={demos} />
      <Testimonials itemVariants={itemVariants} staggerContainer={staggerContainer} />
      <FAQ faqs={faqs} itemVariants={itemVariants} staggerContainer={staggerContainer} />
      <FinalCTA itemVariants={itemVariants} staggerContainer={staggerContainer} />

      {/* Footer Minimal */}
      <footer className="py-12 bg-background border-t border-card-border text-center text-muted-foreground text-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-center gap-8 mb-6">
            <Link href="#" className="hover:text-primary transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-primary transition-colors">Terms</Link>
            <Link href="#" className="hover:text-primary transition-colors">Twitter</Link>
          </div>
          <p>&copy; 2026 Virezo Platform. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
