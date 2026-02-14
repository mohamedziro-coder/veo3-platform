"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Sparkles } from "lucide-react";

interface MobileMenuProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    links: { href: string; label: string; active?: boolean; isButton?: boolean }[];
}

const MenuToggle = ({ isOpen, toggle }: { isOpen: boolean; toggle: () => void }) => {
    return (
        <button
            onClick={toggle}
            className="relative z-[10000] w-12 h-12 flex items-center justify-center rounded-xl bg-white dark:bg-card-bg border border-card-border shadow-2xl shadow-primary/20 transition-all hover:scale-110 active:scale-90"
            aria-label="Toggle Menu"
        >
            <svg width="23" height="23" viewBox="0 0 23 23">
                <motion.path
                    fill="transparent"
                    strokeWidth="3"
                    stroke="currentColor"
                    strokeLinecap="round"
                    variants={{
                        closed: { d: "M 2 2.5 L 20 2.5" },
                        open: { d: "M 3 16.5 L 17 2.5" }
                    }}
                    animate={isOpen ? "open" : "closed"}
                    transition={{ duration: 0.3 }}
                />
                <motion.path
                    fill="transparent"
                    strokeWidth="3"
                    stroke="currentColor"
                    strokeLinecap="round"
                    d="M 2 9.423 L 20 9.423"
                    variants={{
                        closed: { opacity: 1 },
                        open: { opacity: 0 }
                    }}
                    animate={isOpen ? "open" : "closed"}
                    transition={{ duration: 0.1 }}
                />
                <motion.path
                    fill="transparent"
                    strokeWidth="3"
                    stroke="currentColor"
                    strokeLinecap="round"
                    variants={{
                        closed: { d: "M 2 16.346 L 20 16.346" },
                        open: { d: "M 3 2.5 L 17 16.346" }
                    }}
                    animate={isOpen ? "open" : "closed"}
                    transition={{ duration: 0.3 }}
                />
            </svg>
        </button>
    );
};

const menuVariants: Variants = {
    closed: {
        opacity: 0,
        x: "100%",
        transition: {
            duration: 0.4,
            ease: [0.6, 0.05, -0.01, 0.9],
            staggerChildren: 0.05,
            staggerDirection: -1
        }
    },
    open: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.6,
            ease: [0.6, 0.05, -0.01, 0.9],
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

const linkVariants: Variants = {
    closed: {
        opacity: 0,
        y: 40,
        transition: { duration: 0.3, ease: "easeIn" }
    },
    open: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.6, 0.05, -0.01, 0.9] }
    }
};

export default function MobileMenu({ isOpen, setIsOpen, links }: MobileMenuProps) {
    const pathname = usePathname();

    // Body scroll locking
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
            // Ensure we are at z-index context for mobile
            document.body.style.touchAction = "none";
        } else {
            document.body.style.overflow = "unset";
            document.body.style.touchAction = "auto";
        }
        return () => {
            document.body.style.overflow = "unset";
            document.body.style.touchAction = "auto";
        };
    }, [isOpen]);

    return (
        <div className="md:hidden">
            <MenuToggle isOpen={isOpen} toggle={() => setIsOpen(!isOpen)} />

            <AnimatePresence mode="wait">
                {isOpen && (
                    <motion.div
                        variants={menuVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white dark:bg-black backdrop-blur-3xl"
                    >
                        <div className="absolute top-10 left-10 flex items-center gap-3 font-black text-3xl tracking-tighter text-foreground">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white shadow-xl">
                                <Sparkles className="w-7 h-7 fill-white" />
                            </div>
                            <span>Virezo</span>
                        </div>

                        <nav className="flex flex-col items-center gap-10 px-8 text-center mt-20">
                            {links.map((link, i) => (
                                <motion.div key={i} variants={linkVariants}>
                                    {link.isButton ? (
                                        <Link
                                            href={link.href}
                                            onClick={() => setIsOpen(false)}
                                            className="px-16 py-5 rounded-3xl bg-primary text-white text-2xl font-black shadow-2xl shadow-primary/30 transform active:scale-95 transition-all inline-block hover:bg-primary/90"
                                        >
                                            {link.label}
                                        </Link>
                                    ) : (
                                        <Link
                                            href={link.href}
                                            onClick={() => setIsOpen(false)}
                                            className={`text-5xl font-black tracking-tight transition-all hover:scale-105 active:scale-95 block ${pathname === link.href || (link.href.startsWith("/#") && pathname === "/")
                                                ? "text-primary"
                                                : "text-foreground hover:text-primary"
                                                }`}
                                        >
                                            {link.label}
                                        </Link>
                                    )}
                                </motion.div>
                            ))}
                        </nav>

                        {/* Footer in Menu */}
                        <motion.div
                            variants={linkVariants}
                            className="absolute bottom-12 flex gap-8 text-sm font-medium text-muted-foreground"
                        >
                            <Link href="/blogs" onClick={() => setIsOpen(false)}>Blog</Link>
                            <Link href="/pricing" onClick={() => setIsOpen(false)}>Privacy</Link>
                            <Link href="/pricing" onClick={() => setIsOpen(false)}>Terms</Link>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
