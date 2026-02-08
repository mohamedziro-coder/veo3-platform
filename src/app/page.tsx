"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Video, Image as ImageIcon, Mic, ArrowRight, Zap, Globe, Sparkles } from "lucide-react";

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        bounce: 0.4
      }
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-purple-500/30">

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 overflow-hidden">
        {/* Ambient Background */}
        {/* Ambient Background */}
        <div className="absolute inset-0 pointer-events-none w-full h-full bg-black">
          {/* Base Gradients */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-purple-900/30 rounded-full blur-[130px]" />
          <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-blue-900/20 rounded-full blur-[130px]" />

          {/* Patterns */}
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:60px_60px]" />
          <div className="absolute inset-0 bg-noise opacity-30 mix-blend-overlay" />

          {/* Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50" />
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 text-center max-w-5xl px-6 space-y-8"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="flex justify-center">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-sm font-medium text-purple-300">
              <Sparkles className="w-4 h-4" />
              <span>Next-Gen AI Content Suite</span>
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1 variants={itemVariants} className="text-6xl md:text-8xl font-black tracking-tighter leading-[1.1]">
            Create <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">Anything</span> <br />
            <span className="text-white">With AI.</span>
          </motion.h1>

          <motion.p variants={itemVariants} className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            The all-in-one platform for creators. Generate Cinematic Videos, Ultra-HD Images, and Professional Voiceovers in seconds.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link
              href="/video"
              className="px-8 py-4 rounded-xl bg-white text-black font-bold text-lg hover:bg-gray-200 transition-colors flex items-center gap-2 group"
            >
              Start Creating
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-medium text-lg hover:bg-white/10 transition-colors backdrop-blur-md">
              View Showcase
            </button>
          </motion.div>
        </motion.div>

        {/* Floating UI Elements (Decorative) */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="absolute bottom-0 w-full h-[30vh] bg-gradient-to-t from-[#050505] to-transparent z-10"
        />
      </section>

      {/* Features Grid */}
      <section id="features" className="relative z-20 py-24 px-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {/* Feature 1: Video */}
          <Link href="/video" className="group">
            <div className="h-full glass-panel p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-purple-500/50 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-32 bg-purple-500/10 blur-[80px] group-hover:bg-purple-500/20 transition-colors" />
              <div className="relative z-10 space-y-6">
                <div className="w-14 h-14 rounded-2xl bg-purple-500/20 flex items-center justify-center text-purple-300 group-hover:scale-110 transition-transform">
                  <Video className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Cinematic Video</h3>
                  <p className="text-gray-400">Turn images into motion using Veo 3.0. Create stunning transitions and effects.</p>
                </div>
                <div className="flex items-center text-purple-400 font-medium group-hover:gap-2 transition-all">
                  <span>Launch Video Tool</span>
                  <ArrowRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100" />
                </div>
              </div>
            </div>
          </Link>

          {/* Feature 2: Image */}
          <Link href="/nanbanana" className="group">
            <div className="h-full glass-panel p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-yellow-500/50 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-32 bg-yellow-500/10 blur-[80px] group-hover:bg-yellow-500/20 transition-colors" />
              <div className="relative z-10 space-y-6">
                <div className="w-14 h-14 rounded-2xl bg-yellow-500/20 flex items-center justify-center text-yellow-300 group-hover:scale-110 transition-transform">
                  <ImageIcon className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Nanbanana Image</h3>
                  <p className="text-gray-400">Generate ultra-realistic images with Gemini 2.5 Flash. Pure imagination.</p>
                </div>
                <div className="flex items-center text-yellow-400 font-medium group-hover:gap-2 transition-all">
                  <span>Launch Image Tool</span>
                  <ArrowRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100" />
                </div>
              </div>
            </div>
          </Link>

          {/* Feature 3: Voice */}
          <Link href="/voice" className="group">
            <div className="h-full glass-panel p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-blue-500/50 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-32 bg-blue-500/10 blur-[80px] group-hover:bg-blue-500/20 transition-colors" />
              <div className="relative z-10 space-y-6">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-300 group-hover:scale-110 transition-transform">
                  <Mic className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Voice Studio</h3>
                  <p className="text-gray-400">Realistic Text-to-Speech in multiple languages using advanced neural models.</p>
                </div>
                <div className="flex items-center text-blue-400 font-medium group-hover:gap-2 transition-all">
                  <span>Launch Audio Tool</span>
                  <ArrowRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100" />
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      </section>

      {/* Section 3: How it Works */}
      <section id="how-it-works" className="py-24 px-6 max-w-7xl mx-auto relative z-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-4">
            From Idea to Reality
          </h2>
          <p className="text-xl text-gray-400">create professional content in 3 simple steps.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { step: "01", title: "Select Tool", desc: "Choose between Video, Image, or Voice generation tools." },
            { step: "02", title: "Describe It", desc: "Enter your prompt or upload reference images." },
            { step: "03", title: "Generate", desc: "Watch AI bring your vision to life in seconds." }
          ].map((item, i) => (
            <div key={i} className="glass-panel p-8 rounded-3xl border border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 text-[8rem] font-bold text-white/5 leading-none -mt-4 -mr-4 group-hover:text-white/10 transition-colors">
                {item.step}
              </div>
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center font-bold text-lg mb-6 shadow-lg shadow-purple-500/20">
                  {item.step}
                </div>
                <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 4: Testimonials / Community */}
      <section className="py-24 px-6 bg-gradient-to-b from-transparent to-purple-900/10 border-y border-white/5">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-16">Loved by Creators</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Sarah K.", role: "Digital Artist", quote: "The video generation is mind-blowing. Veo 3 changed my workflow entirely." },
              { name: "Ahmed R.", role: "Content Creator", quote: "Nanbanana images are so realistic, I stopped using stock photos." },
              { name: "Mike T.", role: "Game Dev", quote: "The Voice API is perfect for my indie game characters. Huge time saver." }
            ].map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-panel p-8 rounded-2xl text-left bg-white/5 border border-white/10"
              >
                <div className="flex items-center gap-1 text-yellow-500 mb-4">
                  {[1, 2, 3, 4, 5].map(s => <Sparkles key={s} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-lg text-gray-300 mb-6 italic">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-gray-700 to-gray-600" />
                  <div>
                    <div className="font-bold">{t.name}</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5: Pricing / CTA */}
      <section id="pricing" className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-600/5 blur-[100px]" />
        <div className="max-w-5xl mx-auto glass-panel rounded-[3rem] p-12 md:p-20 text-center border border-white/10 bg-gradient-to-b from-white/5 to-black relative z-10">
          <h2 className="text-5xl md:text-7xl font-bold mb-8 tracking-tighter">
            Ready to <span className="text-purple-400">Create?</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12">
            Join thousands of creators using Veo Platform to build the future of content.
            Start for free today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/video"
              className="px-10 py-5 rounded-2xl bg-white text-black font-bold text-xl hover:scale-105 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.3)]"
            >
              Get Started Free
            </Link>
            <button className="px-10 py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-xl hover:bg-white/10 transition-colors">
              Contact Sales
            </button>
          </div>
          <div className="mt-12 flex justify-center gap-8 text-sm text-gray-500 font-mono">
            <span className="flex items-center gap-2"><Zap className="w-4 h-4" /> Instant Access</span>
            <span className="flex items-center gap-2"><Globe className="w-4 h-4" /> Global CDN</span>
            <span className="flex items-center gap-2"><Sparkles className="w-4 h-4" /> AI Powered</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/50 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-gray-500 text-sm">
            © 2026 Veo Platform. All rights reserved.
          </div>
          <div className="flex gap-6">
            <Link href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="text-gray-400 hover:text-white transition-colors">Terms</Link>
            <Link href="#" className="text-gray-400 hover:text-white transition-colors">Twitter</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
