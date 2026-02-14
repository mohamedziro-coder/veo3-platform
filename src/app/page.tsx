"use client";

import Link from "next/link";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  Sparkles,
  Play,
  Check,
  ArrowRight,
  Share2,
  Users,
  Mic,
  Wand2
} from "lucide-react";
import { useState } from "react";

export default function HomePage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

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
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const demos = [
    { id: 1, title: "Product Promo", video: "/videos/demo1.mp4", thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=711&fit=crop" },
    { id: 2, title: "Social Reel", video: "/videos/demo2.mp4", thumbnail: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=711&fit=crop" },
    { id: 3, title: "E-com UGC", video: "/videos/demo3.mp4", thumbnail: "https://images.unsplash.com/photo-1536240478700-b869070f9279?w=400&h=711&fit=crop" },
    { id: 4, title: "News Update", video: "/videos/demo4.mp4", thumbnail: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400&h=711&fit=crop" },
    { id: 5, title: "Travel Blog", video: "/videos/demo5.mp4", thumbnail: "https://images.unsplash.com/photo-1502444330042-d1a1ddf9bb5b?w=400&h=711&fit=crop" },
    { id: 6, title: "Style Guide", video: "/videos/demo6.mp4", thumbnail: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=711&fit=crop" }
  ];

  return (
    <main className="min-h-screen bg-white text-[#1A1A1A] font-sans overflow-x-hidden selection:bg-primary/20 selection:text-primary">

      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-20 px-6 md:px-12 overflow-hidden">
        {/* Subtle Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
          <div className="absolute -top-[20%] -right-[10%] w-[50vw] h-[50vw] bg-secondary/5 rounded-full blur-[100px]" />
          <div className="absolute top-[20%] -left-[10%] w-[40vw] h-[40vw] bg-primary/5 rounded-full blur-[100px]" />
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-5xl mx-auto text-center space-y-8"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="flex justify-center">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 text-sm font-medium text-primary cursor-default">
              <Sparkles className="w-4 h-4 fill-current" />
              <span>The Next Gen of AI Video</span>
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] text-gray-900"
          >
            Create <span className="text-primary relative inline-block">
              Viral Videos
              <svg className="absolute w-full h-3 -bottom-1 left-0 text-secondary opacity-40" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
              </svg>
            </span> <br />
            With Artificial Intelligence.
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
          >
            Turn ideas into broadcast-quality content in seconds.
            Realistic avatars, native multi-language voiceovers, and endless creativity.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Link
              href="/signup"
              className="px-8 py-4 rounded-xl bg-primary text-white font-bold text-lg hover:bg-blue-600 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transform hover:-translate-y-1"
            >
              Start Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <button className="px-8 py-4 rounded-xl bg-white border border-gray-200 text-gray-700 font-bold text-lg hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-2 shadow-sm">
              <Play className="w-5 h-5 text-gray-900" />
              Watch Demo
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* 2. SOCIAL PROOF / STATS */}
      <section className="bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-gray-200/50">
            {[
              { label: "Videos Generated", value: "2M+" },
              { label: "Active Creators", value: "50k+" },
              { label: "Avg. Engagement", value: "3.5x" },
              { label: "Global Reach", value: "120+" }
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center p-2">
                <span className="text-4xl font-bold text-primary mb-1">{stat.value}</span>
                <span className="text-sm text-gray-500 font-medium uppercase tracking-wider">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURES SECTION */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Powerful Tools for Creators</h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">Everything you need to scale your content production.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: <Wand2 className="w-8 h-8" />,
              title: "AI UGC Generator",
              desc: "Generate authentic user-generated content scripts and visuals instantly from a URL."
            },
            {
              icon: <Users className="w-8 h-8" />,
              title: "Realistic Avatars",
              desc: "Access 50+ diverse, human-like avatars that perfectly lip-sync to your script."
            },
            {
              icon: <Mic className="w-8 h-8" />,
              title: "Multi-Language",
              desc: "Native voiceovers in 30+ languages, including specialized support for local dialects."
            },
            {
              icon: <Share2 className="w-8 h-8" />,
              title: "1-Click Export",
              desc: "Auto-resize and optimize your videos for TikTok, Instagram Reels, and Snapchat."
            }
          ].map((feature, i) => (
            <div
              key={i}
              className="group p-8 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300 relative overflow-hidden"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section className="py-24 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-16">How It Works</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connector Line (Desktop) */}
            <div className="hidden md:block absolute top-[28px] left-[20%] right-[20%] h-[2px] bg-gray-200 -z-0" />

            {[
              { step: 1, title: "Paste Product Link", text: "Link your store page or product listing." },
              { step: 2, title: "AI Generates Magic", text: "We write the script & animate the avatar." },
              { step: 3, title: "Download & Post", text: "Get your viral-ready video in seconds." }
            ].map((item) => (
              <div key={item.step} className="relative z-10 flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-white border-2 border-primary text-primary font-bold text-xl flex items-center justify-center mb-6 shadow-md">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 max-w-xs">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. DEMO PREVIEW SECTION */}
      <section className="py-24 px-6 max-w-7xl mx-auto" id="demos">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Made with Virezo</h2>
          <p className="text-xl text-gray-500">See what others are building right now.</p>
        </div>

        <div className="relative overflow-hidden py-10 -mx-6 md:-mx-12 cursor-grab active:cursor-grabbing">
          {/* Faded edges for premium feel */}
          <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          <motion.div
            className="flex gap-6 w-max px-6"
            animate={{
              x: ["0%", "-50%"]
            }}
            transition={{
              duration: 30,
              ease: "linear",
              repeat: Infinity
            }}
            whileHover={{ transition: { duration: 60 } }} // Slow down on hover
          >
            {[...demos, ...demos].map((demo, index) => (
              <motion.div
                key={`${demo.id}-${index}`}
                whileHover={{ y: -10, scale: 1.02 }}
                onClick={() => setSelectedVideo(demo.video)}
                className="w-[280px] aspect-[9/16] bg-gray-100 rounded-2xl relative group overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl transition-all border border-gray-200"
              >
                {/* Video Preview */}
                <video
                  src={demo.video}
                  poster={demo.thumbnail}
                  muted
                  autoPlay
                  loop
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                  <div className="w-14 h-14 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
                    <Play className="w-6 h-6 text-primary ml-1 fill-current" />
                  </div>
                </div>
                <div className="absolute bottom-6 left-6 right-6 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <span className="bg-white/95 backdrop-blur text-[10px] font-extrabold tracking-widest uppercase px-4 py-2 rounded-full text-gray-800 shadow-sm block text-center">
                    {demo.title}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <div className="text-center mt-12">
          <Link href="/signup" className="inline-flex px-8 py-4 rounded-xl bg-primary/5 text-primary border border-primary/20 font-bold hover:bg-primary hover:text-white transition-all transform hover:-translate-y-1">
            Generate Yours Now
          </Link>
        </div>
      </section>

      {/* Video Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
            onClick={() => setSelectedVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm aspect-[9/16] bg-black rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedVideo(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/70 transition-colors border border-white/10"
              >
                <span className="sr-only">Close</span>
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <video
                src={selectedVideo}
                controls
                autoPlay
                loop
                className="w-full h-full object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 6. PRICING SECTION */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Simple, Transparent Pricing</h2>

            <div className="inline-flex items-center gap-2 bg-gray-100 p-1 rounded-full">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${billingCycle === 'monthly' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${billingCycle === 'yearly' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Yearly <span className="text-secondary ml-1">-20%</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {/* Starter */}
            <div className="p-8 rounded-3xl border border-gray-200 hover:border-gray-300 transition-all">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Starter</h3>
              <div className="text-4xl font-bold text-gray-900 mb-6">$29<span className="text-lg text-gray-400 font-normal">/mo</span></div>
              <ul className="space-y-4 text-gray-600 mb-8 text-sm">
                <li className="flex items-center gap-3"><Check className="w-4 h-4 text-green-500" /> 15 Videos / mo</li>
                <li className="flex items-center gap-3"><Check className="w-4 h-4 text-green-500" /> Standard Avatars</li>
                <li className="flex items-center gap-3"><Check className="w-4 h-4 text-green-500" /> 720p Export</li>
              </ul>
              <button className="w-full py-3 rounded-xl border border-gray-200 font-bold text-gray-700 hover:bg-gray-50 transition-all">Get Started</button>
            </div>

            {/* Pro */}
            <div className="p-8 rounded-3xl border-2 border-primary bg-white shadow-xl relative transform md:-translate-y-4">
              <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl">MOST POPULAR</div>
              <h3 className="text-xl font-bold text-primary mb-2">Creator</h3>
              <div className="text-4xl font-bold text-gray-900 mb-6">$59<span className="text-lg text-gray-400 font-normal">/mo</span></div>
              <ul className="space-y-4 text-gray-700 mb-8 text-sm font-medium">
                <li className="flex items-center gap-3"><Check className="w-4 h-4 text-primary" /> 50 Videos / mo</li>
                <li className="flex items-center gap-3"><Check className="w-4 h-4 text-primary" /> All Languages Supported</li>
                <li className="flex items-center gap-3"><Check className="w-4 h-4 text-primary" /> 1080p HD Export</li>
                <li className="flex items-center gap-3"><Check className="w-4 h-4 text-primary" /> No Watermark</li>
              </ul>
              <button className="w-full py-3 rounded-xl bg-primary text-white font-bold hover:bg-blue-600 transition-all shadow-lg shadow-primary/25">Start Free Trial</button>
            </div>

            {/* Agency */}
            <div className="p-8 rounded-3xl border border-gray-200 hover:border-gray-300 transition-all">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Agency</h3>
              <div className="text-4xl font-bold text-gray-900 mb-6">$199<span className="text-lg text-gray-400 font-normal">/mo</span></div>
              <ul className="space-y-4 text-gray-600 mb-8 text-sm">
                <li className="flex items-center gap-3"><Check className="w-4 h-4 text-green-500" /> Unlimited Videos</li>
                <li className="flex items-center gap-3"><Check className="w-4 h-4 text-green-500" /> 4K Export</li>
                <li className="flex items-center gap-3"><Check className="w-4 h-4 text-green-500" /> API Access</li>
              </ul>
              <button className="w-full py-3 rounded-xl border border-gray-200 font-bold text-gray-700 hover:bg-gray-50 transition-all">Contact Sales</button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FINAL CTA */}
      <section className="py-24 px-6 md:px-12 bg-primary">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to create viral videos?</h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">Join thousands of creators using Virezo to scale their content production.</p>

          <Link
            href="/video"
            className="inline-flex px-10 py-5 rounded-2xl bg-white text-primary font-bold text-xl hover:bg-gray-50 transition-all shadow-2xl hover:shadow-xl hover:scale-105"
          >
            Create Your First AI Video
          </Link>
          <p className="mt-6 text-sm text-blue-200">No credit card required. Cancel anytime.</p>
        </div>
      </section>

      {/* Footer Minimal */}
      <footer className="py-12 bg-white border-t border-gray-100 text-center text-gray-500 text-sm">
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
