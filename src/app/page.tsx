"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { Sparkles, Play, ArrowRight, Shield, Globe2, Zap, Lock } from "lucide-react";
import { useEffect } from "react";
import Counter from "@/components/Counter";

// Lazy-load heavy components
const Features = dynamic(() => import("@/components/landing/Features"), { ssr: false });
const HowItWorks = dynamic(() => import("@/components/landing/HowItWorks"), { ssr: false });
const Demos = dynamic(() => import("@/components/landing/Demos"), { ssr: false });
const Testimonials = dynamic(() => import("@/components/landing/Testimonials"), { ssr: false });
const FAQ = dynamic(() => import("@/components/landing/FAQ"), { ssr: false });
const FinalCTA = dynamic(() => import("@/components/landing/FinalCTA"), { ssr: false });

export default function HomePage() {
  // ── AEO-Optimized FAQs (structured for AI Search Engines + Schema Markup) ──
  const faqs = [
    {
      question: "What is Virezo.pro?",
      answer: "Virezo.pro is a B2B AI video generation platform that lets businesses create broadcast-quality videos featuring realistic talking avatars in over 30 languages — without cameras, actors, or post-production. It is purpose-built for marketing teams, e-commerce brands, and media agencies that need to scale video content production at a fraction of traditional costs."
    },
    {
      question: "How does the AI avatar video generator work?",
      answer: "Virezo's AI avatar video generator works in three steps: (1) You enter a script or paste a product URL — our AI writes the script automatically. (2) You select a photorealistic digital avatar and language. (3) A broadcast-quality video is rendered in under 60 seconds. No editing software, no filming equipment, and no technical expertise required."
    },
    {
      question: "What is UGC video creation and how does Virezo support it?",
      answer: "UGC (User-Generated Content) video creation refers to producing casual, authentic-looking short-form videos that mimic real customer testimonials — the format that drives the highest conversion rates on TikTok and Instagram. Virezo's UGC Generator automates this: it analyzes your product, writes a conversion-optimized script, and produces multiple avatar-led UGC ad variations in minutes, at under $5 per video."
    },
    {
      question: "How much does AI video production cost compared to traditional video production?",
      answer: "Traditional video production typically costs $500–$5,000 per video and takes 1–4 weeks with actors, studios, and editors. With Virezo, the cost per AI-generated video is under $5, production time is under 60 seconds, and you can create unlimited variations at any time of day. For agencies and e-commerce brands running high-volume campaigns, this represents a 99% cost reduction."
    },
    {
      question: "Which languages does Virezo support for AI video dubbing?",
      answer: "Virezo supports 30+ languages with native-level pronunciation, including English, French, German, Spanish, Italian, Dutch, Portuguese, Arabic, Japanese, Chinese, and more. Our instant dubbing technology is specifically designed for multinational European companies and global e-commerce brands that need localized video content at scale — without hiring translators or voice actors."
    },
    {
      question: "Is Virezo GDPR compliant and where is data hosted?",
      answer: "Yes. Virezo.pro is fully GDPR compliant. We operate on EU-hosted infrastructure, meaning all your data — including video scripts, generated content, and account information — is stored within the European Union in accordance with GDPR regulations. We do not sell, share, or process your data for advertising purposes."
    },
    {
      question: "What types of businesses use Virezo for AI video generation?",
      answer: "Virezo is used by: (1) E-commerce brands generating product demo and UGC ad videos at scale; (2) Performance marketing agencies creating multi-language ad creatives for European and global campaigns; (3) SaaS companies producing onboarding, explainer, and feature-announcement videos; (4) Media and content teams that need daily video output without increasing headcount."
    },
    {
      question: "Do I need video editing skills to use Virezo?",
      answer: "No technical or video editing skills are required. Virezo is a fully cloud-based AI video software with a no-code interface. The platform handles scriptwriting, avatar selection, voiceover synthesis, and video rendering automatically. If you can type a sentence, you can create a professional-quality video."
    }
  ];

  // ── Schema Markup: FAQPage (Google Rich Snippets + AI Overviews) ──
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": "https://virezo.pro/#faq",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  // ── Schema Markup: HowTo (AI UGC Video Ad Creation) ──
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "@id": "https://virezo.pro/#howto-ugc-ad",
    "name": "How to create a UGC video ad with Virezo.pro",
    "description": "Generate a UGC-style AI avatar video ad in under 60 seconds with Virezo.pro — no cameras, actors, or editing required.",
    "totalTime": "PT1M",
    "estimatedCost": { "@type": "MonetaryAmount", "currency": "USD", "value": "5" },
    "step": [
      { "@type": "HowToStep", "name": "Enter your product URL or script", "text": "Paste your product URL or type a short brief. Virezo's AI automatically generates a high-conversion script optimized for your target audience." },
      { "@type": "HowToStep", "name": "Choose a realistic AI avatar and language", "text": "Select from a library of photorealistic digital actors and choose one of 30+ supported languages for instant dubbing." },
      { "@type": "HowToStep", "name": "Generate multiple ad variations", "text": "Create several AI video variations with different hooks, scripts, or avatars to run split tests across your paid social campaigns." },
      { "@type": "HowToStep", "name": "Export and launch your campaign", "text": "Download broadcast-quality video files and deploy directly to TikTok Ads, Meta Ads, YouTube, or your own platform." }
    ]
  };

  // ── Schema Markup: SoftwareApplication (Google Knowledge Graph / AI Search) ──
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Virezo.pro",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "description": "AI video generation SaaS platform for B2B teams. Create realistic talking avatar videos, UGC ads, and text-to-video campaigns in 30+ languages in under 60 seconds. GDPR compliant and EU hosted.",
    "url": "https://virezo.pro"
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
  };

  const demos = [
    { id: 1, title: "Product Promo", video: "/videos/demo1.mp4", thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&fit=crop" },
    { id: 2, title: "Social Reel", video: "/videos/demo2.mp4", thumbnail: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&fit=crop" },
    { id: 3, title: "E-com UGC", video: "/videos/demo3.mp4", thumbnail: "https://images.unsplash.com/photo-1536240478700-b869070f9279?w=400&fit=crop" },
    { id: 4, title: "News Update", video: "/videos/demo4.mp4", thumbnail: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400&fit=crop" },
    { id: 5, title: "Travel Blog", video: "/videos/demo5.mp4", thumbnail: "https://images.unsplash.com/photo-1502444330042-d1a1ddf9bb5b?w=400&fit=crop" },
    { id: 6, title: "Style Guide", video: "/videos/demo6.mp4", thumbnail: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&fit=crop" }
  ];

  useEffect(() => {
    const scrollToHash = () => {
      const id = window.location.hash.replace("#", "");
      if (!id) return;
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      let tries = 0;
      const run = () => {
        const target = document.getElementById(id);
        if (target) { target.scrollIntoView({ block: "start", behavior: prefersReducedMotion ? "auto" : "smooth" }); return; }
        tries += 1;
        if (tries < 30) window.setTimeout(run, 100);
      };
      run();
    };
    scrollToHash();
    window.addEventListener("hashchange", scrollToHash);
    return () => window.removeEventListener("hashchange", scrollToHash);
  }, []);

  return (
    <main className="min-h-screen text-foreground font-sans overflow-x-hidden selection:bg-primary/20 selection:text-primary">

      {/* ── Structured Data: FAQPage + HowTo + SoftwareApplication ── */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />

      {/* ═══════════════════════════════════════════════════
          SECTION 1 · HERO
          H1 Target Keyword: "AI Avatar Video Generator"
          Supporting: UGC, text-to-video AI, GDPR, EU, cost arbitrage
      ═══════════════════════════════════════════════════ */}
      <section
        aria-label="Hero — AI Video Generation Platform for B2B Teams"
        className="relative min-h-screen flex flex-col justify-center pt-32 pb-40 px-6 md:px-12 overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
          <div className="absolute -top-[26%] -right-[12%] w-[62vw] h-[62vw] bg-primary/10 rounded-full blur-[140px]" />
          <div className="absolute top-[24%] -left-[14%] w-[55vw] h-[55vw] bg-secondary/10 rounded-full blur-[140px]" />
          <div className="absolute bottom-[-20%] left-[35%] w-[45vw] h-[45vw] bg-accent/10 rounded-full blur-[140px]" />
        </div>

        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="max-w-[1220px] mx-auto text-center space-y-12">

          {/* Trust Badge */}
          <motion.div variants={itemVariants} className="flex justify-center">
            <span className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full glass-panel text-sm font-bold text-primary cursor-default uppercase tracking-[0.16em]">
              <Sparkles className="w-5 h-5 fill-current animate-pulse" />
              <span>AI Video Software · GDPR Compliant · EU Hosted</span>
            </span>
          </motion.div>

          {/* H1 — Primary Keyword: "AI Avatar Video Generator" */}
          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl lg:text-[7.3rem] font-black tracking-tight leading-[0.92] text-foreground">
            The{" "}
            <span className="text-primary relative inline-block">
              <span>AI Avatar Video Generator</span>
              <motion.svg
                initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ delay: 0.5, duration: 0.8 }}
                className="absolute w-full h-4 -bottom-2 left-0 text-secondary opacity-45" viewBox="0 0 100 10" preserveAspectRatio="none"
              >
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="10" fill="none" />
              </motion.svg>
            </span>{" "}
            <br />
            <span>Built for B2B Teams.</span>
          </motion.h1>

          {/* Hero Subheadline — Cost Arbitrage + 30 Languages + EU */}
          <motion.div variants={itemVariants}>
            <p className="text-lg md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-medium">
              Replace <strong className="text-foreground">$500+ traditional video production</strong> with broadcast-quality AI video in under 60 seconds.
              Realistic talking avatars, instant <strong className="text-foreground">30+ language dubbing</strong>, and full{" "}
              <strong className="text-foreground">GDPR compliance</strong> — purpose-built for European and global marketing teams.
            </p>
          </motion.div>

          {/* Inline Trust Signals */}
          <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-2 font-semibold"><Shield className="w-4 h-4 text-green-500" />GDPR Compliant</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground hidden sm:block" />
            <span className="flex items-center gap-2 font-semibold"><Globe2 className="w-4 h-4 text-blue-500" />30+ Languages</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground hidden sm:block" />
            <span className="flex items-center gap-2 font-semibold"><Zap className="w-4 h-4 text-yellow-500" />Under $5 per Video</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground hidden sm:block" />
            <span className="flex items-center gap-2 font-semibold"><Lock className="w-4 h-4 text-purple-500" />EU Hosted Infrastructure</span>
          </motion.div>

          {/* Primary CTAs */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-5 justify-center pt-8">
            <Link
              href="/signup"
              className="px-10 py-5 rounded-2xl bg-primary text-white font-black text-lg md:text-xl hover:bg-blue-600 transition-all shadow-[0_14px_38px_-14px_var(--color-primary)] flex items-center justify-center gap-3 transform hover:-translate-y-0.5 active:scale-95"
            >
              Start Creating Free
              <ArrowRight className="w-6 h-6" />
            </Link>
            <button className="px-10 py-5 rounded-2xl soft-card text-foreground font-black text-lg md:text-xl hover:bg-muted transition-all flex items-center justify-center gap-3 transform hover:-translate-y-0.5 active:scale-95">
              <Play className="w-6 h-6 text-primary fill-current" />
              Watch 60-Second Demo
            </button>
          </motion.div>

          <motion.p variants={itemVariants} className="text-sm text-muted-foreground">
            No credit card required · Cancel anytime · Full commercial rights on every video
          </motion.p>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION 2 · STATS (Social Proof)
      ═══════════════════════════════════════════════════ */}
      <section aria-label="Platform statistics and social proof" className="py-28 px-6 overflow-hidden border-y border-card-border/80">
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer} className="max-w-[1200px] mx-auto"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "B2B teams & brands", value: "5,000+" },
              { label: "AI videos generated", value: "50,000+" },
              { label: "Campaigns launched", value: "100,000+" },
              { label: "Saved per team weekly", value: "15 hrs" }
            ].map((stat, i) => (
              <motion.div key={i} variants={itemVariants}
                className="soft-card p-8 md:p-9 rounded-[1.7rem] flex flex-col items-center justify-center text-center group transition-all hover:-translate-y-1 hover:border-primary/35"
              >
                <span className="text-4xl md:text-5xl font-black text-primary mb-3 tracking-tighter">
                  <Counter value={stat.value} />
                </span>
                <span className="text-xs md:text-sm font-black text-muted-foreground uppercase tracking-[0.18em]">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Lazy-loaded sections */}
      <Features itemVariants={itemVariants} staggerContainer={staggerContainer} />
      <HowItWorks itemVariants={itemVariants} staggerContainer={staggerContainer} />
      <Demos demos={demos} />
      <Testimonials itemVariants={itemVariants} staggerContainer={staggerContainer} />

      {/* ═══════════════════════════════════════════════════
          SECTION 3 · COST ARBITRAGE COMPARISON TABLE
          H2 Target: "AI Video Software"
      ═══════════════════════════════════════════════════ */}
      <section aria-label="Virezo AI vs Traditional Video Production comparison" className="py-24 px-6 relative overflow-hidden bg-gradient-to-b from-transparent to-primary/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-foreground mb-6">
              Why 5,000+ B2B Teams Choose AI Video Software Over Agencies
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Traditional video production costs <strong>$500–$5,000 and weeks of waiting</strong>. Virezo delivers the same broadcast quality for <strong>under $5 in under 60 seconds</strong> — with no compromises on multilingual reach.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]" aria-label="Virezo AI vs Traditional Production feature comparison">
              <thead>
                <tr className="border-b border-card-border">
                  <th className="p-6 text-lg font-bold text-muted-foreground">Capability</th>
                  <th className="p-6 text-xl font-black text-primary bg-primary/5 rounded-t-2xl">Virezo AI Video</th>
                  <th className="p-6 text-lg font-bold text-muted-foreground">Traditional Production</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: "Production Time", us: "Under 60 seconds", them: "1–4 weeks" },
                  { feature: "Cost per Video", us: "Under $5", them: "$500–$5,000+" },
                  { feature: "Multilingual Dubbing", us: "30+ languages instantly", them: "Manual translation — weeks" },
                  { feature: "Digital Actors", us: "24/7 AI Avatars — no scheduling", them: "Actors, studios, scheduling fees" },
                  { feature: "GDPR & EU Compliance", us: "✅ Built-in, EU Hosted", them: "Varies — usually manual" },
                  { feature: "Scale to 100s of videos", us: "✅ Unlimited, on demand", them: "❌ Not operationally feasible" }
                ].map((row, i) => (
                  <tr key={i} className="border-b border-card-border last:border-0 hover:bg-white/50 transition-colors">
                    <td className="p-6 font-medium text-foreground">{row.feature}</td>
                    <td className="p-6 font-bold text-primary bg-primary/5">{row.us}</td>
                    <td className="p-6 text-muted-foreground">{row.them}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION 4 · GDPR & EU TRUST (E-E-A-T Signal)
          H2 Target: "GDPR Compliant AI Video" / EU businesses
      ═══════════════════════════════════════════════════ */}
      <section aria-label="GDPR compliance, EU data hosting, and enterprise security" className="py-24 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-green-100 text-green-700 text-sm font-bold mb-6">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              GDPR Compliant · EU Hosted Infrastructure
            </div>
            <h2 className="text-4xl font-black text-foreground mb-6">
              Enterprise-Grade Security Built for European Teams
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Virezo is built with European data sovereignty at its core. All video content, scripts, and account data are processed and stored <strong>within the EU</strong> — giving your legal and compliance teams complete peace of mind under GDPR, without sacrificing performance.
            </p>
            <ul className="space-y-4" aria-label="Security and compliance features">
              {[
                "Full GDPR compliance — all data stays within the EU",
                "End-to-End Encryption (AES-256 at rest and in transit)",
                "EU Data Residency — no data exported outside EEA",
                "SOC-2 Type II certified infrastructure",
                "Zero data sold, shared, or used for model training",
                "Full commercial rights on every video you generate"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-foreground font-medium">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs flex-shrink-0">✓</div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-card-bg border border-card-border p-8 rounded-[2.5rem] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -z-10" />
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: "🔒", label: "AES-256 Encrypted" },
                { icon: "🇪🇺", label: "EU Hosted" },
                { icon: "⚡", label: "Under 60 Seconds" },
                { icon: "🌍", label: "30+ Languages" },
              ].map((item, i) => (
                <div key={i} className="p-6 bg-background rounded-2xl border border-card-border">
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <div className="font-bold text-sm">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <FAQ faqs={faqs} itemVariants={itemVariants} staggerContainer={staggerContainer} />
      <FinalCTA itemVariants={itemVariants} staggerContainer={staggerContainer} />
    </main>
  );
}
