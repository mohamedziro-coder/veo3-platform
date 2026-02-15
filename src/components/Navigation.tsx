"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Video, Image as ImageIcon, Sparkles, Mic, Home, LayoutGrid, LogOut, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import MobileMenu from "./MobileMenu";

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
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [credits, setCredits] = useState(0);

    const updateAuthStatus = async () => {
        const userStr = localStorage.getItem('current_user');
        if (userStr) {
            setIsLoggedIn(true);
            try {
                const localUser = JSON.parse(userStr);
                setIsAdmin(localUser.role === 'admin');
                setCredits(typeof localUser.credits === 'number' ? localUser.credits : 0);

                // REMOVED: Automatic API sync on page load
                // This was causing credit resets because DB might not have latest value yet
                // Credits are now updated via credits-updated event after generation

                // Only sync from API when explicitly needed (credits-updated event)

            } catch (e) {
                console.error("Failed to parse user", e);
                setIsLoggedIn(false);
            }
        } else {
            setIsLoggedIn(false);
        }
    };

    const syncFromDatabase = async () => {
        const userStr = localStorage.getItem('current_user');
        if (userStr) {
            try {
                const localUser = JSON.parse(userStr);

                // Fetch fresh data from API
                const res = await fetch('/api/auth/me', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: localUser.email })
                });

                if (res.ok) {
                    const data = await res.json();
                    if (data.user) {
                        setCredits(data.user.credits);
                        setIsAdmin(data.user.role === 'admin');
                        // Update local storage to keep it in sync
                        const updatedUser = { ...localUser, ...data.user };
                        localStorage.setItem('current_user', JSON.stringify(updatedUser));
                    }
                }
            } catch (err) {
                console.error("Failed to sync user data", err);
            }
        }
    };

    useEffect(() => {
        updateAuthStatus();

        // Listen for events to refresh credits
        window.addEventListener('storage', updateAuthStatus);
        window.addEventListener('credits-updated', updateAuthStatus);
        // Also refresh on visibility change (tab switch)
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') syncFromDatabase();
        });

        return () => {
            window.removeEventListener('storage', updateAuthStatus);
            window.removeEventListener('credits-updated', updateAuthStatus);
            document.removeEventListener('visibilitychange', syncFromDatabase);
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
        {
            href: "/blogs",
            label: "Blog",
            icon: FileText,
            active: pathname.startsWith("/blogs"),
        },
    ];

    // If on Auth pages (Login/Signup), show minimal or no navigation to avoid distractions
    if (isAuthPage) {
        return (
            <div className="fixed top-6 left-6 z-50">
                <Link
                    href="/"
                    className="glass-panel flex items-center gap-2 px-4 py-2 rounded-full text-muted-foreground hover:text-foreground transition-colors"
                >
                    <Home className="w-4 h-4" />
                    <span>Back to Home</span>
                </Link>
            </div>
        );
    }

    // Show Landing Page navigation if NOT logged in, OR if on a landing-specific page
    if (!isLoggedIn || isLandingPage) {
        return (
            <>
                <div className="fixed top-0 inset-x-0 z-[999] bg-card-bg/70 backdrop-blur-xl border-b border-card-border/70">
                    <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
                        {/* Logo (Standard Scale) */}
                        <div className="flex items-center gap-2.5 font-bold text-xl tracking-tighter">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white shadow-md shadow-primary/30">
                                <Sparkles className="w-5 h-5 fill-white" />
                            </div>
                            <span className="text-foreground">Virezo</span>
                        </div>

                        {/* Desktop Menu (Standard Scale) */}
                        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-muted-foreground">
                            <Link href="/#features" className="hover:text-foreground transition-colors">Features</Link>
                            <Link href="/#how-it-works" className="hover:text-foreground transition-colors">How it Works</Link>
                            <Link href="/blogs" className="hover:text-foreground transition-colors">Blog</Link>
                            <Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
                        </div>

                        {/* Auth Buttons (Standard Scale) */}
                        <div className="hidden md:flex items-center gap-4">
                            <Link href="/login" className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
                                Sign In
                            </Link>
                            <Link
                                href="/signup"
                                className="px-5 py-2 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-all shadow-md shadow-primary/25"
                            >
                                Get Started
                            </Link>
                        </div>

                        {/* Mobile Menu Toggle */}
                        <div className="md:hidden">
                            <MobileMenu
                                isOpen={mobileMenuOpen}
                                setIsOpen={setMobileMenuOpen}
                                links={[
                                    { href: "/", label: "Home" },
                                    { href: "/#features", label: "Features" },
                                    { href: "/#how-it-works", label: "How it Works" },
                                    { href: "/pricing", label: "Pricing" },
                                    { href: "/login", label: "Login", isButton: true }
                                ]}
                            />
                        </div>
                    </div>
                </div>
            </>
        );
    }

    // App Navigation (Dashboard & Tools)
    return (
        <>
            {/* Desktop Navigation (Top Pill) - Only show if Desktop */}
            {isDesktop && (
                <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 items-center gap-4 w-full max-w-fit px-4 flex">
                    <nav className="relative bg-card-bg/82 backdrop-blur-2xl border border-card-border rounded-full p-1.5 flex items-center gap-1 shadow-lg shadow-slate-900/10">
                        {appLinks.map((link) => {
                            const isActive = link.active;

                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        "relative flex items-center gap-2 px-5 py-2.5 rounded-full transition-all duration-300 z-10",
                                        isActive ? "text-white" : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
                                    )}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTabDesktop"
                                            className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-full -z-10"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}

                                    <link.icon className={cn("w-4 h-4", isActive ? "text-white" : "text-muted-foreground")} />
                                    <span className="font-medium text-sm tracking-wide">{link.label}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Desktop User Profile / Credits */}
                    <div className="flex items-center gap-2 pl-2">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-xs font-bold text-primary whitespace-nowrap">
                            <Sparkles className="w-3 h-3" />
                            <span>{credits} <span>Credits</span></span>
                        </div>
                        <button
                            onClick={() => {
                                localStorage.removeItem('current_user');
                                window.location.href = '/';
                            }}
                            className="w-10 h-10 rounded-full bg-rose-500/10 border border-rose-500/25 flex items-center justify-center text-rose-500 hover:bg-rose-500/20 transition-colors"
                            title="Sign Out"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Mobile Navigation (Bottom Bar) - Only show if NOT Desktop */}
            {!isDesktop && (
                <>
                    {/* Mobile Top Bar with Credits */}
                    <div className="fixed top-6 right-6 z-50">
                        <div className="glass-panel flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-foreground">
                            <Sparkles className="w-3 h-3 text-primary" />
                            <span>{credits}</span>
                        </div>
                    </div>

                    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm">
                        <nav className="relative bg-card-bg/92 backdrop-blur-2xl border border-card-border rounded-full p-2 flex items-center justify-between shadow-xl shadow-slate-900/20">
                            {appLinks.map((link) => {
                                const isActive = link.active;

                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={cn(
                                            "relative flex flex-col items-center justify-center w-12 h-12 rounded-full transition-all duration-300 z-10",
                                            isActive ? "text-white" : "text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        {isActive && (
                                            <motion.div
                                                layoutId="activeTabMobile"
                                                className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-full -z-10"
                                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}
                                        <link.icon className={cn("w-5 h-5", isActive && "text-white")} />
                                    </Link>
                                );
                            })}
                            <div className="w-px h-6 bg-border mx-1" />
                            <button
                                onClick={() => {
                                    localStorage.removeItem('current_user');
                                    window.location.href = '/';
                                }}
                                className="w-10 h-10 rounded-full flex items-center justify-center text-rose-500 hover:bg-rose-500/10 active:scale-95 transition-all"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </nav>
                    </div>
                </>
            )}
        </>
    );
}
