"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Video, Image as ImageIcon, Sparkles, Mic, Home, LayoutGrid, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function Navigation() {
    const pathname = usePathname();

    // Check if we are on the Landing Page or Auth pages
    const isLandingPage = pathname === "/" || pathname === "/pricing";
    const isAuthPage = pathname === "/login" || pathname === "/signup";

    // Check if user is admin
    const [isAdmin, setIsAdmin] = useState(false);
    useEffect(() => {
        const userStr = localStorage.getItem('current_user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                setIsAdmin(user.role === 'admin');
            } catch (e) {
                console.error("Failed to parse user", e);
            }
        }
    }, [pathname]);

    // Navigation for the App (Dashboard + Tools)
    const appLinks = [
        {
            href: "/dashboard",
            label: "Dashboard",
            icon: LayoutGrid,
            active: pathname === "/dashboard",
        },
        ...(isAdmin ? [{
            href: "/admin",
            label: "Admin",
            icon: Sparkles,
            active: pathname === "/admin",
        }] : []),
        {
            href: "/video",
            label: "Video",
            icon: Video,
            active: pathname === "/video",
        },
        {
            href: "/nanbanana",
            label: "Image",
            icon: ImageIcon,
            active: pathname === "/nanbanana",
        },
        {
            href: "/voice",
            label: "Voice",
            icon: Mic,
            active: pathname === "/voice",
        },
    ];

    // If on Auth pages (Login/Signup), show minimal or no navigation to avoid distractions
    if (isAuthPage) {
        return (
            <div className="fixed top-6 left-6 z-50">
                <Link
                    href="/"
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-sm font-medium text-gray-400 hover:text-white transition-colors"
                >
                    <Home className="w-4 h-4" />
                    <span>Back to Home</span>
                </Link>
            </div>
        );
    }

    // Landing Page Navigation
    if (isLandingPage) {
        return (
            <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-6 md:px-12 max-w-7xl mx-auto">
                {/* Logo */}
                <div className="flex items-center gap-2 font-bold text-xl tracking-tighter">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white">
                        <Sparkles className="w-5 h-5 fill-white" />
                    </div>
                    <span>Veo Platform</span>
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
                    <Link href="/#features" className="hover:text-white transition-colors">Features</Link>
                    <Link href="/#how-it-works" className="hover:text-white transition-colors">How it Works</Link>
                    <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
                </div>

                {/* Auth Buttons */}
                <div className="flex items-center gap-4">
                    <Link href="/login" className="text-sm font-medium text-white hover:text-gray-300 transition-colors">
                        Sign In
                    </Link>
                    <Link
                        href="/signup"
                        className="px-5 py-2.5 rounded-full bg-white text-black text-sm font-bold hover:scale-105 transition-transform"
                    >
                        Get Started
                    </Link>
                </div>
            </div>
        );
    }

    // App Navigation (Dashboard & Tools)
    return (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 w-full max-w-fit px-4">
            <nav className="relative bg-black/50 backdrop-blur-xl border border-white/10 rounded-full p-1.5 flex items-center gap-1 shadow-2xl shadow-purple-900/10 ring-1 ring-white/5">
                {appLinks.map((link) => {
                    const isActive = link.active;

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "relative flex items-center gap-2 px-5 py-2.5 rounded-full transition-all duration-300 z-10",
                                isActive ? "text-white" : "text-gray-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-white/10 rounded-full -z-10 border border-white/5"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}

                            <link.icon className={cn("w-4 h-4", isActive ? "text-white" : "text-gray-400")} />
                            <span className="font-medium text-sm tracking-wide hidden sm:inline">{link.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* User Profile / Sign Out */}
            <div className="flex items-center gap-2 pl-2">
                <button
                    onClick={() => {
                        localStorage.removeItem('current_user');
                        window.location.href = '/';
                    }}
                    className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 hover:bg-red-500/20 transition-colors"
                    title="Sign Out"
                >
                    <LogOut className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
