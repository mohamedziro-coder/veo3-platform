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
            className="relative z-[11000] flex h-12 w-12 items-center justify-center rounded-xl border border-card-border bg-card-bg text-foreground shadow-xl shadow-slate-900/15 transition-all hover:scale-105 active:scale-95"
            aria-label="Toggle Menu"
            aria-expanded={isOpen}
        >
            <svg width="23" height="23" viewBox="0 0 23 23" className="text-foreground">
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
            duration: 0.35,
            ease: [0.6, 0.05, -0.01, 0.9],
            staggerChildren: 0.05,
            staggerDirection: -1
        }
    },
    open: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.45,
            ease: [0.6, 0.05, -0.01, 0.9],
            staggerChildren: 0.08,
            delayChildren: 0.12
        }
    }
};

const linkVariants: Variants = {
    closed: {
        opacity: 0,
        y: 30,
        transition: { duration: 0.25, ease: "easeIn" }
    },
    open: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: [0.6, 0.05, -0.01, 0.9] }
    }
};

export default function MobileMenu({ isOpen, setIsOpen, links }: MobileMenuProps) {
    const pathname = usePathname();

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
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
                        className="fixed inset-0 z-[10500] flex flex-col bg-background/95 backdrop-blur-2xl"
                    >
                        <div className="flex items-center justify-between border-b border-card-border px-6 py-5">
                            <div className="flex items-center gap-3 text-2xl font-black tracking-tighter text-foreground">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary text-white shadow-md shadow-primary/25">
                                    <Sparkles className="h-5 w-5 fill-white" />
                                </div>
                                <span>Virezo</span>
                            </div>
                        </div>

                        <nav className="flex flex-1 flex-col items-center justify-center gap-8 px-8 text-center">
                            {links.map((link, i) => (
                                <motion.div key={i} variants={linkVariants}>
                                    {link.isButton ? (
                                        <Link
                                            href={link.href}
                                            onClick={() => setIsOpen(false)}
                                            className="inline-block rounded-2xl bg-primary px-10 py-4 text-xl font-black text-white shadow-lg shadow-primary/30 transition-all active:scale-95 hover:bg-primary/90"
                                        >
                                            {link.label}
                                        </Link>
                                    ) : (
                                        <Link
                                            href={link.href}
                                            onClick={() => setIsOpen(false)}
                                            className={`block text-3xl font-black tracking-tight transition-all active:scale-95 ${
                                                pathname === link.href || (link.href.startsWith("/#") && pathname === "/")
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

                        <motion.div variants={linkVariants} className="flex items-center justify-center gap-6 border-t border-card-border px-6 py-5 text-sm font-medium text-muted-foreground">
                            <Link href="/blogs" onClick={() => setIsOpen(false)} className="hover:text-foreground">
                                Blog
                            </Link>
                            <Link href="/privacy" onClick={() => setIsOpen(false)} className="hover:text-foreground">
                                Privacy
                            </Link>
                            <Link href="/terms" onClick={() => setIsOpen(false)} className="hover:text-foreground">
                                Terms
                            </Link>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
