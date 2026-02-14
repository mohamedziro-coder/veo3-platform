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
        <footer className="bg-[#0A0A0B] border-t border-white/5 pt-24 pb-12 overflow-hidden relative">
            {/* Background Decorative Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-20">

                    {/* Brand Column */}
                    <div className="col-span-2 lg:col-span-1 space-y-6">
                        <Link href="/" className="flex items-center gap-2 font-bold text-2xl tracking-tighter text-white">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                                <Sparkles className="w-6 h-6 fill-white text-white" />
                            </div>
                            <span>Virezo</span>
                        </Link>
                        <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                            Defy the limits of video production with AI-powered creative solutions for modern brands and agencies.
                        </p>
                    </div>

                    {/* Links Columns */}
                    {footerLinks.map((section) => (
                        <div key={section.title} className="space-y-6">
                            <h4 className="text-white text-xs font-black tracking-[0.2em] uppercase opacity-50">
                                {section.title}
                            </h4>
                            <ul className="space-y-4">
                                {section.links.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="group flex items-center text-gray-400 hover:text-primary transition-colors duration-300"
                                        >
                                            <motion.span
                                                className="inline-block transform transition-transform duration-300 group-hover:translate-x-1 text-[15px] font-medium"
                                            >
                                                {link.name}
                                            </motion.span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Bar */}
                <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
                    <p className="text-gray-500 text-sm font-medium">
                        © {new Date().getFullYear()} Virezo. All rights reserved.
                    </p>

                    <div className="flex items-center gap-6">
                        {socialLinks.map((social) => (
                            <Link
                                key={social.label}
                                href={social.href}
                                className="text-gray-500 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5"
                                aria-label={social.label}
                            >
                                <social.icon className="w-5 h-5" />
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center gap-8 text-sm font-medium text-gray-500">
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
