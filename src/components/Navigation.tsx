"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Video, Image as ImageIcon, Sparkles, Mic, Home, LayoutGrid, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Hook to check for desktop screen
const useMediaQuery = (query: string) => {
    const [matches, setMatches] = useState(false);
    useEffect(() => {
        const media = window.matchMedia(query);
        if (media.matches !== matches) {
            setMatches(media.matches);
        }
        const listener = () => setMatches(media.matches);
        media.addEventListener("change", listener);
        return () => media.removeEventListener("change", listener);
    }, [matches, query]);
    return matches;
};

export default function Navigation() {
    const pathname = usePathname();
    const isDesktop = useMediaQuery("(min-width: 768px)");

    // Mobile menu state (must be at top level, not inside conditions)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Check if we are on the Landing Page or Auth pages
    const isLandingPage = pathname === "/" || pathname === "/pricing";
    const isAuthPage = pathname === "/login" || pathname === "/signup";

    // Check if user is admin & get credits
    const [isAdmin, setIsAdmin] = useState(false);
    const [credits, setCredits] = useState(0);

    const updateAuthStatus = () => {
        const userStr = localStorage.getItem('current_user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                setIsAdmin(user.role === 'admin');
                setCredits(typeof user.credits === 'number' ? user.credits : 0);
            } catch (e) {
                console.error("Failed to parse user", e);
            }
        }
    };

    useEffect(() => {
        updateAuthStatus();
        window.addEventListener('storage', updateAuthStatus);
        window.addEventListener('credits-updated', updateAuthStatus);
        return () => {
            window.removeEventListener('storage', updateAuthStatus);
            window.removeEventListener('credits-updated', updateAuthStatus);
        };
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
            <>
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
                    <div className="hidden md:flex items-center gap-4">
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

                    {/* Mobile Burger Menu - Only show if NOT Desktop */}
                    {!isDesktop && (
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                            aria-label="Toggle menu"
                        >
                            <motion.span
                                animate={mobileMenuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                                className="w-5 h-0.5 bg-white rounded-full"
                            />
                            <motion.span
                                animate={mobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                                className="w-5 h-0.5 bg-white rounded-full"
                            />
                            <motion.span
                                animate={mobileMenuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                                className="w-5 h-0.5 bg-white rounded-full"
                            />
                        </button>
                    )}
                </div>

                {/* Mobile Menu Dropdown - Only show if NOT Desktop */}
                {!isDesktop && mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed top-20 left-0 right-0 z-40 px-6"
                    >
                        <div className="bg-black/95 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
                            <div className="flex flex-col gap-4">
                                <Link
                                    href="/#features"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-gray-400 hover:text-white transition-colors py-2 text-sm font-medium"
                                >
                                    Features
                                </Link>
                                <Link
                                    href="/#how-it-works"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-gray-400 hover:text-white transition-colors py-2 text-sm font-medium"
                                >
                                    How it Works
                                </Link>
                                <Link
                                    href="/pricing"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-gray-400 hover:text-white transition-colors py-2 text-sm font-medium"
                                >
                                    Pricing
                                </Link>
                                <div className="h-px bg-white/10 my-2" />
                                <Link
                                    href="/login"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-white hover:text-gray-300 transition-colors py-2 text-sm font-medium"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/signup"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="px-5 py-3 rounded-full bg-white text-black text-sm font-bold hover:scale-105 transition-transform text-center"
                                >
                                    Get Started
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </>
        );
    }

    // App Navigation (Dashboard & Tools)
    return (
        <>
            {/* Desktop Navigation (Top Pill) - Only show if Desktop */}
            {isDesktop && (
                <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 items-center gap-4 w-full max-w-fit px-4 flex">
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
                                            layoutId="activeTabDesktop"
                                            className="absolute inset-0 bg-white/10 rounded-full -z-10 border border-white/5"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}

                                    <link.icon className={cn("w-4 h-4", isActive ? "text-white" : "text-gray-400")} />
                                    <span className="font-medium text-sm tracking-wide">{link.label}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Desktop User Profile / Credits */}
                    <div className="flex items-center gap-2 pl-2">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-bold text-purple-300 whitespace-nowrap">
                            <Sparkles className="w-3 h-3" />
                            <span>{credits} <span>Credits</span></span>
                        </div>
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
            )}

            {/* Mobile Navigation (Bottom Bar) - Only show if NOT Desktop */}
            {!isDesktop && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm">
                    <nav className="relative bg-[#0a0a0a]/90 backdrop-blur-2xl border border-white/10 rounded-full p-2 flex items-center justify-between shadow-2xl shadow-purple-900/20 ring-1 ring-white/5">
                        {appLinks.map((link) => {
                            const isActive = link.active;

                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        "relative flex flex-col items-center justify-center w-12 h-12 rounded-full transition-all duration-300 z-10",
                                        isActive ? "text-white" : "text-gray-500 hover:text-gray-300"
                                    )}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTabMobile"
                                            className="absolute inset-0 bg-white/10 rounded-full -z-10"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                    <link.icon className={cn("w-5 h-5", isActive && "text-purple-400")} />
                                </Link>
                            );
                        })}
                        {/* Mobile Credit Indicator (Mini) */}
                        <div className="w-px h-6 bg-white/10 mx-1" />
                        <button
                            onClick={() => {
                                localStorage.removeItem('current_user');
                                window.location.href = '/';
                            }}
                            className="w-10 h-10 rounded-full flex items-center justify-center text-red-400 hover:bg-red-500/10 active:scale-95 transition-all"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </nav>
                </div>
            )}
        </>
    );
}
