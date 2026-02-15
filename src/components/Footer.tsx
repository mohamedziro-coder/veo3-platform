"use client";

import Link from "next/link";
import { Sparkles, Twitter, Linkedin, Instagram, Github } from "lucide-react";
import { motion } from "framer-motion";

const footerLinks = [
    {
        title: "PRODUCT",
        links: [
            { name: "Creative Studio", href: "/products/creative-studio" },
            { name: "Snapchat Ads Automation", href: "/products/snapchat-automation" },
            { name: "UGC Video Generator", href: "/products/ugc-generator" },
            { name: "Talking Avatars", href: "/products/talking-avatars" },
            { name: "AI Voiceovers", href: "/products/ai-voiceovers" },
        ],
    },
    {
        title: "SOLUTIONS",
        links: [
            { name: "For Agencies", href: "/solutions/for-agencies" },
            { name: "For Brands", href: "/solutions/for-brands" },
            { name: "For Media Buyers", href: "/solutions/media-buyers" },
            { name: "Creative Testing", href: "/solutions/creative-testing" },
        ],
    },
    {
        title: "RESOURCES",
        links: [
            { name: "Getting Started", href: "/resources/getting-started" },
            { name: "Help Center", href: "/resources/help-center" },
            { name: "Marketing Glossary", href: "/resources/glossary" },
            { name: "Affiliate Program", href: "/resources/affiliate" },
        ],
    },
    {
        title: "COMPANY",
        links: [
            { name: "About", href: "/company/about" },
            { name: "Mission", href: "/company/mission" },
            { name: "Careers", href: "/company/careers" },
            { name: "Contact", href: "/company/contact" },
        ],
    },
];

const socialLinks = [
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Github, href: "#", label: "GitHub" },
];

export default function Footer() {
    return (
        <footer className="relative overflow-hidden border-t border-card-border bg-card-bg/70 backdrop-blur-xl pt-28 pb-16">
            <div className="pointer-events-none absolute top-0 left-1/2 h-px w-full -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            <div className="pointer-events-none absolute -top-36 right-[-8%] h-[360px] w-[360px] rounded-full bg-primary/10 blur-[110px]" />
            <div className="pointer-events-none absolute -bottom-40 left-[-8%] h-[360px] w-[360px] rounded-full bg-secondary/10 blur-[110px]" />

            <div className="relative z-10 mx-auto max-w-[1400px] px-6">
                <div className="mb-16 grid grid-cols-2 gap-10 md:grid-cols-4 lg:grid-cols-5 md:gap-14">
                    <div className="col-span-2 space-y-6 lg:col-span-1">
                        <Link href="/" className="flex items-center gap-3 text-3xl font-black tracking-tighter text-foreground">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-white shadow-xl shadow-primary/25">
                                <Sparkles className="h-7 w-7 fill-white text-white" />
                            </div>
                            <span>Virezo</span>
                        </Link>
                        <p className="max-w-sm text-sm font-medium leading-relaxed text-muted-foreground md:text-base">
                            Defy the limits of video production with AI-powered creative solutions for modern brands and agencies.
                        </p>
                    </div>

                    {footerLinks.map((section) => (
                        <div key={section.title} className="space-y-5">
                            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-foreground/60">{section.title}</h4>
                            <ul className="space-y-3.5">
                                {section.links.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="group flex items-center text-sm font-semibold text-muted-foreground transition-all duration-300 hover:text-primary md:text-base"
                                        >
                                            <motion.span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5">
                                                {link.name}
                                            </motion.span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col items-center justify-between gap-6 border-t border-card-border pt-8 md:flex-row">
                    <p className="text-sm font-semibold text-muted-foreground">(c) {new Date().getFullYear()} Virezo. All rights reserved.</p>

                    <div className="flex items-center gap-3">
                        {socialLinks.map((social) => (
                            <Link
                                key={social.label}
                                href={social.href}
                                className="rounded-xl p-2.5 text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
                                aria-label={social.label}
                            >
                                <social.icon className="h-5 w-5" />
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center gap-5 text-sm font-semibold text-muted-foreground">
                        <Link href="/privacy" className="transition-colors hover:text-foreground">
                            Privacy Policy
                        </Link>
                        <Link href="/terms" className="transition-colors hover:text-foreground">
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
