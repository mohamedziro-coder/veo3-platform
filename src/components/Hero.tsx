"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center text-center px-6 md:px-12 bg-gradient-to-br from-primary to-secondary">
      <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight text-white max-w-3xl">
        Create <span className="text-secondary">Viral Videos</span> with AI
      </h1>
      <p className="mt-6 text-xl md:text-2xl text-gray-200 max-w-2xl">
        Turn ideas into broadcast‑quality content in seconds using lifelike
        avatars and native voiceovers.
      </p>
      <div className="mt-10 flex flex-col sm:flex-row gap-4">
        <Link
          href="/signup"
          className="px-8 py-4 rounded-2xl bg-white text-primary font-black text-lg hover:opacity-90 transition"
        >
          Start Creating Free
        </Link>
        <Link
          href="#demo"
          className="px-8 py-4 rounded-2xl border border-white text-white font-black text-lg hover:bg-white/10 transition"
        >
          Watch Demo
        </Link>
      </div>
    </section>
  );
}
