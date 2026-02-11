"use client";

import Link from "next/link";
import { motion, useScroll, useTransform, Variants } from "framer-motion";
import {
  Video,
  Sparkles,
  Globe,
  Zap,
  Play,
  Check,
  ArrowRight,
  MonitorPlay,
  Share2,
  Users,
  Mic,
  Clapperboard
} from "lucide-react";
import { useState } from "react";

export default function HomePage() {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const y = useTransform(scrollY, [0, 300], [0, 100]);

  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-violet-500/30 selection:text-violet-200 overflow-x-hidden">

      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 md:px-6 pt-20">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[60vw] h-[60vw] bg-violet-600/20 rounded-full blur-[120px] opacity-50 animate-pulse" />
          <div className="absolute bottom-0 right-0 w-[40vw] h-[40vw] bg-blue-600/10 rounded-full blur-[100px]" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.05]" /> {/* Optional grid texture */}
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 max-w-5xl mx-auto text-center space-y-8"
        >
          {/* Trust Badge */}
          <motion.div variants={itemVariants} className="flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-sm text-gray-300 hover:bg-white/10 transition-colors cursor-default">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Veo 3.0 Engine Live
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.1] md:leading-tight"
          >
            Create <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">Limitless</span> <br />
            AI Video Content.
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-lg md:text-2xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed"
          >
            Turn text into broadcast-quality user generated content. Realistic avatars, multi-language voiceovers, and cinematic visuals — in seconds.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Link
              href="/signup"
              className="px-8 py-4 rounded-xl bg-white text-black font-semibold text-lg hover:bg-gray-200 transition-all flex items-center justify-center gap-2 group"
            >
              Start Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-medium text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-2 backdrop-blur-sm">
              <Play className="w-5 h-5 fill-current" />
              Watch Demo
            </button>
          </motion.div>

          {/* Mini Trust Indicators */}
          <motion.div
            variants={itemVariants}
            className="pt-12 flex items-center justify-center gap-8 text-sm text-gray-500 font-medium"
          >
            <span className="flex items-center gap-2"><Check className="w-4 h-4 text-violet-500" /> No Credit Card Required</span>
            <span className="flex items-center gap-2"><Check className="w-4 h-4 text-violet-500" /> 10+ AI Models</span>
          </motion.div>
        </motion.div>
      </section>


      {/* 2. SOCIAL PROOF / STATS */}
      <div className="border-y border-white/5 bg-white/[0.02] backdrop-blur-sm relative z-20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-white/5">
            {[
              { label: "Videos Generated", value: "2M+" },
              { label: "Active Creators", value: "50k+" },
              { label: "Avg. Engagement", value: "3.5x" },
              { label: "Countries", value: "120+" }
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="text-3xl md:text-4xl font-bold bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">{stat.value}</span>
                <span className="text-xs md:text-sm text-gray-400 uppercase tracking-widest mt-2">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* 3. FEATURES */}
      <section className="py-32 px-6 max-w-7xl mx-auto relative z-20">
        <div className="text-center mb-20 space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold">Everything you need to go viral.</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">Powerful tools designed for the modern creator economy.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: <Clapperboard className="w-8 h-8 text-blue-400" />,
              title: "AI UGC Generator",
              desc: "Create authentic-looking user generated content from simple text prompts."
            },
            {
              icon: <Users className="w-8 h-8 text-violet-400" />,
              title: "Realistic Avatars",
              desc: "Choose from 50+ diverse AI avatars that look and sound human."
            },
            {
              icon: <Mic className="w-8 h-8 text-pink-400" />,
              title: "Multi-Language",
              desc: "Voiceovers in 30+ languages, including native Moroccan Darija support."
            },
            {
              icon: <Share2 className="w-8 h-8 text-green-400" />,
              title: "1-Click Export",
              desc: "Optimized formats for TikTok, Instagram Reels, and Snapchat Ads."
            }
          ].map((feature, i) => (
            <div key={i} className="group p-8 rounded-2xl bg-white/5 border border-white/5 hover:border-violet-500/30 hover:bg-white/[0.08] transition-all duration-300">
              <div className="mb-6 w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>


      {/* 4. HOW IT WORKS */}
      <section className="py-24 bg-gradient-to-b from-[#050505] to-[#0A0A0A] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">From Idea to Video in 3 Steps</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connector Line (Desktop) */}
            <div className="hidden md:block absolute top-[60px] left-[20%] right-[20%] h-[2px] bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />

            {[
              { step: "01", title: "Paste Product Link", text: "Link your Shopify store or Amazon product page." },
              { step: "02", title: "AI Generates Script", text: "Our engine writes a hook, script, and visual storyboard." },
              { step: "03", title: "Download & Post", text: "Get your finished video in 9:16 format, ready to scale." }
            ].map((item, i) => (
              <div key={i} className="text-center relative z-10">
                <div className="w-16 h-16 mx-auto rounded-full bg-[#111] border border-white/10 flex items-center justify-center text-xl font-bold text-violet-400 mb-6 shadow-[0_0_30px_-10px_rgba(139,92,246,0.3)]">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 max-w-xs mx-auto">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* 5. DEMO PREVIEW (Grid) */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Made with Veo.</h2>
          <p className="text-gray-400">Join the next generation of content creators.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map((_, i) => (
            <div key={i} className="aspect-[9/16] rounded-2xl bg-white/5 border border-white/5 relative overflow-hidden group cursor-pointer hover:border-violet-500/50 transition-all">
              {/* Placeholder Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50`} />

              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
                <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300">
                  <Play className="w-5 h-5 fill-current pl-1" />
                </div>
              </div>

              {/* Label */}
              <div className="absolute bottom-3 left-3 right-3">
                <div className="bg-black/60 backdrop-blur-md text-xs px-2 py-1 rounded-md inline-block border border-white/10">
                  Example {i + 1}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="px-8 py-3 rounded-full border border-violet-500/30 text-violet-300 hover:bg-violet-500/10 transition-colors text-sm font-medium">
            Generate Yours Now
          </button>
        </div>
      </section>


      {/* 6. PRICING */}
      <section className="py-24 px-6 bg-[#080808]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-6">Simple Pricing.</h2>

            {/* Toggle */}
            <div className="inline-flex items-center gap-4 bg-white/5 p-1 rounded-full border border-white/5">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${billingCycle === 'monthly' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${billingCycle === 'yearly' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}
              >
                Yearly <span className="text-xs text-green-600 ml-1">(-20%)</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Starter */}
            <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
              <h3 className="text-xl font-bold mb-2">Starter</h3>
              <div className="text-3xl font-bold mb-6">$29<span className="text-lg text-gray-500 font-normal">/mo</span></div>
              <ul className="space-y-4 text-sm text-gray-400 mb-8">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-gray-600" /> 15 Videos / mo</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-gray-600" /> 720p Export</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-gray-600" /> Standard Avatars</li>
              </ul>
              <button className="w-full py-3 rounded-xl border border-white/20 hover:bg-white hover:text-black transition-all font-medium">Get Started</button>
            </div>

            {/* Pro - Highlighted */}
            <div className="p-8 rounded-3xl bg-violet-600/10 border border-violet-500/50 relative">
              <div className="absolute top-0 right-0 bg-violet-500 text-white text-[10px] uppercase font-bold px-3 py-1 rounded-bl-xl rounded-tr-2xl">Most Popular</div>
              <h3 className="text-xl font-bold mb-2 text-violet-300">Creator</h3>
              <div className="text-3xl font-bold mb-6">$59<span className="text-lg text-gray-500 font-normal">/mo</span></div>
              <ul className="space-y-4 text-sm text-gray-300 mb-8">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-violet-400" /> 50 Videos / mo</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-violet-400" /> 1080p Export</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-violet-400" /> All Languages (Darija)</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-violet-400" /> No Watermark</li>
              </ul>
              <button className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white transition-all font-medium shadow-lg shadow-violet-500/25">Start Free Trial</button>
            </div>

            {/* Agency */}
            <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
              <h3 className="text-xl font-bold mb-2">Agency</h3>
              <div className="text-3xl font-bold mb-6">$199<span className="text-lg text-gray-500 font-normal">/mo</span></div>
              <ul className="space-y-4 text-sm text-gray-400 mb-8">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-gray-600" /> Unlimited Videos</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-gray-600" /> 4K Export</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-gray-600" /> API Access</li>
              </ul>
              <button className="w-full py-3 rounded-xl border border-white/20 hover:bg-white hover:text-black transition-all font-medium">Contact Sales</button>
            </div>
          </div>
        </div>
      </section>


      {/* 7. FINAL CTA */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center relative overflow-hidden rounded-[3rem] bg-gradient-to-r from-blue-900 to-violet-900 px-8 py-16 border border-white/10 shadow-2xl">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20 mix-blend-overlay" />

          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Start Creating AI Videos in Seconds.</h2>
            <p className="text-blue-200 text-lg mb-8 max-w-xl mx-auto">No credit card required. Cancel anytime.</p>

            <Link
              href="/video"
              className="inline-flex px-10 py-5 rounded-2xl bg-white text-black font-bold text-xl hover:scale-105 transition-transform shadow-xl hover:shadow-2xl hover:shadow-white/20"
            >
              Create Your First Video
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Minimal */}
      <footer className="py-12 border-t border-white/5 text-center text-gray-600 text-sm">
        <p>&copy; 2026 Veo Platform. All rights reserved.</p>
      </footer>

    </main>
  );
}
