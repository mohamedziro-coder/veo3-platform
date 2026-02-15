"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { createPortal } from "react-dom";

interface MobileMenuProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    links: { href: string; label: string; active?: boolean; isButton?: boolean }[];
}

const MenuToggle = ({ isOpen, toggle }: { isOpen: boolean; toggle: () => void }) => {
    return (
        <button
            onClick={toggle}
            className="relative z-[12000] flex h-12 w-12 items-center justify-center rounded-xl border border-card-border bg-card-bg text-foreground shadow-xl shadow-slate-900/20 transition-all hover:scale-105 active:scale-95"
            aria-label="Toggle Menu"
            aria-expanded={isOpen}
        >
            <svg width="23" height="23" viewBox="0 0 23 23" className="text-foreground">
                <motion.path
                    fill="transparent"
                    strokeWidth="3"
                    stroke="currentColor"
                    strokeLinecap="round"
                    animate={{ d: isOpen ? "M 3 16.5 L 17 2.5" : "M 2 2.5 L 20 2.5" }}
                    transition={{ duration: 0.22 }}
                />
                <motion.path
                    fill="transparent"
                    strokeWidth="3"
                    stroke="currentColor"
                    strokeLinecap="round"
                    d="M 2 9.423 L 20 9.423"
                    animate={{ opacity: isOpen ? 0 : 1 }}
                    transition={{ duration: 0.1 }}
                />
                <motion.path
                    fill="transparent"
                    strokeWidth="3"
                    stroke="currentColor"
                    strokeLinecap="round"
                    animate={{ d: isOpen ? "M 3 2.5 L 17 16.346" : "M 2 16.346 L 20 16.346" }}
                    transition={{ duration: 0.22 }}
                />
            </svg>
        </button>
    );
};

export default function MobileMenu({ isOpen, setIsOpen, links }: MobileMenuProps) {
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!isOpen) return;

        const onEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsOpen(false);
        };

        document.body.style.overflow = "hidden";
        document.body.style.touchAction = "none";
        window.addEventListener("keydown", onEsc);

        return () => {
            document.body.style.overflow = "unset";
            document.body.style.touchAction = "auto";
            window.removeEventListener("keydown", onEsc);
        };
    }, [isOpen, setIsOpen]);

    return (
        <div className="md:hidden">
            <MenuToggle isOpen={isOpen} toggle={() => setIsOpen(!isOpen)} />

            {mounted &&
                createPortal(
                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.18 }}
                                className="fixed inset-0"
                                style={{ zIndex: 2147483647 }}
                                onClick={() => setIsOpen(false)}
                            >
                                <div className="absolute inset-0 bg-black/45 backdrop-blur-sm" />

                                <motion.div
                                    initial={{ x: "100%" }}
                                    animate={{ x: 0 }}
                                    exit={{ x: "100%" }}
                                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                                    className="absolute right-0 top-0 h-full w-full max-w-[92vw] border-l border-card-border bg-card-bg shadow-2xl"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <div className="flex items-center justify-between border-b border-card-border px-6 py-5">
                                        <div className="flex items-center gap-3 text-2xl font-black tracking-tighter text-foreground">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary text-white shadow-md shadow-primary/25">
                                                <Sparkles className="h-5 w-5 fill-white" />
                                            </div>
                                            <span>Virezo</span>
                                        </div>
                                        <button
                                            onClick={() => setIsOpen(false)}
                                            className="rounded-lg border border-card-border px-3 py-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground"
                                        >
                                            Close
                                        </button>
                                    </div>

                                    <nav className="flex flex-col gap-4 px-6 py-8">
                                        {links.map((link, i) => (
                                            <Link
                                                key={i}
                                                href={link.href}
                                                onClick={() => setIsOpen(false)}
                                                className={
                                                    link.isButton
                                                        ? "mt-2 inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-lg font-black text-white shadow-lg shadow-primary/25"
                                                        : `rounded-xl border px-4 py-3 text-xl font-bold transition-colors ${
                                                            pathname === link.href || (link.href.startsWith("/#") && pathname === "/")
                                                                ? "border-primary/40 bg-primary/10 text-primary"
                                                                : "border-card-border text-foreground hover:bg-muted"
                                                        }`
                                                }
                                            >
                                                {link.label}
                                            </Link>
                                        ))}
                                    </nav>

                                    <div className="mt-auto border-t border-card-border px-6 py-4 text-sm font-medium text-muted-foreground">
                                        <div className="flex items-center gap-5">
                                            <Link href="/blogs" onClick={() => setIsOpen(false)} className="hover:text-foreground">Blog</Link>
                                            <Link href="/privacy" onClick={() => setIsOpen(false)} className="hover:text-foreground">Privacy</Link>
                                            <Link href="/terms" onClick={() => setIsOpen(false)} className="hover:text-foreground">Terms</Link>
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>,
                    document.body
                )}
        </div>
    );
}
