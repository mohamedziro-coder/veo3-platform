"use client";

import Link from "next/link";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  Sparkles,
  Play,
  Check,
  ArrowRight,
  Wand2,
  Zap,
  Rocket,
  ShieldCheck,
  Layers,
  Library,
  BarChart3,
  Quote,
  Star
} from "lucide-react";
import { useState } from "react";
import Counter from "@/components/Counter";

export default function HomePage() {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
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
            className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] text-gray-900"
          >
            Create <span className="text-primary relative inline-block">
              Viral Videos
              <motion.svg
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 1, duration: 0.8 }}
                className="absolute w-full h-3 -bottom-1 left-0 text-secondary opacity-40" viewBox="0 0 100 10" preserveAspectRatio="none"
              >
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
              </motion.svg>
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
              className="px-8 py-4 rounded-xl bg-primary text-white font-bold text-lg hover:bg-blue-600 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transform hover:-translate-y-1 hover:scale-105"
            >
              Start Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="px-8 py-4 rounded-xl bg-white border border-gray-200 text-gray-700 font-bold text-lg hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-2 shadow-sm transform hover:-translate-y-1">
              <Play className="w-5 h-5 text-gray-900" />
              Watch Demo
            </button>
          </motion.div>
        </motion.div>
      </section>

      <section className="py-20 px-6 bg-white overflow-hidden">
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
                whileHover={{ y: -5 }}
                className="p-8 rounded-3xl bg-gray-50/50 border border-gray-100 flex flex-col items-center justify-center text-center group transition-all hover:bg-white hover:shadow-xl hover:border-primary/20"
              >
                <span className="text-4xl md:text-5xl font-black text-primary mb-3">
                  <Counter value={stat.value} />
                </span>
                <span className="text-sm font-semibold text-gray-500 uppercase tracking-widest">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="py-24 px-6 bg-white">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={staggerContainer}
          className="max-w-7xl mx-auto space-y-20"
        >
          <motion.div variants={itemVariants} className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">Why Top Media Buyers Scale With Us</h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium">Unfair advantage through AI automation. Launch faster, test smarter, and scale harder.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
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
            ].map((feature, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                whileHover={{
                  y: -12,
                  transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
                }}
                className="group p-10 rounded-[2.5rem] bg-white border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-15px_rgba(74,144,226,0.15)] hover:border-primary/20 transition-all duration-300 flex flex-col items-start text-left"
              >
                <div className="w-16 h-16 rounded-[1.25rem] bg-primary/5 flex items-center justify-center text-primary mb-8 group-hover:bg-primary group-hover:text-white group-hover:scale-110 transition-all duration-500">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed font-medium">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="py-24 bg-gray-50 border-y border-gray-100">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
          className="max-w-7xl mx-auto px-6 text-center"
        >
          <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold text-gray-900 mb-16">How It Works</motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connector Line (Desktop) */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="hidden md:block absolute top-[28px] left-[20%] right-[20%] h-[2px] bg-gray-200 -z-0 origin-left"
            />

            {[
              { step: 1, title: "Paste Product Link", text: "Link your store page or product listing." },
              { step: 2, title: "AI Generates Magic", text: "We write the script & animate the avatar." },
              { step: 3, title: "Download & Post", text: "Get your viral-ready video in seconds." }
            ].map((item) => (
              <motion.div key={item.step} variants={itemVariants} className="relative z-10 flex flex-col items-center group">
                <div className="w-14 h-14 rounded-full bg-white border-2 border-primary text-primary font-bold text-xl flex items-center justify-center mb-6 shadow-md group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 max-w-xs">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
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

      {/* 6. TESTIMONIALS SECTION */}
      <section className="py-24 px-6 bg-white overflow-hidden">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer}
          className="max-w-7xl mx-auto space-y-20"
        >
          <motion.div variants={itemVariants} className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">Loved by High-Growth Brands</h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium">Real results from marketers scaling past 7-figures.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
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
            ].map((testimonial, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                whileHover={{ y: -10, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }}
                className="group p-10 rounded-[2.5rem] bg-white border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] hover:border-primary/20 transition-all duration-500 relative flex flex-col justify-between"
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
                  <p className="text-lg text-gray-600 leading-relaxed font-medium mb-10 italic">"{testimonial.text}"</p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/10 flex items-center justify-center text-primary font-bold">
                    {testimonial.initials}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500 font-medium">{testimonial.role}</div>
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
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-400">
                    U{i}
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-white bg-primary flex items-center justify-center text-[10px] font-bold text-white">
                  +5k
                </div>
              </div>
              <p className="text-gray-500 font-bold tracking-tight">Join 5,000+ happy customers</p>
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

      <section className="py-24 px-6 bg-gray-50/50 border-y border-gray-100" id="faq">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
          className="max-w-3xl mx-auto"
        >
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-500">Everything you need to know about Virezo AI.</p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-bold text-gray-900 md:text-lg">{faq.question}</span>
                  <motion.span
                    animate={{ rotate: openFaq === i ? 45 : 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="flex-shrink-0 ml-4"
                  >
                    <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </motion.span>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="px-8 pb-6 text-gray-600 leading-relaxed border-t border-gray-50 pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="relative py-32 px-6 overflow-hidden">
        {/* Radial Glow Background */}
        <div className="absolute inset-0 bg-[#0A0A0B] -z-20" />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-primary/20 blur-[130px] rounded-full -z-10 opacity-60"
          style={{ background: 'radial-gradient(circle, var(--color-primary) 0%, transparent 70%)' }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-accent/10 blur-[100px] rounded-full -z-10 opacity-30"
          style={{ background: 'radial-gradient(circle, var(--color-accent) 0%, transparent 70%)' }}
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="max-w-5xl mx-auto text-center"
        >
          <motion.div variants={itemVariants} className="inline-flex px-4 py-2 rounded-full bg-white/5 border border-white/10 text-primary font-bold text-xs uppercase tracking-widest mb-8 backdrop-blur-md">
            Join the top 1%
          </motion.div>

          <motion.h2
            variants={itemVariants}
            className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-[1.1]"
          >
            Ready to <span className="text-primary italic">10x</span> Your ROI?
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto font-medium"
          >
            Stop manual testing. Start automating your creative strategy today.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col items-center gap-10">
            <Link
              href="/signup"
              className="relative group flex items-center gap-3 px-12 py-6 rounded-[2rem] bg-primary text-white font-black text-2xl transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_40px_-5px_var(--color-primary)] overflow-hidden"
            >
              {/* Dynamic Pulse Shadow */}
              <motion.div
                className="absolute inset-0 bg-white/20 rounded-full"
                animate={{ scale: [1, 1.2, 1], opacity: [0, 0.4, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              <span className="relative z-10">Get Started for Free</span>
              <ArrowRight className="w-6 h-6 relative z-10 group-hover:translate-x-2 transition-transform" />
            </Link>

            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
              {[
                "No credit card required",
                "14-Day Free Trial",
                "24/7 Support"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-gray-400 font-bold text-sm">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Check className="w-3 h-3 stroke-[4px]" />
                  </div>
                  {item}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Mini-Boxes Grid */}
          <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto border-t border-white/5 pt-16">
            {[
              { label2: "Creative Studio", label1: "AI" },
              { label2: "Auto-Optimization", label1: "24/7" },
              { label2: "Faster Scaling", label1: "10x" },
              { label2: "Tech Skills Needed", label1: "0%" }
            ].map((box, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                whileHover={{ y: -5, borderColor: 'var(--color-primary)', backgroundColor: 'rgba(255,255,255,0.03)' }}
                className="p-6 rounded-2xl border border-white/10 bg-transparent transition-all duration-300 group cursor-default"
              >
                <div className="text-2xl font-black text-white mb-1 group-hover:text-primary transition-colors">{box.label1}</div>
                <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{box.label2}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
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
