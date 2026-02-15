"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="fixed top-0 inset-x-0 h-20 bg-background/90 backdrop-blur-lg z-50">
      <div className="max-w-[1400px] mx-auto h-full flex items-center justify-between px-6 md:px-12">
        <Link
          href="/"
          className="flex items-center gap-3 font-black text-2xl tracking-tighter text-white"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white shadow-lg">
            <Sparkles className="w-6 h-6 fill-current" />
          </div>
          <span>Virezo</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-base font-bold text-gray-400">
          <Link href="#features" className="hover:text-white transition-colors">
            Features
          </Link>
          <Link
            href="#how-it-works"
            className="hover:text-white transition-colors"
          >
            How it Works
          </Link>
          <Link href="/pricing" className="hover:text-white transition-colors">
            Pricing
          </Link>
          <Link href="/blogs" className="hover:text-white transition-colors">
            Blog
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="px-6 py-2 rounded-2xl bg-primary text-white font-black text-sm hover:bg-primary/90 transition-all"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}
